import mineflayer from 'mineflayer';
import { EventEmitter } from 'events';
import { accountManager } from './accountManager.js';
import { serverManager } from './serverManager.js';
import { getSettings } from './settingsStore.js';
import { homesStore } from './homesStore.js';
import { whitelistStore } from './whitelistStore.js';

const MAX_CHAT_LINES = 200;

const tr = (fr, en) => (getSettings().language === 'en' ? en : fr);
const slash = (cmd) => (cmd.startsWith('/') ? cmd : `/${cmd}`);
const escapeRe = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const fill = (template, values) => Object.entries(values).reduce((s, [k, v]) => s.split(`{${k}}`).join(v), template);

// Valeurs par défaut pour la détection des demandes de TP et des messages privés
// (serveur type "2B2FR" montré par l'utilisateur). Entièrement redéfinissable par serveur.
const DEFAULT_TP_REQUEST_REGEX = '^([A-Za-z0-9_]{1,16}) veut se t\u00e9l\u00e9porter sur vous';
const DEFAULT_TP_ACCEPT_COMMAND = '/tpaccept';
const DEFAULT_TPA_COMMAND = '/tpa {name}';
const DEFAULT_PM_REGEX = '^\\[([A-Za-z0-9_]{1,16}) (?:\u2192|->) Moi\\] (.+)$';
const DEFAULT_PM_COMMAND = '/msg {name} {text}';

function compileRegex(pattern) {
  try {
    return pattern ? new RegExp(pattern, 'i') : null;
  } catch (e) {
    return null;
  }
}

/**
 * Extrait les noms de homes de la réponse du serveur.
 * Avec une regex : groupe 1 (ou match complet). Sinon : texte après ":" de chaque ligne.
 */
export function parseHomes(text, regexStr) {
  const clean = text.replace(/[§&][0-9a-fk-orx]/gi, '');
  let chunk = '';
  if (regexStr) {
    try {
      const m = clean.match(new RegExp(regexStr, 'is'));
      chunk = m ? (m[1] ?? m[0]) : '';
    } catch (e) {
      chunk = '';
    }
  } else {
    if (/\b(no|aucun|any|pas de)\b.*home|home.*\b(none|aucun)\b/i.test(clean)) return [];
    const lines = clean.split('\n');
    const withColon = lines.filter((l) => l.includes(':'));
    chunk = (withColon.length ? withColon.map((l) => l.slice(l.indexOf(':') + 1)) : lines).join('\n');
  }
  const split = (str) => str
    .split(/[,;\s]+/)
    .map((n) => n.replace(/^[[(\-•*]+|[\]),.]+$/g, ''))
    .filter((n) => /^[\w-]{1,32}$/.test(n));
  let names = split(chunk);
  // Liste sur plusieurs lignes ("Homes:" puis un home par ligne)
  if (names.length === 0 && !regexStr) {
    names = split(clean.split('\n').filter((l) => !l.includes(':')).join('\n'));
  }
  return [...new Set(names)].slice(0, 100);
}

/**
 * Gère les bots Mineflayer (comptes offline). Un bot par compte, aucun état partagé.
 * Événements : 'state' (changement de statut/joueurs), 'chat' (accountId, ligne)
 */
class BotManager extends EventEmitter {
  constructor() {
    super();
    this.entries = new Map(); // accountId -> entrée
  }

  snapshot(e) {
    return {
      accountId: e.accountId,
      serverId: e.serverId,
      status: e.status,
      error: e.error,
      attempts: e.attempts,
      players: e.players,
      homes: e.homes,
      homesState: e.homesState,
      homesInfo: homesStore.list(e.accountId),
    };
  }

  list() {
    return accountManager.listAccounts().map((a) => {
      const e = this.entries.get(a.id);
      return e
        ? this.snapshot(e)
        : {
          accountId: a.id, serverId: null, status: 'offline', error: null, attempts: 0,
          players: [], homes: [], homesState: 'idle', homesInfo: homesStore.list(a.id),
        };
    });
  }

  chatLog(accountId) {
    const e = this.entries.get(accountId);
    return e ? e.chat : [];
  }

  addLine(e, text, system = false) {
    const line = { t: Date.now(), text: String(text).slice(0, 500), system };
    e.chat.push(line);
    if (e.chat.length > MAX_CHAT_LINES) e.chat.shift();
    this.emit('chat', e.accountId, line);
  }

  connect(accountId, serverId) {
    if (!accountManager.getAccount(accountId)) throw new Error('Compte introuvable');
    if (!serverManager.get(serverId)) throw new Error('Serveur introuvable');
    this.disconnect(accountId);
    const e = {
      accountId, serverId, status: 'connecting', error: null, attempts: 0,
      players: [], homes: [], homesState: 'idle', chat: [], bot: null, timer: null, wanted: true,
    };
    this.entries.set(accountId, e);
    this.spawn(e);
    this.emit('state');
  }

  spawn(e) {
    const account = accountManager.getAccount(e.accountId);
    const server = serverManager.get(e.serverId);
    if (!account || !server) {
      e.wanted = false;
      e.status = 'error';
      e.error = tr('Compte ou serveur supprimé', 'Account or server deleted');
      return this.emit('state');
    }
    e.status = e.attempts > 0 ? 'reconnecting' : 'connecting';
    e.error = null;
    e.homes = [];
    e.homesState = 'idle';
    this.addLine(e, tr(`Connexion à ${server.host}:${server.port}...`, `Connecting to ${server.host}:${server.port}...`), true);

    let bot;
    try {
      bot = mineflayer.createBot({
        host: server.host,
        port: server.port,
        username: account.username,
        auth: 'offline',
        hideErrors: true,
        ...(server.version ? { version: server.version } : {}),
      });
    } catch (err) {
      e.error = err.message;
      return this.handleEnd(e);
    }
    e.bot = bot;
    let ended = false;

    // Liste des joueurs connectés (regroupe les rafales d'événements à l'arrivée)
    let playersTimer = null;
    const refreshPlayers = () => {
      if (playersTimer) return;
      playersTimer = setTimeout(() => {
        playersTimer = null;
        if (e.bot !== bot || !e.wanted) return;
        e.players = Object.keys(bot.players || {}).sort((a, b) => a.localeCompare(b));
        this.emit('state');
      }, 150);
    };

    // Connexion automatique (commande configurable par serveur, 2 essais max)
    e.loginSent = 0;
    e.lastLogin = 0;
    const loginTemplate = slash(server.loginCommand || '/login {password}');
    const loginWord = loginTemplate.split(/\s+/)[0];
    const loginPrompt = new RegExp(`(^|\\s)${escapeRe(loginWord)}(\\s|$|<)`, 'i');
    const tryLogin = () => {
      if (!account.password || e.loginSent >= 2 || Date.now() - e.lastLogin < 2500) return;
      e.loginSent += 1;
      e.lastLogin = Date.now();
      bot.chat(loginTemplate.split('{password}').join(account.password));
      this.addLine(e, `> ${loginTemplate.split('{password}').join('********')}`, true);
    };

    bot.once('spawn', () => {
      e.status = 'online';
      e.error = null;
      e.attempts = 0;
      this.addLine(e, tr('Connecté au serveur.', 'Connected to the server.'), true);
      this.emit('state');
      refreshPlayers();
      setTimeout(refreshPlayers, 1500);
      setTimeout(() => { if (e.bot === bot && e.loginSent === 0) tryLogin(); }, 1500);
      // Liste des homes une fois connecté (après le /login s'il y en a un)
      setTimeout(() => { if (e.bot === bot) this.fetchHomes(e.accountId); }, account.password ? 4000 : 2500);
      const every = Math.max(5000, Number(getSettings().playerListUpdateInterval) || 30000);
      e.playerTimer = setInterval(refreshPlayers, every);
      // Anti-AFK : répète des actions configurables pour éviter d'être expulsé pour inactivité
      e.lastAfkAction = Date.now();
      e.afkTimer = setInterval(() => this.runAntiAfk(e), 5000);
    });

    const tpRegex = compileRegex(server.tpRequestRegex || DEFAULT_TP_REQUEST_REGEX);
    const pmRegex = compileRegex(server.privateMessageRegex || DEFAULT_PM_REGEX);
    bot.on('message', (msg) => {
      const text = msg.toString();
      this.addLine(e, text);
      const isPlayerChat = text.trimStart().startsWith('<');
      if (e.collect && !isPlayerChat) e.collect.push(text);
      if (!isPlayerChat && loginPrompt.test(text)) tryLogin();
      if (getSettings().whitelistEnabled === false) return;

      // 1) Vérifie d'abord si ce message confirme une téléportation déjà acceptée précédemment
      //    (sur un message antérieur à celui-ci, pour ne pas se déclencher sur la demande elle-même)
      if (e.pendingAutoTp) {
        if (Date.now() >= e.pendingAutoTp.until) {
          e.pendingAutoTp = null;
        } else {
          const entry = whitelistStore.getByName(e.pendingAutoTp.name);
          if (entry && entry.tpCommand && new RegExp(`${escapeRe(e.pendingAutoTp.name)}.*(t\u00e9l\u00e9port\u00e9|teleported)`, 'i').test(text)) {
            e.pendingAutoTp = null;
            const cmd = slash(entry.tpCommand);
            setTimeout(() => {
              if (e.bot !== bot) return;
              e.bot.chat(cmd);
              this.addLine(e, `> ${cmd}`, true);
            }, 500);
          }
        }
      }

      // 1bis) Vérifie si ce message confirme une téléportation vers un home demandée en privé (!<home>)
      if (e.pendingHomeConfirm) {
        if (Date.now() >= e.pendingHomeConfirm.until) {
          e.pendingHomeConfirm = null;
        } else if (/(t\u00e9l\u00e9port\u00e9|teleported)/i.test(text)) {
          const { sender, homeName } = e.pendingHomeConfirm;
          e.pendingHomeConfirm = null;
          const confirmCmd = slash(fill(server.privateMessageCommand || DEFAULT_PM_COMMAND, {
            name: sender, text: tr(`Téléporté à ${homeName}.`, `Teleported to ${homeName}.`),
          }));
          e.bot.chat(confirmCmd);
          this.addLine(e, `> ${confirmCmd}`, true);
        }
      }

      // 2) Demande de téléportation d'un joueur : acceptation auto si le joueur est en liste blanche
      if (tpRegex) {
        const m = text.match(tpRegex);
        if (m && m[1] && whitelistStore.isWhitelisted(m[1])) {
          const acceptCmd = slash(server.tpAcceptCommand || DEFAULT_TP_ACCEPT_COMMAND);
          e.bot.chat(acceptCmd);
          this.addLine(e, `> ${acceptCmd}`, true);
          e.pendingAutoTp = { name: m[1], until: Date.now() + 30000 };
        }
      }

      // Message privé d'un joueur en liste blanche : !tp, !homes, !<home>
      if (pmRegex) {
        const m = text.match(pmRegex);
        if (m && m[1] && m[2] && whitelistStore.isWhitelisted(m[1])) {
          this.handleWhitelistPm(e, server, m[1], m[2].trim());
        }
      }
    });
    bot.on('playerJoined', refreshPlayers);
    bot.on('playerLeft', refreshPlayers);
    bot.on('kicked', (reason) => {
      const text = typeof reason === 'string' ? reason : JSON.stringify(reason);
      e.error = tr(`Expulsé : ${text.slice(0, 200)}`, `Kicked: ${text.slice(0, 200)}`);
      this.addLine(e, e.error, true);
    });
    bot.on('error', (err) => {
      e.error = err.message || String(err);
      this.addLine(e, tr(`Erreur : ${e.error}`, `Error: ${e.error}`), true);
    });
    bot.once('end', () => {
      if (ended) return;
      ended = true;
      if (e.bot === bot) e.bot = null;
      if (e.playerTimer) clearInterval(e.playerTimer);
      if (e.homesTimer) clearTimeout(e.homesTimer);
      if (e.afkTimer) clearInterval(e.afkTimer);
      e.collect = null;
      e.players = [];
      e.pendingAutoTp = null;
      e.pendingHomeConfirm = null;
      this.handleEnd(e);
    });
  }

  handleEnd(e) {
    if (!e.wanted) {
      e.status = 'offline';
      return this.emit('state');
    }
    const s = getSettings();
    const max = s.reconnectMaxAttempts;
    if (s.autoReconnect && (max < 0 || e.attempts < max)) {
      e.attempts += 1;
      const delay = Math.min(s.reconnectInitialDelay * 2 ** (e.attempts - 1), s.reconnectMaxDelay);
      e.status = 'reconnecting';
      this.addLine(e, tr(`Déconnecté. Nouvelle tentative dans ${Math.round(delay / 1000)} s (n°${e.attempts}).`, `Disconnected. Retrying in ${Math.round(delay / 1000)} s (#${e.attempts}).`), true);
      e.timer = setTimeout(() => {
        e.timer = null;
        if (e.wanted) this.spawn(e);
      }, delay);
    } else {
      e.wanted = false;
      e.status = e.error ? 'error' : 'offline';
      this.addLine(e, tr('Déconnecté.', 'Disconnected.'), true);
    }
    this.emit('state');
  }

  disconnect(accountId) {
    const e = this.entries.get(accountId);
    if (!e) return;
    e.wanted = false;
    if (e.timer) clearTimeout(e.timer);
    e.timer = null;
    if (e.playerTimer) clearInterval(e.playerTimer);
    if (e.homesTimer) clearTimeout(e.homesTimer);
    if (e.afkTimer) clearInterval(e.afkTimer);
    e.collect = null;
    e.pendingAutoTp = null;
    e.pendingHomeConfirm = null;
    if (e.bot) {
      try { e.bot.quit(); } catch (err) { /* ignore */ }
    }
    e.status = 'offline';
    e.players = [];
    this.emit('state');
  }

  say(accountId, message) {
    const e = this.entries.get(accountId);
    const text = String(message || '').trim();
    if (!e || e.status !== 'online' || !e.bot) throw new Error(tr("Ce bot n'est pas en ligne", 'This bot is not online'));
    if (!text || text.length > 256) throw new Error(tr('Message vide ou trop long (256 max)', 'Empty or too long message (256 max)'));
    e.bot.chat(text);
    this.addLine(e, `> ${text}`, true);
  }

  /** Envoie la commande "liste des homes" du serveur et lit la réponse (2,5 s) */
  fetchHomes(accountId) {
    const e = this.entries.get(accountId);
    if (!e || e.status !== 'online' || !e.bot) throw new Error(tr("Ce bot n'est pas en ligne", 'This bot is not online'));
    const server = serverManager.get(e.serverId);
    if (!server) throw new Error(tr('Serveur introuvable', 'Server not found'));
    const cmd = slash(server.homesCommand || '/homes');
    if (e.homesTimer) clearTimeout(e.homesTimer);
    e.homesState = 'loading';
    e.collect = [];
    this.emit('state');
    e.bot.chat(cmd);
    this.addLine(e, `> ${cmd}`, true);
    e.homesTimer = setTimeout(() => {
      e.homes = parseHomes((e.collect || []).join('\n'), server.homesRegex);
      e.collect = null;
      e.homesState = 'done';
      // Conserve les descriptions des homes toujours présents, supprime celles des homes disparus
      try { homesStore.sync(e.accountId, e.homes); } catch (err) { /* ignore */ }
      if (e.homes.length === 0) {
        this.addLine(e, tr('Aucun home détecté (vérifie les commandes du serveur).', 'No home detected (check the server commands).'), true);
      }
      this.emit('state');
    }, 2500);
  }

  /** Téléporte le bot à un home connu (commande configurable par serveur) */
  goHome(accountId, name) {
    const e = this.entries.get(accountId);
    if (!e || e.status !== 'online' || !e.bot) throw new Error(tr("Ce bot n'est pas en ligne", 'This bot is not online'));
    if (!e.homes.includes(name)) throw new Error(tr('Home inconnu', 'Unknown home'));
    const cooldown = Number(getSettings().homeTeleportCooldown) || 0;
    if (Date.now() - (e.lastTp || 0) < cooldown) {
      throw new Error(tr('Attends un instant avant une nouvelle téléportation', 'Wait a moment before teleporting again'));
    }
    const server = serverManager.get(e.serverId);
    const cmd = slash((server && server.homeCommand) || '/home {name}').split('{name}').join(name);
    e.lastTp = Date.now();
    e.bot.chat(cmd);
    this.addLine(e, `> ${cmd}`, true);
  }

  /** Exécute une action anti-AFK (sneak/saut/message) si le délai configuré est écoulé */
  runAntiAfk(e) {
    if (!e.bot) return;
    const s = getSettings().antiAfk || {};
    if (!s.enabled) return;
    const interval = Math.max(5000, Number(s.interval) || 60000);
    if (Date.now() - (e.lastAfkAction || 0) < interval) return;
    e.lastAfkAction = Date.now();
    try {
      if (s.sneak) {
        e.bot.setControlState('sneak', true);
        setTimeout(() => { if (e.bot) { try { e.bot.setControlState('sneak', false); } catch (err) { /* ignore */ } } }, 600);
      }
      if (s.jump) {
        e.bot.setControlState('jump', true);
        setTimeout(() => { if (e.bot) { try { e.bot.setControlState('jump', false); } catch (err) { /* ignore */ } } }, 300);
      }
      if (s.chatEnabled && s.chatText) {
        e.bot.chat(s.chatText);
        this.addLine(e, `> ${s.chatText}`, true);
      }
    } catch (err) { /* ignore */ }
  }

  /** Traite un message privé reçu d'un joueur en liste blanche : !tp, !homes, !<home> */
  handleWhitelistPm(e, server, sender, body) {
    if (!e.bot) return;
    const lower = body.toLowerCase();
    const sendPm = (text) => {
      const cmd = slash(fill(server.privateMessageCommand || DEFAULT_PM_COMMAND, { name: sender, text }));
      e.bot.chat(cmd);
      this.addLine(e, `> ${cmd}`, true);
    };

    if (lower === '!tp') {
      const cmd = slash(fill(server.tpaCommand || DEFAULT_TPA_COMMAND, { name: sender }));
      e.bot.chat(cmd);
      this.addLine(e, `> ${cmd}`, true);
      return;
    }

    if (lower === '!homes') {
      const list = (e.homes || []).length ? e.homes.join(', ') : tr('aucun home', 'no home');
      sendPm(tr(`Homes : ${list}`, `Homes: ${list}`));
      return;
    }

    if (body.startsWith('!')) {
      const homeName = body.slice(1).trim();
      if (!(e.homes || []).includes(homeName)) return; // nom inconnu : on ignore silencieusement
      try {
        this.goHome(e.accountId, homeName);
        // La confirmation en privé n'est envoyée qu'une fois la téléportation réellement effectuée
        // (voir le handler 'message' qui surveille e.pendingHomeConfirm)
        e.pendingHomeConfirm = { sender, homeName, until: Date.now() + 15000 };
      } catch (err) {
        sendPm(err.message);
      }
    }
  }

  disconnectAll() {
    for (const id of [...this.entries.keys()]) this.disconnect(id);
  }
}

export const botManager = new BotManager();

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

// Un /tpa venant d'un compte qu'on gère nous-même (un autre bot de ce BotHub) n'a pas besoin
// d'être ajouté à la liste blanche : on l'accepte toujours directement.
const isOwnAccount = (name) => {
  try {
    return accountManager.listAccounts().some(
      (acc) => (acc.username || '').toLowerCase() === String(name || '').toLowerCase()
    );
  } catch (_) {
    return false;
  }
};

// Valeurs par défaut pour la détection des demandes de TP et des messages privés
// (serveur type "2B2FR" montré par l'utilisateur). Entièrement redéfinissable par serveur.
const DEFAULT_TP_REQUEST_REGEX = '^([A-Za-z0-9_]{1,16}) veut se t\u00e9l\u00e9porter sur vous';
// /tpaccept {name} : accepte explicitement la téléportation DU JOUEUR concerné plutôt que
// la toute dernière demande reçue (plus sûr si plusieurs /tpa arrivent en même temps).
const DEFAULT_TP_ACCEPT_COMMAND = '/tpaccept {name}';
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
// Lignes de chat/système qui peuvent arriver pendant la fenêtre de collecte (2,5 s) et qui
// ne font PAS partie de la réponse "liste des homes" : chat de joueur, chat de clan/Discord
// ("[Tag] Pseudo: message"), arrivées/départs ("[+] Pseudo" / "[-] Pseudo"). Avant ce correctif,
// ces lignes pouvaient être confondues avec la liste des homes (ex: "[Impériaux] Ysray: la chaine ?"
// faisait apparaître deux faux homes "la" et "chaine").
function isChatNoise(line) {
  const l = line.trim();
  if (!l) return true;
  if (l.startsWith('<')) return true; // chat public "<Pseudo> message"
  if (/^\[[^\]]+\]\s*[^\s:\][]+\s*:/.test(l)) return true; // "[Tag] Pseudo: message"
  if (/^\[[+\-]\]/.test(l)) return true; // "[+] Pseudo" / "[-] Pseudo" (arrivée/départ)
  return false;
}

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
    const lines = clean.split('\n').filter((l) => !isChatNoise(l));
    // Priorité à la ligne qui annonce explicitement la liste ("Homes: ..." / "Home(s) :")
    const homesLine = lines.find((l) => /^homes?\s*:/i.test(l.trim()));
    if (homesLine) {
      chunk = homesLine.slice(homesLine.indexOf(':') + 1);
    } else {
      const withColon = lines.filter((l) => l.includes(':'));
      chunk = (withColon.length ? withColon.map((l) => l.slice(l.indexOf(':') + 1)) : lines).join('\n');
    }
  }
  const split = (str) => {
    // D'abord split par virgules, point-virgules, espaces
    let parts = str.split(/[,;\s]+/)
      .map((n) => n.replace(/^[[(•*]+|[\]),.]+$/g, '')) // Ne pas retirer le - initial (coordonnées négatives)
      .filter((n) => n.length > 0);

    // Certains serveurs collent des boutons de liste (pagination [-]/[+], puces...) directement
    // au nom de home précédent, sans espace ni virgule (ex: "corner-+" = home "corner" + boutons
    // "-"/"+" fusionnés). On retire ces suites de +/- en fin de jeton tant qu'elles ne sont PAS
    // précédées d'un chiffre, pour ne pas casser un vrai nom du type "home-2" ou une coordonnée
    // négative ("-22M" garde son signe de tête, seul un éventuel symbole en bout est retiré).
    parts = parts
      .map((n) => n.replace(/(?<!\d)[+-]{1,4}$/, ''))
      .filter((n) => n.length > 0 && !/^[+-]+$/.test(n)) // rejette les jetons qui ne sont QUE des +/-
      .filter((n) => /^[\w+-]{1,32}$/.test(n)); // autorise aussi le "+" en tête (ex: nom "+15M")

    // Ensuite, détecter et splitter les coordonnées concaténées (ex: "8M-7M" -> "8M", "-7M")
    const expanded = [];
    for (const part of parts) {
      // Pattern: chiffre+lettre_optionnelle - chiffre+lettre_optionnelle (ex: 8M-7M, 100-200, 5k-10k)
      const match = part.match(/^(-?\d+[kmg]?)-(-?\d+[kmg]?)$/i);
      if (match) {
        expanded.push(match[1]);
        expanded.push(match[2]);
      } else {
        expanded.push(part);
      }
    }
    return expanded;
  };
  let names = split(chunk);
  // Liste sur plusieurs lignes ("Homes:" puis un home par ligne)
  if (names.length === 0 && !regexStr) {
    names = split(clean.split('\n').filter((l) => !isChatNoise(l) && !l.includes(':')).join('\n'));
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
      health: e.health ?? null,
      food: e.food ?? null,
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
          health: null, food: null,
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
      pendingHomeTp: null, health: null, food: null,
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

    // Enregistrement automatique (pour les serveurs demandant /register <password> <password>)
    const registerTemplate = slash(server.registerCommand || '/register {password} {password}');
    const registerWord = registerTemplate.split(/\s+/)[0];
    const registerPrompt = new RegExp(`(enregistr|register|record).{0,20}${escapeRe(registerWord)}`, 'i');
    let registerSent = 0;
    let lastRegister = 0;
    const tryRegister = () => {
      if (!account.password || registerSent >= 2 || Date.now() - lastRegister < 2500) return;
      registerSent += 1;
      lastRegister = Date.now();
      const cmd = registerTemplate.split('{password}').join(account.password);
      bot.chat(cmd);
      this.addLine(e, `> ${cmd.replace(account.password, '********').replace(account.password, '********')}`, true);
    };

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
      e.health = bot.health ?? null;
      e.food = bot.food ?? null;
      this.addLine(e, tr('Connecté au serveur.', 'Connected to the server.'), true);
      this.emit('state');
      refreshPlayers();
      setTimeout(refreshPlayers, 1500);
      // Liste des homes une fois connecté (le login est géré uniquement par détection de prompt)
      setTimeout(() => { if (e.bot === bot) this.fetchHomes(e.accountId); }, account.password ? 4000 : 2500);
      const every = Math.max(5000, Number(getSettings().playerListUpdateInterval) || 30000);
      e.playerTimer = setInterval(refreshPlayers, every);
      // Anti-AFK : répète des actions configurables pour éviter d'être expulsé pour inactivité
      e.lastAfkAction = Date.now();
      e.afkTimer = setInterval(() => this.runAntiAfk(e), 5000);
    });

    // Vie / faim : mineflayer déclenche 'health' à chaque variation.
    bot.on('health', () => {
      if (e.bot !== bot) return;
      e.health = bot.health ?? null;
      e.food = bot.food ?? null;
      this.emit('state');
    });

    const tpRegex = compileRegex(server.tpRequestRegex || DEFAULT_TP_REQUEST_REGEX);
    const pmRegex = compileRegex(server.privateMessageRegex || DEFAULT_PM_REGEX);
    bot.on('message', (msg) => {
      const text = msg.toString();
      this.addLine(e, text);
      const isPlayerChat = text.trimStart().startsWith('<');
      if (e.collect && !isPlayerChat) {
        e.collect.push(text);
        // Le serveur vient de répondre : on finalise peu après, sans attendre le délai complet.
        if (e.homesQuietTimer) clearTimeout(e.homesQuietTimer);
        e.homesQuietTimer = setTimeout(() => { if (e.homesFinalize) e.homesFinalize(); }, 400);
      }
      if (!isPlayerChat && loginPrompt.test(text)) tryLogin();
      if (!isPlayerChat && registerPrompt.test(text)) tryRegister();

      // Détecter /sethome exécuté PAR LE BOT (ligne système commençant par "> /sethome ")
      if (!isPlayerChat && getSettings().recordHomeCoords && /^>\s*\/sethome\s+(\S+)/i.test(text)) {
        const match = text.match(/^>\s*\/sethome\s+(\S+)/i);
        if (match && match[1]) {
          const homeName = match[1];
          // Petit délai : si le /sethome change aussi de dimension (téléporté juste avant par
          // un portail, par ex.), le paquet de respawn qui met à jour bot.game.dimension peut
          // arriver juste après ce message de chat. On laisse la poussière retomber avant de lire.
          setTimeout(() => {
            if (e.bot !== bot || !e.bot.entity || !e.bot.entity.position) return;
            const pos = e.bot.entity.position;
            try {
              homesStore.setCoords(e.accountId, homeName, {
                x: pos.x,
                y: pos.y,
                z: pos.z,
                dimension: e.bot.game?.dimension || 'overworld',
              });
            } catch (err) {
              // Ignore errors in coordinate recording
            }
          }, 300);
        }
      }

      // Détecter /home exécuté PAR LE BOT (ligne système commençant par "> /home ")
      if (!isPlayerChat && getSettings().recordHomeCoords && /^>\s*\/home\s+(\S+)/i.test(text)) {
        const match = text.match(/^>\s*\/home\s+(\S+)/i);
        if (match && match[1]) {
          // On stocke le nom du home pour la détection de confirmation
          e.pendingHomeTp = match[1];
        }
      }

      // Détecter la confirmation de téléportation (ex: "Téléporté au home -22M !")
      if (!isPlayerChat && getSettings().recordHomeCoords && e.pendingHomeTp && e.bot.entity && e.bot.entity.position) {
        const confirmRegex = new RegExp(`(téléporté|teleported).*${escapeRe(e.pendingHomeTp)}|home.*${escapeRe(e.pendingHomeTp)}.*(téléporté|teleported)`, 'i');
        if (confirmRegex.test(text)) {
          const homeName = e.pendingHomeTp;
          e.pendingHomeTp = null;
          // Même précaution qu'au-dessus : le changement de dimension (ex: home dans l'End) peut
          // arriver un peu après ce message de confirmation. On relit la position/dimension
          // après un court délai plutôt qu'à l'instant même du message.
          setTimeout(() => {
            if (e.bot !== bot || !e.bot.entity || !e.bot.entity.position) return;
            const pos = e.bot.entity.position;
            try {
              homesStore.setCoords(e.accountId, homeName, {
                x: pos.x,
                y: pos.y,
                z: pos.z,
                dimension: e.bot.game?.dimension || 'overworld',
              });
            } catch (err) {
              // Ignore errors in coordinate recording
            }
          }, 300);
        }
      }

      // Demande de TP venant d'un de mes propres comptes : accepté directement, que la liste
      // blanche soit activée ou non (pas besoin de la whitelist entre ses propres bots).
      if (!isPlayerChat && tpRegex) {
        const ownMatch = text.match(tpRegex);
        if (ownMatch && ownMatch[1] && isOwnAccount(ownMatch[1])) {
          const acceptCmd = slash(fill(server.tpAcceptCommand || DEFAULT_TP_ACCEPT_COMMAND, { name: ownMatch[1] }));
          e.bot.chat(acceptCmd);
          this.addLine(e, `> ${acceptCmd}`, true);
          e.pendingAutoTp = { name: ownMatch[1], until: Date.now() + 30000 };
        }
      }

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
        if (m && m[1] && !isOwnAccount(m[1]) && whitelistStore.isWhitelisted(m[1])) {
          const acceptCmd = slash(fill(server.tpAcceptCommand || DEFAULT_TP_ACCEPT_COMMAND, { name: m[1] }));
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
      if (e.homesQuietTimer) clearTimeout(e.homesQuietTimer);
      if (e.afkTimer) clearInterval(e.afkTimer);
      e.collect = null;
      e.players = [];
      e.health = null;
      e.food = null;
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
    if (e.homesQuietTimer) clearTimeout(e.homesQuietTimer);
    if (e.afkTimer) clearInterval(e.afkTimer);
    e.collect = null;
    e.pendingAutoTp = null;
    e.pendingHomeConfirm = null;
    e.pendingHomeTp = null;
    if (e.bot) {
      try { e.bot.quit(); } catch (err) { /* ignore */ }
    }
    e.status = 'offline';
    e.players = [];
    e.health = null;
    e.food = null;
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
    if (e.homesQuietTimer) clearTimeout(e.homesQuietTimer);
    e.homesState = 'loading';
    e.collect = [];
    this.emit('state');
    e.bot.chat(cmd);
    this.addLine(e, `> ${cmd}`, true);

    // Finalise dès que le serveur semble avoir fini de répondre (court silence après la
    // dernière ligne reçue), au lieu d'attendre systématiquement le délai de sécurité complet.
    e.homesFinalize = () => {
      if (e.collect === null) return; // déjà finalisé
      if (e.homesTimer) { clearTimeout(e.homesTimer); e.homesTimer = null; }
      if (e.homesQuietTimer) { clearTimeout(e.homesQuietTimer); e.homesQuietTimer = null; }
      e.homes = parseHomes((e.collect || []).join('\n'), server.homesRegex);
      e.collect = null;
      e.homesState = 'done';
      // Conserve les descriptions des homes toujours présents, supprime celles des homes disparus
      try { homesStore.sync(e.accountId, e.homes); } catch (err) { /* ignore */ }
      if (e.homes.length === 0) {
        this.addLine(e, tr('Aucun home détecté (vérifie les commandes du serveur).', 'No home detected (check the server commands).'), true);
      }
      this.emit('state');
    };
    // Filet de sécurité si le serveur ne répond jamais
    e.homesTimer = setTimeout(e.homesFinalize, 2500);
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

    // Stocker le nom du home pour capturer les coordonnées APRÈS la confirmation de téléportation
    e.pendingHomeTp = name;

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

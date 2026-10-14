// ---------- Traductions ----------
const D = {
    sub: ['Gestionnaire de bots Minecraft', 'Minecraft bot manager'],
    nav_control: ['Centre de contrôle', 'Control center'],
    nav_accounts: ['Comptes & serveurs', 'Accounts & servers'],
    nav_settings: ['Paramètres', 'Settings'],
    st_on: ['Connecté', 'Connected'],
    st_off: ['Déconnecté (nouvelle tentative...)', 'Disconnected (retrying...)'],
    ctl_online: ['Comptes connectés', 'Connected accounts'],
    ctl_offline: ['Comptes hors ligne', 'Offline accounts'],
    ctl_none_online: ['Aucun compte connecté.', 'No account connected.'],
    ctl_no_acc: ["Aucun compte. Ajoute-en un dans l'onglet Comptes & serveurs.", 'No account. Add one in the Accounts & servers tab.'],
    s_offline: ['Hors ligne', 'Offline'],
    s_connecting: ['Connexion...', 'Connecting...'],
    s_online: ['En ligne', 'Online'],
    s_reconnecting: ['Reconnexion...', 'Reconnecting...'],
    s_error: ['Erreur', 'Error'],
    btn_connect: ['Connecter', 'Connect'],
    btn_disconnect: ['Déconnecter', 'Disconnect'],
    btn_send: ['Envoyer', 'Send'],
    btn_add: ['Ajouter', 'Add'],
    btn_edit: ['Modifier', 'Edit'],
    btn_delete: ['Supprimer', 'Delete'],
    btn_save: ['Enregistrer', 'Save'],
    btn_cancel: ['Annuler', 'Cancel'],
    btn_refresh: ['Actualiser homes', 'Refresh homes'],
    players: ['Joueurs ({0})', 'Players ({0})'],
    homes: ['Homes ({0})', 'Homes ({0})'],
    homes_loading: ['Recherche des homes...', 'Looking for homes...'],
    homes_none: ['Aucun home détecté', 'No home found'],
    home_tp: ['Téléportation vers {0}', 'Teleporting to {0}'],
    chat_ph: ['Message ou commande...', 'Message or command...'],
    home_note_ph: ['Description (optionnel)', 'Description (optional)'],
    add_srv_first: ["Ajoute d'abord un serveur", 'Add a server first'],
    acc_title: ['Comptes', 'Accounts'],
    acc_hint: ['Comptes offline. Avec un mot de passe, le bot envoie la commande de connexion du serveur à l\'arrivée.', 'Offline accounts. With a password, the bot sends the server\'s login command on join.'],
    ph_user: ['Pseudo Minecraft', 'Minecraft username'],
    ph_pwd: ['Mot de passe (optionnel)', 'Password (optional)'],
    ph_newpwd: ['Nouveau mot de passe (vide = inchangé)', 'New password (empty = keep current)'],
    pwd_set: ['Connexion automatique activée', 'Auto-login enabled'],
    pwd_none: ['Pas de mot de passe', 'No password'],
    rm_pwd: ['Retirer le mot de passe', 'Remove password'],
    user_req: ['Pseudo requis.', 'Username required.'],
    disc_first: ['Déconnecte le bot avant de modifier ce compte.', 'Disconnect the bot before editing.'],
    update_available: ['Une nouvelle version de BotHub est disponible', 'A new version of BotHub is available'],
    update_see: ['Voir sur GitHub', 'See on GitHub'],
    version_current: ['Version actuelle', 'Current version'],
    srv_title: ['Serveurs', 'Servers'],
    srv_hint: ["Développé pour 2b2fr.org. Compatible avec d'autres serveurs si les commandes sont identiques ou correctement configurées.", 'Built for 2b2fr.org. Works with other servers if commands are identical or properly configured.'],
    ph_name: ['Nom (ex: 2B2FR)', 'Name (e.g. 2B2FR)'],
    ph_host: ['Adresse', 'Address'],
    ph_version: ['Version (auto)', 'Version (auto)'],
    srv_cmds: ['Commandes du serveur', 'Server commands'],
    c_login: ['/login — {password} = mot de passe', '/login — {password} = password'],
    c_homes: ['Commande liste des homes', 'Homes list command'],
    c_home: ['/home — {name} = nom du home', '/home — {name} = home name'],
    c_regex: ['Regex homes (optionnel, groupe 1 = liste)', 'Homes regex (optional, group 1 = list)'],
    d_login: ['/login {password}', '/login {password}'],
    d_homes: ['/homes', '/homes'],
    d_home: ['/home {name}', '/home {name}'],
    set_lang: ['Langue', 'Language'],
    set_theme: ['Thème', 'Theme'],
    dark: ['Sombre', 'Dark'],
    light: ['Clair', 'Light'],
    set_motion: ['Réduire les animations', 'Reduce motion'],
    set_open: ['Ouvrir le navigateur au démarrage', 'Open browser on startup'],
    set_reco: ['Reconnexion automatique des bots', 'Auto-reconnect bots'],
    set_initial: ['Délai initial (s)', 'Initial delay (s)'],
    set_max: ['Délai maximum (s)', 'Max delay (s)'],
    set_attempts: ['Tentatives max (-1 = illimité)', 'Max attempts (-1 = unlimited)'],
    set_wl: ['Activer la liste blanche (/tpa auto-accepté)', 'Enable whitelist (auto-accept /tpa)'],
    set_afk_title: ['Anti-AFK', 'Anti-AFK'],
    afk_enabled: ["Activer l'anti-AFK", 'Enable anti-AFK'],
    afk_interval: ['Intervalle anti-AFK (s)', 'Anti-AFK interval (s)'],
    afk_sneak: ['Se baisser (sneak)', 'Sneak'],
    afk_jump: ['Sauter (jump)', 'Jump'],
    afk_chat: ['Envoyer un message dans le chat', 'Send a chat message'],
    ph_afk_text: ['Message anti-AFK', 'Anti-AFK message'],
    ph_desc: ['Description (optionnel)', 'Description (optional)'],
    wl_title: ['Liste blanche', 'Whitelist'],
    wl_hint: ["Le bot accepte automatiquement les demandes de téléportation (/tpa) venant des joueurs listés ici.", 'The bot automatically accepts teleport requests (/tpa) from players listed here.'],
    ph_wl_name: ['Pseudo', 'Username'],
    btn_reset_all: ['Réinitialiser tous les réglages', 'Reset all settings'],
    set_danger_title: ['Zone dangereuse', 'Danger zone'],
    set_danger_hint: ['Réinitialise tous les réglages, comptes, serveurs, la liste blanche et les homes enregistrés.', 'Resets all settings, accounts, servers, the whitelist and saved homes.'],
    reset_confirm: ['Cette action supprime définitivement tous les comptes, serveurs, la liste blanche et les réglages. Continuer ?', 'This permanently deletes all accounts, servers, the whitelist and settings. Continue?'],
    saved: ['Enregistré.', 'Saved.'],
    tpa_from: ['{0} veut se téléporter sur vous.', '{0} wants to teleport to you.'],
    tpa_accept: ['Accepter', 'Accept'],
    tpa_deny: ['Refuser', 'Deny'],
};

let currentSettings = {};
let lang = 'fr';

const t = (key, ...args) => {
    let text = (D[key] || [key, key])[lang === 'en' ? 1 : 0];
    args.forEach((v, i) => { text = text.replace(`{${i}}`, v); });
    return text;
};

// ---------- DOM helpers ----------
const $ = (id) => document.getElementById(id.startsWith('#') ? id.slice(1) : id);

function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
}
function inp(ph, val = '', type = 'text') {
    const n = el('input'); n.type = type; n.placeholder = ph; n.value = val; return n;
}

function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((n) => { n.textContent = t(n.dataset.i18n); });
    document.querySelectorAll('[data-i18n-ph]').forEach((n) => { n.placeholder = t(n.dataset.i18nPh); });
    // Les options du select thème ne sont pas des data-i18n, on les traduit ici
    const dark = document.querySelector('#set-theme option[value="dark"]');
    const light = document.querySelector('#set-theme option[value="light"]');
    if (dark) dark.textContent = t('dark');
    if (light) light.textContent = t('light');
    setStatus(state.online);
    // Re-render uniquement si les données sont déjà chargées
    if (state.servers.length > 0 || state.accounts.length > 0 || state.dataLoaded) {
        buildServerForm();
        panels.forEach((p) => p.root.remove());
        panels.clear();
        renderAccounts();
        renderServers();
        renderControl();
    }
}

// ---------- Modal premier lancement ----------
function checkFirstLaunch() {
    // Ré-affiche la modal si aucune langue n'a été sauvegardée côté serveur
    const serverLang = currentSettings && currentSettings.language;
    const alreadyChosen = localStorage.getItem('langChosen');
    // Si le serveur a déjà une langue (settings.json existe), ne pas afficher la modal
    if (alreadyChosen || serverLang) {
        if (serverLang) localStorage.setItem('langChosen', '1');
        return;
    }
    const modal = $('lang-modal');
    if (!modal) return;
    modal.hidden = false;
    // Éviter les doublons de listeners avec cloneNode
    const fr = $('lang-fr').cloneNode(true);
    const en = $('lang-en').cloneNode(true);
    $('lang-fr').replaceWith(fr);
    $('lang-en').replaceWith(en);
    fr.addEventListener('click', () => chooseLang('fr', modal));
    en.addEventListener('click', () => chooseLang('en', modal));
}

function setLanguage(chosen) {
    lang = chosen;
    localStorage.setItem('langChosen', '1');
    applyLang();
    api('PUT', '/api/settings', { language: chosen }).then(r => {
        currentSettings = r.settings;
    }).catch(() => {});
}

function chooseLang(chosen, modal) {
    modal.hidden = true;
    setLanguage(chosen);
}

function setTheme(value) {
    document.documentElement.dataset.theme = value;
    api('PUT', '/api/settings', { theme: value }).then(r => {
        currentSettings = r.settings;
    }).catch(() => {});
}

// ---------- Toast ----------
function showToast(message, type = 'error', duration = 4000) {
    const container = $('toast-container');
    const wrap = el('div', `toast ${type}`);
    const icon = el('span', 'toast-icon', type === 'error' ? '❌' : type === 'warn' ? '⚠️' : '✅');
    const body = el('span', '', message);
    const close = el('button', 'toast-close', '×');
    close.addEventListener('click', () => wrap.remove());
    wrap.append(icon, body, close);
    container.append(wrap);
    setTimeout(() => { if (wrap.parentNode) wrap.remove(); }, duration);
}

// ---------- État ----------
const state = {
    online: false, bots: new Map(), servers: [], accounts: [], whitelist: [], ws: null,
    choice: new Map(), editingAccount: null, editingServer: null,
    dataLoaded: false,
    dataLoaded: false,
};
const panels = new Map();
const ACTIVE = ['online', 'connecting', 'reconnecting'];
const isActive = (id) => ACTIVE.includes((state.bots.get(id) || {}).status);

function setStatus(online) {
    state.online = online;
    const node = $('status');
    if (!node) return;
    node.className = `pill ${online ? 'on' : 'off'}`;
    node.textContent = t(online ? 'st_on' : 'st_off');
}

function chatLine(line) {
    const div = el('div', line.system ? 'sys' : '');
    div.textContent = line.text;
    return div;
}

function wsSend(obj) {
    if (state.ws && state.ws.readyState === WebSocket.OPEN) state.ws.send(JSON.stringify(obj));
}

// ---------- API ----------
function api(method, path, data) {
    return fetch(path, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined,
    }).then(r => {
        if (!r.ok) return r.json().then(d => Promise.reject(new Error(d.error || `HTTP ${r.status}`))).catch(e => { if (e instanceof Error) throw e; throw new Error(`HTTP ${r.status}`); });
        return r.json();
    });
}

// ---------- Onglets ----------
function showTab(tabId) {
    document.querySelectorAll('main > section').forEach(s => { s.hidden = true; });
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    const tab = document.getElementById(tabId);
    if (tab) tab.hidden = false;
    const btn = document.querySelector(`nav button[data-tab="${tabId.replace('tab-', '')}"]`);
    if (btn) btn.classList.add('active');
}

// ---------- Paramètres ----------
function applySettings(settings) {
    currentSettings = settings;
    lang = settings.language || 'fr';
    document.documentElement.dataset.theme = settings.theme;
    document.body.classList.toggle('no-motion', settings.reducedMotion);
    $('set-lang').value = settings.language;
    $('set-theme').value = settings.theme;
    $('set-motion').checked = settings.reducedMotion;
    $('set-open').checked = settings.openBrowser;
    $('set-reco').checked = settings.autoReconnect;
    $('set-initial').value = settings.reconnectInitialDelay / 1000;
    $('set-max').value = settings.reconnectMaxDelay / 1000;
    $('set-attempts').value = settings.reconnectMaxAttempts;
    $('set-wl').checked = settings.whitelistEnabled;
    const afk = settings.antiAfk || {};
    $('afk-enabled').checked = !!afk.enabled;
    $('afk-interval').value = (afk.interval || 60000) / 1000;
    $('afk-sneak').checked = !!afk.sneak;
    $('afk-jump').checked = !!afk.jump;
    $('afk-chat-enabled').checked = !!afk.chatEnabled;
    $('afk-chat-text').value = afk.chatText || '';
    applyLang();
}

function saveSettings() {
    const settings = {
        language: $('set-lang').value,
        theme: $('set-theme').value,
        reducedMotion: $('set-motion').checked,
        openBrowser: $('set-open').checked,
        autoReconnect: $('set-reco').checked,
        reconnectInitialDelay: parseInt($('set-initial').value) * 1000,
        reconnectMaxDelay: parseInt($('set-max').value) * 1000,
        reconnectMaxAttempts: parseInt($('set-attempts').value),
        whitelistEnabled: $('set-wl').checked,
        antiAfk: {
            enabled: $('afk-enabled').checked,
            interval: parseInt($('afk-interval').value) * 1000,
            sneak: $('afk-sneak').checked,
            jump: $('afk-jump').checked,
            chatEnabled: $('afk-chat-enabled').checked,
            chatText: $('afk-chat-text').value,
        },
    };
    api('PUT', '/api/settings', settings).then(r => {
        applySettings(r.settings);
        $('set-msg').textContent = t('saved');
        setTimeout(() => { $('set-msg').textContent = ''; }, 2000);
    }).catch(err => { showToast(err.message, 'error'); });
}

function loadSettings() {
    api('GET', '/api/settings').then(r => applySettings(r.settings)).catch(() => {});
}

// ---------- Vérification de mise à jour ----------
function checkForUpdate() {
    api('GET', '/api/version').then(r => {
        if (!r) return;
        // Afficher la version actuelle en discret
        const versionDisplay = $('version-display');
        if (versionDisplay) {
            versionDisplay.textContent = `${t('version_current')}: ${r.current}`;
        }
        // Afficher la bannière si nouvelle version disponible
        if (!r.updateAvailable || !r.latest) return;
        if (localStorage.getItem('updateDismissed') === r.latest) return;
        $('update-banner-text').textContent = `${t('update_available')} (${r.current} → ${r.latest})`;
        const link = $('update-banner-link');
        link.textContent = t('update_see');
        link.href = r.url;
        $('update-banner').hidden = false;
        $('update-banner-close').addEventListener('click', () => {
            localStorage.setItem('updateDismissed', r.latest);
            $('update-banner').hidden = true;
        }, { once: true });
    }).catch(() => {});
}

function resetAll() {
    if (!window.confirm(t('reset_confirm'))) return;
    fetch('/api/reset', { method: 'DELETE' }).then(r => {
        if (!r.ok) return r.json().then(d => Promise.reject(new Error(d.error || `HTTP ${r.status}`)));
        return r.json();
    }).then(() => {
        location.reload();
    }).catch(err => {
        $('reset-msg').textContent = err.message;
    });
}

// ---------- Comptes ----------
function loadAccounts() {
    api('GET', '/api/accounts').then(r => { state.accounts = r.accounts || []; state.dataLoaded = true; renderAccounts(); renderControl(); }).catch(() => {});
}

function renderAccounts() {
    const list = $('acc-list');
    list.innerHTML = '';
    for (const acc of state.accounts) {
        const li = el('li');
        if (state.editingAccount === acc.id) {
            const form = el('div', 'row edit');
            const name = inp(t('ph_user'), acc.username);
            const pwd = inp(t('ph_newpwd'), '', 'password');
            const clrLbl = el('label', 'row');
            const clr = inp('', '', 'checkbox');
            clrLbl.append(clr, document.createTextNode(` ${t('rm_pwd')}`));
            const save = el('button', '', t('btn_save'));
            const cancel = el('button', 'ghost', t('btn_cancel'));
            cancel.addEventListener('click', () => { state.editingAccount = null; renderAccounts(); });
            save.addEventListener('click', () => {
                const body = { username: name.value.trim() };
                if (clr.checked) body.password = '';
                else if (pwd.value) body.password = pwd.value;
                api('PUT', `/api/accounts/${encodeURIComponent(acc.id)}`, body)
                    .then(() => { state.editingAccount = null; loadAccounts(); showToast(t('saved'), 'success', 2000); })
                    .catch(err => showToast(err.message, 'error'));
            });
            form.append(name, pwd, clrLbl, save, cancel);
            li.append(form);
        } else {
            const info = el('span', 'info');
            info.append(el('strong', '', acc.username));
            info.append(el('small', 'muted', acc.hasPassword ? t('pwd_set') : t('pwd_none')));
            const btns = el('span', 'btns');
            const edit = el('button', 'small ghost', t('btn_edit'));
            edit.addEventListener('click', () => {
                if (isActive(acc.id)) { showToast(t('disc_first'), 'warn'); return; }
                state.editingAccount = acc.id; renderAccounts();
            });
            const del = el('button', 'small danger', t('btn_delete'));
            del.addEventListener('click', () => {
                if (!confirm(`Supprimer ${acc.username} ?`)) return;
                wsSend({ type: 'disconnect', accountId: acc.id });
                api('DELETE', `/api/accounts/${encodeURIComponent(acc.id)}`).then(() => loadAccounts()).catch(err => showToast(err.message, 'error'));
            });
            btns.append(edit, del);
            li.append(info, btns);
        }
        list.append(li);
    }
}

$('wl-add').addEventListener('click', () => {
    const name = $('wl-name').value.trim();
    if (!name) { showToast(t('user_req'), 'warn'); return; }
    api('POST', '/api/whitelist', { name })
        .then(() => { $('wl-name').value = ''; loadWhitelist(); showToast(`${name} ajouté`, 'success', 2000); })
        .catch(err => { $('wl-error').textContent = err.message; });
});

$('acc-add').addEventListener('click', () => {
    const username = $('acc-username').value.trim();
    if (!username) { showToast(t('user_req'), 'warn'); return; }
    api('POST', '/api/accounts', { id: username.toLowerCase(), username, password: $('acc-password').value })
        .then(() => { $('acc-username').value = $('acc-password').value = ''; loadAccounts(); showToast(`${username} ajouté`, 'success', 2000); })
        .catch(err => { $('acc-error').textContent = err.message; });
});

// ---------- Serveurs ----------
function srvLabel(srv) { return `${srv.name} — ${srv.host}${srv.version ? ` (${srv.version})` : ''}`; }

function serverForm(initial, submitLabel, onSubmit, onCancel) {
    const form = el('div', 'srvform');
    const row = el('div', 'row');
    const name = inp(t('ph_name'), initial.name || '');
    const host = inp(t('ph_host'), initial.host || '');
    const port = inp('Port', initial.port || 25565, 'number'); port.className = 'short';
    const version = inp(t('ph_version'), initial.version || ''); version.className = 'short';
    const submit = el('button', '', submitLabel);
    row.append(name, host, port, version, submit);
    if (onCancel) {
        const c = el('button', 'ghost', t('btn_cancel'));
        c.addEventListener('click', onCancel);
        row.append(c);
    }
    const details = el('details', 'cmds');
    details.append(el('summary', '', t('srv_cmds')));
    const grid = el('div', 'cmdgrid');
    const fields = {};
    for (const [key, label, ph] of [
        ['loginCommand', 'c_login', 'd_login'],
        ['homesCommand', 'c_homes', 'd_homes'],
        ['homeCommand', 'c_home', 'd_home'],
        ['homesRegex', 'c_regex', ''],
    ]) {
        const wrap = el('label');
        wrap.append(el('div', 'sub', t(label)));
        fields[key] = inp(t(ph) || '', initial[key] || '');
        fields[key].style.width = '100%';
        wrap.append(fields[key]);
        grid.append(wrap);
    }
    details.append(grid);
    form.append(row, details);
    submit.addEventListener('click', () => onSubmit({
        name: name.value, host: host.value, port: Number(port.value), version: version.value,
        loginCommand: fields.loginCommand.value, homesCommand: fields.homesCommand.value,
        homeCommand: fields.homeCommand.value, homesRegex: fields.homesRegex.value,
    }));
    return form;
}

function buildServerForm() {
    const container = $('srv-form');
    container.innerHTML = '';
    container.append(serverForm({}, t('btn_add'), (data) => {
        api('POST', '/api/servers', data)
            .then(() => { loadServers(); buildServerForm(); showToast(`${data.name} ajouté`, 'success', 2000); })
            .catch(err => { $('srv-error').textContent = err.message; });
    }));
}

function loadServers() {
    api('GET', '/api/servers').then(r => { state.servers = r.servers || []; renderServers(); renderControl(); }).catch(() => {});
}

function renderServers() {
    const list = $('srv-list');
    list.innerHTML = '';
    for (const srv of state.servers) {
        const li = el('li');
        if (state.editingServer === srv.id) {
            li.style.display = 'block';
            li.append(serverForm(srv, t('btn_save'), (data) => {
                api('PUT', `/api/servers/${encodeURIComponent(srv.id)}`, data)
                    .then(() => { state.editingServer = null; loadServers(); showToast(t('saved'), 'success', 2000); })
                    .catch(err => { $('srv-error').textContent = err.message; });
            }, () => { state.editingServer = null; renderServers(); }));
        } else {
            li.append(el('span', '', srvLabel(srv)));
            const btns = el('span', 'btns');
            const edit = el('button', 'small ghost', t('btn_edit'));
            edit.addEventListener('click', () => { state.editingServer = srv.id; renderServers(); });
            const del = el('button', 'small danger', t('btn_delete'));
            del.addEventListener('click', () => {
                api('DELETE', `/api/servers/${encodeURIComponent(srv.id)}`).then(() => loadServers()).catch(err => showToast(err.message));
            });
            btns.append(edit, del);
            li.append(btns);
        }
        list.append(li);
    }
}

// ---------- Liste blanche ----------
function loadWhitelist() {
    api('GET', '/api/whitelist').then(r => { state.whitelist = r.entries || []; renderWhitelist(); }).catch(() => {});
}

function renderWhitelist() {
    const list = $('wl-list');
    list.innerHTML = '';
    for (const entryItem of (state.whitelist || [])) {
        const li = el('li');
        li.append(el('span', '', entryItem.name));
        const btns = el('span', 'btns');
        const del = el('button', 'small danger', t('btn_delete'));
        del.addEventListener('click', () => {
            api('DELETE', `/api/whitelist/${encodeURIComponent(entryItem.id)}`).then(() => loadWhitelist()).catch(err => showToast(err.message, 'error'));
        });
        btns.append(del);
        li.append(btns);
        list.append(li);
    }
}

// ---------- Centre de contrôle ----------
function saveHomeNote(accountId, homeName, value) {
    api('PUT', `/api/homes/${accountId}/${encodeURIComponent(homeName)}`, { description: value }).catch(() => {});
}

function homeDescriptions(bot) {
    const map = {};
    for (const h of (bot.homesInfo || [])) map[h.name] = h.description || '';
    return map;
}

function renderOfflineHomes(container, acc, bot) {
    const descs = homeDescriptions(bot);
    const names = Object.keys(descs);
    container.innerHTML = '';
    if (names.length === 0) return;
    container.hidden = false;
    for (const name of names) {
        const chip = el('span', 'chip', name);
        if (descs[name]) chip.title = descs[name];
        container.append(chip);
    }
}

function createPanel(acc) {
    const root = el('div', 'card panel');
    const head = el('div', 'head');
    const badge = el('span', 'badge');
    const srvName = el('span', 'sub');
    const count = el('span', 'sub');
    const disc = el('button', 'danger small', t('btn_disconnect'));
    disc.addEventListener('click', () => wsSend({ type: 'disconnect', accountId: acc.id }));
    head.append(el('strong', '', acc.username), badge, srvName, count, el('span', 'sp'), disc);

    const homesLbl = el('div', 'lbl');
    const homesTitle = el('span');
    const refresh = el('button', 'ghost small', t('btn_refresh'));
    refresh.addEventListener('click', () => wsSend({ type: 'homes', accountId: acc.id }));
    homesLbl.append(homesTitle, refresh);
    const homes = el('div', 'chips');

    const playersLbl = el('div', 'lbl');
    const players = el('div', 'chips');

    const chat = el('div', 'chat');
    const row = el('div', 'row');
    const box = inp(t('chat_ph')); box.className = 'grow'; box.maxLength = 256;
    const send = el('button', '', t('btn_send'));
    const submit = () => {
        const m = box.value.trim();
        if (!m) return;
        wsSend({ type: 'chat', accountId: acc.id, message: m });
        box.value = '';
    };
    send.addEventListener('click', submit);
    box.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    row.append(box, send);

    root.append(head, homesLbl, homes, playersLbl, players, chat, row);
    wsSend({ type: 'history', accountId: acc.id });
    return { root, badge, srvName, count, homesTitle, homes, playersLbl, players, chat, keys: {} };
}

function updatePanel(p, acc, bot) {
    p.badge.className = `badge ${bot.status}`;
    p.badge.textContent = t(`s_${bot.status}`);
    const srv = state.servers.find(s => s.id === bot.serverId);
    p.srvName.textContent = srv ? srv.name : '';
    const online = bot.status === 'online';
    const playerList = bot.players || [];
    p.count.textContent = online ? t('players', playerList.length) : '';
    p.playersLbl.textContent = t('players', playerList.length);

    const pSig = JSON.stringify(playerList);
    if (p.keys.players !== pSig) {
        p.keys.players = pSig;
        p.players.replaceChildren(...playerList.map(n => el('span', `chip${n === acc.username ? ' me' : ''}`, n)));
    }

    const homeList = bot.homes || [];
    p.homesTitle.textContent = t('homes', homeList.length);
    // Titre et message d'état : toujours mis à jour
    const statMsg = bot.homesState === 'loading' ? t('homes_loading') : bot.homesState === 'done' && homeList.length === 0 ? t('homes_none') : '';
    if (p.keys.homesStat !== statMsg) {
        p.keys.homesStat = statMsg;
        if (homeList.length === 0) p.homes.replaceChildren(el('span', 'sub', statMsg));
    }
    // Chips : recréées seulement si la liste des noms change
    const hSig = JSON.stringify(homeList);
    if (p.keys.homes !== hSig) {
        p.keys.homes = hSig;
        if (homeList.length > 0) {
            p.homes.replaceChildren(...homeList.map(name => {
                const wrap = el('div', 'home-chip');
                const btn = el('button', 'chip', name);
                btn.title = `/home ${name}`;
                btn.addEventListener('click', () => {
                    wsSend({ type: 'home', accountId: acc.id, name });
                    showToast(t('home_tp', name), 'success', 3000);
                });
                const descs = homeDescriptions(bot);
                const noteIn = inp(t('home_note_ph'), descs[name] || '');
                noteIn.className = 'home-note';
                // Sauvegarde debouncée pour ne pas écrire à chaque touche
                let saveTimer = null;
                noteIn.addEventListener('input', () => {
                    clearTimeout(saveTimer);
                    saveTimer = setTimeout(() => saveHomeNote(acc.id, name, noteIn.value), 400);
                });
                wrap.append(btn, noteIn);
                return wrap;
            }));
        }
    }
}

function renderControl() {
    const active = state.accounts.filter(a => isActive(a.id));
    const offline = state.accounts.filter(a => !isActive(a.id));

    for (const [id, p] of panels) {
        if (!active.some(a => a.id === id)) { p.root.remove(); panels.delete(id); }
    }
    const panelContainer = $('panels');
    for (const acc of active) {
        if (!panels.has(acc.id)) panels.set(acc.id, createPanel(acc));
        updatePanel(panels.get(acc.id), acc, state.bots.get(acc.id));
        panelContainer.append(panels.get(acc.id).root);
    }
    panelContainer.className = `panels ${active.length > 1 ? 'multi' : 'single'}`;
    const empty = $('panels-empty');
    empty.hidden = active.length > 0;
    empty.textContent = state.accounts.length === 0 ? t('ctl_no_acc') : t('ctl_none_online');

    $('offline-title').hidden = offline.length === 0;
    const box = $('offline');
    box.innerHTML = '';
    for (const acc of offline) {
        const bot = state.bots.get(acc.id) || { status: 'offline', error: null, homesInfo: [] };
        const wrap = el('div', 'mini-wrap');
        const row = el('div', 'mini');
        row.append(el('strong', '', acc.username), el('span', `badge ${bot.status}`, t(`s_${bot.status}`)));
        const select = el('select');
        if (state.servers.length === 0) {
            const opt = el('option', '', t('add_srv_first')); opt.value = ''; select.append(opt);
        } else {
            for (const srv of state.servers) {
                const opt = el('option', '', srv.name); opt.value = srv.id; select.append(opt);
            }
        }
        select.value = state.choice.get(acc.id) || bot.serverId || (state.servers[0] && state.servers[0].id) || '';
        select.disabled = state.servers.length === 0;
        select.addEventListener('change', () => state.choice.set(acc.id, select.value));
        const connectBtn = el('button', '', t('btn_connect'));
        connectBtn.disabled = !select.value;
        connectBtn.title = state.servers.length === 0 ? t('add_srv_first') : '';
        connectBtn.addEventListener('click', () => {
            $('ctl-error').textContent = '';
            wsSend({ type: 'connect', accountId: acc.id, serverId: select.value });
        });
        row.append(select, connectBtn);
        if (bot.error) row.append(el('small', 'danger', bot.error));
        wrap.append(row);
        const homesBox = el('div', 'mini-homes');
        homesBox.hidden = true;
        renderOfflineHomes(homesBox, acc, bot);
        wrap.append(homesBox);
        box.append(wrap);
    }
}

// ---------- WebSocket ----------
function connectWs() {
    const proto = location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${proto}://${location.host}`);
    state.ws = ws;
    ws.addEventListener('open', () => {
        setStatus(true);
        panels.forEach((p, id) => wsSend({ type: 'history', accountId: id }));
    });
    ws.addEventListener('message', (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === 'state') {
            state.bots = new Map(msg.bots.map(b => [b.accountId, b]));
            renderControl();
        } else if (msg.type === 'chat') {
            const p = panels.get(msg.accountId);
            if (p) {
                p.chat.append(chatLine(msg.line));
                p.chat.scrollTop = p.chat.scrollHeight;
                // Détection /tpa
                const clean = msg.line.text.replace(/[§&][0-9a-fk-orx]/gi, '');
                const tpaMatch = clean.match(/^(.+?) (?:veut se téléporter sur vous|wants to teleport to you)/i);
                if (tpaMatch) {
                    const requester = tpaMatch[1].trim();
                    if (currentSettings.whitelist && currentSettings.whitelist.includes(requester)) {
                        wsSend({ type: 'chat', accountId: msg.accountId, message: '/tpaccept' });
                        p.chat.append(chatLine({ t: Date.now(), text: `> /tpaccept (whitelist: ${requester})`, system: true }));
                        p.chat.scrollTop = p.chat.scrollHeight;
                    } else {
                        const toast = el('div', 'toast tpa-toast');
                        toast.innerHTML = `<span>${t('tpa_from', requester)}</span>`;
                        const accept = el('button', 'small', t('tpa_accept'));
                        const deny = el('button', 'small danger', t('tpa_deny'));
                        accept.addEventListener('click', () => { wsSend({ type: 'chat', accountId: msg.accountId, message: '/tpaccept' }); toast.remove(); });
                        deny.addEventListener('click', () => { wsSend({ type: 'chat', accountId: msg.accountId, message: '/tpdeny' }); toast.remove(); });
                        toast.append(accept, deny);
                        $('toast-container').append(toast);
                        setTimeout(() => { if (toast.parentNode) toast.remove(); }, 15000);
                    }
                }
            }
        } else if (msg.type === 'history') {
            const p = panels.get(msg.accountId);
            if (p) { p.chat.replaceChildren(...msg.lines.map(chatLine)); p.chat.scrollTop = p.chat.scrollHeight; }
        } else if (msg.type === 'error') {
            showToast(msg.message, 'error');
        }
    });
    ws.addEventListener('close', () => { setStatus(false); setTimeout(connectWs, 2000); });
    ws.addEventListener('error', () => setStatus(false));
}

// ---------- Init ----------
function init() {
    document.querySelectorAll('nav button').forEach(btn => {
        btn.addEventListener('click', () => showTab(`tab-${btn.dataset.tab}`));
    });
    $('set-save').addEventListener('click', saveSettings);
    $('set-reset').addEventListener('click', resetAll);
    $('set-lang').addEventListener('change', (e) => setLanguage(e.target.value));
    $('set-theme').addEventListener('change', (e) => setTheme(e.target.value));
    $('acc-add').addEventListener('click', () => {});  // handled below via event delegation
    showTab('tab-control');
    checkFirstLaunch();
    loadSettings();
    loadAccounts();
    loadServers();
    loadWhitelist();
    checkForUpdate();
    connectWs();
}

init();

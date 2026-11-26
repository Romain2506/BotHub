// ---------- Traductions ----------
const D = {
    sub: ['Gestionnaire de bots Minecraft', 'Minecraft bot manager'],
    nav_control: ['Centre de contrôle', 'Control center'],
    nav_accounts: ['Comptes & serveurs', 'Accounts & servers'],
    nav_map: ['Carte', 'Map'],
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
    c_register: ['/register — {password} = mot de passe (x2)', '/register — {password} = password (x2)'],
    c_homes: ['Commande liste des homes', 'Homes list command'],
    c_home: ['/home — {name} = nom du home', '/home — {name} = home name'],
    c_regex: ['Regex homes (optionnel, groupe 1 = liste)', 'Homes regex (optional, group 1 = list)'],
    d_login: ['/login {password}', '/login {password}'],
    d_register: ['/register {password} {password}', '/register {password} {password}'],
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
    set_record_coords: ['Enregistrer les coordonnées des homes (/sethome, /home)', 'Record home coordinates (/sethome, /home)'],
    set_clear_coords: ['Effacer toutes les coordonnées enregistrées', 'Clear all recorded coordinates'],
    btn_clear_coords: ['Effacer les coordonnées', 'Clear coordinates'],
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
    set_export_title: ['Export des comptes', 'Account export'],
    set_export_hint: ['Exporte tous les comptes (pseudo + mot de passe EN CLAIR) dans un fichier. À garder en lieu sûr.', 'Exports all accounts (username + password IN CLEAR TEXT) to a file. Keep it somewhere safe.'],
    btn_export_txt: ['Exporter en .txt', 'Export as .txt'],
    btn_export_csv: ['Exporter en .csv (Excel)', 'Export as .csv (Excel)'],
    btn_reset_all: ['Réinitialiser tous les réglages', 'Reset all settings'],
    set_danger_title: ['Zone dangereuse', 'Danger zone'],
    set_danger_hint: ['Réinitialise tous les réglages, comptes, serveurs, la liste blanche et les homes enregistrés.', 'Resets all settings, accounts, servers, the whitelist and saved homes.'],
    reset_confirm: ['Cette action supprime définitivement tous les comptes, serveurs, la liste blanche et les réglages. Continuer ?', 'This permanently deletes all accounts, servers, the whitelist and settings. Continue?'],
    saved: ['Enregistré.', 'Saved.'],
    tpa_from: ['{0} veut se téléporter sur vous.', '{0} wants to teleport to you.'],
    tpa_accept: ['Accepter', 'Accept'],
    tpa_deny: ['Refuser', 'Deny'],
    map_title: ['Carte des homes', 'Homes map'],
    map_hint: ['Vue globale du monde (30M × 30M). Cliquez sur la carte pour voir les coordonnées. Molette pour zoomer, glisser pour déplacer.', 'World overview (30M × 30M). Click map to see coordinates. Wheel to zoom, drag to pan.'],
    map_no_coords: ['Aucun home avec coordonnées enregistrées. Activez l\'option dans les paramètres et faites /home ou /sethome.', 'No homes with recorded coordinates. Enable the option in settings and use /home or /sethome.'],
    map_copy_coords: ['Coordonnées copiées : {0} {1} {2}', 'Coordinates copied: {0} {1} {2}'],
    btn_copy: ['Copier', 'Copy'],
    map_click_hint: ['Cliquez sur la carte pour afficher les coordonnées', 'Click on map to show coordinates'],
    map_cluster: ['{0} homes', '{0} homes'],
    map_zoom: ['Zoom: {0}%', 'Zoom: {0}%'],
    map_sidebar_title: ['Homes avec coordonnées', 'Homes with coords'],
    map_search_ph: ['Rechercher un compte ou un home...', 'Search an account or home...'],
    map_search_empty: ['Aucun résultat pour cette recherche.', 'No results for this search.'],
    map_export_done: ['Carte exportée en image.', 'Map exported as image.'],
    map_export_error: ["Échec de l'export de la carte.", 'Failed to export the map.'],
    map_legend_title: ['Comptes', 'Accounts'],
    map_dim_overworld: ['Surface', 'Overworld'],
    map_dim_nether: ['Nether', 'Nether'],
    map_dim_end: ['End', 'End'],
    vital_hp: ['Vie', 'Health'],
    vital_food: ['Faim', 'Hunger'],
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
    // Map state
    homesByAccount: {}, // accountId -> [{name, coords, description, color}]
    mapDimension: 'overworld', // 'overworld' | 'nether' | 'end'
    mapTransform: { x: 0, y: 0, scale: 1 },
    mapDrag: { active: false, startX: 0, startY: 0, startTransformX: 0, startTransformY: 0 },
    mapAnimationFrame: null,
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

    // Initialiser la carte quand l'onglet est affiché
    if (tabId === 'tab-map') {
        initMap();
    }
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
    $('set-record-coords').checked = settings.recordHomeCoords || false;
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
        recordHomeCoords: $('set-record-coords').checked,
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

function clearCoords() {
    if (!window.confirm('Effacer toutes les coordonnées enregistrées ? Les descriptions seront conservées.')) return;
    api('POST', '/api/homes/clear-coords')
        .then(() => {
            showToast('Coordonnées effacées', 'success', 2000);
            if (mapCanvas) mapCanvas.scheduleRender();
        })
        .catch(err => {
            $('clear-coords-msg').textContent = err.message;
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
        ['registerCommand', 'c_register', 'd_register'],
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
        loginCommand: fields.loginCommand.value, registerCommand: fields.registerCommand.value,
        homesCommand: fields.homesCommand.value, homeCommand: fields.homeCommand.value, homesRegex: fields.homesRegex.value,
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

/** nom de home -> dimension normalisée ('overworld'|'nether'|'end'), d'après les coords connues. */
function homeDimensions(bot) {
    const map = {};
    for (const h of (bot.homesInfo || [])) {
        if (h.coords) map[h.name] = normalizeDimension(h.coords.dimension);
    }
    return map;
}

/** Petite pastille colorée (vert/rouge/violet) indiquant la dimension d'un home, utilisée partout
 * où un home est affiché (carte, sidebar, panneaux de comptes). */
function dimDot(dimension) {
    const dot = el('span', 'dim-dot');
    dot.style.backgroundColor = getDimensionColor(dimension);
    dot.title = t(`map_dim_${normalizeDimension(dimension)}`);
    return dot;
}

function renderOfflineHomes(container, acc, bot) {
    const descs = homeDescriptions(bot);
    const dims = homeDimensions(bot);
    const names = Object.keys(descs);
    container.innerHTML = '';
    if (names.length === 0) return;
    container.hidden = false;
    for (const name of names) {
        const chip = el('span', 'chip', name);
        if (descs[name]) chip.title = descs[name];
        if (dims[name]) chip.prepend(dimDot(dims[name]));
        container.append(chip);
    }
}

function createPanel(acc) {
    const root = el('div', 'card panel');
    const head = el('div', 'head');
    const badge = el('span', 'badge');
    const srvName = el('span', 'sub');
    const count = el('span', 'sub');

    const vitals = el('div', 'vitals');
    vitals.hidden = true;
    const hpIcon = document.createElement('img');
    hpIcon.src = 'assets/icon-heart.png';
    hpIcon.className = 'vital-icon';
    hpIcon.alt = 'HP';
    const hpVal = el('span', 'vital-val', '');
    const foodIcon = document.createElement('img');
    foodIcon.src = 'assets/icon-hunger.png';
    foodIcon.className = 'vital-icon';
    foodIcon.alt = 'Faim';
    const foodVal = el('span', 'vital-val', '');
    vitals.append(hpIcon, hpVal, foodIcon, foodVal);

    const disc = el('button', 'danger small', t('btn_disconnect'));
    disc.addEventListener('click', () => wsSend({ type: 'disconnect', accountId: acc.id }));
    head.append(el('strong', '', acc.username), badge, srvName, count, vitals, el('span', 'sp'), disc);

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
    return { root, badge, srvName, count, vitals, hpVal, foodVal, homesTitle, homes, playersLbl, players, chat, keys: {} };
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

    if (online && typeof bot.health === 'number' && typeof bot.food === 'number') {
        p.vitals.hidden = false;
        p.hpVal.textContent = Math.round(bot.health);
        p.foodVal.textContent = Math.round(bot.food);
        p.vitals.title = `${t('vital_hp')}: ${bot.health}/20  •  ${t('vital_food')}: ${bot.food}/20`;
    } else {
        p.vitals.hidden = true;
    }

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
            const dims = homeDimensions(bot);
            p.homes.replaceChildren(...homeList.map(name => {
                const wrap = el('div', 'home-chip');
                const btn = el('button', 'chip', name);
                btn.title = `/home ${name}`;
                if (dims[name]) btn.prepend(dimDot(dims[name]));
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
            onMapStateUpdate();
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
                    const isOwnAccount = state.accounts.some(a => (a.username || '').toLowerCase() === requester.toLowerCase());
                    if (isOwnAccount) {
                        // Un de mes propres comptes demande la téléportation : pas besoin de popup,
                        // ni d'ajout à la liste blanche, on accepte directement.
                        wsSend({ type: 'chat', accountId: msg.accountId, message: `/tpaccept ${requester}` });
                        p.chat.append(chatLine({ t: Date.now(), text: `> /tpaccept ${requester} (compte interne)`, system: true }));
                        p.chat.scrollTop = p.chat.scrollHeight;
                    } else if (currentSettings.whitelist && currentSettings.whitelist.includes(requester)) {
                        wsSend({ type: 'chat', accountId: msg.accountId, message: `/tpaccept ${requester}` });
                        p.chat.append(chatLine({ t: Date.now(), text: `> /tpaccept ${requester} (whitelist: ${requester})`, system: true }));
                        p.chat.scrollTop = p.chat.scrollHeight;
                    } else {
                        const toast = el('div', 'toast tpa-toast');
                        toast.innerHTML = `<span>${t('tpa_from', requester)}</span>`;
                        const accept = el('button', 'small', t('tpa_accept'));
                        const deny = el('button', 'small danger', t('tpa_deny'));
                        accept.addEventListener('click', () => { wsSend({ type: 'chat', accountId: msg.accountId, message: `/tpaccept ${requester}` }); toast.remove(); });
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

// ========== MAP MODULE ==========
const WORLD_SIZE = 30_000_000; // 30M blocs (rayon)
const MAX_ZOOM = 8;
const MIN_ZOOM = 0;

// Palette de couleurs pour les comptes (accessible daltoniens)
const ACCOUNT_COLORS = [
    '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
    '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
];

function getAccountColor(accountId) {
    let hash = 0;
    for (let i = 0; i < accountId.length; i++) hash = (hash * 31 + accountId.charCodeAt(i)) | 0;
    return ACCOUNT_COLORS[Math.abs(hash) % ACCOUNT_COLORS.length];
}

/** Normalise la valeur de dimension (mineflayer renvoie des formats variés selon la version du serveur). */
function normalizeDimension(raw) {
    // Anciens protocoles : la dimension peut être un id numérique (-1 Nether, 0 Surface, 1 End)
    if (raw === -1 || raw === '-1') return 'nether';
    if (raw === 1 || raw === '1') return 'end';
    if (raw === 0 || raw === '0') return 'overworld';
    const d = String(raw || 'overworld').toLowerCase().replace('minecraft:', '');
    if (d.includes('nether')) return 'nether';
    if (d.includes('end')) return 'end';
    return 'overworld';
}

const DIMENSION_COLORS = { overworld: '#2ecc71', nether: '#e74c3c', end: '#9b59b6' };

/** Couleur du marqueur selon la dimension : vert (Surface), rouge (Nether), violet (End). */
function getDimensionColor(dimension) {
    return DIMENSION_COLORS[normalizeDimension(dimension)] || DIMENSION_COLORS.overworld;
}

/** Formate une coordonnée monde en libellé compact (ex: -22000000 -> "-22M", 1500 -> "1.5k"). */
function formatMapCoord(value) {
    if (value === 0) return '0';
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    if (abs >= 1_000_000) {
        const m = abs / 1_000_000;
        return sign + (Number.isInteger(m) ? m : m.toFixed(1)) + 'M';
    }
    if (abs >= 1_000) {
        const k = abs / 1_000;
        return sign + (Number.isInteger(k) ? k : k.toFixed(1)) + 'k';
    }
    return sign + abs;
}

/** Convertit une couleur hex (#rrggbb) en rgba(...) avec l'opacité donnée. */
function hexToRgba(hex, alpha) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
    if (!m) return `rgba(136,136,136,${alpha})`;
    const r = parseInt(m[1], 16), g = parseInt(m[2], 16), b = parseInt(m[3], 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

// ---- Icônes Reicon (https://reicon.dev) avec repli silencieux si la lib est indisponible ----

/** Essaie plusieurs noms d'icônes Reicon (variantes possibles selon la version de la lib) et renvoie le premier élément SVG trouvé. */
function reiconEl(names, opts = {}) {
    const lib = window.reicon;
    if (!lib) return null;
    for (const name of names) {
        const fn = lib[name];
        if (typeof fn !== 'function') continue;
        try {
            const svg = fn({ size: opts.size || 18, color: opts.color || 'currentColor', weight: opts.weight || 'Outline' });
            if (svg) return svg;
        } catch (_) { /* icône suivante */ }
    }
    return null;
}

/** Remplace le contenu d'un bouton par une icône Reicon, en gardant le texte existant (glyphe de repli) si aucune icône n'est disponible. */
function setBtnIcon(id, names, opts = {}) {
    const btn = document.getElementById(id);
    if (!btn) return;
    const svg = reiconEl(names, opts);
    if (!svg) return;
    svg.classList.add('reicon');
    if (opts.keepLabel) {
        const label = btn.textContent.trim();
        btn.textContent = '';
        btn.append(svg);
        if (label) btn.append(' ', document.createTextNode(label));
    } else {
        btn.textContent = '';
        btn.append(svg);
    }
}

const iconGlyphCache = new Map();

/** Construit (et met en cache) les Path2D d'une icône Reicon "Filled" pour un rendu direct sur <canvas>. */
function getIconGlyph(names) {
    const key = names.join('|');
    if (iconGlyphCache.has(key)) return iconGlyphCache.get(key);
    let glyph = null;
    const lib = window.reicon;
    if (lib) {
        for (const name of names) {
            const fn = lib[name];
            if (typeof fn !== 'function' || typeof fn.toSvg !== 'function') continue;
            try {
                const svgStr = fn.toSvg({ size: 24, weight: 'Filled' });
                const doc = new DOMParser().parseFromString(svgStr, 'image/svg+xml');
                const svgEl = doc.querySelector('svg');
                if (!svgEl) continue;
                const vb = (svgEl.getAttribute('viewBox') || '0 0 24 24').trim().split(/\s+/).map(Number);
                const shapes = [];
                doc.querySelectorAll('path').forEach(p => {
                    const d = p.getAttribute('d');
                    if (d) { try { shapes.push(new Path2D(d)); } catch (_) {} }
                });
                doc.querySelectorAll('circle').forEach(c => {
                    const cx = +c.getAttribute('cx'), cy = +c.getAttribute('cy'), r = +c.getAttribute('r');
                    const p = new Path2D(); p.arc(cx, cy, r, 0, Math.PI * 2); shapes.push(p);
                });
                doc.querySelectorAll('rect').forEach(r => {
                    const x = +(r.getAttribute('x') || 0), y = +(r.getAttribute('y') || 0);
                    const w = +r.getAttribute('width'), h = +r.getAttribute('height'), rx = +(r.getAttribute('rx') || 0);
                    const p = new Path2D();
                    if (p.roundRect) p.roundRect(x, y, w, h, rx); else p.rect(x, y, w, h);
                    shapes.push(p);
                });
                if (shapes.length) { glyph = { shapes, w: vb[2] || 24, h: vb[3] || 24 }; break; }
            } catch (_) { /* icône suivante */ }
        }
    }
    iconGlyphCache.set(key, glyph);
    return glyph;
}

/** Dessine une icône Reicon centrée en (x,y) sur le canvas. Renvoie false si aucune icône n'a pu être chargée (repli à gérer par l'appelant). */
function drawIconGlyph(ctx, names, x, y, size, color) {
    const glyph = getIconGlyph(names);
    if (!glyph) return false;
    ctx.save();
    ctx.translate(x - size / 2, y - size / 2);
    ctx.scale(size / glyph.w, size / glyph.h);
    ctx.fillStyle = color;
    for (const shape of glyph.shapes) ctx.fill(shape);
    ctx.restore();
    return true;
}

/**
 * Géométrie de la carte : calcule la zone carrée (monde 30M x 30M) centrée à l'intérieur
 * du wrapper, quelle que soit la forme (largeur/hauteur) réelle de celui-ci.
 * Corrige le bug visuel où le carré du monde restait collé en haut-à-gauche,
 * laissant une zone morte à droite ou en bas quand le wrapper n'est pas carré.
 */
function getMapGeometry() {
    const wrapper = document.getElementById('map-wrapper');
    const rect = wrapper ? wrapper.getBoundingClientRect() : { width: 800, height: 800 };
    const width = rect.width || 800;
    const height = rect.height || 800;
    const canvasSize = Math.min(width, height);
    return {
        width, height, canvasSize,
        offsetX: (width - canvasSize) / 2,
        offsetY: (height - canvasSize) / 2,
    };
}

/** Convertit coordonnées monde (X, Z) → pixels canvas (base view: monde entier = canvasSize) */
function worldToCanvas(x, z, canvasSize) {
    const halfWorld = WORLD_SIZE;
    const px = (x + halfWorld) / (2 * halfWorld) * canvasSize;
    const pz = (z + halfWorld) / (2 * halfWorld) * canvasSize;
    return { x: px, y: pz };
}

/** Convertit pixels canvas (base view) → coordonnées monde (X, Z) */
function canvasToWorld(px, pz, canvasSize) {
    const halfWorld = WORLD_SIZE;
    return {
        x: Math.round(px / canvasSize * (2 * halfWorld) - halfWorld),
        z: Math.round(pz / canvasSize * (2 * halfWorld) - halfWorld),
    };
}

/** Applique le transform (zoom/pan) à une position canvas base → position canvas transformée */
function applyTransform(pos, transform) {
    return {
        x: pos.x * transform.scale + transform.x,
        y: pos.y * transform.scale + transform.y,
    };
}

/** Inverse le transform : position canvas transformée → position canvas base */
function unapplyTransform(pos, transform) {
    return {
        x: (pos.x - transform.x) / transform.scale,
        y: (pos.y - transform.y) / transform.scale,
    };
}

/** ClusterEngine : regroupe les homes proches selon le niveau de zoom */
class ClusterEngine {
    constructor() {
        this.clusters = [];
        this.zoomLevel = 0;
        this.lastHomes = [];
    }

    /** Calcule la taille de cellule de grille selon le zoom */
    getCellSize(zoomLevel) {
        const base = 2_000_000;
        return Math.max(10_000, base / Math.pow(2, zoomLevel));
    }

    /** Calcule le niveau de zoom à partir du scale additionnel */
    getZoomLevel(scale) {
        const level = Math.log2(scale) * (MAX_ZOOM / Math.log2(256));
        return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.round(level)));
    }

    /** Regroupe les homes en clusters */
    buildClusters(homes, canvasSize, transform) {
        this.lastHomes = homes;
        this.zoomLevel = this.getZoomLevel(transform.scale);
        const cellSize = this.getCellSize(this.zoomLevel);

        if (this.zoomLevel >= MAX_ZOOM) {
            this.clusters = homes.map(h => ({ ...h, cluster: false, count: 1, homes: [h] }));
            return this.clusters;
        }

        const grid = new Map();

        for (const home of homes) {
            if (!home.coords) continue;
            const gx = Math.floor(home.coords.x / cellSize);
            const gz = Math.floor(home.coords.z / cellSize);
            const key = `${gx},${gz}`;
            if (!grid.has(key)) grid.set(key, { homes: [], xSum: 0, zSum: 0 });
            const cell = grid.get(key);
            cell.homes.push(home);
            cell.xSum += home.coords.x;
            cell.zSum += home.coords.z;
        }

        this.clusters = [];
        for (const [key, cell] of grid) {
            if (cell.homes.length === 1) {
                this.clusters.push({ ...cell.homes[0], cluster: false, count: 1, homes: cell.homes });
            } else {
                const avgX = Math.round(cell.xSum / cell.homes.length);
                const avgZ = Math.round(cell.zSum / cell.homes.length);
                this.clusters.push({
                    name: `${cell.homes.length} homes`,
                    coords: { x: avgX, y: cell.homes[0].coords.y, z: avgZ, dimension: 'overworld' },
                    description: '',
                    color: cell.homes[0].color,
                    cluster: true,
                    count: cell.homes.length,
                    homes: cell.homes,
                });
            }
        }
        return this.clusters;
    }

    /** Trouve le cluster/home le plus proche d'un point canvas (transformé) */
    findNearest(cx, cy, canvasSize, transform, maxDist = 15) {
        let nearest = null;
        let nearestDist = maxDist;
        for (const cluster of this.clusters) {
            if (!cluster.coords) continue;
            const basePos = worldToCanvas(cluster.coords.x, cluster.coords.z, canvasSize);
            const pos = applyTransform(basePos, transform);
            const dx = pos.x - cx;
            const dy = pos.y - cy;
            const dist = Math.hypot(dx, dy);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = cluster;
            }
        }
        return nearest;
    }
}

/** MapCanvas : rendu du canvas avec Lucide icons */
class MapCanvas {
    constructor(canvas, clusterEngine, transform) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.clusterEngine = clusterEngine;
        this.transform = transform;
        this.lastRenderTransform = { x: NaN, y: NaN, scale: NaN };
        this.resize();
        // ResizeObserver détecte aussi les changements de taille qui ne déclenchent pas
        // l'évènement 'resize' de la fenêtre (ex: repli/déploiement de la sidebar des homes).
        const wrapper = this.canvas.parentElement;
        if (window.ResizeObserver && wrapper) {
            this.resizeObserver = new ResizeObserver(() => this.resize());
            this.resizeObserver.observe(wrapper);
        } else {
            window.addEventListener('resize', () => this.resize());
        }
    }

    resize() {
        const wrapper = this.canvas.parentElement;
        const rect = wrapper.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.width = rect.width;
        this.height = rect.height;
        const geo = getMapGeometry();
        this.canvasSize = geo.canvasSize;
        this.offsetX = geo.offsetX;
        this.offsetY = geo.offsetY;
        // Une nouvelle taille invalide tout rendu précédent : on force le prochain redraw.
        this.lastRenderTransform = { x: NaN, y: NaN, scale: NaN };
        this.scheduleRender();
    }

    scheduleRender() {
        if (this.renderScheduled) return;
        this.renderScheduled = true;
        requestAnimationFrame(() => {
            this.renderScheduled = false;
            this.render();
        });
    }

    render() {
        const { ctx, canvasSize, transform, offsetX, offsetY } = this;
        const width = this.width;
        const height = this.height;

        // Recalcule les clusters à chaque rendu (pas seulement quand les homes changent) :
        // sinon le regroupement reste figé au niveau de zoom du dernier chargement des données
        // et deux points fusionnés ne se séparent jamais en zoomant.
        this.clusterEngine.buildClusters(this.clusterEngine.lastHomes, canvasSize, transform);

        ctx.clearRect(0, 0, width, height);
        ctx.save();
        // Centre d'abord le carré du monde (30M x 30M) dans le wrapper (offset constant,
        // indépendant du zoom/pan), puis applique le zoom/pan par-dessus.
        ctx.translate(offsetX, offsetY);
        // Apply scale first, then translate (matches CSS transform order: translate(x,y) scale(s))
        // transform.x/y are in visual/CSS pixels (wrapper-relative)
        ctx.scale(transform.scale, transform.scale);
        ctx.translate(transform.x / transform.scale, transform.y / transform.scale);

        this.drawGrid(ctx, canvasSize, transform);

        const clusters = this.clusterEngine.clusters;
        const margin = 50 / transform.scale;

        // Visible bounds in base canvas coordinates
        const visibleMinX = -transform.x / transform.scale - margin;
        const visibleMaxX = (width / transform.scale) - transform.x / transform.scale + margin;
        const visibleMinY = -transform.y / transform.scale - margin;
        const visibleMaxY = (height / transform.scale) - transform.y / transform.scale + margin;

        for (const cluster of clusters) {
            if (!cluster.coords) continue;
            const basePos = worldToCanvas(cluster.coords.x, cluster.coords.z, canvasSize);

            if (basePos.x < visibleMinX || basePos.x > visibleMaxX ||
                basePos.y < visibleMinY || basePos.y > visibleMaxY) {
                continue;
            }

            this.drawMarker(ctx, basePos.x, basePos.y, cluster, transform);
        }

        ctx.restore();
    }

    drawGrid(ctx, canvasSize, transform) {
        const zoomLevel = this.clusterEngine.zoomLevel;
        const s = 1 / transform.scale; // facteur pour garder une taille écran constante, quel que soit le zoom

        let gridStep;
        if (zoomLevel <= 1) gridStep = 5_000_000;
        else if (zoomLevel <= 3) gridStep = 1_000_000;
        else if (zoomLevel <= 5) gridStep = 200_000;
        else if (zoomLevel <= 7) gridStep = 50_000;
        else gridStep = 10_000;

        const halfWorld = WORLD_SIZE;

        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 1 * s;

        for (let x = -halfWorld; x <= halfWorld; x += gridStep) {
            const px = (x + halfWorld) / (2 * halfWorld) * canvasSize;
            ctx.beginPath();
            ctx.moveTo(px, 0);
            ctx.lineTo(px, canvasSize);
            ctx.stroke();
        }
        for (let z = -halfWorld; z <= halfWorld; z += gridStep) {
            const pz = (z + halfWorld) / (2 * halfWorld) * canvasSize;
            ctx.beginPath();
            ctx.moveTo(0, pz);
            ctx.lineTo(canvasSize, pz);
            ctx.stroke();
        }

        // Axes centraux (0,0) - plus visibles
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 2 * s;
        const centerPx = canvasSize / 2;
        ctx.beginPath();
        ctx.moveTo(centerPx, 0);
        ctx.lineTo(centerPx, canvasSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, centerPx);
        ctx.lineTo(canvasSize, centerPx);
        ctx.stroke();

        // Bordure du monde (carré 30M x 30M)
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2 * s;
        ctx.strokeRect(0, 0, canvasSize, canvasSize);

        // ---- Graduations dynamiques ----
        // Au lieu de 4 libellés figés (±30M) qui deviennent illisibles en zoomant, on calcule
        // un pas "rond" (1/2/5 x 10^n) qui donne toujours une dizaine de repères dans la zone
        // visible : plus on zoome, plus les repères affichés sont fins (15M, 1M, 50k...).
        const visibleCanvasSpan = canvasSize / transform.scale;
        const visibleWorldSpan = visibleCanvasSpan * ((2 * halfWorld) / canvasSize);
        const niceSteps = [1_000, 2_000, 5_000, 10_000, 20_000, 50_000, 100_000, 200_000, 500_000, 1_000_000, 2_000_000, 5_000_000, 10_000_000];
        let labelStep = niceSteps[niceSteps.length - 1];
        for (const step of niceSteps) {
            if (visibleWorldSpan / step <= 10) { labelStep = step; break; }
        }

        // Taille de police fixe à l'écran (compensée par s), ne rétrécit plus en flèche avec le zoom
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.font = `600 ${11 * s}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const startX = Math.ceil(-halfWorld / labelStep) * labelStep;
        for (let x = startX; x <= halfWorld; x += labelStep) {
            const px = (x + halfWorld) / (2 * halfWorld) * canvasSize;
            ctx.fillText(formatMapCoord(x), px, 4 * s);
        }
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const startZ = Math.ceil(-halfWorld / labelStep) * labelStep;
        for (let z = startZ; z <= halfWorld; z += labelStep) {
            const pz = (z + halfWorld) / (2 * halfWorld) * canvasSize;
            ctx.fillText(formatMapCoord(z), 4 * s, pz);
        }

        // Origine
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = `bold ${11 * s}px sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('(0,0)', centerPx + 6 * s, centerPx - 6 * s);
    }

    drawMarker(ctx, x, y, cluster, transform) {
        const isCluster = cluster.cluster;
        // Icône taille fixe en pixels écran (ne grossit pas avec le zoom)
        // Le contexte est déjà scalé (ctx.scale), donc on divise par transform.scale
        const s = 1 / transform.scale;
        const iconSize = (isCluster ? 30 : 24) * s;
        const radius = iconSize / 2 + 4 * s;
        const iconColor = cluster.color || '#888';

        // Halo doux de la couleur du compte, puis disque de fond avec double liseré
        ctx.beginPath();
        ctx.arc(x, y, radius + 3 * s, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(iconColor, 0.22);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(10,12,16,0.88)';
        ctx.fill();
        ctx.lineWidth = 2 * s;
        ctx.strokeStyle = iconColor;
        ctx.stroke();
        ctx.lineWidth = 1 * s;
        ctx.strokeStyle = 'rgba(255,255,255,0.55)';
        ctx.beginPath();
        ctx.arc(x, y, radius - 1.2 * s, 0, Math.PI * 2);
        ctx.stroke();

        if (isCluster) {
            const glyphSize = iconSize * 0.58;
            const drew = drawIconGlyph(ctx, ['UsersGroupRounded', 'UsersGroupTwoRounded', 'UsersGroup', 'Users', 'User', 'UserCircle'], x, y - 0.5 * s, glyphSize, '#fff');
            if (!drew) {
                // Repli : trois points groupés
                ctx.fillStyle = '#fff';
                const r = 3.6 * s, offset = 6 * s;
                ctx.beginPath();
                ctx.arc(x - offset, y - 2 * s, r, 0, Math.PI * 2);
                ctx.arc(x + offset, y - 2 * s, r, 0, Math.PI * 2);
                ctx.arc(x, y + 5 * s, r, 0, Math.PI * 2);
                ctx.fill();
            }

            // Badge de comptage en bas à droite du marqueur
            const badgeX = x + radius * 0.7, badgeY = y + radius * 0.7;
            const badgeR = 8 * s;
            ctx.beginPath();
            ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
            ctx.fillStyle = iconColor;
            ctx.fill();
            ctx.lineWidth = 1.5 * s;
            ctx.strokeStyle = '#0a0c10';
            ctx.stroke();
            ctx.fillStyle = '#fff';
            ctx.font = `bold ${10 * s}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(cluster.count.toString(), badgeX, badgeY + 0.5 * s);
        } else {
            const glyphSize = iconSize * 0.58;
            const drew = drawIconGlyph(ctx, ['Home2', 'HomeSmile', 'Home', 'HomeAngle', 'HomeAngle2', 'Buildings2'], x, y, glyphSize, '#fff');
            if (!drew) {
                // Repli : maison stylisée (toit + corps)
                ctx.fillStyle = '#fff';
                const hs = 7.5 * s;
                ctx.beginPath();
                ctx.moveTo(x, y - hs);
                ctx.lineTo(x - hs, y);
                ctx.lineTo(x + hs, y);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                ctx.roundRect(x - hs * 0.65, y, hs * 1.3, hs * 1.1, 2 * s);
                ctx.fill();
            }

            // Label du nom (toujours visible, avec léger halo d'ombre pour la lisibilité)
            ctx.fillStyle = '#fff';
            ctx.font = `600 ${11 * s}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.shadowColor = 'rgba(0,0,0,0.85)';
            ctx.shadowBlur = 3 * s;
            ctx.fillText(cluster.name, x, y - radius - 4 * s);
            ctx.shadowBlur = 0;

            // Coordonnées en petit sous l'icône quand zoomé
            if (transform.scale >= 2 && cluster.coords) {
                ctx.fillStyle = 'rgba(255,255,255,0.85)';
                ctx.font = `${9 * s}px monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                const coordText = `${cluster.coords.x} ${cluster.coords.y} ${cluster.coords.z}`;
                ctx.fillText(coordText, x, y + radius + 2 * s);
            }
        }
    }
}

/** TooltipManager : infobulle HTML au-dessus du canvas */
class TooltipManager {
    constructor(canvas, clusterEngine, transform) {
        this.canvas = canvas;
        this.clusterEngine = clusterEngine;
        this.transform = transform;
        this.tooltip = document.getElementById('map-tooltip');
        this.canvasSize = 0;
        this.bindEvents();
    }

    bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseleave', () => this.hide());
        this.canvas.addEventListener('click', (e) => this.onClick(e));
    }

    onMouseMove(e) {
        const rectWrapper = this.canvas.parentElement.getBoundingClientRect();
        const geo = getMapGeometry();
        this.canvasSize = geo.canvasSize;
        const cx = e.clientX - rectWrapper.left - geo.offsetX;
        const cy = e.clientY - rectWrapper.top - geo.offsetY;

        const cluster = this.clusterEngine.findNearest(cx, cy, this.canvasSize, this.transform, 20);
        if (cluster && cluster.coords) {
            this.show(cluster, e.clientX, e.clientY);
        } else {
            this.hide();
        }
    }

    show(cluster, clientX, clientY) {
        if (!this.tooltip) return;
        const isCluster = cluster.cluster;
        let html = '';
        const dotHtml = (dimension) => `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:5px;vertical-align:middle;background:${getDimensionColor(dimension)}"></span>`;
        if (isCluster) {
            html = `<strong>${cluster.count} ${t('map_cluster', cluster.count)}</strong>`;
            if (cluster.homes && cluster.homes.length > 0) {
                html += '<ul style="margin:4px 0 0;padding-left:16px;font-size:11px;">';
                for (const h of cluster.homes.slice(0, 5)) {
                    if (h.coords) {
                        html += `<li>${dotHtml(h.coords.dimension)}${h.name} (${h.accountName || ''}) : ${h.coords.x} ${h.coords.y} ${h.coords.z}</li>`;
                    }
                }
                if (cluster.homes.length > 5) html += `<li>... et ${cluster.homes.length - 5} autres</li>`;
                html += '</ul>';
            }
        } else {
            html = `${dotHtml(cluster.coords?.dimension)}<strong>${cluster.name}</strong><br>`;
            if (cluster.accountName) html += `Compte: ${cluster.accountName}<br>`;
            html += `X: ${cluster.coords.x}  Y: ${cluster.coords.y}  Z: ${cluster.coords.z}<br>`;
            if (cluster.description) html += `<em>${cluster.description}</em>`;
        }
        this.tooltip.innerHTML = html;
        this.tooltip.hidden = false;

        // #map-tooltip est en position:absolute à l'intérieur de #map-wrapper : il faut donc
        // des coordonnées relatives au wrapper, pas les coordonnées écran (clientX/Y) brutes,
        // sans quoi la bulle apparaît très loin du curseur dès que le wrapper n'est pas collé
        // au coin de la page.
        const rectWrapper = this.canvas.parentElement.getBoundingClientRect();
        let left = clientX - rectWrapper.left + 14;
        let top = clientY - rectWrapper.top + 14;
        const tw = this.tooltip.offsetWidth;
        const th = this.tooltip.offsetHeight;
        if (left + tw > rectWrapper.width - 4) left = (clientX - rectWrapper.left) - tw - 14;
        if (top + th > rectWrapper.height - 4) top = (clientY - rectWrapper.top) - th - 14;
        if (left < 4) left = 4;
        if (top < 4) top = 4;
        this.tooltip.style.left = left + 'px';
        this.tooltip.style.top = top + 'px';
    }

    hide() {
        if (this.tooltip) this.tooltip.hidden = true;
    }

    onClick(e) {
        const rectWrapper = this.canvas.parentElement.getBoundingClientRect();
        const geo = getMapGeometry();
        this.canvasSize = geo.canvasSize;
        const cx = e.clientX - rectWrapper.left - geo.offsetX;
        const cy = e.clientY - rectWrapper.top - geo.offsetY;

        const cluster = this.clusterEngine.findNearest(cx, cy, this.canvasSize, this.transform, 20);
        let coords;
        if (cluster && cluster.coords) {
            if (cluster.cluster) {
                this.zoomToCluster(cluster, e.clientX, e.clientY);
                return;
            }
            coords = { x: cluster.coords.x, y: cluster.coords.y, z: cluster.coords.z };
        } else {
            const basePos = unapplyTransform({ x: cx, y: cy }, this.transform);
            coords = canvasToWorld(basePos.x, basePos.y, this.canvasSize);
            coords.y = 64; // Y par défaut
        }

        // Afficher les coordonnées dans la zone d'affichage
        this.showCoords(coords);
    }

    showCoords(coords) {
        const textEl = document.getElementById('map-coords-text');
        const copyBtn = document.getElementById('map-copy-coords');
        if (!textEl || !copyBtn) return;

        this.lastClickedCoords = coords;
        textEl.innerHTML = `X: <strong>${coords.x}</strong>  Y: <strong>${coords.y}</strong>  Z: <strong>${coords.z}</strong>`;
        copyBtn.hidden = false;

        // Gestionnaire pour le bouton de copie
        copyBtn.onclick = () => {
            const text = `${coords.x} ${coords.y} ${coords.z}`;
            navigator.clipboard.writeText(text).then(() => {
                showToast(t('map_copy_coords', coords.x, coords.y, coords.z), 'success', 2000);
            });
        };
    }

    zoomToCluster(cluster, clientX, clientY) {
        const rectWrapper = this.canvas.parentElement.getBoundingClientRect();
        const geo = getMapGeometry();
        const canvasSize = geo.canvasSize;

        const basePos = worldToCanvas(cluster.coords.x, cluster.coords.z, canvasSize);

        const mouseX = clientX - rectWrapper.left - geo.offsetX;
        const mouseY = clientY - rectWrapper.top - geo.offsetY;

        const targetScale = Math.min(this.transform.scale * 2, 256);

        this.transform.scale = targetScale;
        this.transform.x = mouseX - basePos.x * targetScale;
        this.transform.y = mouseY - basePos.y * targetScale;

        this.clampTransform(canvasSize);
        if (mapController) mapController.updateTransform();
        this.updateZoomDisplay();
        if (mapCanvas) mapCanvas.scheduleRender();
    }

    clampTransform(canvasSize) {
        const scale = this.transform.scale;

        if (scale >= 1) {
            const min = canvasSize * (1 - scale);
            const max = 0;
            this.transform.x = Math.max(min, Math.min(max, this.transform.x));
            this.transform.y = Math.max(min, Math.min(max, this.transform.y));
        } else {
            const centered = canvasSize * (1 - scale) / 2;
            this.transform.x = centered;
            this.transform.y = centered;
        }
    }

    updateZoomDisplay() {
        const zoomEl = document.getElementById('map-zoom-display');
        if (zoomEl) {
            const zoomPct = Math.round(this.transform.scale * 100);
            zoomEl.textContent = t('map_zoom', zoomPct);
        }
    }
}

/** MapController : gère zoom (molette, boutons, double-clic, clavier) et pan (glisser) */
class MapController {
    constructor(wrapper, canvas, clusterEngine, transform, tooltipManager) {
        this.wrapper = wrapper;
        this.canvas = canvas;
        this.clusterEngine = clusterEngine;
        this.transform = transform;
        this.tooltipManager = tooltipManager;
        this.canvasSize = 0;
        this.dragStart = null;
        this.animFrame = null;
        this.activePointers = new Map(); // pointerId -> {x, y} en coordonnées écran, pour le pincer-zoomer tactile
        this.pinchStart = null;
        this.bindEvents();
        this.updateTransform();
    }

    /** Position souris/doigt relative au carré du monde (hors zone morte éventuelle). */
    pointInCanvas(clientX, clientY) {
        const rectWrapper = this.wrapper.getBoundingClientRect();
        const geo = getMapGeometry();
        this.canvasSize = geo.canvasSize;
        this.offsetX = geo.offsetX;
        this.offsetY = geo.offsetY;
        return { x: clientX - rectWrapper.left - geo.offsetX, y: clientY - rectWrapper.top - geo.offsetY };
    }

    bindEvents() {
        this.wrapper.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
        this.canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
        window.addEventListener('pointermove', (e) => this.onPointerMove(e));
        window.addEventListener('pointerup', (e) => this.onPointerUp(e));
        window.addEventListener('pointercancel', (e) => this.onPointerUp(e));
        window.addEventListener('pointerleave', (e) => this.onPointerUp(e));
        this.canvas.addEventListener('dblclick', (e) => {
            e.preventDefault();
            this.zoomAtClient(2, e.clientX, e.clientY, true);
        });
        this.wrapper.addEventListener('keydown', (e) => this.onKeyDown(e));

        document.getElementById('map-zoom-in')?.addEventListener('click', () => this.zoom(1.6, true));
        document.getElementById('map-zoom-out')?.addEventListener('click', () => this.zoom(1 / 1.6, true));
        document.getElementById('map-reset')?.addEventListener('click', () => this.resetView());
    }

    onKeyDown(e) {
        if (e.target !== this.wrapper && !this.wrapper.contains(e.target)) return;
        if (e.key === '+' || e.key === '=') { e.preventDefault(); this.zoom(1.6, true); }
        else if (e.key === '-' || e.key === '_') { e.preventDefault(); this.zoom(1 / 1.6, true); }
        else if (e.key === '0') { e.preventDefault(); this.resetView(); }
    }

    onWheel(e) {
        e.preventDefault();
        this.cancelAnim();
        const { x: cx, y: cy } = this.pointInCanvas(e.clientX, e.clientY);

        // Molette : zoom progressif et instantané, plus agréable pour un défilement rapide.
        const zoomFactor = e.deltaY < 0 ? 1.2 : 1 / 1.2;
        const newScale = Math.max(1, Math.min(256, this.transform.scale * zoomFactor));
        const mouseBase = unapplyTransform({ x: cx, y: cy }, this.transform);

        this.transform.scale = newScale;
        this.transform.x = cx - mouseBase.x * newScale;
        this.transform.y = cy - mouseBase.y * newScale;

        this.clampTransform();
        this.updateTransform();
        this.updateZoomDisplay();
        if (mapCanvas) mapCanvas.scheduleRender();
    }

    onPointerDown(e) {
        if (e.pointerType === 'touch') {
            this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
            try { this.canvas.setPointerCapture(e.pointerId); } catch (_) {}
            this.cancelAnim();
            if (this.activePointers.size === 2) {
                this.dragStart = null; // deux doigts : on bascule en pincer-zoomer
                this.startPinch();
            } else if (this.activePointers.size === 1) {
                this.beginDrag(e.clientX, e.clientY, e.pointerId);
            }
            return;
        }
        if (e.button !== 0) return;
        this.cancelAnim();
        this.beginDrag(e.clientX, e.clientY, e.pointerId);
        this.canvas.setPointerCapture(e.pointerId);
    }

    beginDrag(clientX, clientY, pointerId) {
        const { x: cx, y: cy } = this.pointInCanvas(clientX, clientY);
        this.dragStart = { x: cx, y: cy, transformX: this.transform.x, transformY: this.transform.y, pointerId };
        this.canvas.style.cursor = 'grabbing';
    }

    /** Initialise un geste de pincer-zoomer à partir des deux doigts actuellement posés. */
    startPinch() {
        const pts = [...this.activePointers.values()];
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
        const midClientX = (pts[0].x + pts[1].x) / 2;
        const midClientY = (pts[0].y + pts[1].y) / 2;
        const { x: cx, y: cy } = this.pointInCanvas(midClientX, midClientY);
        const basePos = unapplyTransform({ x: cx, y: cy }, this.transform);
        this.pinchStart = { dist, scale: this.transform.scale, baseX: basePos.x, baseY: basePos.y };
    }

    onPointerMove(e) {
        if (e.pointerType === 'touch' && this.activePointers.has(e.pointerId)) {
            this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

            if (this.activePointers.size === 2 && this.pinchStart) {
                const pts = [...this.activePointers.values()];
                const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
                const midClientX = (pts[0].x + pts[1].x) / 2;
                const midClientY = (pts[0].y + pts[1].y) / 2;
                const { x: mx, y: my } = this.pointInCanvas(midClientX, midClientY);
                const newScale = Math.max(1, Math.min(256, this.pinchStart.scale * (dist / this.pinchStart.dist)));

                this.transform.scale = newScale;
                this.transform.x = mx - this.pinchStart.baseX * newScale;
                this.transform.y = my - this.pinchStart.baseY * newScale;
                this.clampTransform();
                this.updateTransform();
                this.updateZoomDisplay();
                if (mapCanvas) mapCanvas.scheduleRender();
                return;
            }
            if (this.activePointers.size !== 1) return; // en attente d'un 2e doigt : pas de pan parasite
        }

        if (!this.dragStart) return;
        const { x: cx, y: cy } = this.pointInCanvas(e.clientX, e.clientY);
        const dx = cx - this.dragStart.x;
        const dy = cy - this.dragStart.y;
        this.transform.x = this.dragStart.transformX + dx;
        this.transform.y = this.dragStart.transformY + dy;
        this.clampTransform();
        this.updateTransform();
        if (mapCanvas) mapCanvas.scheduleRender();
    }

    onPointerUp(e) {
        if (e && e.pointerType === 'touch') {
            this.activePointers.delete(e.pointerId);
            if (this.activePointers.size < 2) this.pinchStart = null;
            if (this.activePointers.size === 1) {
                // Il reste un doigt posé : on relance un pan simple depuis sa position pour éviter un saut.
                const [remaining] = this.activePointers.values();
                this.beginDrag(remaining.x, remaining.y, null);
                return;
            }
            if (this.activePointers.size === 0) {
                this.dragStart = null;
                this.canvas.style.cursor = '';
            }
            return;
        }
        if (!this.dragStart) return;
        const pointerId = this.dragStart.pointerId;
        this.dragStart = null;
        this.canvas.style.cursor = '';
        try { this.canvas.releasePointerCapture?.(pointerId); } catch (_) {}
    }

    /** Zoom centré sur le milieu de la vue (boutons, clavier). */
    zoom(factor, animate = false) {
        const geo = getMapGeometry();
        this.canvasSize = geo.canvasSize;
        this.zoomAtPoint(factor, geo.canvasSize / 2, geo.canvasSize / 2, animate);
    }

    /** Zoom centré sur un point écran donné (double-clic). */
    zoomAtClient(factor, clientX, clientY, animate = false) {
        const { x: cx, y: cy } = this.pointInCanvas(clientX, clientY);
        this.zoomAtPoint(factor, cx, cy, animate);
    }

    zoomAtPoint(factor, cx, cy, animate) {
        const newScale = Math.max(1, Math.min(256, this.transform.scale * factor));
        const mouseBase = unapplyTransform({ x: cx, y: cy }, this.transform);
        const targetX = cx - mouseBase.x * newScale;
        const targetY = cy - mouseBase.y * newScale;

        if (!animate) {
            this.transform.scale = newScale;
            this.transform.x = targetX;
            this.transform.y = targetY;
            this.clampTransform();
            this.updateTransform();
            this.updateZoomDisplay();
            if (mapCanvas) mapCanvas.scheduleRender();
            return;
        }
        this.animateTo(newScale, targetX, targetY);
    }

    resetView() {
        this.cancelAnim();
        const geo = getMapGeometry();
        this.canvasSize = geo.canvasSize;
        this.animateTo(1, 0, 0);
    }

    cancelAnim() {
        if (this.animFrame) { cancelAnimationFrame(this.animFrame); this.animFrame = null; }
    }

    /** Anime en douceur le transform (scale/x/y) vers une cible, avec un easeOutCubic. */
    animateTo(targetScale, targetX, targetY) {
        this.cancelAnim();
        const start = { scale: this.transform.scale, x: this.transform.x, y: this.transform.y };
        const duration = 220;
        const startTime = performance.now();
        const ease = (t) => 1 - Math.pow(1 - t, 3);

        const step = (now) => {
            const t = Math.min(1, (now - startTime) / duration);
            const k = ease(t);
            this.transform.scale = start.scale + (targetScale - start.scale) * k;
            this.transform.x = start.x + (targetX - start.x) * k;
            this.transform.y = start.y + (targetY - start.y) * k;
            this.clampTransform();
            this.updateTransform();
            this.updateZoomDisplay();
            if (mapCanvas) mapCanvas.scheduleRender();
            if (t < 1) {
                this.animFrame = requestAnimationFrame(step);
            } else {
                this.animFrame = null;
            }
        };
        this.animFrame = requestAnimationFrame(step);
    }

    clampTransform() {
        const canvasSize = this.canvasSize;
        const scale = this.transform.scale;

        if (scale >= 1) {
            const min = canvasSize * (1 - scale);
            const max = 0;
            this.transform.x = Math.max(min, Math.min(max, this.transform.x));
            this.transform.y = Math.max(min, Math.min(max, this.transform.y));
        } else {
            const centered = canvasSize * (1 - scale) / 2;
            this.transform.x = centered;
            this.transform.y = centered;
        }
    }

    updateTransform() {
        // Canvas context transform handles zoom/pan; wrapper stays at identity
        this.wrapper.style.transform = 'none';
        this.wrapper.style.transformOrigin = '0 0';
    }

    updateZoomDisplay() {
        const zoomEl = document.getElementById('map-zoom-display');
        if (zoomEl) {
            const zoomPct = Math.round(this.transform.scale * 100);
            zoomEl.textContent = t('map_zoom', zoomPct);
        }
    }
}

// Instance globales
let mapCanvas = null;
let clusterEngine = null;
let tooltipManager = null;
let mapController = null;

/** Initialise la carte quand l'onglet est affiché pour la première fois */
function initMap() {
    if (mapCanvas) return;

    const canvas = document.getElementById('map-canvas');
    const wrapper = document.getElementById('map-wrapper');
    if (!canvas || !wrapper) return;

    // Transform initial : monde entier visible (scale=1, centré)
    state.mapTransform = {
        x: 0,
        y: 0,
        scale: 1,
    };

    clusterEngine = new ClusterEngine();
    mapCanvas = new MapCanvas(canvas, clusterEngine, state.mapTransform);
    tooltipManager = new TooltipManager(canvas, clusterEngine, state.mapTransform);
    mapController = new MapController(wrapper, canvas, clusterEngine, state.mapTransform, tooltipManager);

    // Initialiser la sidebar
    initMapSidebar();
    initMapToolbarIcons();

    updateMapHomes();
    mapCanvas.scheduleRender();
}

/** Remplace les glyphes texte de la barre d'outils de la carte par des icônes Reicon. */
function initMapToolbarIcons() {
    setBtnIcon('map-zoom-in', ['ZoomIn', 'MagniferZoomIn', 'AddCircle', 'AddSquare'], { size: 17 });
    setBtnIcon('map-zoom-out', ['ZoomOut', 'MagniferZoomOut', 'MinusCircle', 'MinusSquare'], { size: 17 });
    setBtnIcon('map-reset', ['Home2', 'Home', 'Compass', 'GlobalLine', 'Globus'], { size: 17 });
    setBtnIcon('map-export', ['Download', 'DownloadLine', 'TrayArrowDown', 'CloudDownload', 'Export', 'ExportLine'], { size: 16 });
    setBtnIcon('map-sidebar-toggle', ['ListTree', 'List', 'Menu', 'HamburgerMenu', 'AltArrowRight'], { size: 16 });
    setBtnIcon('map-copy-coords', ['Copy', 'CopyLine', 'Clipboard', 'ClipboardList'], { size: 14, keepLabel: true });

    document.getElementById('map-export')?.addEventListener('click', () => exportMapImage());
}

/** Exporte la vue actuelle de la carte (telle qu'affichée) en image PNG téléchargeable. */
function exportMapImage() {
    if (!mapCanvas || !mapCanvas.canvas) return;
    try {
        const url = mapCanvas.canvas.toDataURL('image/png');
        const ts = new Date().toISOString().replace(/[:.]/g, '-');
        const a = document.createElement('a');
        a.href = url;
        a.download = `bothub-carte-${ts}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        showToast(t('map_export_done'), 'success', 2000);
    } catch (_) {
        showToast(t('map_export_error'), 'error', 3000);
    }
}

/** Initialise la sidebar de la carte (repli + recherche) */
function initMapSidebar() {
    const toggleBtn = document.getElementById('map-sidebar-toggle');
    const sidebar = document.getElementById('map-sidebar');
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    const searchInput = document.getElementById('map-search');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            state.mapSearchTerm = searchInput.value;
            updateMapSidebar();
        });
    }

    document.querySelectorAll('.map-dim-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) return;
            document.querySelectorAll('.map-dim-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            state.mapDimension = btn.dataset.dim;
            updateMapHomes();
        });
    });
}

/** Remplit le champ de recherche de la sidebar et applique le filtre (utilisé par la légende). */
/** Met à jour les homes affichés sur la carte depuis state.bots */
function updateMapHomes() {
    if (!clusterEngine) return;

    const dim = state.mapDimension || 'overworld';
    const homes = [];
    for (const [accountId, bot] of state.bots) {
        if (!bot.homesInfo) continue;
        for (const home of bot.homesInfo) {
            if (home.coords && normalizeDimension(home.coords.dimension) === dim) {
                homes.push({
                    name: home.name,
                    coords: home.coords,
                    description: home.description || '',
                    color: getDimensionColor(home.coords.dimension), // vert/rouge/violet selon la dimension
                    accountId,
                    accountName: bot.username || accountId,
                });
            }
        }
    }

    state.homesByAccount = {};
    for (const home of homes) {
        if (!state.homesByAccount[home.accountId]) {
            state.homesByAccount[home.accountId] = { color: home.color, name: home.accountName };
        }
    }

    clusterEngine.buildClusters(homes, getMapGeometry().canvasSize, state.mapTransform);

    updateMapSidebar();

    if (mapCanvas) mapCanvas.scheduleRender();
}

function updateMapSidebar() {
    const contentEl = document.getElementById('map-sidebar-content');
    if (!contentEl) return;

    const term = (state.mapSearchTerm || '').trim().toLowerCase();
    const dim = state.mapDimension || 'overworld';
    const color = getDimensionColor(dim); // vert/rouge/violet selon la dimension affichée

    const homes = [];
    for (const [accountId, bot] of state.bots) {
        if (!bot.homesInfo) continue;
        const accountName = bot.username || accountId;
        const accountNameMatches = !term || accountName.toLowerCase().includes(term);
        const accountHomes = [];
        for (const home of bot.homesInfo) {
            if (!home.coords || normalizeDimension(home.coords.dimension) !== dim) continue;
            const homeMatches = !term || accountNameMatches || home.name.toLowerCase().includes(term);
            if (!homeMatches) continue;
            accountHomes.push({
                name: home.name,
                coords: home.coords,
                description: home.description || '',
                color,
                accountId,
                accountName,
            });
        }
        if (accountHomes.length > 0) {
            homes.push({ accountId, accountName, color, homes: accountHomes });
        }
    }

    if (homes.length === 0) {
        contentEl.innerHTML = `<div class="map-sidebar-empty">${term ? t('map_search_empty') : t('map_no_coords')}</div>`;
        return;
    }

    contentEl.innerHTML = '';
    for (const acc of homes) {
        const accDiv = el('div', 'map-sidebar-account');
        const header = el('div', 'map-sidebar-account-header');
        const dot = el('span', 'map-sidebar-account-dot');
        dot.style.backgroundColor = acc.color;
        const name = el('span', 'map-sidebar-account-name', acc.accountName);
        const count = el('span', 'map-sidebar-account-count', `(${acc.homes.length})`);
        header.append(dot, name, count);

        const homesDiv = el('div', 'map-sidebar-homes');
        if (term) homesDiv.classList.add('open'); // une recherche active déplie directement les résultats
        for (const home of acc.homes) {
            const homeEl = el('div', 'map-sidebar-home');
            homeEl.innerHTML = `
                <span class="map-sidebar-home-name">${home.name}</span>
                <span class="map-sidebar-home-coords">${home.coords.x} ${home.coords.y} ${home.coords.z}</span>
            `;
            homeEl.querySelector('.map-sidebar-home-name')?.prepend(dimDot(home.coords.dimension));
            homeEl.addEventListener('click', () => navigateToHome(home));
            homesDiv.appendChild(homeEl);
        }

        header.addEventListener('click', () => {
            homesDiv.classList.toggle('open');
        });

        accDiv.append(header, homesDiv);
        contentEl.appendChild(accDiv);
    }
}

/** Navigue vers un home sur la carte (centre et zoom) */
function navigateToHome(home) {
    if (!mapController || !clusterEngine) return;

    const wrapper = document.getElementById('map-wrapper');
    if (!wrapper) return;
    const rectWrapper = wrapper.getBoundingClientRect();
    const geo = getMapGeometry();
    const canvasSize = geo.canvasSize;

    const basePos = worldToCanvas(home.coords.x, home.coords.z, canvasSize);

    // Centrer sur le home avec un zoom confortable (scale 8), animé en douceur
    const targetScale = 8;
    const targetX = (canvasSize / 2) - basePos.x * targetScale;
    const targetY = (canvasSize / 2) - basePos.y * targetScale;
    mapController.canvasSize = canvasSize;
    mapController.animateTo(targetScale, targetX, targetY);

    // Afficher le tooltip temporairement une fois l'animation terminée
    if (tooltipManager) {
        setTimeout(() => {
            const cluster = { ...home, cluster: false };
            const clientX = rectWrapper.left + geo.offsetX + state.mapTransform.x + basePos.x * targetScale;
            const clientY = rectWrapper.top + geo.offsetY + state.mapTransform.y + basePos.y * targetScale;
            tooltipManager.show(cluster, clientX, clientY);
            setTimeout(() => tooltipManager.hide(), 3000);
        }, 240);
    }
}

/** Appelé quand on reçoit un nouvel état WS */
function onMapStateUpdate() {
    if (document.getElementById('tab-map')?.hidden === false) {
        updateMapHomes();
    }
}

// ---------- Init ----------
function init() {
    document.querySelectorAll('nav button').forEach(btn => {
        btn.addEventListener('click', () => showTab(`tab-${btn.dataset.tab}`));
    });
    $('set-save').addEventListener('click', saveSettings);
    $('set-reset').addEventListener('click', resetAll);
    $('set-clear-coords').addEventListener('click', clearCoords);
    $('acc-export-txt').addEventListener('click', () => { window.location.href = '/api/accounts/export?format=txt'; });
    $('acc-export-csv').addEventListener('click', () => { window.location.href = '/api/accounts/export?format=csv'; });
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

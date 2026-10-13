import { serverManager } from './serverManager.js';
import { getSettings, saveSettings, resetSettings } from './settingsStore.js';
import { whitelistStore } from './whitelistStore.js';
import { homesStore } from './homesStore.js';
import { accountManager } from './accountManager.js';

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 100000) {
        reject(new Error('Corps de requête trop grand'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('JSON invalide'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Gère /api/servers et /api/settings (même origine uniquement)
 */
export async function handleExtraApi(req, res, pathname) {
  const json = (code, obj) => {
    res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(obj));
  };

  // Bloque les requêtes venant d'un autre site web
  const origin = req.headers.origin;
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host) return json(403, { error: 'Origine refusée' });
    } catch (e) {
      return json(403, { error: 'Origine refusée' });
    }
  }

  try {
    const parts = pathname.split('/').filter(Boolean); // ['api', 'servers', id?]
    const m = req.method;

    if (parts[1] === 'settings' && parts.length === 2) {
      if (m === 'GET') return json(200, { settings: getSettings() });
      if (m === 'PUT') return json(200, { settings: saveSettings(await readBody(req)) });
    }
    if (parts[1] === 'servers') {
      if (parts.length === 2 && m === 'GET') return json(200, { servers: serverManager.list() });
      if (parts.length === 2 && m === 'POST') return json(201, { server: serverManager.add(await readBody(req)) });
      if (parts.length === 3 && m === 'PUT') return json(200, { server: serverManager.update(parts[2], await readBody(req)) });
      if (parts.length === 3 && m === 'DELETE') {
        serverManager.delete(parts[2]);
        return json(200, { success: true });
      }
    }
    // Liste blanche : /api/whitelist, /api/whitelist/:id
    if (parts[1] === 'whitelist') {
      if (parts.length === 2 && m === 'GET') return json(200, { entries: whitelistStore.list() });
      if (parts.length === 2 && m === 'POST') return json(201, { entry: whitelistStore.add(await readBody(req)) });
      if (parts.length === 3 && m === 'PUT') return json(200, { entry: whitelistStore.update(parts[2], await readBody(req)) });
      if (parts.length === 3 && m === 'DELETE') {
        whitelistStore.delete(parts[2]);
        return json(200, { success: true });
      }
    }
    // Description des homes : /api/homes/:accountId/:name (PUT)
    if (parts[1] === 'homes' && parts.length === 4 && m === 'PUT') {
      const body = await readBody(req);
      return json(200, { homes: homesStore.setDescription(parts[2], decodeURIComponent(parts[3]), body.description) });
    }
    return json(404, { error: 'Route API introuvable' });
  } catch (err) {
    return json(400, { error: err.message });
  }
}

/**
 * Réinitialisation complète : supprime tous les comptes, serveurs, la liste blanche,
 * les homes/descriptions enregistrés et remet les paramètres par défaut.
 * Le bot manager est déjà déconnecté par l'appelant (index.js) avant d'arriver ici.
 */
export async function handleResetApi(req, res, pathname) {
  const json = (code, obj) => {
    res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(obj));
  };
  try {
    accountManager.resetAll();
    serverManager.resetAll();
    whitelistStore.resetAll();
    homesStore.resetAll();
    resetSettings();
    return json(200, { success: true });
  } catch (err) {
    return json(500, { error: err.message });
  }
}

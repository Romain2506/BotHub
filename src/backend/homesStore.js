import { readFileSync, writeFileSync, existsSync, renameSync } from 'fs';
import { join } from 'path';

const FILE = join(process.cwd(), 'data', 'homes.json');
const MAX_DESC = 200;

function read() {
  try {
    return existsSync(FILE) ? (JSON.parse(readFileSync(FILE, 'utf8')).homes || {}) : {};
  } catch (e) {
    return {};
  }
}

function write(homes) {
  const tmp = FILE + '.tmp';
  writeFileSync(tmp, JSON.stringify({ homes }, null, 2));
  renameSync(tmp, FILE);
}

export const homesStore = {
  /** Liste les homes connus d'un compte avec leur description ({name, description}[]) */
  list(accountId) {
    const all = read();
    const entry = all[accountId] || {};
    return Object.keys(entry).sort((a, b) => a.localeCompare(b)).map((name) => ({ name, description: entry[name] || '' }));
  },

  /**
   * Enregistre la liste des homes actuellement détectée pour un compte.
   * Conserve les descriptions des homes toujours présents, supprime celles des homes disparus.
   */
  sync(accountId, homeNames) {
    const all = read();
    const previous = all[accountId] || {};
    const next = {};
    for (const name of homeNames) {
      next[name] = previous[name] || '';
    }
    all[accountId] = next;
    write(all);
    return this.list(accountId);
  },

  /** Définit la description d'un home déjà connu pour ce compte */
  setDescription(accountId, homeName, description) {
    const all = read();
    const entry = all[accountId] || {};
    if (!(homeName in entry)) {
      throw new Error('Home inconnu (fais d\'abord "Actualiser" les homes depuis le centre de contrôle)');
    }
    const desc = String(description || '').slice(0, MAX_DESC);
    entry[homeName] = desc;
    all[accountId] = entry;
    write(all);
    return this.list(accountId);
  },

  /** Supprime toutes les données de homes d'un compte (compte supprimé) */
  removeAccount(accountId) {
    const all = read();
    if (accountId in all) {
      delete all[accountId];
      write(all);
    }
  },

  /** Supprime toutes les données de homes de tous les comptes */
  resetAll() {
    write({});
  },
};

import { readFileSync, writeFileSync, existsSync, renameSync } from 'fs';
import { join } from 'path';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const FILE = join(process.cwd(), 'data', 'homes.json');
const SECRET_FILE = join(process.cwd(), 'data', '.secret');
const MAX_DESC = 200;
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

/** Charge la clé secrète depuis .secret (même fichier que accountManager) */
function loadSecretKey() {
  try {
    if (existsSync(SECRET_FILE)) {
      const secretData = readFileSync(SECRET_FILE, 'utf8');
      const secretObj = JSON.parse(secretData);
      if (secretObj.key) {
        return Buffer.from(secretObj.key, 'hex');
      }
    }
  } catch (e) {
    // Ignore errors, will generate a key if needed (should not happen if accountManager runs first)
  }
  // Fallback: generate a deterministic key from a fixed string (for standalone use)
  // In practice, accountManager creates .secret first
  return Buffer.from('0'.repeat(64), 'hex'); // 32 bytes = 256 bits
}

const SECRET_KEY = loadSecretKey();

/** Chiffre un objet coordonnées {x,y,z,dimension} */
function encryptCoords(coords) {
  if (!coords) return null;
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ENCRYPTION_ALGORITHM, SECRET_KEY, iv);
  const plaintext = JSON.stringify(coords);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted,
    tag: tag.toString('hex'),
  };
}

/** Déchiffre un objet coordonnées chiffré */
function decryptCoords(encryptedObj) {
  if (!encryptedObj || !encryptedObj.encryptedData) return null;
  try {
    const iv = Buffer.from(encryptedObj.iv, 'hex');
    const encryptedData = Buffer.from(encryptedObj.encryptedData, 'hex');
    const tag = Buffer.from(encryptedObj.tag, 'hex');
    const decipher = createDecipheriv(ENCRYPTION_ALGORITHM, SECRET_KEY, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  } catch (e) {
    return null;
  }
}

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

function migrateEntry(entry) {
  // Ancien format: { "homeName": "description" }
  // Format intermédiaire: { "homeName": { description, coords, updatedAt } } avec coords en clair
  // Nouveau format: { "homeName": { description, coords (chiffré ou null), updatedAt } }
  const migrated = {};
  for (const [name, value] of Object.entries(entry)) {
    if (typeof value === 'string') {
      // Très ancien format : juste une string description
      migrated[name] = { description: value, coords: null, updatedAt: 0 };
    } else if (value && typeof value === 'object') {
      let coords = value.coords;
      // Si coords est un objet en clair (migration depuis version non-chiffrée), le chiffrer
      if (coords && typeof coords === 'object' && !coords.encryptedData) {
        coords = encryptCoords(coords);
      }
      migrated[name] = {
        description: value.description || '',
        coords: coords || null,
        updatedAt: value.updatedAt || 0,
      };
    } else {
      migrated[name] = { description: '', coords: null, updatedAt: 0 };
    }
  }
  return migrated;
}

function decryptEntryForOutput(entry) {
  // Pour l'API : déchiffre les coords pour les renvoyer au frontend
  const result = {};
  for (const [name, value] of Object.entries(entry)) {
    result[name] = {
      description: value.description || '',
      coords: decryptCoords(value.coords),
      updatedAt: value.updatedAt || 0,
    };
  }
  return result;
}

export const homesStore = {
  /** Liste les homes connus d'un compte avec leur description et coordonnées (déchiffrées) */
  list(accountId) {
    const all = read();
    const entry = all[accountId] || {};
    const migrated = migrateEntry(entry);
    // Écrire la migration si nécessaire (chiffrement des coords en clair)
    if (JSON.stringify(migrated) !== JSON.stringify(entry)) {
      all[accountId] = migrated;
      write(all);
    }
    const decrypted = decryptEntryForOutput(migrated);
    return Object.keys(decrypted).sort((a, b) => a.localeCompare(b)).map((name) => ({
      name,
      description: decrypted[name].description || '',
      coords: decrypted[name].coords || null,
      updatedAt: decrypted[name].updatedAt || 0,
    }));
  },

  /**
   * Enregistre la liste des homes actuellement détectée pour un compte.
   * Conserve les descriptions et coordonnées des homes toujours présents, supprime celles des homes disparus.
   */
  sync(accountId, homeNames) {
    const all = read();
    const previous = migrateEntry(all[accountId] || {});
    // Repli insensible à la casse : si le serveur renvoie un nom avec une casse différente
    // d'un rafraîchissement à l'autre (ex: "Corner" puis "corner"), on ne veut pas perdre
    // les coordonnées/dimension déjà enregistrées pour ce home.
    const previousByLowerName = {};
    for (const key of Object.keys(previous)) {
      const lower = key.toLowerCase();
      if (!(lower in previousByLowerName)) previousByLowerName[lower] = key;
    }
    const next = {};
    for (const name of homeNames) {
      const matchKey = (name in previous) ? name : previousByLowerName[name.toLowerCase()];
      next[name] = (matchKey !== undefined ? previous[matchKey] : null) || { description: '', coords: null, updatedAt: 0 };
    }
    all[accountId] = next;
    write(all);
    return this.list(accountId);
  },

  /** Définit la description d'un home déjà connu pour ce compte */
  setDescription(accountId, homeName, description) {
    const all = read();
    const entry = migrateEntry(all[accountId] || {});
    if (!(homeName in entry)) {
      throw new Error('Home inconnu (fais d\'abord "Actualiser" les homes depuis le centre de contrôle)');
    }
    entry[homeName].description = String(description || '').slice(0, MAX_DESC);
    all[accountId] = entry;
    write(all);
    return this.list(accountId);
  },

  /** Définit les coordonnées d'un home (appelé quand le bot fait /sethome ou /home) */
  setCoords(accountId, homeName, coords) {
    const all = read();
    const entry = migrateEntry(all[accountId] || {});
    if (!(homeName in entry)) {
      // Si le home n'existe pas encore, on le crée (sera sync plus tard)
      entry[homeName] = { description: '', coords: null, updatedAt: 0 };
    }
    entry[homeName].coords = encryptCoords({
      x: Math.floor(coords.x),
      y: Math.floor(coords.y),
      z: Math.floor(coords.z),
      dimension: coords.dimension || 'overworld',
    });
    entry[homeName].updatedAt = Date.now();
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

  /** Efface toutes les coordonnées (garde les descriptions) */
  clearAllCoords() {
    const all = read();
    for (const accountId of Object.keys(all)) {
      const entry = migrateEntry(all[accountId]);
      for (const name of Object.keys(entry)) {
        entry[name].coords = null;
        entry[name].updatedAt = 0;
      }
      all[accountId] = entry;
    }
    write(all);
  },
};
import { readFileSync, writeFileSync, existsSync, renameSync } from 'fs';
import { join } from 'path';

const FILE = join(process.cwd(), 'data', 'settings.json');

const DEFAULTS = {
  theme: 'dark',
  language: 'fr',
  language: 'fr',
  port: 8080,
  host: '127.0.0.1',
  openBrowser: true,
  autoReconnect: true,
  reconnectInitialDelay: 5000,
  reconnectMaxDelay: 60000,
  reconnectMaxAttempts: -1,
  homeTeleportCooldown: 3000,
  maxHomeTeleportRetries: 3,
  playerListUpdateInterval: 30000,
  logLevel: 'info',
  reducedMotion: false,
  whitelistEnabled: true,
  antiAfk: {
    enabled: false,
    interval: 60000,
    sneak: true,
    jump: true,
    chatEnabled: false,
    chatText: '',
  },
};

const isBool = (v) => typeof v === 'boolean';
const isDelay = (v) => Number.isFinite(v) && v >= 1000 && v <= 3600000;
const isAntiAfk = (v) => {
  if (!v || typeof v !== 'object') return false;
  if (!isBool(v.enabled)) return false;
  if (!Number.isFinite(v.interval) || v.interval < 5000 || v.interval > 3600000) return false;
  if (!isBool(v.sneak) || !isBool(v.jump) || !isBool(v.chatEnabled)) return false;
  if (typeof v.chatText !== 'string' || v.chatText.length > 256 || /[\r\n]/.test(v.chatText)) return false;
  return true;
};

// Paramètres modifiables depuis l'interface (port/host exigent un redémarrage : non exposés)
const RULES = {
  language: (v) => v === 'fr' || v === 'en',
  theme: (v) => v === 'dark' || v === 'light',
  reducedMotion: isBool,
  openBrowser: isBool,
  autoReconnect: isBool,
  reconnectInitialDelay: isDelay,
  reconnectMaxDelay: isDelay,
  reconnectMaxAttempts: (v) => Number.isInteger(v) && v >= -1 && v <= 1000,
  whitelistEnabled: isBool,
  antiAfk: isAntiAfk,
};

function readFile() {
  try {
    return existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : {};
  } catch (e) {
    return {};
  }
}

export function getSettings() {
  return { ...DEFAULTS, ...readFile() };
}

export function saveSettings(patch) {
  if (!patch || typeof patch !== 'object') throw new Error('Paramètres invalides');
  for (const [key, value] of Object.entries(patch)) {
    if (!RULES[key]) throw new Error(`Paramètre inconnu ou non modifiable: ${key}`);
    if (!RULES[key](value)) throw new Error(`Valeur invalide pour ${key}`);
  }
  const merged = { ...getSettings(), ...patch };
  if (merged.reconnectMaxDelay < merged.reconnectInitialDelay) {
    throw new Error('Le délai maximum doit être supérieur ou égal au délai initial');
  }
  const tmp = FILE + '.tmp';
  writeFileSync(tmp, JSON.stringify(merged, null, 2));
  renameSync(tmp, FILE);
  return merged;
}

/** Réinitialise les paramètres aux valeurs par défaut */
export function resetSettings() {
  const tmp = FILE + '.tmp';
  writeFileSync(tmp, JSON.stringify({}, null, 2));
  renameSync(tmp, FILE);
  return { ...DEFAULTS };
}

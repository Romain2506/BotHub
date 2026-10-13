import { readFileSync, writeFileSync, existsSync, renameSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

const FILE = join(process.cwd(), 'data', 'whitelist.json');
const MAX_NAME = 16;
const MAX_CMD = 150;

function read() {
  try {
    return existsSync(FILE) ? (JSON.parse(readFileSync(FILE, 'utf8')).entries || []) : [];
  } catch (e) {
    return [];
  }
}

function write(entries) {
  const tmp = FILE + '.tmp';
  writeFileSync(tmp, JSON.stringify({ entries }, null, 2));
  renameSync(tmp, FILE);
}

function clean(data, base = {}) {
  const name = String(data.name ?? base.name ?? '').trim();
  const tpCommand = String(data.tpCommand ?? base.tpCommand ?? '').trim();
  const enabled = data.enabled !== undefined ? Boolean(data.enabled) : (base.enabled !== undefined ? base.enabled : true);
  if (!name || !/^[A-Za-z0-9_]{1,16}$/.test(name)) throw new Error('Pseudo invalide (lettres, chiffres, _, 16 caractères max)');
  if (name.length > MAX_NAME) throw new Error('Pseudo trop long');
  if (tpCommand.length > MAX_CMD || /[\r\n]/.test(tpCommand)) throw new Error('Commande auto invalide');
  return { name, tpCommand, enabled };
}

export const whitelistStore = {
  list: read,

  get(id) {
    return read().find((w) => w.id === id) || null;
  },

  isWhitelisted(name) {
    const n = String(name || '').toLowerCase();
    return read().some((w) => w.enabled && w.name.toLowerCase() === n);
  },

  getByName(name) {
    const n = String(name || '').toLowerCase();
    return read().find((w) => w.name.toLowerCase() === n) || null;
  },

  add(data) {
    const entries = read();
    const entry = clean(data);
    if (entries.some((w) => w.name.toLowerCase() === entry.name.toLowerCase())) {
      throw new Error(`'${entry.name}' est déjà dans la liste blanche`);
    }
    const full = { id: randomUUID(), ...entry };
    entries.push(full);
    write(entries);
    return full;
  },

  update(id, data) {
    const entries = read();
    const i = entries.findIndex((w) => w.id === id);
    if (i === -1) throw new Error('Entrée introuvable');
    const entry = clean(data, entries[i]);
    if (entries.some((w, idx) => idx !== i && w.name.toLowerCase() === entry.name.toLowerCase())) {
      throw new Error(`'${entry.name}' est déjà dans la liste blanche`);
    }
    entries[i] = { id, ...entry };
    write(entries);
    return entries[i];
  },

  delete(id) {
    const entries = read();
    if (!entries.some((w) => w.id === id)) throw new Error('Entrée introuvable');
    write(entries.filter((w) => w.id !== id));
  },

  resetAll() {
    write([]);
  },
};

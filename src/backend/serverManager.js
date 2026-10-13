import { readFileSync, writeFileSync, existsSync, renameSync } from 'fs';
import { join } from 'path';

const FILE = join(process.cwd(), 'data', 'servers.json');

function read() {
  try {
    return existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')).servers || [] : [];
  } catch (e) {
    return [];
  }
}

function write(servers) {
  const tmp = FILE + '.tmp';
  writeFileSync(tmp, JSON.stringify({ servers }, null, 2));
  renameSync(tmp, FILE);
}

function cmdField(data, base, key, max = 100) {
  const value = String(data[key] ?? base[key] ?? '').trim();
  if (value.length > max || /[\r\n]/.test(value)) throw new Error(`Champ invalide : ${key}`);
  return value;
}

function clean(data, base = {}) {
  const name = String(data.name ?? base.name ?? '').trim();
  const host = String(data.host ?? base.host ?? '').trim();
  const port = Number(data.port ?? base.port ?? 25565);
  const version = String(data.version ?? base.version ?? '').trim();
  if (!name) throw new Error('Nom du serveur requis');
  if (!host || /\s/.test(host)) throw new Error('Adresse du serveur invalide');
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Port invalide (1-65535)');

  // Commandes propres au serveur (vide = valeur par défaut)
  const loginCommand = cmdField(data, base, 'loginCommand');
  const homesCommand = cmdField(data, base, 'homesCommand');
  const homeCommand = cmdField(data, base, 'homeCommand');
  const homesRegex = cmdField(data, base, 'homesRegex', 200);
  if (homeCommand && !homeCommand.includes('{name}')) {
    throw new Error('La commande de téléportation doit contenir {name}');
  }
  if (homesRegex) {
    try { new RegExp(homesRegex, 'is'); } catch (e) { throw new Error('Regex des homes invalide'); }
  }

  // Liste blanche : détection des demandes de TP et des messages privés
  const tpRequestRegex = cmdField(data, base, 'tpRequestRegex', 200);
  const tpAcceptCommand = cmdField(data, base, 'tpAcceptCommand');
  const tpaCommand = cmdField(data, base, 'tpaCommand');
  const privateMessageRegex = cmdField(data, base, 'privateMessageRegex', 200);
  const privateMessageCommand = cmdField(data, base, 'privateMessageCommand');
  if (tpRequestRegex) {
    try { new RegExp(tpRequestRegex, 'i'); } catch (e) { throw new Error('Regex de demande de TP invalide'); }
  }
  if (tpaCommand && !tpaCommand.includes('{name}')) {
    throw new Error('La commande /tpa doit contenir {name}');
  }
  if (privateMessageRegex) {
    try { new RegExp(privateMessageRegex, 'i'); } catch (e) { throw new Error('Regex de message privé invalide'); }
  }
  if (privateMessageCommand && (!privateMessageCommand.includes('{name}') || !privateMessageCommand.includes('{text}'))) {
    throw new Error('La commande de message privé doit contenir {name} et {text}');
  }

  return {
    name, host, port, version, loginCommand, homesCommand, homeCommand, homesRegex,
    tpRequestRegex, tpAcceptCommand, tpaCommand, privateMessageRegex, privateMessageCommand,
  };
}

export const serverManager = {
  list: read,
  get: (id) => read().find((s) => s.id === id) || null,
  add(data) {
    const servers = read();
    const entry = clean(data);
    let id = entry.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'serveur';
    while (servers.some((s) => s.id === id)) id += '-2';
    const server = { id, ...entry };
    servers.push(server);
    write(servers);
    return server;
  },
  update(id, data) {
    const servers = read();
    const i = servers.findIndex((s) => s.id === id);
    if (i === -1) throw new Error('Serveur introuvable');
    servers[i] = { id, ...clean(data, servers[i]) };
    write(servers);
    return servers[i];
  },
  delete(id) {
    const servers = read();
    if (!servers.some((s) => s.id === id)) throw new Error('Serveur introuvable');
    write(servers.filter((s) => s.id !== id));
  },
  resetAll() {
    write([]);
  },
};

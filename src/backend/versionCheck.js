import https from 'node:https';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = join(fileURLToPath(import.meta.url), '..');

// Dépôt GitHub où BotHub est publié.
const REPO = 'Romain2506/BotHub';

const CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 heures

let cache = null; // { checkedAt, result }

function getCurrentVersion() {
  try {
    const pkg = JSON.parse(readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf8'));
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

function httpsGetJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'BotHub-update-check',
        'Accept': 'application/vnd.github+json',
      },
      timeout: 5000,
    }, (res) => {
      if (res.statusCode === 404) { resolve(null); return; }
      if (res.statusCode < 200 || res.statusCode >= 300) {
        reject(new Error(`GitHub a répondu ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    });
    req.on('timeout', () => req.destroy(new Error('Délai dépassé')));
    req.on('error', reject);
  });
}

// Compare deux versions "x.y.z" (sans suffixe pré-release). Retourne true si a < b.
function isOlder(a, b) {
  const pa = String(a).replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0);
  const pb = String(b).replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] || 0, y = pb[i] || 0;
    if (x < y) return true;
    if (x > y) return false;
  }
  return false;
}

async function fetchLatest() {
  // On essaie d'abord la dernière "release" GitHub, sinon le dernier tag.
  let latest = await httpsGetJson(`https://api.github.com/repos/${REPO}/releases/latest`);
  if (latest && latest.tag_name) {
    return { version: latest.tag_name, url: latest.html_url || `https://github.com/${REPO}/releases` };
  }
  const tags = await httpsGetJson(`https://api.github.com/repos/${REPO}/tags`);
  if (Array.isArray(tags) && tags.length > 0) {
    return { version: tags[0].name, url: `https://github.com/${REPO}/releases/tag/${tags[0].name}` };
  }
  return null;
}

/**
 * Vérifie s'il existe une version plus récente de BotHub sur GitHub.
 * Résultat mis en cache (CHECK_INTERVAL_MS) pour éviter de solliciter l'API GitHub à chaque requête.
 */
export async function checkForUpdate() {
  const current = getCurrentVersion();
  const now = Date.now();
  if (cache && (now - cache.checkedAt) < CHECK_INTERVAL_MS) {
    return cache.result;
  }
  let result = { current, latest: null, updateAvailable: false, url: `https://github.com/${REPO}/releases`, error: null };
  try {
    const latest = await fetchLatest();
    if (latest) {
      result.latest = latest.version;
      result.url = latest.url;
      result.updateAvailable = isOlder(current, latest.version);
    }
  } catch (err) {
    result.error = err.message;
  }
  cache = { checkedAt: now, result };
  return result;
}

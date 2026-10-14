import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { join, extname, normalize, sep } from 'path';
import { readFileSync, existsSync, writeFileSync, unlinkSync, mkdirSync } from 'fs';
import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { AccountManager, accountManager } from './accountManager.js';
import { botManager } from './botManager.js';
import { handleExtraApi, handleResetApi } from './api.js';
import { checkForUpdate } from './versionCheck.js';

// Get directory names
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

// Default configuration
const DEFAULT_CONFIG = {
  port: 8080,
  host: '127.0.0.1',
  openBrowser: true,
  // Other settings would go here
};

// Lock file to prevent multiple instances
const LOCK_FILE = join(process.cwd(), 'data', '.botHub.lock');

/**
 * Loads configuration from data/settings.json or uses defaults
 * @returns {Object} Configuration object
 */
function loadConfig() {
  try {
    const settingsPath = join(process.cwd(), 'data', 'settings.json');
    if (existsSync(settingsPath)) {
      const settingsContent = readFileSync(settingsPath, 'utf8');
      const userSettings = JSON.parse(settingsContent);
      // Merge with defaults, user settings override defaults
      return { ...DEFAULT_CONFIG, ...userSettings };
    }
  } catch (error) {
    console.warn('Could not load settings.json, using defaults:', error.message);
  }
  return { ...DEFAULT_CONFIG };
}

/**
 * Vérifie qu'un PID correspond à un processus node vivant
 */
function isNodeProcessAlive(pid) {
  try {
    process.kill(pid, 0); // lève une erreur si le PID n'existe pas
  } catch (e) {
    return e.code === 'EPERM' ? true : false;
  }
  // Protection contre la réutilisation de PID : on vérifie que c'est bien node
  try {
    if (process.platform === 'win32') {
      const out = execSync(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`, { encoding: 'utf8' });
      return /node(\.exe)?"/i.test(out);
    }
    const out = execSync(`ps -p ${pid} -o comm=`, { encoding: 'utf8' });
    return /node/i.test(out);
  } catch (e) {
    return false;
  }
}

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

/**
 * Acquiert le verrou. Si une ancienne instance tourne, elle est arrêtée.
 * Si le verrou est orphelin (processus mort), il est écrasé.
 */
function acquireLock() {
  try {
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

    if (existsSync(LOCK_FILE)) {
      const oldPid = parseInt(readFileSync(LOCK_FILE, 'utf8').trim(), 10);
      if (Number.isInteger(oldPid) && oldPid !== process.pid && isNodeProcessAlive(oldPid)) {
        console.log(`Ancienne instance détectée (PID ${oldPid}), arrêt en cours...`);
        try { process.kill(oldPid, 'SIGTERM'); } catch (e) {}
        for (let i = 0; i < 20 && isNodeProcessAlive(oldPid); i++) sleepSync(250);
        if (isNodeProcessAlive(oldPid)) {
          console.error(`Impossible d'arrêter le PID ${oldPid}. Fais: taskkill /PID ${oldPid} /F`);
          return false;
        }
      } else {
        console.log('Verrou orphelin détecté, nettoyage.');
      }
      try { unlinkSync(LOCK_FILE); } catch (e) {}
    }

    writeFileSync(LOCK_FILE, process.pid.toString(), { flag: 'wx' });
    return true;
  } catch (error) {
    console.error('Failed to create lock file:', error.message);
    return false;
  }
}

/**
 * Supprime le verrou s'il nous appartient
 */
function releaseLock() {
  try {
    if (existsSync(LOCK_FILE) && readFileSync(LOCK_FILE, 'utf8').trim() === process.pid.toString()) {
      unlinkSync(LOCK_FILE);
    }
  } catch (error) {
    // ignore
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

/**
 * Ouvre l'URL dans le navigateur par défaut
 */
function openBrowser(url) {
  try {
    let child;
    if (process.platform === 'win32') {
      child = spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' });
    } else if (process.platform === 'darwin') {
      child = spawn('open', [url], { detached: true, stdio: 'ignore' });
    } else {
      child = spawn('xdg-open', [url], { detached: true, stdio: 'ignore' });
    }
    child.on('error', () => {});
    child.unref();
  } catch (e) {
    console.warn('Impossible d\'ouvrir le navigateur:', e.message);
  }
}

/**
 * Attempts to start the server on a specific port and host
 * @param {number} port - Port to try
 * @param {string} host - Host to bind to
 * @returns {Promise<{server: import('http').Server, wss: WebSocketServer, port: number}>}
 * @throws {Error} If port is unavailable or other error occurs
 */
function startServerOnPort(port, host) {
  return new Promise((resolve, reject) => {
    // Create HTTP server
    const server = createServer(async (req, res) => {
      // Parse URL
      const url = new URL(req.url || '/', `http://${req.headers.host}`);
      const pathname = url.pathname;

      // Serve index.html for root requests
      if (pathname === '/' || pathname === '') {
        try {
          const htmlContent = readFileSync(
            join(process.cwd(), 'src', 'frontend', 'index.html'),
            'utf8'
          );
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(htmlContent);
        } catch (error) {
          console.error('Error reading index.html:', error);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }
      }
      // Réinitialisation complète (toutes les données) : déconnecte d'abord tous les bots
      else if (pathname === '/api/version' && req.method === 'GET') {
        try {
          const result = await checkForUpdate();
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify(result));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: err.message }));
        }
      }
      else if (pathname === '/api/reset' && req.method === 'DELETE') {
        botManager.disconnectAll();
        await handleResetApi(req, res, pathname);
      }
      // API routes for account management
      else if (pathname === '/api/accounts' || pathname.startsWith('/api/accounts/')) {
        await handleAccountApi(req, res, pathname);
      }
      // Serveurs Minecraft, paramètres, liste blanche et descriptions de homes
      else if (
        pathname.startsWith('/api/servers')
        || pathname === '/api/settings'
        || pathname.startsWith('/api/whitelist')
        || pathname.startsWith('/api/homes')
      ) {
        await handleExtraApi(req, res, pathname);
      }
      // Fichiers statiques du frontend (app.js, style.css, ...)
      else {
        const frontendDir = join(process.cwd(), 'src', 'frontend');
        const filePath = normalize(join(frontendDir, decodeURIComponent(pathname)));
        if (filePath.startsWith(frontendDir + sep) && existsSync(filePath)) {
          const mime = MIME_TYPES[extname(filePath).toLowerCase()] || 'application/octet-stream';
          res.writeHead(200, { 'Content-Type': mime });
          res.end(readFileSync(filePath));
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
        }
      }
    });

    // Setup WebSocket server
    const wss = new WebSocketServer({ server });

    const send = (ws, obj) => {
      if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(obj));
    };
    const broadcast = (obj) => wss.clients.forEach((c) => send(c, obj));
    botManager.on('state', () => broadcast({ type: 'state', bots: botManager.list() }));
    botManager.on('chat', (accountId, line) => broadcast({ type: 'chat', accountId, line }));

    wss.on('connection', (ws, req) => {
      // Refuse les connexions venant d'un autre site web
      const origin = req.headers.origin;
      if (origin) {
        let ok = false;
        try { ok = new URL(origin).host === req.headers.host; } catch (e) { /* refusé */ }
        if (!ok) return ws.close(1008, 'Origine refusée');
      }

      send(ws, { type: 'state', bots: botManager.list() });

      ws.on('message', (raw) => {
        try {
          const msg = JSON.parse(raw.toString());
          switch (msg.type) {
            case 'connect': botManager.connect(msg.accountId, msg.serverId); break;
            case 'disconnect': botManager.disconnect(msg.accountId); break;
            case 'chat': botManager.say(msg.accountId, msg.message); break;
            case 'homes': botManager.fetchHomes(msg.accountId); break;
            case 'home': botManager.goHome(msg.accountId, msg.name); break;
            case 'history':
              send(ws, { type: 'history', accountId: msg.accountId, lines: botManager.chatLog(msg.accountId) });
              break;
            default: throw new Error('Message inconnu');
          }
        } catch (err) {
          send(ws, { type: 'error', message: err.message });
        }
      });

      ws.on('error', (error) => {
        console.error('WebSocket connection error:', error);
      });
    });

    // WebSocket server error handling - this should NOT circumvent HTTP server error handling
    wss.on('error', (error) => {
      console.error('WebSocket server error:', error);
      // Note: We don't reject the promise here because WebSocket errors
      // shouldn't necessarily stop the HTTP server from functioning
    });

    // Start listening
    server.listen(port, host, () => {
      console.log(`BotHub server listening on http://${host}:${port}`);
      resolve({ server, wss, port });
    });

    // Handle listen errors - THIS IS CRITICAL for preventing Unhandled 'error' events
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // Port is already in use - reject with clear message
        reject(new Error(`Port ${port} is already in use. Please ensure BotHub is not already running or change the port in data/settings.json.`));
      } else {
        // Other error
        reject(err);
      }
    });

    // Handle client errors
    server.on('clientError', (err, socket) => {
      console.error('Client error:', err);
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });
  });
}

/**
 * Handle account management API requests
 * @param {import('http').IncomingMessage} req - HTTP request
 * @param {import('http').ServerResponse} res - HTTP response
 * @param {string} pathname - Request pathname
 */
async function handleAccountApi(req, res, pathname) {
  try {
    // Parse the path to extract account ID if present
    const pathParts = pathname.split("/").filter(part => part !== "");
    // Expected formats: /api/accounts, /api/accounts/:id

    // Set CORS headers
    res.setHeader("Content-Type", "application/json");

    // Handle OPTIONS request for CORS preflight
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    // Handle different endpoints
    if (pathname === "/api/accounts" && req.method === "GET") {
      // Get all accounts (without passwords)
      const accounts = accountManager.listAccounts();
      res.writeHead(200);
      res.end(JSON.stringify({ accounts }));
    }
    else if (pathname === "/api/accounts" && req.method === "POST") {
      // Create new account
      let body = "";
      req.on("data", chunk => {
        body += chunk.toString();
      });
      req.on("end", async () => {
        try {
          const accountData = JSON.parse(body);
          const newAccount = accountManager.addAccount(accountData);
          // Return account without password
          const { password, ...safeAccount } = newAccount;
          res.writeHead(201);
          res.end(JSON.stringify({ account: safeAccount }));
        } catch (error) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    }
    else if (pathParts.length === 3 && pathParts[1] === "accounts" && req.method === "GET") {
      // Get specific account by ID: /api/accounts/:id
      const accountId = pathParts[2];
      const account = accountManager.getAccount(accountId);
      if (account) {
        // Return account without password
        const { password, ...safeAccount } = account;
        res.writeHead(200);
        res.end(JSON.stringify({ account: safeAccount }));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Account not found" }));
      }
    }
    else if (pathParts.length === 3 && pathParts[1] === "accounts" && req.method === "PUT") {
      // Update account by ID: /api/accounts/:id
      const accountId = pathParts[2];
      let body = "";
      req.on("data", chunk => {
        body += chunk.toString();
      });
      req.on("end", async () => {
        try {
          const updateData = JSON.parse(body);
          const updatedAccount = accountManager.updateAccount(accountId, updateData);
          // Return account without password
          const { password, ...safeAccount } = updatedAccount;
          res.writeHead(200);
          res.end(JSON.stringify({ account: safeAccount }));
        } catch (error) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    }
    else if (pathParts.length === 3 && pathParts[1] === "accounts" && req.method === "DELETE") {
      // Delete account by ID: /api/accounts/:id
      const accountId = pathParts[2];
      try {
        accountManager.deleteAccount(accountId);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: error.message }));
      }
    }
    else {
      // Unknown API endpoint
      res.writeHead(404);
      res.end(JSON.stringify({ error: "API endpoint not found" }));
    }
  } catch (error) {
    console.error("API error:", error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
}

/**
 * Starts the server using configuration from settings
 * @returns {Promise<{server: import('http').Server, wss: WebSocketServer, port: number}>}
 */
async function startServer() {
  // Load configuration
  const config = loadConfig();
  const { port, host } = config;

  console.log(`Starting BotHub with configuration:`, config);

  try {
    const result = await startServerOnPort(port, host);
    return result;
  } catch (error) {
    if (error.message && error.message.includes('Port ') && error.message.includes('is already in use')) {
      // Re-throw with our custom message (already handled in startServerOnPort)
      throw error;
    } else {
      // Some other error - rethrow
      throw error;
    }
  }
}

// Start the server and handle graceful shutdown
let serverInstance = null;
let wssInstance = null;

async function initializeServer() {
  try {
    // First, try to acquire lock to prevent multiple instances
    if (!acquireLock()) {
      process.exit(1);
    }

    // Start the server
    const result = await startServer();
    serverInstance = result.server;
    wssInstance = result.wss;
    return result;
  } catch (error) {
    console.error('Failed to start BotHub server:', error.message);
    releaseLock(); // Release lock if we acquired it but failed to start
    process.exit(1);
  }
}

// Handle graceful shutdown
function shutdownServer(signal) {
  console.log(`\nReceived ${signal}, shutting down gracefully...`);
  botManager.disconnectAll();

  // Close WebSocket connections
  if (wssInstance) {
    wssInstance.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.close(1000, 'Server shutting down');
      }
    });
    wssInstance.close();
  }

  // Close HTTP server
  if (serverInstance) {
    serverInstance.close(() => {
      console.log('BotHub server closed');
      releaseLock(); // Release lock on shutdown
      process.exit(0);
    });
    setTimeout(() => { releaseLock(); process.exit(0); }, 3000).unref();
  } else {
    releaseLock();
    process.exit(0);
  }
}

// Setup signal handlers
process.on('SIGINT', () => shutdownServer('SIGINT'));
process.on('SIGTERM', () => shutdownServer('SIGTERM'));
process.on('exit', releaseLock);

// Handle uncaught exceptions to prevent Unhandled 'error' events
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  shutdownServer('UNCaught_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Note: Not exiting here as it might be handled elsewhere
});

// Start the server
initializeServer().then(({ port }) => {
  const url = `http://127.0.0.1:${port}`;
  console.log(`BotHub is ready! Access at: ${url}`);
  if (loadConfig().openBrowser !== false) openBrowser(url);
}).catch((error) => {
  console.error('Fatal error during startup:', error);
  process.exit(1);
});
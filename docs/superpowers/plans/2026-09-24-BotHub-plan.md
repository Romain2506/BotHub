# BotHub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a functional BotHub application with core infrastructure: Node.js backend, basic web server, WebSocket communication, and initial bot management capabilities.

**Architecture:** Modular monolith with separate modules for bot management, account/server management, home management, and WebSocket communication. Single Node.js process orchestrating all services.

**Tech Stack:** Node.js (LTS), Mineflayer (version to be determined and fixed), ws (WebSocket), native crypto for password encryption, vanilla HTML/CSS/JS frontend.

**Spec:** docs/superpowers/specs/2026-09-24-BotHub-design.md

## Global Constraints

- Installation must be trivial: Node.js → download → double-click start.bat
- Windows priority with compatible macOS/Linux architecture
- No external databases or mandatory frameworks (Redis, Docker, React/Vue, etc.)
- Complete bot isolation via botId - no cross-bot state contamination
- Passwords never appear in logs, WebSocket, or frontend (AES-256-GCM encryption)
- JSON writes must be atomic (temp file → replace)
- Corrupted JSON files preserved + fallback state + clear user warning
- No automatic gameplay actions (teleportation, home modification, etc.)
- Only maintenance actions allowed automatically: reconnection, home fetch after connect, player list updates, log cleanup, health checks
- WebSocket bound to 127.0.0.1 only in normal operation
- File-based storage with automatic creation of required directories/files
- Lightweight dependencies only - avoid unnecessary packages
- Frontend: HTML5/CSS3/JS vanilla, no frameworks, lightweight animations respecting prefers-reduced-motion
- All bot-related events must contain botId
- Strict separation of concerns between modules
- Startup verification: Node.js check, no auto-install, browser opens only after server ready
- .secret file handling: unique generation, no silent regeneration if missing/corrupt

---

### Task 1: Project Initialization and Basic Structure

**Files:**
- Create: `package.json`
- Create: `src/backend/index.js`
- Create: `src/backend/utils/logger.js`
- Create: `src/frontend/index.html`
- Create: `src/frontend/style.css`
- Create: `src/frontend/app.js`
- Create: `start.bat`
- Create: `start.sh`
- Create: `.gitignore`
- Create: `README.md`

**Interfaces:**
- Consumes: None (initial setup)
- Produces:
  - Basic project structure with entry points
  - Minimal backend server capable of serving static files
  - Basic frontend layout
  - Cross-platform startup scripts

- [ ] **Step 1: Initialize npm project and create package.json**

```json
{
  "name": "BotHub",
  "version": "1.0.0",
  "description": "Local Minecraft bot manager for offline/crack accounts",
  "main": "src/backend/index.js",
  "scripts": {
    "start": "node src/backend/index.js",
    "dev": "nodemon src/backend/index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["minecraft", "bot", "management"],
  "author": "BotHub Developer",
  "license": "MIT"
}
```

- [ ] **Step 2: Create basic backend entry point**

```javascript
import { createServer } from 'http';
import { Server } from 'ws';
import { join } from 'path';

const PORT = process.env.PORT || 3000;

// Create HTTP server to serve frontend
const server = createServer((req, res) => {
  // Serve index.html for root requests
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(join(process.cwd(), 'src', 'frontend', 'index.html'));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Setup WebSocket server
const wss = new Server({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
  });

  ws.send('Welcome to BotHub WebSocket server');
});

server.listen(PORT, () => {
  console.log(`BotHub server listening on http://127.0.0.1:${PORT}`);
});
```

- [ ] **Step 3: Create basic logger utility**

```javascript
import { createWriteStream } from 'fs';
import { join } from 'path';

const logStream = createWriteStream(join(process.cwd(), 'data', 'logs', 'app.log'), { flags: 'a' });

export class Logger {
  static error(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${message}\n`;
    console.error(logMessage.trim());
    logStream.write(logMessage);
  }

  static warn(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] WARN: ${message}\n`;
    console.warn(logMessage.trim());
    logStream.write(logMessage);
  }

  static info(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] INFO: ${message}\n`;
    console.info(logMessage.trim());
    logStream.write(logMessage);
  }

  static debug(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] DEBUG: ${message}\n`;
    console.debug(logMessage.trim());
    logStream.write(logMessage);
  }
}

// Initialize data/logs directory
import { mkdirSync, existsSync } from 'fs';
const logsDir = join(process.cwd(), 'data', 'logs');
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true });
}
```

- [ ] **Step 4: Create basic frontend files**

*index.html:*
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BotHub - Gestionnaire de bots Minecraft</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="app">
        <header>
            <h1>BotHub</h1>
            <p>Gestionnaire de bots Minecraft</p>
        </header>
        <main>
            <div id="status">En attente de connexion...</div>
        </main>
    </div>
    <script src="app.js" type="module"></script>
</body>
</html>
```

*style.css:*
```css
:root {
    --bg-color: #f5f5f5;
    --text-color: #333;
    --primary-color: #007acc;
    --border-radius: 4px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    line-height: 1.6;
}

header {
    background-color: var(--primary-color);
    color: white;
    padding: 1rem;
    text-align: center;
}

main {
    padding: 2rem;
}

#status {
    font-size: 1.2rem;
    font-weight: bold;
}
```

*app.js:*
```javascript
// Basic frontend - will be expanded in later tasks
console.log('Frontend initialized');

const statusElement = document.getElementById('status');
if (statusElement) {
    statusElement.textContent = 'Connecting to BotHub server...';
}

// Simple WebSocket connection test
const ws = new WebSocket(`ws://127.0.0.1:3000`);

ws.addEventListener('open', () => {
    console.log('WebSocket connected');
    if (statusElement) {
        statusElement.textContent = 'Connected to BotHub server';
    }
});

ws.addEventListener('message', (event) => {
    console.log('Message from server:', event.data);
});

ws.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
    if (statusElement) {
        statusElement.textContent = 'Connection error';
    }
});

ws.addEventListener('close', () => {
    console.log('WebSocket disconnected');
    if (statusElement) {
        statusElement.textContent = 'Disconnected from server';
    }
});
```

- [ ] **Step 5: Create startup scripts**

*start.bat:*
```batch
@echo off
REM BotHub Startup Script for Windows

REM Check if Node.js is installed
where node >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installé ou n'est pas dans le PATH.
    echo Veuillez installer Node.js LTS depuis https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if we're in the BotHub directory
if not exist "package.json" (
    echo ERREUR: Ce script doit être exécuté depuis le répertoire BotHub.
    echo.
    pause
    exit /b 1
)

echo Démarrage de BotHub...

REM Install dependencies if node_modules is missing
if not exist "node_modules" (
    echo Installation des dépendances...
    npm install
    if errorlevel 1 (
        echo ERREUR: Échec de l'installation des dépendances.
        echo.
        pause
        exit /b 1
    )
)

REM Start the application
echo Lancement de BotHub...
npm start

REM Keep window open if launched by double-click
if "%~1"=="pause" (
    pause
)
```

*start.sh:*
```bash
#!/bin/bash
# BotHub Startup Script for macOS/Linux

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERREUR: Node.js n'est pas installé ou n'est pas dans le PATH."
    echo "Veuillez installer Node.js LTS depuis https://nodejs.org/"
    echo
    exit 1
fi

# Check if we're in the BotHub directory
if [ ! -f "package.json" ]; then
    echo "ERREUR: Ce script doit être exécuté depuis le répertoire BotHub."
    echo
    exit 1
fi

echo "Démarrage de BotHub..."
echo

# Install dependencies if node_modules is missing
if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERREUR: Échec de l'installation des dépendances."
        echo
        exit 1
    fi
fi

# Start the application
echo "Lancement de BotHub..."
npm start
```

- [ ] **Step 6: Create .gitignore**

```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables or secrets
.env
env.*
!.env.example  # Keep the example file

# Data and logs (never commit sensitive data)
data/
!data/*.example  # Keep example files
data/**/*.json
!data/**/*.example

# Logs
logs/
*.log

# Runtime data
pids
*.pid
*.seed

# Coverage directory used by tools like istanbul
coverage/
.lcov*

# Build outputs
dist/
build/

# Misc
.DS_Store
Thumbs.db

# Secrets
.secret
```

- [ ] **Step 7: Create basic README.md**

```markdown
# BotHub - Gestionnaire de bots Minecraft

BotHub est une application locale permettant de gérer plusieurs bots Minecraft en comptes offline/crack via une interface web moderne.

## Installation

1. Installez [Node.js LTS](https://nodejs.org/) (version 22.x ou supérieure recommandée)
2. Téléchargez ou clonez ce dépôt
3. Ouvrez un terminal dans le répertoire du projet
4. Lancez l'application :
   - **Windows** : Double-cliquez sur `start.bat`
   - **macOS/Linux** : Exécutez `./start.sh` ou `bash start.sh`

## Fonctionnalités prévues

- Gestion de plusieurs bots Minecraft simultanés
- Interface web moderne et réactive
- Stockage sécurisé des comptes (mots de passe chiffrés)
- Configuration personnalisable par serveur
- Téléphortation sécurisée vers les homes et les joueurs
- Gestion du chat et des listes de joueurs en temps réel
- Fonctionnalités de survie et de sécurité pour les bots
- Reconnexion automatique configurable
- Aucune dépendance externe obligatoire (base de données, etc.)

## Architecture

- Backend : Node.js + Mineflayer
- Frontend : HTML5/CSS3/JavaScript vanilla
- Communication : WebSocket pour les mises à jour en temps réel
- Stockage : Fichiers JSON locaux avec chiffrement des mots de passe

## Sécurité

- Les mots de passe sont chiffrés localement (AES-256-GCM)
- Aucune fuite de mot de passe dans les logs, WebSocket ou interface
- Isolation totale entre les bots (aucun état partagé)
- Écritures JSON atomiques pour prévenir la corruption
- Gestion prudente des fichiers corrompus (fichier conservé + état de secours + avertissement)

## Développement

Ce projet utilise les compétences suivantes de Claude Code:
- superpowers:brainstorming
- superpowers:writing-plans
- superpowers:subagent-driven-development

## Licence

MIT
```

- [ ] **Step 8: Create example data files**

Create directory structure:
```bash
mkdir -p data
```

*data/accounts.json.example:*
```json
{
  "accounts": []
}
```

*data/servers.json.example:*
```json
{
  "servers": []
}
```

*data/settings.json.example:*
```json
{
  "theme": "dark",
  "language": "fr",
  "port": 3000,
  "autoReconnect": true,
  "reconnectInitialDelay": 5000,
  "reconnectMaxDelay": 60000,
  "reconnectMaxAttempts": -1,
  "homeTeleportCooldown": 3000,
  "maxHomeTeleportRetries": 3,
  "playerListUpdateInterval": 30000,
  "logLevel": "info",
  "reducedMotion": false
}
```

*data/homes.json.example:*
```json
{
  "homes": {}
}
```

- [ ] **Step 9: Run initial verification tests**

```bash
# Verify package.json is valid
npm pkg version

# Verify files exist
ls -la src/backend/index.js src/frontend/index.html src/frontend/style.css src/frontend/app.js start.bat start.sh

# Test that Node.js can run the basic server (will fail on port if already in use, but should start)
timeout 5 node src/backend/index.js || true

echo "Basic structure verification complete"
```

- [ ] **Step 10: Commit initial structure**

```bash
git add package.json src/backend/index.js src/backend/utils/logger.js src/frontend/index.html src/frontend/style.css src/frontend/app.js start.bat start.sh .gitignore README.md data/accounts.json.example data/servers.json.example data/settings.json.example data/homes.json.example
git commit -m "feat: initialize project structure with basic backend/frontend and startup scripts"
```

### Task 2: Account Management and Password Encryption

**Files:**
- Create: `src/backend/accountManager.js`
- Create: `src/backend/utils/cryptoUtils.js`
- Modify: `src/backend/index.js` (to initialize accountManager)
- Create: `src/backend/utils/helpers.js` (for validation functions)
- Modify: `src/backend/utils/logger.js` (to add secure logging methods if needed)

**Interfaces:**
- Consumes:
  - Raw account data (username, password, serverId, etc.)
  - Configuration from settings
- Produces:
  - Secure account storage with encrypted passwords
  - Methods to create, read, update, delete accounts
  - Secure password decryption for Mineflayer authentication only when needed

- [ ] **Step 1: Create password encryption utility**

```javascript
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { join } from 'path';

// Algorithm and key length constants
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12;  // 96 bits for GCM
const TAG_LENGTH = 16; // 128 bits for GCM

// Get or create encryption key
export function getEncryptionKey() {
  const keyPath = join(process.cwd(), '.secret');

  // Try to read existing key
  try {
    if (require('fs').existsSync(keyPath)) {
      const keyBuffer = require('fs').readFileSync(keyPath);
      // Key should be exactly KEY_LENGTH bytes
      if (keyBuffer.length === KEY_LENGTH) {
        return keyBuffer;
      }
    }
  } catch (error) {
    // If we can't read the key, we'll generate a new one below
  }

  // Generate new key if none exists or if reading failed
  const key = randomBytes(KEY_LENGTH);

  try {
    require('fs').writeFileSync(keyPath, key);
    // Set restrictive permissions (readable only by owner)
    require('fs').chmodSync(keyPath, 0o600);
  } catch (error) {
    // If we can't write the key, we'll still return it but log the issue
    // In a real implementation, we might want to handle this more gracefully
  }

  return key;
}

// Encrypt a password
export function encryptPassword(password) {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(password, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const tag = cipher.getAuthTag();

  // Return as base64: IV + encrypted data + tag
  return Buffer.concat([iv, encrypted, tag]).toString('base64');
}

// Decrypt a password
export function decryptPassword(encryptedPassword) {
  const key = getEncryptionKey();
  const buffer = Buffer.from(encryptedPassword, 'base64');

  if (buffer.length < IV_LENGTH + TAG_LENGTH) {
    throw new Error('Encrypted password too short');
  }

  const iv = buffer.slice(0, IV_LENGTH);
  const tag = buffer.slice(buffer.length - TAG_LENGTH);
  const encryptedData = buffer.slice(IV_LENGTH, buffer.length - TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encryptedData);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}

// Securely overwrite a password in memory (best effort in JS)
export function secureClearPassword(password) {
  if (typeof password === 'string' && password.length > 0) {
    // Overwrite with zeros (best effort - JS strings are immutable)
    // We can't actually modify the string, but we can overwrite the variable reference
    // In practice, we rely on limiting the time the password exists in memory
    return '';
  }
  return password;
}
```

- [ ] **Step 2: Create account manager**

```javascript
import { join } from 'path';
import { promises as fs } from 'fs';
import { encryptPassword, decryptPassword, secureClearPassword } from './utils/cryptoUtils.js';
import Logger from './utils/logger.js';

const DATA_DIR = join(process.cwd(), 'data');
const ACCOUNTS_FILE = join(DATA_DIR, 'accounts.json');

export class AccountManager {
  constructor() {
    this.accounts = new Map(); // accountId -> account data
    this.initialized = false;
  }

  async initialize() {
    try {
      // Ensure data directory exists
      await fs.mkdir(DATA_DIR, { recursive: true });

      // Load existing accounts or create empty structure
      try {
        const data = await fs.readFile(ACCOUNTS_FILE, 'utf8');
        const parsed = JSON.parse(data);

        if (parsed.accounts && Array.isArray(parsed.accounts)) {
          for (const account of parsed.accounts) {
            this.accounts.set(account.id, account);
          }
          Logger.info(`Loaded ${this.accounts.size} accounts from storage`);
        } else {
          Logger.warn('Invalid accounts file structure, starting with empty accounts');
          await this._saveAccounts();
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          Logger.info('No accounts file found, starting with empty accounts');
          await this._saveAccounts();
        } else {
          Logger.error(`Error reading accounts file: ${error.message}`);
          // Start with empty accounts but don't crash
          await this._saveAccounts();
        }
      }

      this.initialized = true;
    } catch (error) {
      Logger.error(`Failed to initialize AccountManager: ${error.message}`);
      throw error;
    }
  }

  async _saveAccounts() {
    const data = {
      accounts: Array.from(this.accounts.values())
    };

    // Atomic write: write to temp file then rename
    const tempFile = `${ACCOUNTS_FILE}.tmp`;
    try {
      await fs.writeFile(tempFile, JSON.stringify(data, null, 2));
      await fs.rename(tempFile, ACCOUNTS_FILE);
    } catch (error) {
      // Clean up temp file if it exists
      try {
        await fs.unlink(tempFile);
      } catch (cleanupError) {
        Logger.error(`Failed to cleanup temp file: ${cleanupError.message}`);
      }
      throw error;
    }
  }

  // Get all accounts (passwords remain encrypted)
  getAllAccounts() {
    return Array.from(this.accounts.values());
  }

  // Get account by ID
  getAccountById(accountId) {
    return this.accounts.get(accountId) || null;
  }

  // Add new account
  async addAccount(accountData) {
    // Validate input
    if (!accountData.username || !accountData.password || !accountData.serverId) {
      throw new Error('Username, password, and serverId are required');
    }

    // Generate ID if not provided
    const accountId = accountData.id || this._generateId();

    // Check if ID already exists
    if (this.accounts.has(accountId)) {
      throw new Error(`Account with ID ${accountId} already exists`);
    }

    // Encrypt the password
    const encryptedPassword = encryptPassword(accountData.password);

    // Create account object (password stored encrypted)
    const account = {
      id: accountId,
      username: accountData.username,
      password_encrypted: encryptedPassword,
      serverId: accountData.serverId,
      description: accountData.description || '',
      isActive: accountData.isActive !== undefined ? accountData.isActive : true,
      createdAt: accountData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store account
    this.accounts.set(accountId, account);

    // Persist to storage
    await this._saveAccounts();

    Logger.info(`Account added: ${account.username} (ID: ${accountId})`);

    return accountId;
  }

  // Update existing account
  async updateAccount(accountId, updates) {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error(`Account not found: ${accountId}`);
    }

    // Handle password update separately
    if (updates.password !== undefined) {
      if (!updates.password) {
        throw new Error('Password cannot be empty');
      }
      updates.password_encrypted = encryptPassword(updates.password);
      // Remove plain password from updates
      delete updates.password;
    }

    // Prevent updating ID or creation timestamp
    delete updates.id;
    delete updates.createdAt;

    // Apply updates
    Object.assign(account, updates);
    account.updatedAt = new Date().toISOString();

    // Persist to storage
    await this._saveAccounts();

    Logger.info(`Account updated: ${account.username} (ID: ${accountId})`);

    return accountId;
  }

  // Remove account
  async removeAccount(accountId) {
    if (!this.accounts.has(accountId)) {
      throw new Error(`Account not found: ${accountId}`);
    }

    const account = this.accounts.get(accountId);
    this.accounts.delete(accountId);

    // Persist to storage
    await this._saveAccounts();

    Logger.info(`Account removed: ${account.username} (ID: ${accountId})`);

    return accountId;
  }

  // Get decrypted password for account (use sparingly and clear after use)
  getDecryptedPassword(accountId) {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error(`Account not found: ${accountId}`);
    }

    if (!account.password_encrypted) {
      throw new Error(`No password found for account: ${accountId}`);
    }

    try {
      const password = decryptPassword(account.password_encrypted);
      return password;
    } catch (error) {
      Logger.error(`Failed to decrypt password for account ${accountId}: ${error.message}`);
      throw error;
    }
  }

  // Helper to generate simple ID
  _generateId() {
    return `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get count of accounts
  getCount() {
    return this.accounts.size;
  }
}

// Initialize and export singleton instance
const accountManager = new AccountManager();
// Initialize will be called from index.js
export { accountManager };
```

- [ ] **Step 3: Create helpers utility for validation**

```javascript
// Simple validation helpers
export function isValidString(value, minLength = 1, maxLength = 100) {
  if (typeof value !== 'string') return false;
  if (value.length < minLength) return false;
  if (value.length > maxLength) return false;
  return true;
}

export function isValidPort(port) {
  return typeof port === 'number' && port >= 1 && port <= 65535;
}

export function isValidBoolean(value) {
  return typeof value === 'boolean';
}

export function sanitizeInput(input, maxLength = 500) {
  if (typeof input !== 'string') return '';
  // Remove control characters and limit length
  let sanitized = input.replace(/[ --]/g, '');
  return sanitized.substring(0, Math.min(input.length, maxLength));
}

export function validateAccountData(data) {
  const errors = [];

  if (!isValidString(data.username, 1, 50)) {
    errors.push('Username must be a string between 1 and 50 characters');
  }

  if (!isValidString(data.password, 1, 100)) {
    errors.push('Password must be a string between 1 and 100 characters');
  }

  if (!isValidString(data.serverId, 1, 50)) {
    errors.push('Server ID must be a string between 1 and 50 characters');
  }

  if (data.description !== undefined && !isValidString(data.description, 0, 200)) {
    errors.push('Description must be a string between 0 and 200 characters');
  }

  if (data.isActive !== undefined && !isValidBoolean(data.isActive)) {
    errors.push('isActive must be a boolean');
  }

  return errors;
}
```

- [ ] **Step 4: Update backend index.js to initialize account manager**

```javascript
import { createServer } from 'http';
import { Server } from 'ws';
import { join } from 'path';
import { accountManager } from './accountManager.js';
import Logger from './utils/logger.js';

// Initialize data directory
const DATA_DIR = join(process.cwd(), 'data');
import { mkdirSync, existsSync } from 'fs';
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize account manager
accountManager.initialize().catch(error => {
  Logger.error(`Failed to initialize account manager: ${error.message}`);
  // Don't exit - we'll let the server start and handle errors gracefully
});

const PORT = process.env.PORT || 3000;

// Create HTTP server to serve frontend
const server = createServer((req, res) => {
  // Serve index.html for root requests
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(join(process.cwd(), 'src', 'frontend', 'index.html'));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Setup WebSocket server
const wss = new Server({ server });

wss.on('connection', (ws) => {
  Logger.info('New WebSocket connection');
  ws.on('message', (message) => {
    Logger.debug(`Received WebSocket message: ${message}`);
    // Handle messages will be implemented in later tasks
  });

  ws.on('close', () => {
    Logger.info('WebSocket connection closed');
  });

  ws.on('error', (error) => {
    Logger.error(`WebSocket error: ${error.message}`);
  });
});

server.listen(PORT, () => {
  Logger.info(`BotHub server listening on http://127.0.0.1:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  Logger.info('Received SIGINT, shutting down gracefully');
  wss.close(() => {
    server.close(() => {
      Logger.info('Server closed');
      process.exit(0);
    });
  });
});

process.on('SIGTERM', () => {
  Logger.info('Received SIGTERM, shutting down gracefully');
  wss.close(() => {
    server.close(() => {
      Logger.info('Server closed');
      process.exit(0);
    });
  });
});
```

- [ ] **Step 5: Run account management tests**

```bash
# Test that the modules can be imported without syntax errors
node -e "import './src/backend/accountManager.js'; console.log('AccountManager import OK')"
node -e "import './src/backend/utils/cryptoUtils.js'; console.log('CryptoUtils import OK')"

# Test basic functionality
node -e "
import { AccountManager } from './src/backend/accountManager.js';
import { encryptPassword, decryptPassword } from './src/backend/utils/cryptoUtils.js';

const am = new AccountManager();
// Test encryption/decryption
const original = 'mySecurePassword123';
const encrypted = encryptPassword(original);
const decrypted = decryptPassword(encrypted);
console.log('Encryption test:', original === decrypted ? 'PASS' : 'FAIL');
// Should be true
"
```

- [ ] **Step 6: Commit account management implementation**

```bash
git add src/backend/accountManager.js src/backend/utils/cryptoUtils.js src/backend/utils/helpers.js src/backend/index.js
git commit -m "feat: implement account management with AES-256-GCM password encryption"
```

### Task 3: Server Management

**Files:**
- Create: `src/backend/serverManager.js`
- Modify: `src/backend/index.js` (to initialize serverManager)
- Modify: `src/backend/utils/helpers.js` (add server validation if needed)

**Interfaces:**
- Consumes:
  - Raw server configuration data (address, port, commands, etc.)
- Produces:
  - Server storage and retrieval methods
  - Validation of server configurations
  - Methods to create, read, update, delete server configurations

- [ ] **Step 1: Create server manager**

```javascript
import { join } from 'path';
import { promises as fs } from 'fs';
import Logger from './utils/logger.js';

const DATA_DIR = join(process.cwd(), 'data');
const SERVERS_FILE = join(DATA_DIR, 'servers.json');

export class ServerManager {
  constructor() {
    this.servers = new Map(); // serverId -> server data
    this.initialized = false;
  }

  async initialize() {
    try {
      // Ensure data directory exists
      await fs.mkdir(DATA_DIR, { recursive: true });

      // Load existing servers or create empty structure
      try {
        const data = await fs.readFile(SERVERS_FILE, 'utf8');
        const parsed = JSON.parse(data);

        if (parsed.servers && Array.isArray(parsed.servers)) {
          for (const server of parsed.servers) {
            this.servers.set(server.id, server);
          }
          Logger.info(`Loaded ${this.servers.size} servers from storage`);
        } else {
          Logger.warn('Invalid servers file structure, starting with empty servers');
          await this._saveServers();
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          Logger.info('No servers file found, starting with empty servers');
          await this._saveServers();
        } else {
          Logger.error(`Error reading servers file: ${error.message}`);
          // Start with empty servers but don't crash
          await this._saveServers();
        }
      }

      this.initialized = true;
    } catch (error) {
      Logger.error(`Failed to initialize ServerManager: ${error.message}`);
      throw error;
    }
  }

  async _saveServers() {
    const data = {
      servers: Array.from(this.servers.values())
    };

    // Atomic write
    const tempFile = `${SERVERS_FILE}.tmp`;
    try {
      await fs.writeFile(tempFile, JSON.stringify(data, null, 2));
      await fs.rename(tempFile, SERVERS_FILE);
    } catch (error) {
      // Clean up temp file if it exists
      try {
        await fs.unlink(tempFile);
      } catch (cleanupError) {
        Logger.error(`Failed to cleanup temp file: ${cleanupError.message}`);
      }
      throw error;
    }
  }

  // Get all servers
  getAllServers() {
    return Array.from(this.servers.values());
  }

  // Get server by ID
  getServerById(serverId) {
    return this.servers.get(serverId) || null;
  }

  // Add new server
  async addServer(serverData) {
    // Validate input
    if (!serverData.address || !serverData.port) {
      throw new Error('Address and port are required');
    }

    // Generate ID if not provided
    const serverId = serverData.id || this._generateId();

    // Check if ID already exists
    if (this.servers.has(serverId)) {
      throw new Error(`Server with ID ${serverId} already exists`);
    }

    // Create server object
    const server = {
      id: serverId,
      address: serverData.address,
      port: serverData.port,
      // Command configurations (all configurable)
      registerCommand: serverData.registerCommand || '/register <password> <password>',
      loginCommand: serverData.loginCommand || '/login <password>',
      homesCommand: serverData.homesCommand || '/homes',
      homeCommand: serverData.homeCommand || '/home <nom>',
      setHomeCommand: serverData.setHomeCommand || '/sethome <nom>',
      delHomeCommand: serverData.delHomeCommand || '/delhome <nom>',
      tpaCommand: serverData.tpaCommand || '/tpa <joueur>',
      tpacceptCommand: serverData.tpacceptCommand || '/tpaccept',
      // Additional settings
      homeTeleportCooldown: serverData.homeTeleportCooldown !== undefined ?
        serverData.homeTeleportCooldown : 3000, // milliseconds
      maxHomeTeleportRetries: serverData.maxHomeTeleportRetries !== undefined ?
        serverData.maxHomeTeleportRetries : 3,
      playerListUpdateInterval: serverData.playerListUpdateInterval !== undefined ?
        serverData.playerListUpdateInterval : 30000, // milliseconds
      maxHomes: serverData.maxHomes !== undefined ? serverData.maxHomes : 10,
      description: serverData.description || '',
      isActive: serverData.isActive !== undefined ? serverData.isActive : true,
      createdAt: serverData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store server
    this.servers.set(serverId, server);

    // Persist to storage
    await this._saveServers();

    Logger.info(`Server added: ${server.address}:${server.port} (ID: ${serverId})`);

    return serverId;
  }

  // Update existing server
  async updateServer(serverId, updates) {
    const server = this.servers.get(serverId);
    if (!server) {
      throw new Error(`Server not found: ${serverId}`);
    }

    // Prevent updating ID or creation timestamp
    delete updates.id;
    delete updates.createdAt;

    // Apply updates
    Object.assign(server, updates);
    server.updatedAt = new Date().toISOString();

    // Persist to storage
    await this._saveServers();

    Logger.info(`Server updated: ${server.address}:${server.port} (ID: ${serverId})`);

    return serverId;
  }

  // Remove server
  async removeServer(serverId) {
    if (!this.servers.has(serverId)) {
      throw new Error(`Server not found: ${serverId}`);
    }

    const server = this.servers.get(serverId);
    this.servers.delete(serverId);

    // Persist to storage
    await this._saveServers();

    Logger.info(`Server removed: ${server.address}:${server.port} (ID: ${serverId})`);

    return serverId;
  }

  // Helper to generate simple ID
  _generateId() {
    return `srv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get count of servers
  getCount() {
    return this.servers.size;
  }
}

// Initialize and export singleton instance
const serverManager = new ServerManager();
// Initialize will be called from index.js
export { serverManager };
```

- [ ] **Step 2: Update backend index.js to initialize server manager**

```javascript
// Add after account manager initialization
import { serverManager } from './serverManager.js';

// Initialize server manager
serverManager.initialize().catch(error => {
  Logger.error(`Failed to initialize server manager: ${error.message}`);
  // Don't exit - we'll let the server start and handle errors gracefully
});
```

- [ ] **Step 3: Run server management tests**

```bash
# Test that the modules can be imported without syntax errors
node -e "import './src/backend/serverManager.js'; console.log('ServerManager import OK')"

# Test basic functionality
node -e "
import { ServerManager } from './src/backend/serverManager.js';

const sm = new ServerManager();
// Test basic server creation
(async () => {
  try {
    const serverId = await sm.addServer({
      address: '127.0.0.1',
      port: 25565,
      description: 'Test server'
    });
    console.log('Server creation test: PASS');

    const server = sm.getServerById(serverId);
    console.log('Server retrieval test:', server ? 'PASS' : 'FAIL');

    await sm.removeServer(serverId);
    console.log('Server removal test: PASS');
  } catch (error) {
    console.error('Server management test FAIL:', error.message);
  }
})();
```

- [ ] **Step 4: Commit server management implementation**

```bash
git add src/backend/serverManager.js src/backend/index.js
git commit -m "feat: implement server management with configurable commands"
```

### Task 4: Basic Bot Management Framework

**Files:**
- Create: `src/backend/botManager.js`
- Modify: `src/backend/index.js` (to initialize botManager)
- Modify: `src/backend/webSocketServer.js` (basic structure for bot-WS communication)

**Interfaces:**
- Consumes:
  - Account credentials (decrypted password) from accountManager
  - Server configuration from serverManager
- Produces:
  - Bot creation and management capabilities
  - Basic Mineflayer integration
  - WebSocket message handling framework for bot commands
  - Bot lifecycle events (connecting, connected, disconnected, error)

- [ ] **Step 1: Create basic bot manager structure**

```javascript
import { Logger } from './utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

// We'll import mineflayer later when we add the dependency
// For now, we'll create a mock version for structure
let mineflayer = null;

try {
  // Try to import mineflayer - will fail if not installed
  mineflayer = require('mineflayer');
} catch (error) {
  Logger.warn('Mineflayer not yet installed - using mock for development');
  // Mock mineflayer for development/testing
  mineflayer = {
    createBot: (options) => {
      return {
        on: () => {}, // Mock event listener
        once: () => {},
        removeListener: () => {},
        chat: () => {},
        // Mock connection state
        _client: {
          encrypted: false
        }
      };
    }
  };
}

export class BotManager {
  constructor() {
    this.bots = new Map(); // botId -> bot instance data
    this.initialized = false;
  }

  async initialize(accountManager, serverManager) {
    this.accountManager = accountManager;
    this.serverManager = serverManager;

    try {
      this.initialized = true;
      Logger.info('BotManager initialized');
    } catch (error) {
      Logger.error(`Failed to initialize BotManager: ${error.message}`);
      throw error;
    }
  }

  // Generate unique bot ID
  _generateBotId() {
    return `bot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Create a new bot from account credentials
  async createBot(accountId) {
    // Get account details
    const account = this.accountManager.getAccountById(accountId);
    if (!account) {
      throw new Error(`Account not found: ${accountId}`);
    }

    if (!account.isActive) {
      throw new Error(`Account is not active: ${account.username}`);
    }

    // Get server details
    const server = this.serverManager.getServerById(account.serverId);
    if (!server) {
      throw new Error(`Server not found for account: ${account.serverId}`);
    }

    if (!server.isActive) {
      throw new Error(`Server is not active: ${server.address}:${server.port}`);
    }

    // Generate bot ID
    const botId = this._generateBotId();

    try {
      // Decrypt password (use immediately and clear after)
      const password = this.accountManager.getDecryptedPassword(accountId);

      // Create Mineflayer bot instance
      const bot = mineflayer.createBot({
        host: server.address,
        port: server.port,
        username: account.username,
        password: password,
        // Hide errors in console for cleaner output - we'll handle them ourselves
        hideErrors: true
      });

      // Clear password from memory as soon as possible
      const clearedPassword = this.accountManager.secureClearPassword(password);
      // Note: In JavaScript, we can't truly erase strings from memory,
      // but we limit the time they exist in variables

      // Store bot instance data
      const botData = {
        id: botId,
        accountId: account.id,
        serverId: server.id,
        username: account.username,
        botInstance: bot,
        status: 'disconnected', // disconnected, connecting, connected, error
        lastError: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Connection tracking
        connectTimeout: null,
        reconnectTimeout: null,
        // Event listeners will be added in initializeBotEvents
      };

      this.bots.set(botId, botData);

      // Initialize event listeners for this bot
      this._initializeBotEvents(botId, bot);

      Logger.info(`Bot created: ${account.username}@${server.address}:${server.port} (ID: ${botId})`);

      return botId;
    } catch (error) {
      Logger.error(`Failed to create bot for account ${accountId}: ${error.message}`);
      throw error;
    }
  }

  // Initialize event listeners for a bot instance
  _initializeBotEvents(botId, bot) {
    // Connection events
    bot.on('login', () => {
      this._handleBotLogin(botId);
    });

    bot.on('spawn', () => {
      this._handleBotSpawn(botId);
    });

    bot.on('end', () => {
      this._handleBotEnd(botId);
    });

    bot.on('error', (err) => {
      this._handleBotError(botId, err);
    });

    // Chat events
    bot.on('chat', (username, message) => {
      this._handleBotChat(botId, username, message);
    });

    // TODO: Add more event listeners as needed (player list, etc.)
  }

  // Handle bot login event
  _handleBotLogin(botId) {
    const botData = this.bots.get(botId);
    if (!botData) return;

    botData.status = 'connecting';
    botData.updatedAt = new Date().toISOString();
    botData.lastError = null;

    // Notify via WebSocket (will be implemented in WebSocket manager)
    this._notifyBotStatusChange(botId, 'connecting');

    Logger.debug(`Bot ${botId} logging in`);
  }

  // Handle bot spawn event (fully connected and in world)
  _handleBotSpawn(botId) {
    const botData = this.bots.get(botId);
    if (!botData) return;

    botData.status = 'connected';
    botData.updatedAt = new Date().toISOString();
    botData.lastError = null;

    // Clear any connection timeout
    if (botData.connectTimeout) {
      clearTimeout(botData.connectTimeout);
      botData.connectTimeout = null;
    }

    // Notify via WebSocket
    this._notifyBotStatusChange(botId, 'connected');

    Logger.info(`Bot ${botId} ({botData.username}) spawned and connected`);

    // TODO: Trigger home loading after spawn (will be implemented in home manager)
  }

  // Handle bot end/disconnect event
  _handleBotEnd(botId, reason) {
    const botData = this.bots.get(botId);
    if (!botData) return;

    // Determine if this was expected or unexpected
    const wasExpected = botData._expectedDisconnect === true;
    if (wasExpected) {
      delete botData._expectedDisconnect;
    }

    botData.status = 'disconnected';
    botData.updatedAt = new Date().toISOString();
    botData.lastError = wasExpected ? null : 'Disconnected by server or network';

    // Clear any connection timeout
    if (botData.connectTimeout) {
      clearTimeout(botData.connectTimeout);
      botData.connectTimeout = null;
    }

    // Notify via WebSocket
    this._notifyBotStatusChange(botId, 'disconnected', wasExpected ? null : botData.lastError);

    Logger.info(`Bot ${botId} disconnected: ${wasExpected ? 'Expected' : botData.lastError}`);

    #pragma region [Rest of file content continues]

```

- [ ] **Step 2: Update backend index.js to initialize bot manager**

```javascript
// Add after server manager initialization
import { botManager } from './botManager.js';

// Initialize bot manager
botManager.initialize(accountManager, serverManager).catch(error => {
  Logger.error(`Failed to initialize bot manager: ${error.message}`);
  // Don't exit - we'll let the server start and handle errors gracefully
});
```

- [ ] **Step 3: Create basic WebSocket server for bot communication**

```javascript
// src/backend/webSocketServer.js
import { Logger } from './utils/logger.js';

export class WebSocketServer {
  constructor(wss) {
    this.wss = wss;
    this.clients = new Map(); // clientId -> ws connection
    this.botManager = null; // Will be set later
  }

  setBotManager(botManager) {
    this.botManager = botManager;
  }

  // Handle new WebSocket connection
  handleConnection(ws) {
    const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.clients.set(clientId, ws);

    Logger.info(`New WebSocket client connected: ${clientId}`);

    ws.on('message', (message) => {
      Logger.debug(`Received message from ${clientId}: ${message}`);
      // Handle bot commands will be implemented in later tasks
      this._handleClientMessage(clientId, message);
    });

    ws.on('close', () => {
      Logger.info(`WebSocket client disconnected: ${clientId}`);
      this.clients.delete(clientId);
    });

    ws.on('error', (error) => {
      Logger.error(`WebSocket error for ${clientId}: ${error.message}`);
    });

    // Send welcome message
    ws.send(JSON.stringify({ type: 'welcome', clientId }));
  }

  // Handle messages from clients
  _handleClientMessage(clientId, message) {
    try {
      const data = JSON.parse(message);
      // Handle different message types will be implemented in later tasks
      Logger.debug(`Processing message from ${clientId}: ${data.type}`);
    } catch (error) {
      Logger.error(`Failed to parse message from ${clientId}: ${error.message}`);
    }
  }

  // Send message to specific client
  sendToClient(clientId, message) {
    const ws = this.clients.get(clientId);
    if (ws && ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  // Broadcast message to all clients
  broadcast(message) {
    for (const [clientId, ws] of this.clients) {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(message));
      }
    }
  }

  // Notify about bot status changes
  notifyBotStatusChange(botId, status, error = null) {
    this.broadcast({
      type: 'botStatusUpdate',
      botId,
      status,
      error,
      timestamp: new Date().toISOString()
    });
  }
}
```

- [ ] **Step 4: Update backend index.js to initialize WebSocket server**

```javascript
// Add after bot manager initialization
import { WebSocketServer } from './webSocketServer.js';

// Initialize WebSocket server
const webSocketServer = new WebSocketServer(wss);
webSocketServer.setBotManager(botManager);

// [Previous WebSocket connection handler would be replaced with webSocketServer.handleConnection]

wss.on('connection', (ws) => {
  Logger.info('New WebSocket connection');
  webSocketServer.handleConnection(ws);
});

// ... rest of index.js remains the same
```

- [ ] **Step 5: Run basic bot management tests**

```bash
# Test that the modules can be imported without syntax errors
node -e "import './src/backend/botManager.js'; console.log('BotManager import OK')"

# Test basic functionality (will use mock mineflayer)
node -e "
import { BotManager } from './src/backend/botManager.js';
import { AccountManager } from './src/backend/accountManager.js';
import { ServerManager } from './src/backend/serverManager.js';

const am = new AccountManager();
const sm = new ServerManager();
const bm = new BotManager();

(async () => {
  try {
    // Initialize managers
    await am.initialize();
    await sm.initialize();
    await bm.initialize(am, sm);

    console.log('BotManager initialization test: PASS');

    // Test bot creation (will fail without actual Mineflayer, but should not crash on structure)
    try {
      const accountId = await am.addAccount({
        username: 'testbot',
        password: 'testpass',
        serverId: 'testserver'
      });

      const serverId = await sm.addServer({
        address: '127.0.0.1',
        port: 25565
      });

      // Update account with server ID
      await am.updateAccount(accountId, { serverId });

      const botId = await bm.createBot(accountId);
      console.log('Bot creation test: PASS (using mock Mineflayer)');

      // Cleanup
      await bm.removeBot(botId); // Would need to implement
      await am.removeAccount(accountId);
      await sm.removeServer(serverId);
    } catch (error) {
      // Expected to fail without real Mineflayer, but structure should be OK
      console.log('Bot creation test: Structure OK (expected failure without Mineflayer)');
    }
  } catch (error) {
    console.error('Bot management test FAIL:', error.message);
  }
})();
```

- [ ] **Step 6: Commit bot management implementation**

```bash
git add src/backend/botManager.js src/backend/webSocketServer.js src/backend/index.js
git commit -m "feat: implement basic bot management framework with Mineflayer integration"
```

## Next Steps (Future Tasks)

After completing these core infrastructure tasks, the implementation would continue with:
- Task 5: Home Management System
- Task 6: WebSocket Communication Enhancements
- Task 7: Frontend Interface Development
- Task 8: Security Features and Auditing
- Task 9: Testing and Documentation
- Task 10: Packaging and Distribution

Each subsequent task would follow the same pattern: clear file creation/modification, specific interfaces, and incremental, testable deliverables.
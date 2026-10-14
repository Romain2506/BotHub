# BotHub

**Local Minecraft bot manager for offline/cracked accounts, with a modern web interface.**
*Gestionnaire local de bots Minecraft pour comptes offline/crack, avec interface web moderne.*

Run multiple Minecraft bots from one dashboard: connect them to any server, chat, teleport to saved homes, auto-accept teleport requests from trusted players, and keep them from idling out with anti-AFK — all from your browser, no account data leaving your machine.

> **Note:** BotHub is built and tested for the **2b2fr.org** server. It may work on other servers if the per-server commands are adapted in the UI, but this is untested and not guaranteed.
> *BotHub est développé et testé pour le serveur **2b2fr.org**. Il peut éventuellement fonctionner sur d'autres serveurs en adaptant les commandes par serveur dans l'interface, mais ce n'est pas testé ni garanti.*

---

## 🇬🇧 English

### Features

- **Multi-account, multi-server** — manage any number of offline/cracked Minecraft accounts and server profiles from a single screen.
- **Live control center** — connect/disconnect bots, watch the player list and chat in real time, and send commands or messages directly to a bot.
- **Homes** — detects a bot's homes on the server (`/homes` or your server's equivalent) and lets you teleport with one click. Each home can have its own note/description, visible on hover even when the account is offline.
- **Whitelist & auto-teleport** — players on the whitelist are auto-accepted (`/tpa` → auto `/tpaccept`) and can message the bot privately: `!tp`, `!homes`, `!<home name>`.
- **Anti-AFK** — configurable sneak, jump and/or chat message on an interval, so bots aren't kicked for inactivity.
- **Auto-reconnect** — configurable initial delay, max delay and max attempts if a bot's connection drops.
- **Per-server commands** — login, homes-list and home-teleport commands (and the regex to parse the homes list) are fully customizable per server, for servers that don't use vanilla-like commands.
- **Encrypted account storage** — passwords are encrypted at rest (AES-256-GCM) and never appear in logs or sent back to the browser.
- **Bilingual UI** — French / English, switchable instantly from Settings, plus a light/dark theme.
- **No external dependencies** — no database, no cloud account; everything is stored in local JSON files under `data/`.

### Requirements

- [Node.js](https://nodejs.org/) 18 or later (LTS recommended)
- Windows, macOS or Linux

### Installation & usage

1. Download or clone this repository.
2. Start the app:
   - **Windows**: double-click `start.bat`
   - **macOS/Linux**: run `./start.sh` (or `bash start.sh`)

   The startup script installs dependencies automatically on first run (`npm install`) and then starts the server. Your browser opens automatically on `http://127.0.0.1:8080`.

   Alternatively, with Node.js already set up:
   ```bash
   npm install
   npm start      # production
   npm run dev    # auto-restart on file changes (nodemon)
   ```

3. In the web UI:
   - **Accounts & servers**: add your Minecraft account(s) (username, optional password for servers that require `/login`) and your server(s) (address, port, version).
   - **Control center**: connect an account to a server, watch it live, chat, teleport to a home.
   - **Settings**: language, theme, reconnection behaviour, anti-AFK, whitelist toggle.
   - The whitelist tab lets you add player names that get auto-accepted when they request a teleport to a bot.

4. A full reset ("danger zone" in Settings) wipes all accounts, servers, whitelist entries, home data and settings back to defaults — it does not touch your Minecraft accounts themselves, only BotHub's local data.

### Project structure

```
src/backend/    Node.js server: HTTP API, WebSocket, bot management (Mineflayer), local JSON storage
src/frontend/   Static web UI (vanilla HTML/CSS/JS, no build step)
data/           Local JSON storage (accounts, servers, settings, whitelist, homes) — created automatically
```

### Security notes

- Account passwords are encrypted locally with AES-256-GCM; the key never leaves your machine.
- The HTTP/WebSocket server only binds to `127.0.0.1` by default — it is not exposed to your network.
- Passwords are never sent back to the browser or written to logs.

### License

MIT

---

## 🇫🇷 Français

### Fonctionnalités

- **Multi-comptes, multi-serveurs** — gère un nombre illimité de comptes Minecraft offline/crack et de profils de serveur depuis un seul écran.
- **Centre de contrôle en direct** — connecte/déconnecte les bots, suis la liste des joueurs et le chat en temps réel, envoie des commandes ou messages directement au bot.
- **Homes** — détecte les homes d'un bot sur le serveur (`/homes` ou l'équivalent défini pour ce serveur) et permet de s'y téléporter en un clic. Chaque home peut avoir sa propre description, visible au survol même quand le compte est hors ligne.
- **Liste blanche & téléportation automatique** — les joueurs en liste blanche sont acceptés automatiquement (`/tpa` → `/tpaccept` auto) et peuvent envoyer des messages privés au bot : `!tp`, `!homes`, `!<nom du home>`.
- **Anti-AFK** — se baisser, sauter et/ou envoyer un message dans le chat à intervalle configurable, pour éviter une expulsion pour inactivité.
- **Reconnexion automatique** — délai initial, délai maximum et nombre de tentatives configurables en cas de coupure.
- **Commandes par serveur** — commandes de connexion, de liste des homes et de téléportation (ainsi que la regex d'analyse de la liste des homes) entièrement personnalisables par serveur, pour les serveurs qui n'utilisent pas les commandes vanilla.
- **Stockage des comptes chiffré** — les mots de passe sont chiffrés au repos (AES-256-GCM) et n'apparaissent jamais dans les logs ni renvoyés au navigateur.
- **Interface bilingue** — français / anglais, changement instantané depuis les Réglages, plus un thème clair/sombre.
- **Aucune dépendance externe** — pas de base de données, pas de compte cloud ; tout est stocké dans des fichiers JSON locaux sous `data/`.

### Prérequis

- [Node.js](https://nodejs.org/) 18 ou supérieur (LTS recommandé)
- Windows, macOS ou Linux

### Installation et utilisation

1. Télécharge ou clone ce dépôt.
2. Lance l'application :
   - **Windows** : double-clique sur `start.bat`
   - **macOS/Linux** : exécute `./start.sh` (ou `bash start.sh`)

   Le script installe automatiquement les dépendances au premier lancement (`npm install`) puis démarre le serveur. Le navigateur s'ouvre automatiquement sur `http://127.0.0.1:8080`.

   Ou, avec Node.js déjà configuré :
   ```bash
   npm install
   npm start      # production
   npm run dev    # redémarrage auto à chaque modification (nodemon)
   ```

3. Dans l'interface :
   - **Comptes & serveurs** : ajoute ton/tes compte(s) Minecraft (pseudo, mot de passe optionnel pour les serveurs exigeant un `/login`) et ton/tes serveur(s) (adresse, port, version).
   - **Centre de contrôle** : connecte un compte à un serveur, suis-le en direct, chat, téléporte-toi à un home.
   - **Réglages** : langue, thème, comportement de reconnexion, anti-AFK, activation de la liste blanche.
   - L'onglet liste blanche permet d'ajouter des pseudos qui seront acceptés automatiquement lorsqu'ils demandent à se téléporter sur un bot.

4. Une réinitialisation complète ("zone dangereuse" dans les Réglages) efface tous les comptes, serveurs, entrées de liste blanche, données de homes et réglages — cela ne touche pas à tes comptes Minecraft eux-mêmes, uniquement aux données locales de BotHub.

### Structure du projet

```
src/backend/    Serveur Node.js : API HTTP, WebSocket, gestion des bots (Mineflayer), stockage JSON local
src/frontend/   Interface web statique (HTML/CSS/JS vanilla, aucune étape de build)
data/           Stockage JSON local (comptes, serveurs, réglages, liste blanche, homes) — créé automatiquement
```

### Sécurité

- Les mots de passe des comptes sont chiffrés localement en AES-256-GCM ; la clé ne quitte jamais ta machine.
- Le serveur HTTP/WebSocket n'écoute que sur `127.0.0.1` par défaut — il n'est pas exposé sur le réseau.
- Les mots de passe ne sont jamais renvoyés au navigateur ni écrits dans les logs.

### Licence

MIT

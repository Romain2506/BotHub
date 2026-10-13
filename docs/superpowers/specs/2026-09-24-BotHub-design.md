# Conception de BotHub - Gestionnaire de bots Minecraft

**Date** : 2026-09-24  
**Version** : 1.0  
**Statut** : En révision  

## 1. Vue d'ensemble

BotHub est une application locale permettant de gérer plusieurs bots Minecraft en comptes offline/crack via une interface web moderne. L'application fonctionne avec Node.js + Mineflayer pour les bots et une interface HTML/CSS/JavaScript pour le contrôle.

**Objectif principal** : Offrir une installation et une utilisation triviales (Node.js → télécharger → lancer `start.bat`) tout en fournissant une gestion puissante et sécurisée de plusieurs bots simultanés.

## 2. Architecture

### 2.1 Principe général
Architecture modulaire monolithique : un seul processus Node.js orchestrant tous les services via des modules clairement séparés, communiquant principalement par appels de fonctions directs et événements internes légers lorsque pertinent.

### 2.2 Modules principaux

#### `src/backend/index.js` - Point d'entrée
- Initialise tous les services dans l'ordre logique
- Lance le serveur HTTP servant le frontend
- Démarre le serveur WebSocket pour les communications temps réel
- Prépare les gestionnaires de bots, comptes, homes, etc.

#### `src/backend/botManager.js` - Gestion des bots
- Crée et détruit des instances Mineflayer isolées
- Gère le cycle de connexion/déconnexion de chaque bot
- Route les événements Mineflayer vers le WebSocket avec le `botId` associé
- Gère la reconnexion automatique configurable par bot
- Isole complètement les erreurs : un bot qui plante n'affecte pas les autres

#### `src/backend/accountManager.js` - Gestion des comptes et serveurs
- Charge/sauvegarde les comptes (`data/accounts.json`) avec chiffrement des mots de passe
- Charge/sauvegarde les configurations de serveurs (`data/servers.json`)
- Fournit des méthodes sécurisées pour ajouter/mettre à jour/supprimer un compte
- Jamais les mots de passe en clair dans les logs, événements ou réponses frontend

#### `src/backend/homeManager.js` - Gestion des homes
- Charge les homes d'un bot dès sa connexion réussie (via `/homes` configuré)
- Gère les opérations sur les homes : téléportation, renommage, création, suppression
- Applique le cooldown et la vérification de mouvement/dégâts lors des téléportations
- Sauvegarde/charge les homes découverts localement (`data/homes.json`)
- Affiche les coordonnées des homes uniquement lorsqu'elles sont réellement disponibles depuis le serveur

#### `src/backend/webSocketServer.js` - Communication temps réel
- Établit et maintient des connexions WebSocket avec le frontend sur `127.0.0.1:port` (localhost uniquement)
- Route les messages entrants du frontend vers les bons modules (avec validation stricte)
- Diffuse les événements des bots vers le frontend approprié (filtrage obligatoire par `botId`)
- Ne supporte pas le protocole `file://` en fonctionnement normal - utilisation standard via `http://localhost:<port>`
- Jamais d'exposition externe : écoute exclusivement sur localhost

#### `src/backend/utils/` - Fonctions utilitaires partagées
- `logger.js` : Journalisation centralisée avec filtrage préalable des données sensibles
- `config.js` : Chargement de la configuration depuis `data/settings.json`
- `helpers.js` : Utilitaires réels nécessaires (génération d'ID sécurisé, formatage, etc.)

#### `src/frontend/` - Interface utilisateur
- `index.html` : Layout de base avec 3 onglets (Centre de contrôle, Comptes & serveurs, Paramètres)
- `style.css` : Design responsive, thème sombre/claire basé sur préférence utilisateur, respect de `prefers-reduced-motion`
- `app.js` : Logique frontend : connexion WebSocket, mise à jour dynamique strictement séparée par `botId`, envoi commandes

#### `src/data/` - Stockage local (jamais commit-té)
- `accounts.json` : Comptes utilisateur (mots de passe chiffrés, jamais en clair)
- `servers.json` : Configurations de serveurs
- `settings.json` : Préférences utilisateur
- `homes.json` : Homes découverts par les bots (avec indication de disponibilité des coordonnées)
- `logs/` : Fichiers de log tournants avec filtrage préalable des données sensibles
- Fichiers `.example` fournis pour l'installation initiale

### 2.3 Stockage et sécurité des données
- **Aucune base de données externe** : tout stockage en fichiers JSON locaux
- **Création automatique** : tous les fichiers et dossiers de données générés au premier lancement si manquants
- **Chiffrement des mots de passe** : AES-256-GCM avec IV aléatoire et tag d'authentification obligatoire
  - Clé de chiffrement stockée dans `.secret` (généré automatiquement au premier lancement)
  - En cas d'absence ou de corruption de `.secret` : l'application ne génère pas de nouvelle clé silencieusement ; elle conserve les fichiers chiffrés existants, crée un état de secours vide et avertit clairement l'utilisateur pour éviter toute perte silencieuse de données
  - Les mots de passe ne sont déchiffrés que brièvement en mémoire lorsqu nécessaires pour une connexion Mineflayer
  - Aucune fuite de mot de passe dans les logs, événements WebSocket ou réponses frontend (filtrage systématique préalable)
- **Écritures JSON atomiques** : écriture dans fichier temporaire puis remplacement atomique pour éviter la corruption en cas d'arrêt pendant l'écriture
- **Gestion des fichiers corrompus** : 
  * Conservation du fichier corrompu tel quel
  * Création d'un état de secours (structure vide sécurisée) en parallèle
  * Avertissement clair de l'utilisateur permettant de décider de la marche à suivre
  * Aucune écrasement automatique avec fichier vide pour éviter perte silencieuse de données
- **Sauvegardes limitées** : conservation raisonnable des `.bak` (ex: 5 dernières versions) pour éviter l'accumulation infinie

### 2.4 Communication et temps réel
- **WebSocket mono-utilisateur** : connexion sécurisée entre frontend et backend sur `ws://127.0.0.1:port`
- **Fonctionnement standard** : utilisation via `http://localhost:<port>` en conditions normales
- **Support file://** : ajouté uniquement si nécessaire pour des cas d'utilisation spécifiques, pas comme fonctionnement principal
- **Validation d'origine** : acceptation souple des variantes `localhost`/`127.0.0.1` pour usage local
- **Aucun framework frontend** : HTML5/CSS3/JavaScript vanilla uniquement
- **État strictement séparé par bot** : aucun événement d'un bot ne modifie l'affichage d'un autre bot (filtrage obligatoire par `botId` dans le frontend)

## 3. Fonctionnalités clés

### 3.1 Gestion des comptes et serveurs
- Ajout de plusieurs comptes avec pseudo, mot de passe, serveur associé, description
- Activation/désactivation des comptes
- Configuration complète par serveur :
  * Adresse/IP et port
  * Commandes utilisées pour inscription/connexion (`/register`, `/login`)
  * Commandes homes (`/homes`, `/sethome <nom>`, `/delhome <nom>`)
  * Commandes téléportation joueur (`/tpa <joueur>`, `/tpaccept`)
  * Cooldown entre téléportations/home
  * Limite maximale de homes
  * Toutes les commandes entièrement configurables par serveur
  * Aucune fuite de mot de passe dans l'interface après enregistrement (masquage complet)

### 3.2 Centre de contrôle (tableau de bord)
Pour chaque bot :
- Statut : déconnecté / connexion / connecté / erreur
- Serveur actuel et pseudo
- Boutons : connecter/déconnecter/reconnecter, AFK, retour au serveur, se téléporter au bot
- Affichage temps réel :
  * Joueurs actuellement connectés (liste par bot, mise à jour en temps réel via événements `playerJoined`/`playerLeft` + resync périodique configurable)
  * Chat Minecraft complet avec distinction visuelle claire entre messages reçus et commandes/messages envoyés par l'utilisateur
  * Zone d'envoi de commandes/messages dédiée dans le panneau de chaque bot
  * Logs importants du bot et erreurs de connexion (filtrage préalable des données sensibles)
- Gestion des homes :
  * Récupération automatique à la connexion réussie (via `/homes` configuré)
  * Affichage avec nom, description (si disponible), coordonnées (si disponibles et réellement fournies par le serveur)
  * Téléportation sécurisée avec :
    * Enregistrement de la position de référence avant envoi de `/home <nom>`
    * Surveillance pendant la phase d'attente avec détection fine :
      - Mouvement anormal : déplacement rapide non lié à l'exécution de `/home` (ex: déplacement lateral, saut)
      - Mouvement de téléportation reconnu : changement de position correspondant à l'exécution de `/home` (généralement vers les coordonnées du home)
      - Séparation claire des dégâts (via événements Mineflayer `damage`), déconnexion et changement de dimension
    * Le système ne considère comme échec qu'un mouvement anormal, des dégâts, une déconnexion ou un changement de dimension pendant la phase d'attente
  * Cooldown configurable par serveur (affichage du temps restant dans l'interface)
  * Nombre maximal de tentatives configurable par serveur (avec séquence : tentative → échec → attente → nouvelle tentative jusqu'à la limite)
  * File d'attente optionnelle préférée simple (une opération sensible active à la fois par bot ; nouvelle demande refusée avec explication ou ajoutée à la file uniquement si l'utilisateur le demande explicitement)
  * Boutons : Téléporter, Renommer, Modifier, Supprimer, Remplacer
- Téléportation vers les joueurs :
  * Récupération de la liste des joueurs connectés (indépendante pour chaque bot)
  * Sélection d'un joueur et exécution de `/tpa <joueur>`
  * Gestion automatique de `/tpaccept` lorsque nécessaire
  * Bouton pour se téléporter vers le bot (lorsque le serveur le permet et configuré)
- Aucune téléportation ou action de gameplay importante déclenchée automatiquement : toutes nécessitent une action explicite de l'utilisateur

### 3.3 Survie et sécurité du bot
- Détection des dégâts via événements Mineflayer `damage` appropriés (pas de simple comparaison d'état)
- Détection des mobs hostiles proches
- Défense automatique configurable contre les attaques (désactivable)
- Évitement des actions dangereuses inutiles
- Reconnexion automatique configurable par combinaison (botId, serverId) :
  * Délai initial configurable
  * Délai maximal entre tentatives configurable
  * Nombre maximal de tentatives configurable (`-1` = infinie)
  * Bouton de reconnexion manuelle toujours disponible
- Lorsqu'un utilisateur déclenche une déconnexion volontaire :
  * Désactivation temporaire de la reconnexion automatique pour ce bot
  * Réactivation possible uniquement via action explicite de l'utilisateur (ex: bouton "Activer reconnexion auto")
- La reconnexion utilise un backoff exponentiel avec jitter pour éviter les effets de retombée
- Aucune action de gameplay importante (téléportation, modification de home, etc.) déclenchée par la reconnexion automatique

### 3.4 Interface utilisateur
- **Trois onglets principaux** :
  1. Centre de contrôle : gestion des bots, chat, joueurs, homes, commandes, téléportations
  2. Comptes & serveurs : gestion des comptes, serveurs et commandes spécifiques à chaque serveur
  3. Paramètres : thème sombre/clair, français/anglais, limite de homes, cooldowns, reconnexion automatique, défense contre les mobs, paramètres généraux
- **Responsive** : utilisable sur différentes tailles d'écran
- **Professionnelle** : design sobre inspiré des dashboards de gestion
- **Accessibilité** : respect strict de `prefers-reduced-motion`
- **Animations très légères** : uniquement lorsqu'elles améliorent la compréhension de l'interface (ex: transition de statut, indicateur de chargement subtil)

### 3.5 Fonctionnalités utiles supplémentaires
- Reconnexion automatique configurable par bot/serveur (avec tous les paramètres ci-dessus)
- Démarrage automatique de certains bots (configuration dans `settings.json`)
- Statut détaillé de chaque bot (état de connexion, latence approximative, etc.)
- Logs filtrables par niveau et par bot (avec filtrage préalable des données sensibles)
- Historique des actions importantes (connexion, déconnexion, actions critiques)
- Sauvegarde/import/export de configuration (via copie du dossier `/data`)
- Bouton « reconnecter tous les bots » (respecte la configuration individuelle de chaque bot)
- Bouton « déconnecter tous les bots » (avec confirmation utilisateur)
- Notifications dans l'interface lorsqu'un bot se déconnecte ou rencontre une erreur
- Possibilité d'affecter plusieurs bots au même serveur
- Validation stricte des commandes reçues du frontend pour empêcher les entrées malformées ou les injections applicatives
- Aucune limitation artificielle sur les commandes Minecraft légitimes depuis le panneau du bot

## 4. Choix techniques justifiés

### 4.1 Backend : Node.js + Mineflayer
- **Node.js LTS** : choisi pour sa stabilité, son support à long terme et sa large adoption (version spécifique à déterminer lors de l'implémentation initiale)
- **Mineflayer** : bibliothèque la plus mature et complète pour contrôler des bots Minecraft en JavaScript/Node.js
  - **Version fixe et testée** : le plan d'implémentation prévoira de vérifier la compatibilité avec la version Minecraft ciblée, puis d'utiliser une version connue et stabilisée pour BotHub (pas de dépendance flottante qui changerait automatiquement sans contrôle)
  - La version exacte utilisée sera documentée dans le README et restera fixe entre les mises à jour mineures de BotHub pour garantir la reproducibilité
- **Aucun framework backend inutile** : Node.js natif ou Express léger selon les besoins réels
- **WebSocket natif** (`ws` module) : pour les communications temps réel efficaces et à faible latence

### 4.2 Frontend : HTML5/CSS3/JS vanilla
- **Aucun framework** : conformément à la demande de simplicité et de légèreté
- **CSS3 pur** : utilisation des variables CSS pour les thèmes sombre/claire
- **Layout moderne** : Flexbox et Grid pour un design responsive sans framework
- **Animations très légères** : uniquement lorsqu'elles améliorent la compréhension de l'interface, en respectant strictement `prefers-reduced-motion`
- **JavaScript ES2020** : modules, async/await, etc. pour une codebase moderne sans transpilation

### 4.3 Sécurité et confidentialité
- **Protection des mots de passe** : chiffrement local (AES-256-GCM) comme défense raisonnable contre l'exposition accidentelle ou la lecture directe des fichiers
  - Limites clairement documentées : le chiffrement ne résiste pas à un attaquant ayant accès à la machine et au fichier `.secret`
  - Aucune promesse irréaliste de destruction garantie en JavaScript : les variables contenant les mots de passe sont overwrittent après utilisation pour limiter leur présence en mémoire
  - Filtrage systématique préalable dans tous les points de sortie (logs, WebSocket, frontend) pour garantir l'absence de mot de passe
- **Isolation des bots** : chaque instance Mineflayer complètement indépendante dans sa propre mémoire
- **Validation des entrées** : schéma strict côté application pour prévenir les commandes malformées et les injections, sans limiter les commandes Minecraft légitimes
- **Logs équilibrés** : 
  * Conservation des informations techniques utiles au diagnostic (erreurs de connexion, timeouts, réponses serveur structurelles non sensibles)
  * Filtrage préalable obligatoire avant écriture dans les logs pour exclure :
    - Mots de passe (même chiffrés)
    - Clés de chiffrement
    - Credentials et secrets d'authentification
  * Conservation volontaire des positions du bot et des événements liés au bot lui-même lorsqu'utilitaires pour le diagnostic (ex: débogage d'une téléportation échouée)
  * Aucun filtrage arbitraire des informations de jeu utiles au diagnostic simplement parce qu'elles pourraient être considérées comme "sensibles" de manière générale
- **Sécurité du fichier .secret** :
  * Génération automatique et unique lors du premier lancement
  * Lecture sécurisée uniquement lorsque nécessaire pour le déchiffrement des mots de passe
  * En cas d'absence ou de corruption détectée : conservation du fichier existant, création d'état de secours vide, avertissement clair de l'utilisateur (pas de régénération silencieuse qui rendrait irrécupérables les mots de passe existants)
- **Aucune télémétrie** : fonctionnement entièrement local sans envoi de données vers des serveurs externes
- **WebSocket sécurisé** : lié exclusivement à `127.0.0.1` en fonctionnement normal, validation d'origine adaptée à l'usage local mono-utilisateur

### 4.4 Déploiement et installation
- **Installation triviale** :
  1. Installer Node.js LTS (version spécifique recommandée dans le README)
  2. Télécharger/cloner BotHub depuis GitHub
  3. Double-cliquer sur `start.bat` (Windows) ou lancer `start.sh` (macOS/Linux)
  4. Tout démarre automatiquement :
     - Vérification de la présence de Node.js (affichage d'erreur claire si absent)
     - Si `node_modules` absent : message clair indiquant de lancer `npm install` dans le dossier du projet
     - Lancement du backend après vérification des dépendances
     - Confirmation que le serveur HTTP écoute effectivement sur le port configuré
     - Ouverture automatique du navigateur uniquement après cette confirmation
- **Documentation claire** : README avec instructions étape par étape pour non-développeurs
- **Fichiers d'exemple** : `*.json.example` dans `/data` pour montrer la structure attendue
- **Pas de configuration externe requise** : tout configuré via l'interface ou généré automatiquement
- **Architecture préservée** : aucune complexité prématurée ajoutée (pas de base de données externe, Redis, Docker obligatoire, framework frontend, API REST complexe, etc.)
- **Project mantenance** : reste facilement installable par une personne non développeuse

## 5. Flux de données et gestion des événements

### 5.1 Philosophie
- **Appels de fonctions directs** : pour les interactions simples et synchrones (ex: lecture de configuration, validation d'entrée)
- **Events internes légers** : réservés exclusivement aux cas où le découplage apporte une réelle valeur ajoutée (ex: notification de connexion de bot pour déclencher le chargement des homes)
- **Pas d'over-engineering** : évitement délibéré des systèmes événementiels complexes lorsqu'un appel direct suffit

### 5.2 Événements internes clés (exemples)
Tous les événements liés à un bot contiennent systématiquement `botId` en première propriété :
- `bot:created` : lorsqu'un bot est instancié
- `bot:connecting` : début de tentative de connexion
- `bot:connected` : connexion réussie au serveur Minecraft
- `bot:disconnected` : déconnexion (avec raison : erreur, timeout, volontaire)
- `bot:error` : erreur Mineflayer (détails techniques filtrés, jamais de données sensibles)
- `bot:chatMessage` : message de chat reçu (avec distinction envoyée/reçue dans le frontend)
- `bot:playerListUpdate` : liste des joueurs connectés mise à jour (indépendante par bot)
- `bot:homesLoaded` : liste des homes reçue depuis le serveur (avec indication de disponibilité des coordonnées)
- `bot:homeTeleportStart` : début de tentative de téléportation vers un home (après enregistrement position de référence)
- `bot:homeTeleportSuccess` : téléportation réussie (mouvement de téléportation reconnu confirmé)
- `bot:homeTeleportFailed` : téléportation échouée (raison spécifique : mouvement anormal, dégâts, déconnexion, changement de dimension, timeout + nombre de tentatives effectuées)
- `account:added` : nouveau compte enregistré (jamais le mot de passe en clair dans les données ou les événements)
- `account:removed` : compte supprimé
- `server:updated` : configuration de serveur modifiée
- `setting:changed` : préférence utilisateur modifiée

### 5.3 Exemple de flux : téléportation vers un home (avec toutes les sécurités)
1. Frontend → WebSocket : demande de téléportation (validation stricte du schéma d'entrée)
2. WebSocketServer → HomeManager : 
   * Validation de la commande 
   * Vérification du cooldown depuis la dernière téléportation pour ce (botId, serverId)
   * Si cooldown actif : retour immédiat d'erreur via WebSocket
   * Sinon : poursuite de la séquence
3. HomeManager → BotManager : 
   * Préparation de la téléportation 
   * Enregistrement de la position de référence actuelle du bot
4. BotManager : 
   * Publication événement interne `bot:homeTeleportStart` 
   * Notification à HomeManager que la surveillance peut commencer
5. HomeManager → BotManager : commande d'exécution `/home <nom>` pour ce bot spécifique
6. BotManager → Mineflayer : envoi de la commande Minecraft
7. Surveillance en arrière-plan (phase d'attente configurée) :
   * Détection séparée :
     - Mouvement anormal : changement de position rapide non corrélé à l'exécution attendue de `/home` 
     - Mouvement de téléportation : changement de position correspondant aux coordonnées du home cible
     - Dégâts : via événement Mineflayer `damage` immédiat
     - Déconnexion : via événement Mineflayer `end` ou `disconnect`
     - Changement de dimension : via événement Mineflayer approprié
   * Dès détection d'un problème : 
     - Annulation de la séquence en cours
     - Publication événement `bot:homeTeleportFailed` avec raison spécifique
     * Pas de retry automatique dans cette même séquence (respect du choix utilisateur de file d'attente)
8. Gestion du retry (si configuré et si l'utilisateur souhaite poursuivre) :
   * Attente selon le cooldown configuré
   * Nouvelle tentative uniquement si explicitement demandée par l'utilisateur ou si file d'attente activée
   * Respect du nombre maximal de tentatives configuré par serveur
   * À l'atteinte de la limite : arrêt automatique, affichage clair de la raison définitive
9. Résultat → WebSocket → Frontend : 
   * Mise à jour en temps réel de l'état de la téléportation 
   * Pour un succès : événement `bot:homeTeleportSuccess` 
   * Pour un échec : événement `bot:homeTeleportFailed` avec raison et compteur de tentatives
10. Frontend : 
    * Affichage clair du résultat dans l'interface du bot concerné 
    * Aucune confusion possible avec les états des autres bots (filtrage strict par `botId`)
    * Aucune action de gameplay importante déclenchée automatiquement suite au résultat

## 6. Considérations d'implémentation et planification

### 6.1 Approche modulaire
Chaque module peut être développé, testé et débogué relativement indépendamment grâce à :
- Des interfaces claires, bien définies et testables
- Une isolation efficace des responsabilités avec des contrats explicites
- La possibilité de mocker les dépendances lors des tests unitaires
- Des responsabilités clairement séparées empêchant les effets de bord entre modules

### 6.2 Séquencement recommandé (avec étapes testables indépendantes)
Comme demandé, le plan d'implémentation contiendra des étapes permettant de tester chaque fonctionnalité de manière isolée :
1. **Infrastructure de base** : 
   - `index.js` minimal avec serveur HTTP/WebSocket de base
   - Test : serveur répond correctement, connexions WebSocket établies
2. **Gestion des comptes et du chiffrement** : 
   - `accountManager.js` avec création lecture/chiffrement des mots de passe
   - Tests : 
     * Chiffrement/déchiffrement fonctionne correctement 
     * Aucun mot de passe ne apparaît dans les logs ou événements factices 
     * Gestion gracieuse de l'absence/corruption de `.secret`
3. **Gestion des serveurs et de leur configuration** : 
   - Validation des structures de serveur
   - Test : configuration correctement lue/sauvegardée
4. **Infrastructure frontend de base** : 
   - Layout, connexion WebSocket, affichage de statut de connexion simple
   - Test : connexion établie, messages de base transmis
5. **Gestion des bots Mineflayer de base** : 
   - `botManager.js` avec création/connexion simple d'un bot isolé
   - Tests : 
     * Un bot peut se connecter/déconnecter indépendamment 
     * Une erreur dans un bot (ex: timeout de connexion) ne fait pas tomber les autres bots ni l'application 
     * État des bots parfaitement isolé
6. **Gestion des homes de base** : 
   - `homeManager.js` avec récupération `/homes` et affichage simple
   - Tests : 
     * Homes récupérés automatiquement après connexion 
     * Coordonnées affichées uniquement lorsqu'elles sont réellement disponibles 
     * Aucune fuite d'état entre bots
7. **Téléportation simple vers les homes** : 
   - Téléportation basique sans détection de sécurité
   - Test : commande `/home` envoyée et exécutée
8. **Fonctionnalités avancées de téléportation** : 
   - Sécurité complète (détection mouvement anormal/dégâts/etc.), cooldown, retry, file d'attente optionnelle
   - Tests : 
     * Mouvement anormal pendant téléportation détecté comme échec 
     * Mouvement de téléportation reconnu comme succès 
     * Dégâts déclenchent l'annulation immédiate 
     * Cooldown respecté et affiché 
     * Nombre de tentatives limité comme configuré 
     * File d'attente fonctionne selon le choix de l'utilisateur
9. **Gestion du chat et des joueurs** : 
   - Chat complet avec distinction envoyée/reçue 
   - Liste des joueurs mise à jour en temps réel + resync périodique 
   - Tests : 
     * État du chat parfaitement isolé par bot 
     * Liste des joueurs indépendante et correctement mise à jour 
     * Aucun mélange entre bots
10. **Fonctionnalités de survie et sécurité du bot** : 
    - Détection des dégâts via événements appropriés 
    - Reconnexion automatique configurable 
    - Défense automatique configurable 
    - Tests : 
      * Déconnexion volontaire désactive temporairement la reconnexion automatique 
      * Aucune action de gameplay importante déclenchée par la reconnexion 
      * Erreurs isolées par bot 
      * Fonctionnalités de survie ne déclenchent jamais de téléportation ou modification de home automatique
11. **Interface complète par onglets** : 
    - Tous les trois onglets fonctionnels 
    - Test : navigation fluide, état préservé lors des changements d'onglet
12. **Fonctionnalités utiles supplémentaires** : 
    - Reconnexion automatique complète 
    - Sauvegarde/import/export de configuration 
    - Boutons de contrôle global (reconnecter/déconnecter tous) 
    - Tests : 
      * Boutons globaux respectent la configuration individuelle 
      * Aucune action de gameplay importante déclenchée accidentellement 
      * Notifications dans l'interface pour événements importants
13. **Tests d'intégration finaux** : 
    - Vérification de la bonne coopération entre tous les modules 
    - Confirmation que les étapes précédemment testées isolément fonctionnent ensemble 
    - Tests spécifiques demandés : 
      * Bot A ne modifie jamais l'état du Bot B 
      * Une erreur de Bot A ne fait pas tomber Bot B 
      * Les mots de passe n'apparaissent jamais dans les logs/WebSocket/frontend 
      * Une téléportation réussie est bien distinguée d'un mouvement anormal 
      * Une reconnexion automatique ne déclenche aucune action de gameplay non demandée 
      * Une corruption JSON ne provoque pas de perte silencieuse de données (fichier corrompu conservé + état de secours + avertissement utilisateur) 
      * Plusieurs bots peuvent fonctionner simultanément sans mélange de leurs états

### 6.3 Gestion spécifique des corrruptions JSON
Comme demandé explicitement :
- En cas de fichier JSON corrompu détecté au démarrage ou lors de la lecture :
  * Le fichier corrompu est conservé tel quel (pas d'écrasement automatique) 
  * Un état de secours (structure vide sécurisée correspondant au format attendu) est créé en parallèle 
  * L'utilisateur reçoit un avertissement clair décrivant :
    - La nature de la corruption détectée 
    - L'emplacement du fichier corrompu conservé 
    - L'emplacement de l'état de secours actuellement utilisé 
    - Les options de récupération possibles 
  * Aucune perte silencieuse de données n'est possible 
  * L'utilisateur peut décider de :
    - Ignorer l'avertissement et continuer avec l'état de secours 
    - Essayer de réparer le fichier corrompu manuellement 
    - Restaurer depuis une sauvegarde si disponible 
    - Réinitialiser complètement en supprimant les fichiers de données

## 7. Prochaines étapes

Après approbation de ce document de conception :
1. Invocation de la compétence `writing-plans` pour créer le plan d'implémentation détaillé
2. Suivi du plan d'implémentation pour le développement
3. Tests réguliers et révisions selon les retours
4. Préparation de la version initiale pour usage personnel
5. Nettoyage et préparation pour publication open source sur GitHub

---
*Ce document spécifie la conception complète de BotHub telle qu'approuvée lors des sessions de brainstorming et de conception. Toute déviation significative lors de l'implémentation devra être justifiée et documentée.*
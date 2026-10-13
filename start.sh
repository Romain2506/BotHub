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
if [ ! -d "node_modules/mineflayer" ]; then
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
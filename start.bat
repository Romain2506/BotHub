@echo off
chcp 65001 >nul
REM BotHub Startup Script for Windows

REM Check if Node.js is installed
where node >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe ou n'est pas dans le PATH.
    echo Veuillez installer Node.js LTS depuis https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if we're in the BotHub directory
if not exist "package.json" (
    echo ERREUR: Ce script doit etre execute depuis le repertoire BotHub.
    echo.
    pause
    exit /b 1
)

echo Demarrage de BotHub...

REM Install dependencies if missing (mineflayer is required for the bots)
if not exist "node_modules\mineflayer" (
    echo Installation des dependances, cela peut prendre quelques minutes...
    call npm install
    if errorlevel 1 (
        echo ERREUR: Echec de l'installation des dependances.
        echo.
        pause
        exit /b 1
    )
)

echo Lancement de BotHub...
call npm start

REM Keep the window open if BotHub stopped with an error
if errorlevel 1 pause

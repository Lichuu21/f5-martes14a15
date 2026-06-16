@echo off
title Iniciando SquadGoals Portal...
echo ==================================================
echo   🚀 INICIANDO SQUADGOALS PORTAL EN LOCALHOST
echo ==================================================
echo.
echo 1. Iniciando servidor Node.js...
echo 2. Abriendo el portal en tu navegador por defecto...
echo.

:: Open the default browser after a 1 second delay to ensure server is ready
start "" http://localhost:3000

:: Start the node server
node server.js

pause

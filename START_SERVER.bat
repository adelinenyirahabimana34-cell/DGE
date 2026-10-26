@echo off
title D&G E-Commerce API Server
color 0A
cd /d "%~dp0server"
echo ==========================================================
echo    D&G E-Commerce API Backend Server
echo    Rwamagana, Rwanda
echo ==========================================================
echo.
echo Server starting on http://localhost:5000 (port 5000)...
echo KEEP THIS WINDOW OPEN while using the app on your phone!
echo.
node index.js
pause

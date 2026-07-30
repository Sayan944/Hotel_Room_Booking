@echo off
title Starting Hotel Management System...
echo ====================================================
echo      Launching Hotel Management System Servers
echo ====================================================
echo.

REM Start Backend API (Port 5000)
start "Hotel Backend API" /D "%~dp0backend" cmd /k "node server.js"

REM Start Frontend React App (Port 5173)
start "Hotel Frontend App" /D "%~dp0frontend" cmd /k "npm run dev"

REM Wait 3 seconds safely without redirection errors and open Browser
ping 127.0.0.1 -n 4 >nul
start http://localhost:5173

exit

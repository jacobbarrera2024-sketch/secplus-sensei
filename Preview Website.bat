@echo off
title Preview Portfolio Website
cd /d "%~dp0website"

echo.
echo  Portfolio website preview
echo  -------------------------
echo.

where npm >nul 2>nul
if errorlevel 1 (
  echo Opening index.html in your default browser...
  start "" "%~dp0website\index.html"
  echo.
  echo Tip: For mobile preview on same Wi-Fi, install Node.js and run this again.
  pause
  exit /b 0
)

echo Starting local server...
echo.
echo  On this PC:     http://localhost:3000
echo  On your iPhone: http://YOUR-PC-IP:3000  (same Wi-Fi, run ipconfig for IP)
echo.
echo  Press Ctrl+C to stop.
echo.

npx --yes serve . -l 3000

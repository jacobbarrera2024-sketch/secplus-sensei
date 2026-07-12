@echo off
title Setup Portfolio Contact Info
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js required. Install from https://nodejs.org
  pause
  exit /b 1
)

node setup-contact.js %*
pause

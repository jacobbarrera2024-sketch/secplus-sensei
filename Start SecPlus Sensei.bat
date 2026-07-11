@echo off
title SecPlus Sensei
cd /d "%~dp0"
if not exist "node_modules\electron\package.json" (
  echo First run: installing desktop app dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo npm install failed. Install Node.js from https://nodejs.org then run this again.
    pause
    exit /b 1
  )
)
npm start

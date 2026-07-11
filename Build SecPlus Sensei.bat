@echo off

title Build SecPlus Sensei Installer

cd /d "%~dp0"

where npm >nul 2>nul

if errorlevel 1 (

  echo Node.js is not installed.

  echo Download LTS from https://nodejs.org then run this again.

  pause

  exit /b 1

)

echo Installing dependencies...

call npm install

if errorlevel 1 goto fail

echo.

echo Syncing version files...

call node sync-version.js

if errorlevel 1 goto fail

echo.

echo Building SecPlus Sensei Updater.exe...

call node build-updater.js

if errorlevel 1 goto fail

echo.

echo Rendering ninja duck desktop icon...

call node build-icon.js

if errorlevel 1 goto fail

echo.

echo Building Windows installer (shows in Settings ^> Apps)...

set CSC_IDENTITY_AUTO_DISCOVERY=false

call npm run build

if errorlevel 1 goto fail

echo.

echo Done! Installer is in the dist folder.

echo Staging update files for in-app auto-update...

call node stage-update.js dist

if errorlevel 1 goto fail

echo.

echo   First install:  Documents\SecPlus Sensei Setup.exe

echo   Fix icon only:    node fix-installed-icon.js  (run as Admin if needed)

echo   After install:  Start menu -^> Update SecPlus Sensei

echo   Also in:        Program Files\SecPlus Sensei\SecPlus Sensei Updater.exe

explorer dist

pause

exit /b 0

:fail

echo Build failed.

pause

exit /b 1


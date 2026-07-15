@echo off
REM Windows launcher — no bash required
cd /d "%~dp0.."
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0split-into-repos.ps1" %*
if errorlevel 1 exit /b 1
echo.
echo Run push next:
echo   scripts\push-repos.bat
pause

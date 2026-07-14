@echo off
REM Windows launcher — no bash required
cd /d "%~dp0.."
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0push-split-repos.ps1" %*
pause

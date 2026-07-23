@echo off
REM Push split repos using git only (no GitHub CLI).
REM First create empty public repos on github.com — see docs/SPLIT_REPOS.md

set SPLIT=%~dp0..\..\secplus-split
if not "%~1"=="" set SPLIT=%~1

set GH=jacobbarrera2024-sketch

echo.
echo Pushing from: %SPLIT%
echo.
echo BEFORE running this, create these EMPTY public repos on GitHub:
echo   https://github.com/new
echo.
echo   %GH%/jacobbarrera2024-sketch.github.io
echo   %GH%/secplus-ai-demo
echo   %GH%/quick-quote
echo   %GH%/sheet-dash
echo.
echo Do NOT add README, .gitignore, or license when creating them.
echo.
pause

call :push jacobbarrera2024-sketch.github.io
call :push secplus-ai-demo
call :push quick-quote
call :push sheet-dash

echo.
echo Done. Enable Pages on each repo:
echo   Settings -^> Pages -^> Source: GitHub Actions
echo.
echo Portfolio: https://%GH%.github.io/
pause
exit /b 0

:push
set NAME=%~1
echo === %NAME% ===
cd /d "%SPLIT%\%NAME%"
if not exist ".git" (
  echo ERROR: Missing %SPLIT%\%NAME% — run split-repos.bat first
  exit /b 1
)
git remote remove origin 2>nul
git remote add origin https://github.com/%GH%/%NAME%.git
git push -u origin main
if errorlevel 1 (
  echo PUSH FAILED for %NAME% — did you create the repo on GitHub?
  exit /b 1
)
echo.
exit /b 0

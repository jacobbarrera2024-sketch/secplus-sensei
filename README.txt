SecPlus Sensei — Desktop App (Windows Installer)
=================================================

INSTALL (first time only)
--------------------------
  Double-click:  Documents\SecPlus Sensei Setup.exe

  After install you get:
    Start menu  ->  SecPlus Sensei          (the app)
    Start menu  ->  Update SecPlus Sensei   (the updater exe)
    Program Files\SecPlus Sensei\           (both exes live here)

  If already installed, Setup shows Update or Uninstall on the second page.

YOUR PROGRESS IS ALWAYS SAVED
------------------------------
  All spaced repetition, due dates, card edits, quiz stats, and AI
  enrichments save automatically to:

    %APPDATA%\SecPlus Sensei\progress.json

  This file survives app updates and reinstalls.
  A backup copy is kept at progress.backup.json in the same folder.

UPDATES (exe only — no bat files)
-----------------------------------
  When you change the app, run  Build SecPlus Sensei.bat  on the dev PC.
  That stages the new installer here:

    %APPDATA%\SecPlus Sensei\updates\SecPlus Sensei Setup.exe

  To update on your PC:
    Start menu  ->  Update SecPlus Sensei

  Or double-click:
    C:\Program Files\SecPlus Sensei\SecPlus Sensei Updater.exe

  Your study progress is kept. No uninstall needed.

BUILD INSTALLER (developers)
------------------------------
  Build SecPlus Sensei.bat

MIGRATING FROM BROWSER
------------------------
  First desktop launch tries to import your old browser localStorage
  automatically if no desktop save exists yet.

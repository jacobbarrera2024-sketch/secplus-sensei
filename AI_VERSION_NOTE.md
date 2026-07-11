# SecPlus Sensei — version file (READ EVERY SESSION)

**Any AI or human changing this app MUST update the version after every change.**

## Current version

**1.1.2**

Canonical sources (keep all in sync):

| File | What to update |
|------|----------------|
| `CURRENT_VERSION.txt` | Single line: `1.1.3` |
| `package.json` | `"version": "1.1.3"` |
| `secplus-sensei.html` | `var APP_VERSION="1.1.3"` |

## After every code change

1. Bump patch version (e.g. `1.0.4` → `1.0.5`) in all three files above, **or** run:
   ```
   node sync-version.js 1.0.5
   ```
2. Rebuild installer:
   ```
   Build SecPlus Sensei.bat
   ```
   (or `node stage-update.js dist2` after `npm run build`)
3. User opens the desktop app — update checks run in the background; a banner offers **Restart now** or installs silently on quit when a newer build is staged in `%APPDATA%\SecPlus Sensei\updates\`.

## Why this file exists

- Installer **Update** button appears when an existing install is detected.
- In-app auto-update reads `%APPDATA%\SecPlus Sensei\updates\latest.yml` + `CURRENT_VERSION.txt`.
- If versions are not bumped, the installer only shows Uninstall / Exit and the app never offers an update.

## Last change summary

- v1.1.2: Background auto-update UX — no blocking modal on launch; slim top banner ("Update ready — installs when you close, or Restart now"); silent install on quit; Restart now runs silent install and reopens the app. Desktop shortcut workflow: open app → keep studying → close or restart when ready.
- v1.1.1: Compact header nav (tabs no longer stretch full width). Persistent "Unofficial study aid" disclaimer in a new app footer on every view; new About & Help modal (version, what the app does, how optional AI works, privacy note, FAQ/known issues); all 5 raw AI error messages (Optimize, Card tutor x2, quiz explain, refine suggestions) replaced with friendly `friendlyAiError()` classification (bad key / offline / rate-limited / out of credits / other); fixed stale "check API key on the Dashboard" text left over from the old redirect-based flow; fixed "Refine with AI" missing loading/disabled state (could double-fire) and dropped its redundant pre-emptive toast; repo hygiene — deleted stale `dist2`–`dist6` build-output folders (~37MB, mostly duplicate Chromium license files), `.gitignore` now ignores `dist*/`; reformatted `README.txt` spacing.
- v1.0.9: Priority 1 (onboarding/BYOK) — first-run welcome modal explaining offline-first + optional AI, with CompTIA disclaimer; replaced disruptive "redirect to Dashboard" AI-key prompt with an in-place quick-add key modal on all 4 AI entry points (Optimize, Card tutor, quiz explain, refine suggestions); Dashboard AI card reworded as clearly optional with a "How does this work?" link back to the welcome modal.
- v1.0.5: Stop repeating update nag (24h snooze); fix duck shortcut icon; admin installer launch; hide old banner.
- v1.0.4: Fix installer always offering Update; in-app update modal on launch; version staging; nested install path detection.

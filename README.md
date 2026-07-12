# SecPlus Sensei

A polished, offline-first desktop study app for the **CompTIA Security+ (SY0-701)** exam. Built as a single-file vanilla-JS application packaged with Electron — flashcards with true spaced repetition, adaptive practice quizzes, full timed exam simulations, acronym drills, a readiness dashboard with gamification, and an *optional* AI tutor you power with your own key.

> **Unofficial study aid — not affiliated with or endorsed by CompTIA.** "CompTIA" and "Security+" are trademarks of CompTIA, Inc. This project is an independent learning tool.

---

## Screenshots

<!-- Add screenshots/GIFs here before publishing. Suggested shots:
     Dashboard (readiness + quests), a flashcard mid-review, the exam simulator, and the AI tutor. -->

_Screenshots coming soon — drop PNGs/GIFs in an `docs/` folder and link them here._

---

## Highlights

- **452 flashcards + 500+ practice questions** (single-answer, multi-select, and performance-based questions) authored across **all five SY0-701 domains**, weighted to match the real exam blueprint.
- **Real spaced repetition** — an SM-2-style scheduler with ease factors, intervals, lapses, leech detection, and "mastered" tracking.
- **Adaptive quizzing** that weights your weakest domains, plus a **90-minute exam simulator** (PBQs first, scaled scoring, per-domain breakdown, and attempt history).
- **Readiness dashboard** with domain-weighted scoring, XP/levels, daily quests, achievements, streaks, and a 20/30/60-day study plan.
- **Optional AI tutor** (bring-your-own-key **Anthropic Claude**) to optimize cards, explain missed questions, and generate follow-up flashcards. The entire app works fully offline without it.
- **Local-first & private** — no accounts, no signup, no telemetry. Progress is saved to your device and survives updates, with an automatic backup copy.
- **Custom content** — add your own flashcards, then export/import your full study state as JSON.

## Tech stack

- **Electron** desktop shell (`main.js`, `preload.js`) with `contextIsolation: true` and `nodeIntegration: false`.
- **Vanilla JavaScript, HTML, and CSS** — the whole app is one self-contained `secplus-sensei.html` (no framework, hash-based routing, single global state object).
- **Three.js** for the animated 3D header logo.
- **electron-builder** (NSIS) for the Windows installer, with an in-app update flow.
- Optional **Anthropic Claude** API for AI features (user-supplied key).

## Getting started (development)

```bash
npm install
npm start        # launches the Electron app
```

## Build a Windows installer

```bash
npm run build          # electron-builder --win nsis  -> dist/
```

On Windows you can also run `Build SecPlus Sensei.bat`, which installs deps, syncs version files, renders the icon, builds the installer, and stages update files.

## Optional AI setup

AI features are entirely optional and off by default. To enable them, add your own [Anthropic API key](https://console.anthropic.com) from the in-app Dashboard. Your key is stored locally on your device and is only ever sent directly to Anthropic when you invoke an AI feature.

> **Privacy note:** your key is stored in plain text in your local save file. If you export a backup, that file also contains the key — keep exported backups private.

## Data & persistence

- **Desktop:** `%APPDATA%\SecPlus Sensei\progress.json` (with a `progress.backup.json` copy).
- **Browser fallback:** `localStorage`.
- Progress persists across app updates and reinstalls.

See [`README.txt`](README.txt) for end-user install/update instructions.

## Notes & scope

- The readiness percentage and simulated scaled score are **app-internal estimates** to guide your studying — they are not official CompTIA metrics and don't guarantee a passing result.
- Distribution is currently **Windows (NSIS installer)**.

## License

No license is currently specified. All rights reserved by the author unless a license file is added.

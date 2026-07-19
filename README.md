<p align="center">
  <img src="assets/icon-512.png" alt="SecPlus Sensei" width="128" />
</p>

<h1 align="center">SecPlus Sensei</h1>

<p align="center">
  <strong>Offline-first CompTIA Security+ (SY0-701) desktop study app</strong><br>
  Flashcards · Spaced repetition · Exam simulation · Optional AI tutor
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.1.7-blue" alt="version" />
  <img src="https://img.shields.io/badge/platform-Windows-0078D6" alt="Windows" />
  <img src="https://img.shields.io/badge/Electron-35-47848F" alt="Electron" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT" />
</p>

<p align="center">
  <a href="docs/PORTFOLIO.md"><strong>Case study</strong></a> ·
  <a href="https://jacobbarrera2024-sketch.github.io/secplus-sensei/ai-demo/"><strong>Web demo</strong></a> ·
  <a href="https://jacobbarrera2024-sketch.github.io/secplus-sensei/quick-quote/"><strong>QuickQuote</strong></a> ·
  <a href="https://secplus-sensei.vercel.app/"><strong>QuickQuote Next</strong></a> ·
  <a href="https://soothing-surprise-production-27a3.up.railway.app/"><strong>FeedCollector</strong></a> ·
  <a href="https://github.com/jacobbarrera2024-sketch/secplus-sensei/tree/main/lead-intake"><strong>LeadDesk</strong></a> ·
  <a href="https://jacobbarrera2024-sketch.github.io/secplus-sensei/sheet-dash/"><strong>SheetDash</strong></a> ·
  <a href="https://jacobbarrera2024-sketch.github.io/secplus-sensei/"><strong>Portfolio</strong></a> ·
  <a href="website/README.md"><strong>Website</strong></a>
</p>

> **Unofficial study aid** — not affiliated with or endorsed by CompTIA. "CompTIA" and "Security+" are trademarks of CompTIA, Inc.

---

## At a glance

| | |
|---|---|
| **Built in** | ~3 days (solo) |
| **Flashcards** | 452 across all 5 SY0-701 domains |
| **Questions** | 504 (415 MCQ + 23 multi-select + 66 PBQs) |
| **Stack** | Electron · Vanilla JS · Three.js · Claude API (optional) |
| **Privacy** | Local-first · No accounts · No telemetry |

---

## Features

- **SM-2 spaced repetition** — ease factors, intervals, leeches, mastered tracking, keyboard shortcuts
- **Adaptive quizzes** — weak-domain weighting, instant feedback, missed-question flashcard suggestions
- **90-minute exam simulator** — PBQs first, scaled scoring (100–900), per-domain breakdown, attempt history
- **Readiness dashboard** — domain-weighted %, XP/levels, daily quests, achievements, streaks, study plans
- **Acronym rapid-fire** — drill all term cards until you know them cold
- **Optional AI tutor** (BYOK Anthropic Claude) — optimize cards, embedded card chat, quiz explanations
- **Custom cards** — add your own, export/import full state as JSON
- **Desktop packaging** — Windows NSIS installer, auto-update, progress survives reinstalls

---

## For recruiters & clients

This repo demonstrates **end-to-end product delivery**: real exam content, desktop installer, update pipeline, onboarding, gamification, and responsible optional AI — not a tutorial todo app.

**Full case study → [docs/PORTFOLIO.md](docs/PORTFOLIO.md)**

**Live portfolio → [jacobbarrera2024-sketch.github.io/secplus-sensei](https://jacobbarrera2024-sketch.github.io/secplus-sensei/)**

**Try the web demo → [AI assessment explainer](https://jacobbarrera2024-sketch.github.io/secplus-sensei/ai-demo/)** (no install, BYOK Claude)

**QuickQuote → [Invoice & quote generator](https://jacobbarrera2024-sketch.github.io/secplus-sensei/quick-quote/)** (business tool, PDF export)

**QuickQuote Next → [Next.js rebuild with live FX API](https://secplus-sensei.vercel.app/)** (React, TypeScript, Tailwind, Node.js API)

**FeedCollector → [RSS/Atom aggregator](https://soothing-surprise-production-27a3.up.railway.app/)** (Express API, JSON/CSV export)

**LeadDesk → [AI lead intake + Supabase admin dashboard](https://github.com/jacobbarrera2024-sketch/secplus-sensei/tree/main/lead-intake)** (Next.js, Vercel AI SDK, Supabase — deploy to Vercel)

**SheetDash → [CSV to dashboard](https://jacobbarrera2024-sketch.github.io/secplus-sensei/sheet-dash/)** (upload spreadsheet, instant charts)

---

## Screenshots

Real app captures coming soon — follow [docs/SCREENSHOTS.md](docs/SCREENSHOTS.md) on Windows (`Win+Shift+S`) to add dashboard, study, and exam views to the README.

---

## Quick start (development)

```bash
git clone https://github.com/jacobbarrera2024-sketch/secplus-sensei.git
cd secplus-sensei
npm install
npm start
```

## Build Windows installer

```bash
npm run build
```

Or on Windows: double-click **`Build SecPlus Sensei.bat`** (installs deps, syncs version, builds NSIS installer to `dist/`).

End-user install/update instructions: **[README.txt](README.txt)**

---

## Optional AI setup

AI is **off by default**. The app works fully offline without it.

1. Get a free API key at [console.anthropic.com](https://console.anthropic.com)
2. Open the app → **Dashboard** → paste key → Save
3. Use Optimize, Card tutor, and quiz explanations as needed

Your key stays on your device. The only network calls are your direct requests to Anthropic.

> **Privacy:** keys are stored in plain text locally. Exported backups also contain your key — keep them private.

---

## Project structure

```
secplus-sensei/
├── secplus-sensei.html   # Entire app (HTML + CSS + JS + seed content)
├── main.js               # Electron main process
├── preload.js            # Secure IPC bridge
├── ai-demo/              # BYOK web demo (source — synced to website/ on deploy)
├── quick-quote/          # Invoice & quote generator (source — synced on deploy)
├── sheet-dash/           # CSV → dashboard (source — synced on deploy)
├── website/              # Portfolio site + deployed demo copies (GitHub Pages)
├── assets/               # App icons
├── build/                # NSIS installer scripts
├── docs/                 # Case study, screenshot guide
├── package.json
└── README.txt            # End-user install guide
```

---

## Data & persistence

| Platform | Location |
|----------|----------|
| Desktop | `%APPDATA%\SecPlus Sensei\progress.json` (+ backup copy) |
| Browser | `localStorage` key `secplus_sensei_v1` |

Progress persists across app updates. First desktop launch auto-imports browser data if present.

---

## Notes

- Readiness % and simulated exam scores are **in-app estimates** — not official CompTIA metrics.
- Distribution is currently **Windows** (NSIS). macOS/Linux builds are possible but not packaged yet.
- Release binaries are distributed via **GitHub Releases**, not committed to this repo.

---

## Author

**Jacob** — developer, solo builder of SecPlus Sensei.

- **Portfolio site:** [jacobbarrera2024-sketch.github.io/secplus-sensei](https://jacobbarrera2024-sketch.github.io/secplus-sensei/)

---

## License

[MIT](LICENSE) — Copyright (c) 2026 Jacob

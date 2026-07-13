# SecPlus Sensei — Portfolio Case Study

> **One-line pitch:** A full-featured CompTIA Security+ desktop study app — built solo in three days — with 500+ authored questions, real spaced repetition, exam simulation, gamification, and optional AI tutoring.

---

## The problem

Security+ candidates need more than passive reading. They need **active recall**, **timed practice**, **weak-domain targeting**, and **progress they can trust** — ideally without subscriptions, accounts, or always-on internet.

## What I built

**SecPlus Sensei** is a Windows desktop app (Electron) that packages a complete SY0-701 study system:

| Area | What it does |
|------|----------------|
| **Flashcards** | 452 cards across all 5 exam domains, SM-2 spaced repetition, leech detection |
| **Quizzes** | 438 MCQ/multi-select (415 + 23) + adaptive weak-domain weighting |
| **Exam sim** | 90-minute timed run, PBQs first, scaled scoring, per-domain breakdown |
| **Dashboard** | Readiness %, XP/levels, daily quests, achievements, 20/30/60-day plans |
| **AI tutor** | Optional BYOK Claude integration — optimize cards, explain misses, refine suggestions |
| **Desktop shell** | Installer, auto-update, local persistence with backup, browser migration |

Everything works **offline-first**. AI is optional and user-keyed.

## Technical highlights

- **Vanilla JS** — entire UI + logic in one self-contained HTML file (~3,400 lines); no React/Vue dependency
- **Electron** with `contextIsolation: true`, `nodeIntegration: false`, IPC via `preload.js`
- **State** — single JSON object persisted to `%APPDATA%` (desktop) or `localStorage` (browser fallback)
- **Content pipeline** — seed arrays merge additively on version bump without wiping user progress
- **Build** — `electron-builder` NSIS installer, custom updater exe, icon embedding, version sync scripts

## By the numbers

- **452** flashcards
- **504** practice questions (415 MCQ + 23 multi-select + 66 PBQs)
- **5** SY0-701 domains, weighted to the real exam blueprint
- **8** main views + onboarding, AI key modal, About/Help
- **v1.1.7** — iterated through onboarding, auto-update, AI error handling, and portfolio polish

## What this demonstrates (for clients)

- **End-to-end product thinking** — not just code, but installer, updates, persistence, onboarding, disclaimers
- **Domain content authoring** — hundreds of exam-quality Q&A pairs, not placeholder data
- **AI integration done responsibly** — BYOK, offline fallback, friendly errors, privacy warnings on export
- **Ship speed** — full desktop product in ~3 days of focused work

## Stack

Electron · JavaScript · HTML/CSS · Three.js · electron-builder · Anthropic Claude API (optional)

## Links

- **Repo:** [github.com/jacobbarrera2024-sketch/secplus-sensei](https://github.com/jacobbarrera2024-sketch/secplus-sensei)
- **Portfolio:** [jacobbarrera2024-sketch.github.io/secplus-sensei](https://jacobbarrera2024-sketch.github.io/secplus-sensei/)
- **Web demo:** [AI assessment explainer](https://jacobbarrera2024-sketch.github.io/secplus-sensei/ai-demo/) — browser-based BYOK Claude tutoring
- **QuickQuote:** [Invoice & quote generator](https://jacobbarrera2024-sketch.github.io/secplus-sensei/quick-quote/) — small business web tool demo
- **Screenshot guide:** [docs/SCREENSHOTS.md](SCREENSHOTS.md)

---

*Unofficial study aid — not affiliated with or endorsed by CompTIA.*

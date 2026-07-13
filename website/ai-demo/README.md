# SecPlus AI Demo

Browser-based **Security+ assessment explainer** with optional **bring-your-own-key (BYOK) Claude** tutoring.

Try it live: **https://jacobbarrera2024-sketch.github.io/secplus-sensei/ai-demo/**

Companion to the full desktop study app: [SecPlus Sensei](https://github.com/jacobbarrera2024-sketch/secplus-sensei)

> **Note:** Edit files in `ai-demo/` only. The copy under `website/ai-demo/` is synced automatically when the portfolio site deploys.

---

## What it demonstrates

- Vanilla JavaScript web app (no build step)
- Direct Anthropic API integration from the browser (BYOK)
- Assessment-style UX: question → answer check → AI explanation
- Local-first privacy: API key stored in `localStorage` only
- GitHub Pages deployment

---

## Features

- 8 sample SY0-701 practice questions
- Paste your own custom question + answer choices
- Built-in explanations (works offline, no API key)
- **Explain with AI** — Claude breaks down why the answer is correct and why distractors are wrong

---

## Run locally

```bash
git clone https://github.com/jacobbarrera2024-sketch/secplus-sensei.git
cd secplus-sensei/ai-demo
npx --yes serve .
```

Open `http://localhost:3000`

---

## Optional AI setup

1. Get a free API key at [console.anthropic.com](https://console.anthropic.com)
2. Paste it in the demo → **Save key**
3. Select a question → **Explain with AI**

Your key never touches a backend — requests go directly from your browser to Anthropic.

---

## Author

**Jacob** — built SecPlus Sensei (Electron desktop study app) and this web demo.

- Portfolio: https://jacobbarrera2024-sketch.github.io/secplus-sensei/
- LinkedIn: https://www.linkedin.com/in/jacob-barrera-515683152

---

## License

MIT — Copyright (c) 2026 Jacob

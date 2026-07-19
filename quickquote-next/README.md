# QuickQuote Next

Modern rebuild of [QuickQuote](../quick-quote/) — a browser-based invoice and quote generator built to demonstrate **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, and a **Node.js API route** with live REST integration.

## Live demo

**https://secplus-sensei.vercel.app/**

## Run locally

```bash
cd quickquote-next
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Post-deploy checklist

1. Open the live URL → click **Sample** → **Print / PDF** to verify
2. Scroll to **Live currency check** — confirm FX tiles load
3. Screenshot editor + preview → add **Upwork portfolio item**
4. Optional: set `NEXT_PUBLIC_SITE_URL` in Vercel to your production URL (Open Graph)

## Features

- **Invoice & quote builder** — line items, tax, themes (Classic / Slate / Mint)
- **Live preview** — updates as you type; mobile Edit / Preview tabs
- **Print / PDF** — browser print → Save as PDF (colored headers preserved)
- **Local drafts** — auto-save + manual save (`Ctrl+S` / `Cmd+S`)
- **Import / Export JSON** — round-trip documents
- **New document confirm** — avoids accidental data loss
- **Live currency conversion** — `/api/exchange` proxies Frankfurter rates server-side

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript, Tailwind CSS 4 |
| API | Next.js Route Handler (`/api/exchange`) |
| Data | Frankfurter public FX API (server-side proxy) |
| Storage | `localStorage` drafts |
| Deploy | Vercel |

## Project structure

```
quickquote-next/
├── src/app/           # App Router pages + API routes
├── src/components/    # React UI
├── src/lib/           # Types, calc, storage, import
├── public/            # Static assets
└── vercel.json
```

## Portfolio

Part of [SecPlus Sensei portfolio](https://jacobbarrera2024-sketch.github.io/secplus-sensei/) — project demonstrating full-stack Next.js for Upwork web dev jobs.

## License

MIT — Jacob Barrera

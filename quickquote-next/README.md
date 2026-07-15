# QuickQuote Next

Modern rebuild of [QuickQuote](../quick-quote/) — a browser-based invoice and quote generator built to demonstrate **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, and a **Node.js API route** with live REST integration.

## Live demo

Deploy to [Vercel](https://vercel.com) (recommended) or run locally:

```bash
cd quickquote-next
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Invoice & quote builder** — line items, tax, themes (Classic / Slate / Mint)
- **Live preview** — updates as you type; mobile Edit / Preview tabs
- **Print / PDF** — browser print → Save as PDF
- **Local drafts** — auto-save + manual save (`Ctrl+S` / `Cmd+S`)
- **Export JSON** — download the current document
- **Live currency conversion** — `/api/exchange` proxies [Frankfurter](https://www.frankfurter.app/) rates server-side (USD, EUR, GBP, CAD, AUD, JPY, MXN, INR)

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript, Tailwind CSS v4 |
| API | Node.js route handler (`src/app/api/exchange/route.ts`) |
| Deploy | Vercel (serverless) |

## Project structure

```
src/
├── app/
│   ├── api/exchange/route.ts   # Node.js REST proxy + caching
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/                 # React UI
└── lib/                        # Types, calc, storage, format
```

## Deploy on Vercel

1. Push this folder to GitHub (or deploy from monorepo with **Root Directory** = `quickquote-next`)
2. Import project in Vercel
3. Framework preset: **Next.js** (auto-detected)
4. Deploy — `/api/exchange` runs as a serverless function automatically

No environment variables required for the currency API (Frankfurter is free, no key).

## Portfolio context

This project closes the top skills gap from Upwork job analysis:

- React, Next.js, TypeScript, Tailwind CSS
- Node.js API route + REST integration
- Vercel-ready deployment

Original vanilla JS version: [quick-quote/](../quick-quote/)

## License

MIT — Jacob Barrera

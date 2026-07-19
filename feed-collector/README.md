# FeedCollector

RSS and Atom feed aggregator built to demonstrate **Express.js**, **Node.js**, **React**, **TypeScript**, **Tailwind CSS**, and **REST API** integration — the Phase 2 skills gap after QuickQuote Next.

Matches the Upwork **RSS Feed Collector** job lane: collect feeds, filter headlines, export JSON/CSV.

## Live demo

**https://soothing-surprise-production-27a3.up.railway.app/**

## Run locally

```bash
cd feed-collector
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (Vite proxies `/api` to Express on port 3001).

## Quick test

1. Click **Load sample feeds**
2. Click **Fetch all**
3. Filter headlines, then **Export JSON** or **Export CSV**

## Features

- **Add RSS/Atom URLs** — saved in localStorage on this device
- **Server-side parsing** — Express + `rss-parser` avoids browser CORS limits
- **Batch fetch** — up to 12 feeds in one request
- **Search/filter** — title, summary, or source name
- **Export** — JSON or CSV download
- **Sample feeds** — Hacker News, r/webdev, BBC Technology

## Tech stack

| Layer | Technology |
|-------|------------|
| API | Express 5, Node.js, TypeScript, rss-parser |
| UI | React 19, Vite, TypeScript, Tailwind CSS v4 |
| Deploy | Railway / Render (single Node process serves API + static build) |

## Project structure

```
feed-collector/
├── server/           # Express API
│   ├── index.ts
│   ├── routes/feeds.ts
│   └── lib/rss.ts
├── src/              # React UI
└── dist/             # Production build output
```

## API routes

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/api/health` | — | Health check |
| POST | `/api/feeds/parse` | `{ url }` | Parse one feed |
| POST | `/api/feeds/parse-batch` | `{ urls: string[] }` | Parse up to 12 feeds |

## Deploy on Railway

1. Import repo → set **Root Directory** = `feed-collector`
2. Build: `npm install --include=dev && npm run build`
3. Start: `NODE_ENV=production npm start`
4. Railway sets `PORT` automatically

## Upwork skills closed

- Express.js, Node.js REST API
- React, TypeScript, Tailwind CSS
- RSS/data export (JSON, CSV)
- Cloud deploy (Railway/Render)

See also: [docs/UPWORK_SKILLS_GAP.md](../docs/UPWORK_SKILLS_GAP.md)

## License

MIT — Jacob Barrera

# FeedCollector — Phase 2 Portfolio Project

**Purpose:** Close the **Express.js + Node.js REST API + RSS export** skills gap (Phase 2, item #5 in the Upwork tracker).

## Upwork pitch (short)

> Built FeedCollector — an RSS/Atom aggregator with an Express API that parses feeds server-side, a React + TypeScript + Tailwind UI, and JSON/CSV export. Matches data-collection and RSS feed jobs without CORS workarounds.

## Skills demonstrated

| Skill | Proof |
|-------|--------|
| Express.js | `server/routes/feeds.ts`, `server/index.ts` |
| Node.js | Server-side RSS fetch + parse |
| React + TypeScript | `src/` UI |
| Tailwind CSS | Styling throughout |
| REST API | POST `/api/feeds/parse`, `/api/feeds/parse-batch` |
| JSON/CSV export | Client export buttons |
| Cloud deploy | Railway/Render (`railway.json`, `npm start`) |

## Deploy checklist

1. Merge PR → Railway or Render
2. Root Directory = `feed-collector`
3. Build: `npm run build` · Start: `NODE_ENV=production npm start`
4. Test: Load samples → Fetch all → Export CSV
5. Screenshot → Upwork portfolio item

## Related jobs you can now cite

- RSS Feed Collector (already proposed)
- Node.js API integration fixes
- Data export / aggregation tools
- React dashboard with backend

See: [docs/UPWORK_SKILLS_GAP.md](./UPWORK_SKILLS_GAP.md)

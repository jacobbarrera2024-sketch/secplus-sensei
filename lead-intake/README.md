# LeadDesk — AI Lead Intake + Admin Dashboard

Portfolio project **#7** for the Upwork lane: professional services intake forms, AI categorization, Supabase auth/database, and owner dashboards.

## Live demo

Deploy this folder to **Vercel** and add environment variables (below). Until then, run locally.

## Features

- **Multi-step public intake form** — contact → service → project description → review
- **AI summary + tags** — Vercel AI SDK + OpenAI (`gpt-4o-mini`), with keyword **demo mode** when `OPENAI_API_KEY` is missing
- **Supabase Postgres** — stores submissions with RLS (public insert, authenticated read/update)
- **Admin dashboard** (`/admin`) — search, filter, status dropdown (New / Scheduled / Archived)
- **Rate limiting** — basic per-IP cap on `/api/analyze`

## Stack

Next.js · TypeScript · Tailwind CSS · Supabase · Vercel AI SDK · OpenAI

## Quick start

```bash
cd lead-intake
npm install
cp .env.example .env.local
# Edit .env.local with your keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Run [`supabase/schema.sql`](./supabase/schema.sql) in the SQL Editor
3. Copy **Project URL** and **anon public key** into `.env.local`
4. In **Authentication → Users**, create an admin user (email + password)
5. Sign in at `/admin/login`

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (for saves) | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes (for saves) | Public anon key |
| `OPENAI_API_KEY` | No | Real AI tags; without it, demo keyword mode runs |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL for metadata |
| `AI_RATE_LIMIT_PER_HOUR` | No | Analyze rate limit (default 20) |

<a id="deploy-vercel"></a>

## Deploy (Vercel)

1. Import repo, set **Root Directory** to `lead-intake`
2. Add env vars from `.env.example`
3. Deploy

## Upwork pitch (one-liner)

> Built LeadDesk — a Next.js intake form with Vercel AI SDK auto-tagging, Supabase Postgres + auth, and an admin dashboard for tracking client requests (the same pattern as pro-services lead intake jobs).

## License

MIT — Jacob Barrera

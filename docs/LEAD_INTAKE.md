# LeadDesk — Phase 3 Portfolio Project

**Purpose:** Close the **Supabase + Vercel AI SDK + admin dashboard** skills gap for pro-services lead intake jobs.

**Live demo:** Deploy pending — see [lead-intake/README.md](../lead-intake/README.md#deploy-vercel)

## Upwork pitch (short)

> Built LeadDesk — a Next.js multi-step intake form with Vercel AI SDK auto-tagging, Supabase Postgres + auth, and an admin dashboard for tracking client requests. Same pattern as pro-services lead intake and Lovable refactor jobs.

## Skills demonstrated

| Skill | Proof |
|-------|--------|
| Next.js | App Router, API routes (`/api/analyze`, `/api/leads`) |
| TypeScript | Strict mode throughout `lead-intake/src/` |
| Tailwind CSS | Intake form + admin UI |
| Supabase | Postgres schema, RLS, email auth |
| Vercel AI SDK | OpenAI `gpt-4o-mini` categorization |
| Security | Rate limits, Zod validation, open-redirect fix, security headers |
| Admin dashboard | `/admin` — search, filter, status updates |

## Post-deploy checklist

1. Run Supabase schema → disable public sign-up → create admin user
2. Deploy to Vercel (root: `lead-intake`) with env vars from `.env.example`
3. Test public form + `/admin/login`
4. Screenshot → Upwork portfolio item
5. Update portfolio hub LeadDesk card with live Vercel URL

## Related jobs you can now cite

- AI-powered lead intake forms
- Lovable / v0 app refactors with Supabase backend
- Admin dashboards for service businesses
- Next.js bug fixes and polish on existing codebases

See: [docs/UPWORK_SKILLS_GAP.md](./UPWORK_SKILLS_GAP.md)

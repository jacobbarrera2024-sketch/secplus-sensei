# Portfolio project: QuickQuote Next

**Status:** ✅ Audited, polished, ready for Vercel deploy  
**Path:** `quickquote-next/`  
**PR:** [#24](https://github.com/jacobbarrera2024-sketch/secplus-sensei/pull/24)

## Elevator pitch (Upwork / LinkedIn)

> Rebuilt my invoice generator in **Next.js + React + TypeScript + Tailwind**, with a **Node.js API route** for live currency conversion. Auto-save, JSON import/export, print-to-PDF, deployed on Vercel.

## When you get home

| Step | Action |
|------|--------|
| 1 | Merge PR #24, `git pull` |
| 2 | Vercel → New Project → repo `secplus-sensei` → Root Directory: **`quickquote-next`** |
| 3 | Deploy → copy live URL |
| 4 | Test: Sample → currency tiles → Print/PDF |
| 5 | Screenshot → Upwork portfolio + LinkedIn Featured |
| 6 | Update Upwork overview: add React, Next.js, TypeScript, Tailwind, Node.js |

## Skills demonstrated

| Skill | Proof |
|-------|-------|
| React | `src/components/*.tsx` |
| Next.js | App Router, API routes |
| TypeScript | Strict mode |
| Tailwind CSS | v4 styling |
| Node.js | `/api/exchange` |
| REST API | Frankfurter proxy |
| Vercel | README + `vercel.json` |

## Audit log (latest)

- JSON import + export round-trip
- Confirm dialog on New document
- Auto-save with status feedback
- Loading skeleton on hydration
- Print color preservation for invoice header
- Mobile layout fixes (tax/currency grid, line amounts)
- Removed unused scaffold assets
- Dynamic metadataBase from Vercel URL
- MIT LICENSE added

## Related

- Vanilla version: `quick-quote/` (GitHub Pages)
- Skills tracker: `docs/UPWORK_SKILLS_GAP.md`

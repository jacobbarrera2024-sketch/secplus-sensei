# 8. NIST Policy & Documentation 🟢 Nice-to-know

*Where this comes from in your work: your [NIST Security Policy Library case study](../case-studies/nist-policy-library.md) and [policy quick-reference card](../case-studies/policy-quick-reference.md).*

## Why interviewers ask this

Rarely tested in depth at Tier 1, but it's one of your strongest **differentiators** — most
entry-level candidates have never written a real policy document. It also signals you
understand *why* rules exist, not just what they are, which matters when you're the one
telling a frustrated user "no, I can't just give you admin rights."

## The concepts, in plain English

### Why policy exists at all
Without a written policy, "security" depends entirely on whoever happens to be doing the work
that day. A policy makes the rule consistent, auditable, and enforceable — and it protects
*you* too, because you're following a documented process instead of making judgment calls
that could be second-guessed later.

### Password Standard (NIST 800-63B aligned)
Modern guidance favors **length over forced complexity/rotation** — see
[Chapter 4](04-security-fundamentals.md) for why. Your standard reflects current best
practice, not the outdated "change your password every 90 days with a symbol" advice a lot of
people still expect.

### Change Control Management Policy
Nothing changes in production without: **request → review → approval → scheduled
implementation → documentation → verification.** Even "quick fixes" get a retroactive record.
This exists so a bad change can be traced back to *what changed* and *rolled back*, instead of
everyone guessing why something broke.

**Interview one-liner:** *"Change control isn't bureaucracy for its own sake — it's what lets
you actually answer 'what changed right before this broke' instead of guessing."*

### New Account Creation Procedure
Covered in depth in [Chapter 2](02-windows-active-directory.md) — request, approval,
least-privilege provisioning, and same-day offboarding.

### Why this is a good interview story
It shows you can think like the person who *writes* the rules the help desk enforces, not just
the person who clicks "reset password." That's a Tier 2/lead-track signal, even in an
entry-level interview.

## Add your screenshot here

- [ ] A cleaned-up page from your actual Password Standard document
- [ ] A cleaned-up page from your Change Control Policy document

## STAR story: writing the policy library

> **Situation:** A simulated organization had no documented security policies — no consistent
> password rules, no formal change process, no defined account provisioning steps.
> **Task:** Author a policy library aligned to NIST guidance that could actually be followed.
> **Action:** Wrote a Password Standard, Change Control Management Policy, and New Account
> Creation Procedure, each mapped to specific NIST recommendations rather than generic
> boilerplate.
> **Result:** Three ready-to-use governance documents that mirror the exact tickets a help
> desk technician processes daily — proof I understand the "why" behind the process, not
> just the "how."

## Quick self-check

- [ ] Can I explain why forced password rotation is now discouraged?
- [ ] Can I walk through the change control steps in order?
- [ ] Can I explain why documentation matters even for a "quick fix"?

**Next:** [9. Ticketing & ITSM Basics →](09-ticketing-itsm.md)

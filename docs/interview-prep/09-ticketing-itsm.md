# 9. Ticketing & ITSM Basics 🟡 Should-know

*Where this comes from in your work: your [sample ticket tracker](../case-studies/sample-tickets.csv) from the Nessus remediation project, plus general ITSM concepts every help desk job uses.*

## Why interviewers ask this

Almost every help desk job is "work a queue of tickets all day." Interviewers want to know you
understand how to **prioritize** when you have 20 tickets and can only work one at a time, and
that you'll actually document your work instead of just fixing things and moving on silently.

## The concepts, in plain English

### Ticket lifecycle
**New → Assigned/In Progress → (Pending, if waiting on the user or a vendor) → Resolved →
Closed.** "Pending" is important — it stops the clock being unfairly counted against you while
you wait on someone else.

### Priority & severity — not the same thing
- **Severity** — how bad is the impact (one user can't print vs. the whole building has no
  network).
- **Priority** — how urgent is it to fix *right now*, which factors in severity **and** who's
  affected and any deadlines (a VP's broken laptop before a client call might outrank a more
  "severe" but low-urgency issue).

**Interview one-liner:** *"Severity is how bad it is, priority is how fast it needs to be
fixed — a low-severity issue can still be high priority if the timing matters."*

### SLA (Service Level Agreement)
A promised response/resolution time based on priority (e.g., Critical = respond in 15 min,
resolve in 4 hours; Low = resolve in 3 business days). Missing an SLA is a real, trackable
metric — this is why documentation and timestamps matter.

### Escalation
Tier 1 handles what it can within its knowledge/access; anything beyond that (needs elevated
permissions, needs specialist knowledge, or is taking too long) gets escalated to Tier 2/3 with
**everything already tried documented** — so the next person doesn't repeat your steps.

**Interview one-liner:** *"I'd escalate anything outside my access or expertise, but I always
document what I already tried so Tier 2 isn't starting from zero."*

### How this maps to your Nessus ticket tracker
Your [sample tickets](../case-studies/sample-tickets.csv) already model this: severity (CVSS-based),
status (open/in progress/resolved), an owner, and a due date — that's a real ticketing
discipline, just applied to vulnerability findings instead of "my printer won't work."

## Add your screenshot here

- [ ] A filled-out ticket from `Ticket Template.xlsx` (once located/exported)

## STAR story: ticket tracking discipline

> **Situation:** Multiple vulnerability findings needed to be tracked from discovery through
> to a verified fix — not just fixed and forgotten.
> **Task:** Build and maintain a ticket log covering the full remediation lifecycle.
> **Action:** Logged each finding with severity, affected host, status, owner, and due date,
> updating status as work progressed and only marking "resolved" after re-verification.
> **Result:** A clean, auditable record of what was found, fixed, and confirmed — the exact
> documentation discipline a help desk ticketing system (Zendesk, ServiceNow, Freshservice,
> etc.) is built around.

## Quick self-check

- [ ] Can I explain severity vs. priority with an example where they'd disagree?
- [ ] Can I explain why "Pending" status matters for SLA tracking?
- [ ] Can I describe what I'd document before escalating a ticket?

**Next:** [10. Troubleshooting Methodology →](10-troubleshooting-methodology.md)

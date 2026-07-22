# 10. Troubleshooting Methodology 🔴 Must-know

*This is the single most-asked topic in help desk interviews. Learn it cold.*

## The picture to draw

![CompTIA 6-step troubleshooting methodology](C:/Users/Jacob/.cursor/projects/c-Users-Jacob-Documents-MyRobloxGame-secplus-sensei/assets/troubleshooting-methodology-flowchart.png)

## Why interviewers ask this

Nearly every help desk interview includes some version of: *"A user calls and says their
computer won't connect to the internet — walk me through how you'd handle it."* They're not
grading whether you get the "right" answer — they're grading whether you have a **repeatable
process** instead of randomly guessing. This is the CompTIA A+ six-step method, and it applies
to literally any technical problem.

## The six steps, in plain English

### 1. Identify the problem
Ask questions before touching anything. What exactly is happening? When did it start? Did
anything change recently (update, new software, moved desks)? Can you reproduce it? **Don't
skip this step** — jumping straight to a fix without understanding the actual problem is the
#1 mistake new technicians make.

### 2. Establish a theory of probable cause
Based on what you learned, form a hypothesis. Start with the obvious/most common cause before
exotic ones (**Occam's razor**: "is it plugged in?" before "is it a firmware bug?").

### 3. Test the theory to determine cause
Test cheaply and non-destructively first. If the theory is wrong, go back to step 2 with a new
theory — **this loop is expected and normal**, not a failure.

### 4. Establish a plan of action & implement the solution
Once you know the cause, decide the fix and do it. If the fix carries risk (production system,
many users affected), this is where change control ([Chapter 8](08-nist-policy-documentation.md))
kicks in — get approval before implementing on anything beyond your own authority.

### 5. Verify full system functionality
**Don't just assume it's fixed because the error went away.** Confirm the original symptom is
gone AND check you didn't break anything else. This is the step people skip and it's exactly
why "I fixed it" tickets get reopened.

### 6. Document findings, actions, and outcomes
Write down what the problem was, what you tried, what fixed it, and the outcome — in the
ticket system. Future-you (or Tier 2) will thank you.

**Interview one-liner, the whole thing in one breath:** *"I identify the problem by asking
questions and gathering info, form a theory starting with the most likely cause, test it
cheaply, fix it once I know the real cause, verify the fix actually worked without breaking
anything else, and document everything in the ticket."*

## A worked example (use this if asked "walk me through a scenario")

**Scenario: "My internet isn't working."**

1. **Identify** — Is it just this user, or everyone? Wired or Wi-Fi? Any error message?
   Anything change recently (new laptop, moved desks, recent update)?
2. **Theory** — Start simple: is it plugged in / Wi-Fi toggled on? If yes, check if it's a
   DHCP/DNS issue (can they reach an IP directly but not a website?) vs. a full connectivity
   failure.
3. **Test** — `ipconfig` to check they actually have a valid IP. `ping 8.8.8.8` (tests raw
   connectivity) vs. `ping google.com` (tests DNS too). If IP ping works but DNS doesn't →
   it's DNS, not "the internet."
4. **Plan & implement** — If it's a bad DHCP lease: `ipconfig /release` then `/renew`. If DNS:
   `ipconfig /flushdns` or switch DNS servers. If cable/Wi-Fi: reseat/reconnect.
5. **Verify** — Confirm they can actually load a website, not just that the error is gone.
6. **Document** — Log the ticket: symptom, cause (DHCP lease expired), fix (renewed lease),
   confirmed resolved.

This exact "isolate the layer" instinct (physical → IP → DNS → application) is the same
mental model from [Chapter 1](01-networking-fundamentals.md).

## Add your screenshot here

*(This chapter is process, not a specific project — no screenshot needed. Practice saying the
6 steps out loud instead.)*

## Quick self-check

- [ ] Can I list all 6 steps in order, from memory, without looking?
- [ ] Can I explain why "verify" and "document" are not optional?
- [ ] Can I talk through the "no internet" example without notes in under 2 minutes?
- [ ] Can I explain what to do if my first theory turns out to be wrong (go back to step 2, don't panic)?

**Next:** [11. Interview Playbook — STAR Stories & Q&A →](11-interview-playbook.md)

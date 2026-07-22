# 11. Interview Playbook — STAR Stories & Q&A 🔴 Must-know

This is the chapter that actually gets you hired. Certs and labs prove you *can* do the job —
this chapter is about proving it clearly, in a normal conversation, under mild pressure.

## The STAR method (your answer template for everything)

- **S**ituation — one sentence of context.
- **T**ask — what you specifically needed to do.
- **A**ction — what you actually did (this is the longest part).
- **R**esult — the outcome, ideally with something measurable or a clear "why this matters."

Every chapter in this guide already has a STAR story built in. Here they are again, indexed,
plus the general behavioral/soft-skill questions that aren't tied to a specific project.

## Your STAR stories, indexed by likely question

| If asked about... | Use this story | Chapter |
|---|---|---|
| A security/vulnerability project | Credentialed vs. non-credentialed Nessus scan | [5](05-vulnerability-management.md) |
| Writing documentation/policy | NIST policy library | [8](08-nist-policy-documentation.md) |
| Networking/infrastructure | NLB build on Windows Server 2019 | [1](01-networking-fundamentals.md) |
| Account/access management | AD provisioning + least privilege | [2](02-windows-active-directory.md) |
| Hardening/securing a system | WordPress + Wordfence hardening | [4](04-security-fundamentals.md) |
| A "beyond the basics" technical project | Nginx reverse proxy + SSL for multiple services | [6](06-web-infra-hardening.md) |
| Building a tool / scripting | Python/Tkinter AES-256 encryption tool | [7](07-encryption-basics.md) |
| Organizing/tracking work | Ticket tracker for vulnerability remediation | [9](09-ticketing-itsm.md) |

## Common behavioral questions & how to answer them

### "Tell me about yourself"
Keep it to ~60 seconds: current situation → relevant background → why this role.

> *"I have a B.S. in Cybersecurity from Full Sail, finished October 2025, and I'm currently
> studying for CompTIA Security+. Through my degree I got hands-on with vulnerability
> scanning, Active Directory, Windows Server, and Linux administration — not just theory, I
> built and secured real lab environments. I also have six-plus years of high-volume
> customer-facing experience, so I'm used to staying calm and clear when someone's frustrated
> and needs a fix fast. I'm looking for a help desk role where I can apply both sides of
> that — the technical skills and the people skills — starting day one."*

### "Why help desk? Why not go straight for a security job?"
Be honest and confident — this is a *strength*, not a weakness to hide.

> *"I want to build real production experience before specializing. Help desk is where you see
> the widest range of real problems — networking, accounts, hardware, security-adjacent
> issues — and it's the fastest way to prove myself and start building toward Tier 2 and
> eventually a security-focused role, using the Security+ I'm finishing now."*

### "Why the gap / what have you been doing since graduating?"
Don't over-explain or apologize. One honest sentence, then pivot forward.

> *"I've been finishing my Security+ certification and doing local work to stay employed while
> I job search — but I've been building out my lab projects and portfolio the whole time,
> which is actually most of what we've been talking about today."*

*(Don't feel obligated to name your current maintenance job specifically — "local work while
job searching and finishing my certification" is honest and sufficient. If pressed for
detail, describe the work plainly and move on — there's nothing to be ashamed of.)*

### "Describe a time you dealt with a difficult person" (use your Carnival experience)

> **Situation:** Working guest services on a cruise ship, I regularly supported elderly and
> mobility-restricted passengers during boarding/departure — high-pressure, time-sensitive,
> and sometimes frustrated guests.
> **Task:** Get them where they needed to go safely without delaying the whole line.
> **Action:** I stayed calm, explained what was happening and why, and coordinated with crew
> when equipment (elevators, ramps) failed, to find a safe alternative fast.
> **Result:** Guests got where they needed to go, delays were minimized, and I learned to
> triage a stressed person's *actual* need under time pressure — the same instinct a help
> desk queue demands when three people need help at once.

### "How do you handle not knowing the answer to something?"

> *"I say so honestly, then either look it up, check documentation, or escalate with everything
> I've already tried written down — I'd rather give a correct answer two minutes later than a
> confident wrong one now."*

### "How do you explain something technical to a non-technical person?"
Give a real example, don't just describe the skill abstractly.

> *"When I hardened a WordPress site, I didn't just tell the client 'I installed a firewall' —
> I explained it as 'I put a guard at the door that blocks known troublemakers before they can
> even try the lock,' and showed them the before/after so they could see it working, not just
> take my word for it."*

### "Where do you see yourself in a year?"

> *"Comfortable handling Tier 1 independently, finished with Security+, and starting to take on
> Tier 2 tickets — especially anything security-adjacent, since that's where my degree and
> labs point."*

## Technical rapid-fire — be ready for one-liners, not essays

Have a one-sentence answer ready for each (full explanations are in earlier chapters):

- What's the difference between TCP and UDP? → [Ch. 1](01-networking-fundamentals.md)
- What does DNS do? → [Ch. 1](01-networking-fundamentals.md)
- What's an OU vs. a Group in AD? → [Ch. 2](02-windows-active-directory.md)
- What's the CIA triad? → [Ch. 4](04-security-fundamentals.md)
- What's MFA and why does it matter? → [Ch. 4](04-security-fundamentals.md)
- Credentialed vs. non-credentialed scanning? → [Ch. 5](05-vulnerability-management.md)
- What's a reverse proxy? → [Ch. 6](06-web-infra-hardening.md)
- Symmetric vs. asymmetric encryption? → [Ch. 7](07-encryption-basics.md)
- Severity vs. priority on a ticket? → [Ch. 9](09-ticketing-itsm.md)
- Walk me through your troubleshooting process → [Ch. 10](10-troubleshooting-methodology.md) — **know this one cold, it's the most likely question in the entire interview.**

## Questions to ask them (always have 2–3 ready)

- "What does a typical ticket queue look like day-to-day — mostly account/access issues,
  hardware, or something else?"
- "What's the path from Tier 1 to Tier 2 here, and what would you want to see from me to make
  that jump?"
- "Is there a ticketing system/tooling you use that I should get familiar with before day one?"

## Night-before checklist

- [ ] Can say the 6-step troubleshooting process cold
- [ ] Have 3 STAR stories ready without reading them
- [ ] Have an honest, confident 2-sentence answer for the employment gap
- [ ] Have 2 questions ready to ask them
- [ ] Portfolio site link ready to share if asked: `jacobbarrera2024-sketch.github.io/secplus-sensei`

**Next:** [12. Cheat Sheets →](12-cheat-sheets.md)

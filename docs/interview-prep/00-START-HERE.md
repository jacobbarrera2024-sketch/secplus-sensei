# IT Help Desk Interview Prep — Guidebook

This is your full "reteach me everything" guide, built from your actual Full Sail coursework
(Portfolio II/III/IV/VII, Application Servers, Cryptology) plus the fundamentals every help
desk interview tests. It's organized around the **80/20 rule**: ~20% of these topics account
for ~80% of what you'll actually be asked in a Tier 1/2 help desk interview or on-the-job in
your first 90 days. Study the 🔴 **Must-know** items until you can explain them out loud,
in plain English, without notes. The 🟡 **Should-know** items round you out. The 🟢 **Nice-to-know**
items are there so nothing "feels new" if it comes up, but don't burn your last night before
an interview on them.

## How to use this guide

1. Read a chapter.
2. Close it, and explain the concept out loud to an empty room (or record yourself) like
   you're explaining it to a non-technical coworker. If you can't, you don't know it yet —
   that's normal, re-read and try again.
3. Use the **STAR story** in each chapter as your answer template for "tell me about a time..."
   questions. Practice saying it in under 90 seconds.
4. The image in each chapter is meant to be the mental picture you draw on a whiteboard
   if asked to explain the concept in an interview.

## The 80/20 priority map

| Priority | Topic | Why it matters | Chapter |
|---|---|---|---|
| 🔴 Must-know | Troubleshooting methodology | Asked in almost every help desk interview, directly | [10](10-troubleshooting-methodology.md) |
| 🔴 Must-know | Networking fundamentals (DNS, DHCP, TCP/IP, ports) | The #1 technical screening topic for Tier 1 | [01](01-networking-fundamentals.md) |
| 🔴 Must-know | Active Directory & account management | Password resets / account unlocks are the #1 real ticket type | [02](02-windows-active-directory.md) |
| 🔴 Must-know | Security fundamentals (CIA triad, MFA, phishing) | Ties to your Security+ study and comes up constantly | [04](04-security-fundamentals.md) |
| 🔴 Must-know | Your STAR stories from real projects | This is what actually gets you hired over someone with a cert and no proof | [11](11-interview-playbook.md) |
| 🟡 Should-know | Ticketing / ITSM basics (priority, SLA, escalation) | Comes up as "how do you triage your queue" | [09](09-ticketing-itsm.md) |
| 🟡 Should-know | Vulnerability management (Nessus, CVSS) | Differentiates you from other entry-level candidates | [05](05-vulnerability-management.md) |
| 🟡 Should-know | Linux basics & file sharing (Samba) | Many help desk roles are Windows-only, but this is a nice edge | [03](03-linux-file-sharing.md) |
| 🟢 Nice-to-know | NIST policy & documentation | Great talking point, rarely tested in depth at Tier 1 | [08](08-nist-policy-documentation.md) |
| 🟢 Nice-to-know | Web/infra hardening (Nginx, SSL, Docker) | Good "I go beyond the job description" story | [06](06-web-infra-hardening.md) |
| 🟢 Nice-to-know | Encryption basics (AES-256/OpenSSL) | Good for security-adjacent roles, rarely asked directly at Tier 1 | [07](07-encryption-basics.md) |
| 🔵 Reference | Cheat sheets (ports, OSI model, error codes) | Keep open in a tab the morning of the interview | [12](12-cheat-sheets.md) |

## Table of contents

0. **[Start here](00-START-HERE.md)** — this file
1. [Networking Fundamentals](01-networking-fundamentals.md) 🔴
2. [Windows Administration & Active Directory](02-windows-active-directory.md) 🔴
3. [Linux & File Sharing](03-linux-file-sharing.md) 🟡
4. [Security Fundamentals](04-security-fundamentals.md) 🔴
5. [Vulnerability Management](05-vulnerability-management.md) 🟡
6. [Web & Infrastructure Hardening](06-web-infra-hardening.md) 🟢
7. [Encryption Basics](07-encryption-basics.md) 🟢
8. [NIST Policy & Documentation](08-nist-policy-documentation.md) 🟢
9. [Ticketing & ITSM Basics](09-ticketing-itsm.md) 🟡
10. [Troubleshooting Methodology](10-troubleshooting-methodology.md) 🔴
11. [Interview Playbook — STAR Stories & Q&A](11-interview-playbook.md) 🔴
12. [Cheat Sheets](12-cheat-sheets.md) 🔵

## A note on the images

The diagrams in each chapter are generated study aids (not screenshots) so you have a clean
picture to describe. Where your actual lab screenshots exist (Nessus results, AD console,
etc.), each chapter has a **"Add your screenshot here"** callout showing exactly what to drop
in from your Full Sail files once you export them.

# Multi-Service Infrastructure Hardening — Case Study

> **Type:** Academic / self-directed lab project (Full Sail, B.S. Cybersecurity/IT — *Project and Portfolio II & III*, and Virtual Computers coursework). Not paid employment.

## Problem

A simulated small-business client ("Marconi Law" and similar course scenarios) needed a working, *secured* set of services — web hosting, file sharing, document management, and internal collaboration — not just one isolated app. Real IT support work is rarely a single service in a vacuum.

## Steps

1. Deployed **Nginx** as a reverse proxy in front of the client's web services, terminating **SSL/TLS**.
2. Installed and hardened **WordPress**, documenting a before/after security pass (hardened admin access, removed default info leaks, updated insecure defaults).
3. Stood up **Ghost** as a lightweight blogging/CMS alternative on the same infrastructure.
4. Configured **Samba** file shares with defined permissions for a Linux-based file server.
5. Deployed **Mayan EDMS** for document management and indexing.
6. Built a **Windows Server 2019** Network Load Balancing (NLB) cluster and automated configuration tasks with **PowerShell**.

## Fix

Each service was locked down individually — SSL certificates and forced HTTPS at the proxy layer, a documented WordPress security hardening checklist, least-privilege Samba share permissions, and NLB failover so the Windows-side service stays available if one node drops.

## Result

End-to-end proof of deploying, securing, and *documenting* multiple production-style services spanning both Linux and Windows, and both web-facing and internal file/document services. This is the same "stand it up, lock it down, write it up" pattern used across help desk Tier 2 escalations and small-business IT support engagements.

## Tools

Nginx · SSL/TLS · WordPress · Ghost · Mayan EDMS · Samba · Docker · Windows Server 2019 · PowerShell

## Evidence to add here (next step)

- [ ] Screenshot: Nginx reverse proxy config + valid SSL cert (browser padlock)
- [ ] Screenshot: WordPress security hardening before/after (from `activity3-5WPSecurityBEFORE.docx` + after)
- [ ] Screenshot: Samba share permissions / Mayan EDMS document list
- [ ] Screenshot: Windows Server 2019 NLB cluster status + a PowerShell script snippet
- [ ] Optional: AD lab screenshots from `INTRODUCTION TO APPLICATION SERVERS` (Week 2, `activity2.5.docx`) to reinforce Active Directory hands-on proof

---

[← Back to portfolio](https://jacobbarrera2024-sketch.github.io/secplus-sensei/#it-support)

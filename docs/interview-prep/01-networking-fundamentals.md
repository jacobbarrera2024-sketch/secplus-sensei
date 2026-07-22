# 1. Networking Fundamentals 🔴 Must-know

*Where this comes from in your work: Windows Server NLB configuration (Portfolio III), Nginx reverse proxy setup (Portfolio II), general networking exposure across every lab.*

## The picture to draw

![OSI model and common ports](C:/Users/Jacob/.cursor/projects/c-Users-Jacob-Documents-MyRobloxGame-secplus-sensei/assets/osi-model-ports-cheatsheet.png)

## Why interviewers ask this

Almost every Tier 1 screening includes some version of "walk me through what happens when
you type a URL into a browser" or "what's the difference between TCP and UDP." They're not
testing whether you can design a network — they're testing whether you have a mental model
of what's actually happening when a user says "the internet is down."

## The concepts, in plain English

### IP addressing
Every device on a network needs a unique address (like a street address) so traffic knows
where to go. IPv4 looks like `192.168.1.10`. Private ranges (`192.168.x.x`, `10.x.x.x`,
`172.16.x.x`–`172.31.x.x`) are used inside a network and aren't reachable directly from the
internet — that's what a router/NAT is for.

### DNS (port 53) — "the phonebook of the internet"
Translates names (`google.com`) into IP addresses. **Most "the website won't load" tickets
are actually DNS problems**, not internet problems. First troubleshooting move: can you ping
the IP directly? If yes, it's DNS. `ipconfig /flushdns` (Windows) is a classic first fix.

### DHCP (ports 67/68) — automatic IP assignment
When a device joins a network, DHCP hands it an IP address, subnet mask, default gateway, and
DNS server automatically — so nobody has to type in networking settings by hand. A common
help desk fix for "no internet" is releasing/renewing the DHCP lease: `ipconfig /release` then
`ipconfig /renew`.

### TCP vs. UDP
- **TCP** — reliable, ordered, checks that data arrived (handshake). Used for anything where
  accuracy matters more than speed: web browsing (HTTP/HTTPS), email, file transfer.
- **UDP** — fast, no delivery guarantee, no handshake. Used where speed matters more than
  perfection: video calls, streaming, DNS lookups.

**Interview one-liner:** *"TCP is like a phone call where you confirm the other person heard
you — UDP is like shouting across a room. TCP is more reliable; UDP is faster."*

### Ports you should recognize on sight

| Port | Protocol | What it's for |
|---|---|---|
| 22 | SSH | Secure remote command-line access to Linux/network gear |
| 25/587 | SMTP | Sending email |
| 53 | DNS | Name resolution |
| 67/68 | DHCP | Automatic IP assignment |
| 80 | HTTP | Unencrypted web traffic |
| 443 | HTTPS | Encrypted web traffic (this is the one you used with Nginx SSL) |
| 445 | SMB | Windows/Samba file sharing |
| 3389 | RDP | Remote Desktop |

### VPN
Creates an encrypted tunnel over the public internet so a remote device can act like it's on
the private company network. Common help desk ticket: "VPN won't connect" → check
credentials, check if the VPN client needs an update, check if the user's internet works at
all first (isolate the layer with the problem).

### Network Load Balancing (NLB) — from your Windows Server 2019 project
NLB spreads incoming traffic across two or more servers so no single server gets overwhelmed,
and if one server goes down, the others keep serving traffic. You built this with PowerShell
and Sysprep across two Windows Server 2019 machines.

**Interview one-liner:** *"NLB is why a website doesn't go down just because one server did —
traffic gets rerouted to the healthy server."*

## Add your screenshot here

- [ ] NLB cluster status screen from your Windows Server 2019 lab (Portfolio III, Week 3–4)
- [ ] `ipconfig /all` output annotated with IP, subnet, gateway, DNS labeled

## STAR story: NLB build

> **Situation:** Needed to prove a web service could stay available if one server failed.
> **Task:** Build a two-node Network Load Balancing cluster on Windows Server 2019.
> **Action:** Used Sysprep to clone a consistent server image, then configured NLB and all
> networking (IP, DNS, hostname) entirely through PowerShell and `sconfig` — no GUI.
> **Result:** A working load-balanced cluster where traffic kept flowing even when I
> simulated one node going offline — the same failover concept that keeps real help desk
> ticketing/email systems up.

## Quick self-check

- [ ] Can I explain the difference between TCP and UDP in one sentence?
- [ ] Can I name 5 common ports from memory?
- [ ] Can I explain what DNS does without saying "it's like a phonebook" (i.e., in my own words)?
- [ ] Can I explain NLB in the context of *why a user cares* (uptime), not just *what it is*?

**Next:** [2. Windows Administration & Active Directory →](02-windows-active-directory.md)

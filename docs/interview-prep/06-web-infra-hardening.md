# 6. Web & Infrastructure Hardening 🟢 Nice-to-know

*Where this comes from in your work: your [Multi-Service Infrastructure Hardening case study](../case-studies/infrastructure-hardening.md) — Nginx, SSL, WordPress, Ghost, Mayan EDMS.*

## The picture to draw

![Reverse proxy and SSL architecture](C:/Users/Jacob/.cursor/projects/c-Users-Jacob-Documents-MyRobloxGame-secplus-sensei/assets/reverse-proxy-ssl-architecture.png)

## Why interviewers ask this

This one rarely gets asked directly at Tier 1 — its value is as a **"here's how I go beyond
the basics"** story if the interview has any open-ended "tell me about a project" moment.

## The concepts, in plain English

### Reverse proxy (Nginx)
A reverse proxy sits in front of your actual web servers and handles incoming requests on
their behalf — clients talk to the proxy, not directly to the backend services. This lets one
public-facing address route to multiple internal services (like your WordPress, Ghost, and
Mayan EDMS setup), and centralizes things like SSL so you configure it once instead of on
every backend service.

**Interview one-liner:** *"A reverse proxy is the front door — it takes the request, decides
where it goes, and can handle security (like SSL) in one place instead of on every server
behind it."*

### SSL/TLS certificates
The thing that makes a browser show the padlock and use `https://` instead of `http://`.
It encrypts traffic between the browser and server, and (via the certificate) proves the
server is who it claims to be. Without it, anyone on the same network can read the traffic
in plain text.

### WordPress hardening (a concrete before/after story)
- Locked file/directory permissions so the web server process couldn't write where it
  shouldn't.
- Restricted access to `wp-config.php` (contains database credentials — a top target).
- Installed Wordfence (a web application firewall) to block common attack patterns.
- **Validated** the fix by confirming write access was actually blocked for test accounts.

### Docker for service deployment (Ghost, Mayan EDMS)
Rather than manually installing dependencies for each app, Docker runs each service in its
own isolated container with everything it needs bundled in — faster to deploy, easier to
tear down and rebuild if something breaks.

## Add your screenshot here

- [ ] Browser padlock / certificate details on the Nginx-fronted site
- [ ] Nginx config file snippet showing the reverse proxy + SSL block
- [ ] WordPress before/after security settings (from `activity3-5WPSecurityBEFORE.docx`)

## STAR story: reverse proxy + multi-service hosting

> **Situation:** Multiple services (WordPress, Ghost, a document management system) needed to
> be reachable securely from one public-facing setup, not exposed individually.
> **Task:** Front all of them with a single secured entry point.
> **Action:** Configured Nginx as a reverse proxy with SSL/TLS termination, routing traffic to
> the correct backend service based on the request, so certificates and access control were
> managed centrally instead of per-service.
> **Result:** A single hardened entry point for multiple services — the same pattern
> companies use to avoid exposing every internal service directly to the internet.

## Quick self-check

- [ ] Can I explain what a reverse proxy does using a "front desk" analogy?
- [ ] Can I explain what SSL/TLS actually protects (confidentiality + server identity)?
- [ ] Can I name one specific thing I hardened on the WordPress site and how I verified it?

**Next:** [7. Encryption Basics →](07-encryption-basics.md)

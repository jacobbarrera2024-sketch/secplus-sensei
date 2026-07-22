# 4. Security Fundamentals 🔴 Must-know

*Where this comes from in your work: your entire Cybersecurity B.S., CompTIA Security+ study, and every hardening project (WordPress, Nginx SSL, NIST policies).*

## Why interviewers ask this

Every company wants to know you won't be the reason they end up in the news. You don't need
to be a security engineer for a help desk role — you need to demonstrate **security-aware
habits** and be able to explain the fundamentals your Security+ studying already covers.

## The concepts, in plain English

### CIA Triad — the foundation of everything in security
- **Confidentiality** — only authorized people can see the data (encryption, access control).
- **Integrity** — data hasn't been tampered with (hashing, checksums, version control).
- **Availability** — systems are up and usable when needed (backups, NLB, redundancy — this
  is literally what your NLB project protects).

**Interview one-liner:** *"Confidentiality is about who can see it, integrity is about whether
it's been changed, availability is about whether it's up when you need it — most security
controls map to protecting one of those three."*

### AAA — Authentication, Authorization, Accounting
- **Authentication** — proving who you are (password, MFA).
- **Authorization** — what you're allowed to do once you're in (permissions, least privilege).
- **Accounting** — logging what happened (audit trails — this is your Change Control Policy's
  documentation requirement in action).

### MFA (Multi-Factor Authentication)
Something you know (password) + something you have (phone/authenticator app) + something you
are (fingerprint). Defeats the #1 cause of account compromise: a stolen or guessed password
alone. Your Password Standard requires MFA wherever supported.

### Phishing & social engineering
The #1 way attackers actually get in isn't a fancy exploit — it's tricking a person. Red
flags: urgency ("your account will be closed today!"), mismatched sender domains, unexpected
attachments/links, requests to bypass normal process. As help desk, **you're the front line**
for users reporting "is this email real?"

**Interview one-liner:** *"Most breaches start with a person, not a firewall — that's why user
awareness and a quick 'don't click, report it' habit matter as much as any technical control."*

### Patching & vulnerability management
Unpatched software is one of the most common ways attackers get in — this is literally what
your Nessus scanning project addressed. See [Chapter 5](05-vulnerability-management.md) for
the full workflow.

### Password security (your Password Standard, in practice)
- Longer is better than "complex but short" — length beats forced special characters.
- Don't force rotation without reason — it pushes users toward predictable patterns
  (`Password1!`, `Password2!`...).
- Screen against known-breach password lists.
- MFA wherever possible.

### Encryption at a glance
Symmetric (same key encrypts and decrypts — fast, used for bulk data, like your AES-256 tool)
vs. asymmetric (public/private key pair — slower, used for things like HTTPS handshakes and
digital signatures). See [Chapter 7](07-encryption-basics.md) for the deep dive.

## Add your screenshot here

- [ ] Your Security+ study dashboard/progress screen, if you want to show active certification progress
- [ ] Before/after screenshot from the WordPress Wordfence firewall install

## STAR story: security awareness in action (WordPress hardening)

> **Situation:** A live WordPress site had default configurations that left it exposed —
> writable config files and no firewall.
> **Task:** Harden the site against common attack vectors.
> **Action:** Locked down file/directory permissions and `wp-config.php` access, installed the
> Wordfence firewall, then validated the fix by confirming write access was actually blocked
> for test accounts — not just assumed.
> **Result:** A measurably hardened site, with the validation step proving the fix worked
> instead of just "should work" — the same rigor you'd want in a help desk fix.

## Quick self-check

- [ ] Can I define CIA triad with a real example for each letter?
- [ ] Can I explain why forced 90-day password rotation is now considered bad practice?
- [ ] Can I describe 3 phishing red flags?
- [ ] Can I explain MFA to someone who's annoyed by it and thinks it's pointless?

**Next:** [5. Vulnerability Management →](05-vulnerability-management.md)

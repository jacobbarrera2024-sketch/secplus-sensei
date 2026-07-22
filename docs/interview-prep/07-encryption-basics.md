# 7. Encryption Basics 🟢 Nice-to-know

*Where this comes from in your work: your Python/Tkinter AES-256 encryption tool, `Openssl tutorial.docx`, [KB article: How to Encrypt/Decrypt Files with AES-256](../kb/encrypt-decrypt-aes256.md).*

## The picture to draw

![AES-256 symmetric encryption flow](C:/Users/Jacob/.cursor/projects/c-Users-Jacob-Documents-MyRobloxGame-secplus-sensei/assets/aes-256-encryption-flow.png)

## Why interviewers ask this

Rarely asked in depth at Tier 1, but if you're asked "what security tools have you used," this
is a concrete, hands-on answer — you didn't just read about encryption, you built a tool that
does it and used it in an incident-response exercise.

## The concepts, in plain English

### Symmetric vs. asymmetric encryption
- **Symmetric** (AES-256) — one key encrypts *and* decrypts. Fast, used for bulk data. The
  challenge is securely sharing that one key with whoever needs to decrypt it.
- **Asymmetric** (RSA, etc.) — a public/private key pair. Anyone can encrypt with the public
  key, but only the private key holder can decrypt. Slower, so it's typically used to securely
  exchange a symmetric key (this is roughly what happens at the start of an HTTPS connection).

**Interview one-liner:** *"Symmetric is one key for both directions — fast, but you have to
get that key to the other person safely. Asymmetric uses a public/private pair so you never
have to share a secret key at all — HTTPS uses asymmetric encryption to safely agree on a
symmetric key for the rest of the session."*

### What you actually built
A Python/Tkinter GUI tool that wraps OpenSSL's AES-256-CBC encryption so a user can encrypt
or decrypt a file without touching the command line. You then used it in an incident-response
lab to investigate and decode encrypted files — connecting the "build a tool" side with the
"use a tool to solve a problem" side.

### Why this matters for help desk (not just security roles)
File encryption tickets come up more than people expect — a user needs to send something
sensitive securely, or IT needs to encrypt a drive before disposal/repurposing (this is also
tied to **BitLocker** on Windows, which is the tool you'd actually reach for on a real help
desk, not raw OpenSSL — mention both if asked).

## Add your screenshot here

- [ ] Your Tkinter encryption tool's UI, mid-encryption or decryption
- [ ] A terminal/log snippet showing a successful encrypt → decrypt round-trip

## STAR story: building and using the encryption tool

> **Situation:** Needed a practical way to protect files at rest/in transit and to understand
> encryption from the implementation side, not just the theory.
> **Task:** Build a working encryption utility and apply it in an incident-response scenario.
> **Action:** Built a Python/Tkinter GUI wrapping OpenSSL AES-256-CBC encryption, then used it
> in a lab exercise to decrypt and investigate files as part of an incident-response workflow.
> **Result:** A working tool plus hands-on experience with the exact failure modes (wrong
> password, KDF flag mismatches) that show up in real "why won't this decrypt" tickets — see
> the KB article I wrote from that experience.

## Quick self-check

- [ ] Can I explain symmetric vs. asymmetric with the "sharing a key safely" problem?
- [ ] Can I name the tool most companies would actually use for drive encryption (BitLocker)?
- [ ] Can I explain what happens when a decrypt fails (wrong password vs. corrupted file vs. flag mismatch)?

**Next:** [8. NIST Policy & Documentation →](08-nist-policy-documentation.md)

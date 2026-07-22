# 2. Windows Administration & Active Directory 🔴 Must-know

*Where this comes from in your work: AD lab (Application Servers, Week 2, `activity2.5.docx`), New Account Creation Procedure (Portfolio IV), NextCloud/LDAP integration (Portfolio III).*

## The picture to draw

![Active Directory hierarchy](C:/Users/Jacob/.cursor/projects/c-Users-Jacob-Documents-MyRobloxGame-secplus-sensei/assets/active-directory-hierarchy.png)

## Why interviewers ask this

**Password resets and account unlocks are the single most common help desk ticket at almost
every company.** If you can talk fluently about Active Directory, you're demonstrating you
already know the #1 thing you'll do every single shift.

## The concepts, in plain English

### What Active Directory actually is
A big organized database of every user, computer, and group in a company, plus the rules
(permissions, policies) that apply to them. Think of it as the company's org chart, made
functional — it's what lets IT say "Sarah in Sales should only see Sales files" and have
that actually enforced everywhere, automatically.

### The building blocks

- **Domain** — the whole company's AD environment (e.g., `company.local`).
- **Organizational Unit (OU)** — a folder-like container used to organize users/computers
  (e.g., by department) so policies and permissions can be applied to a whole group at once.
- **User account** — one person's login identity.
- **Group** — a collection of users, used to assign permissions once instead of one-by-one
  (e.g., add someone to "Sales-ReadWrite" instead of setting permissions individually).
- **Group Policy Object (GPO)** — a rule set (password requirements, desktop restrictions,
  software deployment) applied to an OU and everything inside it.

**Interview one-liner:** *"AD is the system of record for who exists in the company and what
they're allowed to touch — groups and OUs are how you manage that at scale instead of
one user at a time."*

### The account lifecycle (this is your New Account Creation Procedure, live)

1. **Request** — manager/owner requests a new account with a justified reason for access.
2. **Approval** — someone with authority signs off before the account is created.
3. **Provisioning** — account created with **least privilege** (only what's needed for the
   role right now — more access is added later on request, not assumed upfront).
4. **Ongoing** — password resets, group membership changes, permission requests.
5. **Offboarding** — account disabled the *same day* as separation, not "whenever."

This exact lifecycle is what you documented in your New Account Creation Procedure
(Portfolio IV) — it's not theoretical, you wrote the actual company policy for it.

### Common help desk AD tickets & how you'd handle them

| Ticket | What's actually happening | Fix |
|---|---|---|
| "I'm locked out" | Too many failed login attempts tripped the lockout policy | Unlock account in AD Users & Computers (or reset password if they forgot it) |
| "I can't see the shared drive" | Missing group membership, or a mapped drive didn't reconnect | Check group membership; re-map the network drive |
| "New hire has no access" | Account not provisioned yet, or wrong OU/group | Verify request was approved, provision with correct group memberships |
| "Can't log into a new computer" | Computer not joined to the domain, or profile issue | Confirm domain join status; check for a corrupted user profile |

### Permissions basics
Windows/Samba permissions generally follow **least privilege**: give Read access unless
someone specifically needs Write, give Write unless they need Full Control. You configured
exactly this on your Samba file server (locked-down user permissions for cross-platform
Windows/Linux sharing).

## Add your screenshot here

- [ ] AD Users & Computers console showing an OU structure (from `activity2.5.docx`)
- [ ] A provisioned user account with group memberships shown
- [ ] Shared-folder permissions dialog from your Samba lab

## STAR story: Active Directory & account provisioning

> **Situation:** A lab environment needed proper account and access management, not just
> "everyone is an admin."
> **Task:** Administer Active Directory: provision accounts, configure shared-folder
> permissions, map network drives, and integrate outside authentication.
> **Action:** Created user accounts with least-privilege group memberships, configured
> shared-folder permissions to match department needs, mapped network drives, and integrated
> NextCloud authentication via LDAP so users had a single set of credentials across systems.
> **Result:** A working, least-privilege access model — the same logic behind every "please
> give me access to X" or "why can't I see Y" ticket a help desk technician resolves.

## Quick self-check

- [ ] Can I explain what an OU is vs. a Group (they're often confused)?
- [ ] Can I walk through the account lifecycle from request to offboarding?
- [ ] Can I explain "least privilege" using a non-technical example?
- [ ] Do I know what I'd actually click to unlock an account or reset a password in AD?

**Next:** [3. Linux & File Sharing →](03-linux-file-sharing.md)

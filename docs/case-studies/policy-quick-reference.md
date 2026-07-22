# Policy Quick-Reference Card

> One-page summary of the three NIST-aligned policies from the [NIST Security Policy Library](nist-policy-library.md) case study. Written as a quick-reference card a help desk technician could pin to their desk — not the full policy text.

## 1. Password Standard (NIST 800-63B aligned)

- **Minimum length:** 12+ characters (length matters more than complexity for resistance to modern cracking).
- **No mandatory periodic rotation** for user accounts unless there's evidence of compromise — current NIST guidance favors long, unique passwords over forced 90-day changes, which push users toward predictable patterns.
- **Screen against breach/common-password lists** at creation/change time; reject anything found in a known-breach corpus.
- **MFA required** wherever supported, especially for privileged/admin accounts.
- **Lockout after repeated failed attempts** (e.g., 5–10 tries) with a time-based or admin-reset unlock.

## 2. Change Control Management Policy

- **All infrastructure changes go through:** Request → Risk/impact review → Approval → Scheduled implementation → Documentation → Post-change verification.
- **Emergency changes** get a lightweight fast-track path but still require after-the-fact documentation and sign-off within a defined window (e.g., 24–48 hrs).
- **Every change ticket records:** what changed, who approved it, who implemented it, rollback plan, and verification step.
- **No unapproved changes** to production systems — including "quick fixes" — without at least a retroactive change record.

## 3. New Account Creation Procedure

- **Least privilege by default:** new accounts start with the minimum access needed for the role; access is added on request, not assumed upfront.
- **Formal request + approval** required before an account is created (manager/owner sign-off).
- **Unique account per person** — no shared/generic logins for traceability.
- **Offboarding mirrors onboarding:** account disable/removal is triggered the same day as separation, not "whenever IT gets to it."
- **Audit trail:** who requested, who approved, who provisioned, and when — kept for account lifecycle review.

---

*Recreated as a condensed reference from my own NIST-aligned policy documents (Full Sail coursework). See the [full case study](nist-policy-library.md) for context, or request the complete policy documents.*

[← Back to portfolio](https://jacobbarrera2024-sketch.github.io/secplus-sensei/#it-support)

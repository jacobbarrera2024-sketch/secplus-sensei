# Policy Quick-Reference Card

> One-page summary of the three NIST-aligned policies from the [NIST Security Policy Library](nist-policy-library.md) case study. Written as a quick-reference card a help desk technician could pin to their desk — not the full policy text.

## 1. Password Standard

- **Minimum length:** 12+ characters, mixing upper/lower-case letters, numbers, and symbols.
- **No personal info:** can't be based on the user's name, birthdate, or common words.
- **90-day rotation:** passwords are changed every 90 days; temporary/initial passwords are changed immediately after first login.
- **Never shared, never written down:** not even with a supervisor — a password manager is used instead.

*(Note: current NIST 800-63B guidance actually favors long, unique passwords over forced periodic rotation — this document follows the more traditional 90-day standard, which is still common in many organizations.)*

## 2. Change Control Management Policy

- **All infrastructure changes go through:** Change identification → Impact assessment → CAB (Change Advisory Board) review and approval → Implementation planning → Documentation → Post-change monitoring and review.
- **Emergency changes** can be approved by a designated emergency change authority instead of waiting on the full CAB.
- **Every change is documented:** what changed, who approved it, and the outcome — kept for audit purposes.

## 3. New Account Creation Procedure

- **Formal request + approval** required before an account is created — a manager submits the request, IT (and CISO if needed) approves it.
- **Least privilege by default:** IT provisions the account with only the access needed for that person's role, plus MFA.
- **Notification + first login:** the new hire is notified and must change their temporary password on first login.
- **Verification:** the manager confirms the new account has the correct access before it's considered done.
- **Audit trail:** every step — request, approval, provisioning, verification — is documented.

---

*Recreated as a condensed reference from my own NIST-aligned policy documents (Full Sail coursework). See the [full case study](nist-policy-library.md) for context, or view the [actual PDF documents linked from the case study](nist-policy-library.md#evidence).*

[← Back to portfolio](https://jacobbarrera2024-sketch.github.io/secplus-sensei/#it-support)

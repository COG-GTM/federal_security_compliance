---
name: federal-security-compliance
description: Apply STIG, NIST 800-53, and NIST SP 800-207 Zero Trust controls when writing or reviewing code for federal (FedRAMP / DoD) systems. Use for any task touching authentication, sessions, authorization, user input, database queries, API endpoints, error handling, secrets, audit logging, or CAC/PIV.
---

# Federal Security Compliance

Generate and review code so it meets STIG, NIST 800-53 (AC, AU, IA, SC, SI), and NIST SP 800-207 Zero Trust requirements.

Source of truth: https://github.com/COG-GTM/federal_security_compliance
- Rules: `devin-desktop/stig-rules.md`, `devin-desktop/zero-trust-rules.md`
- Reference modules: `templates/python/` (`security_utils.py`, `auth_manager.py`, `audit_logger.py`, `zero_trust_middleware.py`, `cac_piv_handler.py`)
- Verification: `tests/test_zero_trust.py`

Prefer reusing or adapting the reference modules over writing new security primitives.

## 1. Triage the change

| If the code... | Apply |
|---|---|
| Accepts user input | Whitelist validation + sanitization (STIG V-220631/V-220632, NIST SI-10) |
| Authenticates users | bcrypt (12 rounds) or Argon2, 14+ char complex passwords, MFA/CAC/PIV for privileged users (V-220629, IA-2, IA-5) |
| Creates or checks sessions | IP-bound session, regenerate ID after login, 15-minute sliding timeout, Secure/HttpOnly/SameSite=Strict cookies (V-220630, AC-12) |
| Grants access to data or actions | Default deny, explicit least-privilege grants, check on every request (AC-3, AC-6) |
| Queries a database | Parameterized queries or ORM only; never string-built SQL |
| Exposes an HTTP endpoint | HSTS, CSP, X-Frame-Options DENY, X-Content-Type-Options nosniff (V-220641) |
| Handles errors | Log details server-side; return generic messages to clients (SI-11) |
| Stores or sends sensitive data | AES-256 at rest, TLS 1.2+ in transit (V-220633/V-220634, SC-28, SC-8) |
| Uses secrets | Environment or secret manager only; never hardcoded |

## 2. Zero Trust request flow

Every protected request must follow:

```
Request -> Verify Session -> Check IP Binding -> Check Timeout -> Authorize -> Process -> Log
```

- Missing session: reject (401) and log.
- IP mismatch: destroy the session and log a security alert.
- Expired session: reject and log.
- Authorization denied: reject (403) and log.

Use `@zero_trust_required` / `validate_session` from `zero_trust_middleware.py` rather than a one-time login check.

## 3. Audit logging (V-220635, AU-2, AU-3)

Log structured JSON for every security event: login success/failure, lockout (5 failures -> 15-minute lock), logout, session create/expire/destroy, IP mismatch, authorization denial, privileged actions, and data export. Each entry needs a UTC timestamp, event type, user ID, source IP, outcome, and correlation ID. Use `audit_logger.py`, which adds an integrity hash per entry.

## 4. Verify before finishing

- [ ] All user input validated and sanitized
- [ ] Parameterized queries only
- [ ] No hardcoded secrets
- [ ] Sessions IP-bound, regenerated after auth, 15-minute timeout
- [ ] Authorization is default deny and checked on every request
- [ ] Security headers on every response
- [ ] Generic error messages to clients
- [ ] Security events audit-logged
- [ ] Tests cover the controls touched (model them on `tests/test_zero_trust.py`) and pass

If a SonarQube scan runs on the PR: fix Critical/High issues and resolve security hotspots before merge; keep coverage at or above 80%.

## Platform note

Devin Desktop (formerly Windsurf) and Devin CLI are FedRAMP High authorized in Devin federal deployments; Devin Cloud is in process. Code produced anywhere must still be reviewed and deployed in an authorized environment. Current status: https://docs.devin.ai/federal/compliance

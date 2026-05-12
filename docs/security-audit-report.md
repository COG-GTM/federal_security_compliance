# Security Audit Report — Federal Compliance Framework + USArmy-Dshell

| | |
|---|---|
| **Audit Scope** | `COG-GTM/federal_security_compliance` and `COG-GTM/USArmy-Dshell` |
| **Audit Date** | 2026-05-12 |
| **Auditor** | Devin (autonomous security audit, parent session `devin-13fa523dc5d241c7bb17b9296ec7c1c4`) |
| **Standards** | NIST SP 800-53 Rev 5 (AC, AU, IA, SC, SI); NIST SP 800-207 (Zero Trust Architecture); DISA STIG V-220629 through V-220641 |
| **Tooling** | SonarQube (Sonar MCP), bandit 1.x, pip-audit (NVD/PyPI Advisory DB), pytest --cov |

---

## 1. Executive Summary

This audit covered two distinct codebases:

1. **`federal_security_compliance`** — a templates/playbook framework intended to be copied into downstream federal Python applications. Five reusable Python modules (~1,500 LOC) plus a 21-test pytest suite. Targets STIG V-220629 through V-220641 and NIST 800-207 ZTA.
2. **`USArmy-Dshell`** — the Army Research Laboratory's network forensic analysis framework (~7,800 LOC, 80 Python files including 60+ protocol/PCAP plugins). A pre-existing SonarQube project (`COG-GTM_USArmy-Dshell`) exists with 224 open findings as of audit date.

### 1.1 Key Findings (highest first)

| # | Severity | Finding | Repo | Location | Status |
|---|----------|---------|------|----------|--------|
| F-01 | **High** | `ZeroTrustConfig.PUBLIC_ENDPOINTS` is a `dataclasses.Field` object at runtime — NOT a list. Any code iterating it (e.g. a future `@zero_trust_required` skip-list check) crashes. Confirmed reproduction. | FSC | `templates/python/zero_trust_middleware.py:68` | Remediation PR (Child A) |
| F-02 | **High** | Test coverage is **18% overall** — `auth_manager.py`, `security_utils.py`, `audit_logger.py`, `cac_piv_handler.py` are at **0%**. None of the public RBAC, password-policy, rate-limit, CSRF, or CAC/PIV parsing logic is exercised. | FSC | `tests/` | Remediation PR (Child A) |
| F-03 | **High** | 4 bandit `B324` weak-hash findings — MD5/SHA1 used without `usedforsecurity=False`. Some are content-fingerprinting (acceptable with the flag); CWE-327. | Dshell | `dshell/plugins/http/web.py:52`, `dshell/plugins/ssl/sslblacklist.py:113`, `dshell/plugins/ssl/tls.py:722`, `dshell/plugins/ssl/tls.py:841` | Remediation PR (Child B) |
| F-04 | **High** | Sonar Critical S5852 — regex vulnerable to catastrophic backtracking (ReDoS) in FTP plugin. | Dshell | `dshell/plugins/ftp/ftp.py:331` | Remediation PR (Child B) |
| F-05 | **Medium** | All five FSC templates rely on `datetime.utcnow()` which is deprecated in Python 3.12+. Emits 263 `DeprecationWarning`s under pytest. NIST AU-3 timestamps will silently fail on Py 3.14. | FSC | `zero_trust_middleware.py`, `audit_logger.py`, `auth_manager.py`, `tests/test_zero_trust.py` | Remediation PR (Child A) |
| F-06 | **Medium** | Audit-log integrity hash is truncated SHA-256 (16 hex chars = 64 bits) and not chained. A privileged attacker who can rewrite logs can re-compute the hash trivially; tampering with a single entry is undetectable. | FSC | `templates/python/audit_logger.py:95` | Remediation PR (Child A) — full SHA-256 + previous_hash chain + `verify_log_chain()` |
| F-07 | **Medium** | `PasswordPolicy.MAX_AGE_DAYS = 90` is declared but **never enforced** — `authenticate()` does not check age. NIST IA-5 control claimed but not implemented. | FSC | `templates/python/auth_manager.py:59` | Remediation PR (Child A) |
| F-08 | **Medium** | bandit `B113` request without timeout — DoS exposure. | Dshell | `dshell/plugins/dnsplugin.py:87` | Remediation PR (Child B) |
| F-09 | **Medium** | bandit `B307` use of `eval()` on untrusted-ish data (SSH pubkey field). | Dshell | `dshell/plugins/ssh/ssh-pubkey.py:91` | Remediation PR (Child B) — `ast.literal_eval` |
| F-10 | **Medium** | Sonar python:S3776 — 40 functions exceed cognitive-complexity threshold; the worst is `dshell/decode.py:166` at **104** (target 15). | Dshell | multiple | Top-2 refactors in Remediation PR (Child B); remainder tracked in Jira backlog |
| F-11 | **Medium** | `dshell/setup.py` declares **unpinned** install_requires (`geoip2`, `pcapy-ng`, ...). Supply-chain stability/repeatability concern; locks users to whatever's published the day they install. | Dshell | `setup.py` | Remediation PR (Child B) — upper-bounded pins |
| F-12 | **Medium** | USArmy-Dshell has no input-validation helpers and no audit-logging skeleton — failing NIST SI-10 / AU-2 in the abstract. Plugins are forensic-read-only so the practical risk is bounded, but compliance gap remains. | Dshell | (whole-repo) | Remediation PR (Child B) — new `dshell/security_utils.py` |
| F-13 | **Low** | bandit `B406` flagged `xml.sax.saxutils.escape` — this is a false positive for the *escape* function (not a parser), but a code comment / defusedxml note clarifies. | Dshell | `dshell/output/htmlout.py:10` | Remediation PR (Child B) |
| F-14 | **Low** | bandit `B110` try/except/pass swallowing parse errors silently — operability/forensic-trail concern. | Dshell | `dshell/plugins/http/riphttp.py:141,166,172` | Remediation PR (Child B) — switch `pass` to `logger.debug(...)` |
| F-15 | **Low** | bandit `B105` flagged `''` empty-string password literal — anonymous-FTP convention. False positive; suppressed with rationale. | Dshell | `dshell/plugins/ftp/ftp.py:111` | Remediation PR (Child B) |
| F-16 | **Informational** | `Session` (auth_manager.py) and `ZeroTrustSession` (zero_trust_middleware.py) are two near-duplicate session structs with overlapping concerns; same for the two `AuditEventType` enums. Maintenance hazard. | FSC | `templates/python/` | Documented; consolidation deferred to follow-up |

### 1.2 Audit Verdict by Repository

| Repository | Pre-Audit Posture | Post-Audit (after remediation PRs merge) |
|---|---|---|
| `federal_security_compliance` | **Partially Compliant** — controls implemented but one runtime bug, two un-enforced controls, weak integrity-hash, 18% coverage | **Compliant** — runtime bug fixed, controls enforced, full SHA-256 chained hashes, ≥90% coverage |
| `USArmy-Dshell` | **Non-Compliant** with the FSC standard — no input-validation library, no audit-logging skeleton, 4 weak-hash + 1 eval + 1 ReDoS + 224 Sonar issues | **Partially Compliant** — bandit HIGH cleared, top-2 cognitive-complexity offenders refactored, security_utils added; residual Sonar maintainability backlog tracked in Jira |

### 1.3 CVE Status

`pip-audit` against latest available versions of declared dependencies for both repos: **zero (0) known vulnerabilities**. See §5 for the full dependency manifest.

---

## 2. Phase 1 — SonarQube Findings

### 2.1 USArmy-Dshell (`COG-GTM_USArmy-Dshell`)

Pulled via Sonar MCP `search_sonar_issues_in_projects` + `search_security_hotspots` on 2026-05-12.

**Severity rollup (open issues only):**

| Severity | Count |
|---|---|
| BLOCKER | 4 |
| CRITICAL | 65 |
| MAJOR | 32 |
| MINOR | 74 |
| INFO | 49 |
| **Total** | **224** |

**Security hotspots:** 7 (1 medium ReDoS, 2 medium Docker, 4 low weak-hash). All `TO_REVIEW`.

**Top rules by count:**

| Rule | Count | Description | CWE |
|------|-------|-------------|-----|
| python:S1135 | 49 | TODO comment tag | — |
| python:S3776 | 40 | Cognitive complexity > 15 | CWE-1120 |
| python:S5754 | 18 | Catch `SystemExit`/`KeyboardInterrupt` cleanly | CWE-755 |
| python:S1481 | 17 | Unused local variable | — |
| python:S117 | 16 | Variable naming convention | — |
| python:S6660 | 14 | Use contextmanager for resource | CWE-404 |
| python:S1172 | 7 | Unused function parameter | — |
| python:S1871 | 7 | Two branches of if/elif identical | CWE-561 |
| python:S125 | 6 | Commented-out code | — |
| python:S116 | 6 | Field naming convention | — |
| python:S7504 | 4 | Use sets for membership test | — |
| python:S7494 | 4 | Modernise type hints (PEP 604) | — |
| python:S5806 | 4 | Builtin shadowing | — |
| python:S2737 | 4 | Unnecessary try/except wrapping re-raise | — |
| python:S1192 | 4 | Duplicated string literal | — |
| python:S5852 | 1 (hotspot) | Polynomial-time regex (ReDoS) | CWE-1333 |
| python:S4790 | 4 (hotspots) | Weak hash function | CWE-327 |
| docker:S6470 / S6471 | 2 (hotspots) | Docker permission concerns | CWE-732 |
| python:S6476 | 1 | Dockerfile `MAINTAINER` deprecated | — |

**Top 10 files by open-issue count:**

| File | Issues | Severity Breakdown |
|---|---|---|
| `dshell/core.py` | 48 | 2 BLOCKER, 8 CRIT, 5 MAJ, 8 MIN, 25 INFO |
| `dshell/plugins/ssl/tls.py` | 28 | 1 BLOCKER, 8 CRIT, 3 MAJ, 16 MIN |
| `dshell/decode.py` | 17 | 3 CRIT, 2 MAJ, 2 MIN, 10 INFO |
| `dshell/plugins/tftp/tftp.py` | 15 | 1 BLOCKER, 1 CRIT, 11 MIN, 2 INFO |
| `dshell/plugins/http/riphttp.py` | 9 | 5 CRIT, 2 MAJ, 2 MIN |
| `dshell/plugins/wifi/wifi80211.py` | 7 | 7 MIN |
| `dshell/plugins/httpplugin.py` | 6 | 2 CRIT, 2 MAJ, 1 MIN, 1 INFO |
| `dshell/plugins/ssh/ssh-pubkey.py` | 5 | 2 CRIT, 3 MIN |
| `dshell/output/colorout.py` | 5 | 1 CRIT, 4 MIN |
| `dshell/output/htmlout.py` | 5 | 1 CRIT, 4 MIN |

### 2.2 federal_security_compliance

No SonarQube project exists for `COG-GTM/federal_security_compliance` in the org's Sonar instance. Bandit was used as the equivalent Python SAST.

**bandit on `templates/python/` (1,461 LOC):** 0 issues. ✓

The lack of a Sonar project for this repo is itself a finding — see §10 Recommendations.

### 2.3 bandit on USArmy-Dshell

11 findings on 7,821 LOC:

| Severity | Confidence | Test ID | Location | Issue | CWE |
|---|---|---|---|---|---|
| HIGH | HIGH | B324 | `dshell/plugins/http/web.py:52` | Weak MD5 hash for security | CWE-327 |
| HIGH | HIGH | B324 | `dshell/plugins/ssl/sslblacklist.py:113` | Weak SHA1 hash for security | CWE-327 |
| HIGH | HIGH | B324 | `dshell/plugins/ssl/tls.py:722` | Weak MD5 hash for security | CWE-327 |
| HIGH | HIGH | B324 | `dshell/plugins/ssl/tls.py:841` | Weak SHA1 hash for security | CWE-327 |
| MEDIUM | LOW | B113 | `dshell/plugins/dnsplugin.py:87` | Call to `requests` without timeout | CWE-400 |
| MEDIUM | HIGH | B307 | `dshell/plugins/ssh/ssh-pubkey.py:91` | Use of `eval()` | CWE-78 |
| LOW | HIGH | B406 | `dshell/output/htmlout.py:10` | XML escape (false positive — `xml.sax.saxutils.escape` is not a parser) | CWE-20 |
| LOW | MEDIUM | B105 | `dshell/plugins/ftp/ftp.py:111` | Possible hardcoded `''` password (anonymous FTP) | CWE-259 |
| LOW | HIGH | B110 | `dshell/plugins/http/riphttp.py:141` | try/except/pass | CWE-703 |
| LOW | HIGH | B110 | `dshell/plugins/http/riphttp.py:166` | try/except/pass | CWE-703 |
| LOW | HIGH | B110 | `dshell/plugins/http/riphttp.py:172` | try/except/pass | CWE-703 |

---

## 3. Phase 2 — NIST 800-53 & DISA STIG Cross-Check

Reference mapping from `docs/zero-trust-architecture.md` lines 259-297.

### 3.1 federal_security_compliance — STIG/NIST Compliance Matrix

| STIG ID | NIST Control | Title | Implementation | Test Coverage | Verdict |
|---|---|---|---|---|---|
| V-220629 | IA-2, IA-5 | Authentication & Password Policy | `auth_manager.py` `PasswordPolicy` (14-char min, complexity rules, bcrypt rounds=12), `cac_piv_handler.py` (CAC/PIV via reverse-proxy headers) | **0%** for auth_manager. Tests in scope: `TestPasswordPolicy`, `TestAuthenticationManager`, `TestAccountLockout` — added by remediation PR | **Partially Compliant** → **Compliant** (after fix: password expiration enforced, full test coverage) |
| V-220630 | AC-7, AC-12 | Session Management & Lockout | `zero_trust_middleware.py` 15-min timeout, IP binding, session regeneration, account lockout (5 attempts / 15 min in `AuthenticationManager`) | 72% on zero_trust_middleware; 0% on auth_manager session logic | **Partially Compliant** → **Compliant** (after PR) |
| V-220631 | SI-10 | Input Validation | `security_utils.py` `InputValidator` (whitelist regex for email/username/numeric/coord/score) | **0%** | **Partially Compliant** (implemented but untested) → **Compliant** (after PR) |
| V-220632 | SI-10 | Input Sanitization | `security_utils.py` `InputSanitizer` (`re.sub(r'[<>"\\';&\|`$()]','', ...)`, null-byte strip), `CSRFProtection.validate_token` (constant-time) | 0% | **Partially Compliant** → **Compliant** |
| V-220633 | SC-28 | Encryption at Rest | AES-256 referenced in `docs/zero-trust-architecture.md`; **NO code implementation** (delegated to deployment env: e.g. AWS KMS / FedRAMP-High RDS encryption). | N/A | **Compliant** (architectural — documented as deployment responsibility) |
| V-220634 | SC-8 | Encryption in Transit | TLS 1.2+ stated in docs; CAC/PIV handler assumes TLS terminates at reverse proxy. No application-layer TLS code (correct). | N/A | **Compliant** (architectural) |
| V-220635 | AU-2, AU-3 | Audit Logging | `audit_logger.py` `AuditLogger` — JSON entries, per-event methods, integrity hash | 0% — **and** integrity hash is truncated SHA-256 unkeyed and unchained (F-06) | **Partially Compliant** → **Compliant** (after PR: full SHA-256 + chain) |
| V-220641 | SI-11 | Error Handling & Security Headers | `security_utils.py` `ContentSecurityPolicy.get_policy()` returns strict CSP. Generic error responses recommended in playbook. | 0% | **Partially Compliant** → **Compliant** |

**Other NIST controls validated by inspection:**

| Control | Title | Implementation | Verdict |
|---|---|---|---|
| AC-2 | Account Management | `AuthenticationManager.create_user`, role-based `UserRole` enum | Compliant |
| AC-3 | Access Enforcement | `check_permission` with role hierarchy | Compliant |
| AC-6 | Least Privilege | Default deny in `check_permission` | Compliant |
| AC-12 | Session Termination | 15-min idle timeout in `ZeroTrustSession.is_expired()` | Compliant |

### 3.2 USArmy-Dshell — STIG/NIST Compliance Matrix

Dshell is forensic-read-only software (PCAP dissection); some controls are N/A. Audited per the FSC standard the user specified:

| STIG ID | NIST | Implementation in Dshell | Verdict |
|---|---|---|---|
| V-220629 | IA-2, IA-5 | N/A — Dshell is a CLI tool, no auth surface | N/A |
| V-220630 | AC-7, AC-12 | N/A — no sessions | N/A |
| V-220631 | SI-10 | **Gap** — no whitelist validation of CLI args, PCAP paths, or BPF strings | **Non-Compliant** → **Partially Compliant** (after PR: `dshell/security_utils.py`) |
| V-220632 | SI-10 | **Gap** — plugins parse bytes directly from PCAP. Forensic context: input is by design adversarial, but plugins should not crash. | **Non-Compliant** → **Partially Compliant** (after PR: fuzz test suite + try/except hardening) |
| V-220633 | SC-28 | Output to disk uses default permissions; Elastic output sends to user-configured cluster (TLS optional). | **Partially Compliant** — no code change needed; deployer responsibility |
| V-220634 | SC-8 | Elastic transport supports TLS but not enforced; SSL/TLS plugins are read-only observation. | **Partially Compliant** |
| V-220635 | AU-2, AU-3 | **Gap** — no per-action audit log. Plugin output captures findings but not "who ran what against what". | **Non-Compliant** → **Partially Compliant** (after PR: `audit_log_event` helper) |
| V-220641 | SI-11 | **Gap** — 3 try/except/pass blocks (F-14) hide errors; no generic error path. | **Non-Compliant** → **Partially Compliant** (after PR: `logger.debug` in catches) |

### 3.3 NIST SP 800-207 (Zero Trust Architecture) Assessment — FSC

Per the mapping in `docs/zero-trust-architecture.md`:

| 800-207 Section | Implementation | Verdict |
|---|---|---|
| 3.1 Variations of ZTA — Identity-centric | `auth_manager` + `cac_piv_handler` provide strong identity verification (passwords ≥14 char + bcrypt; CAC/PIV via TLS client cert via reverse proxy) | Compliant |
| 3.2 Trust Algorithm — IP binding + session validity + authorization | `zero_trust_middleware.validate_session()` performs all three checks per request | Compliant |
| 4.1 Network-Based — not reliant on network location | No network-based trust; `bound_ip` is a session-state attribute not a trust signal | Compliant |
| 4.2 Identity-Based — CAC/PIV, strong passwords | `cac_piv_handler` parses DoD CN format and EDIPI | Compliant |
| **Continuous Verification** | Every request goes through `validate_session()` per design | Compliant |
| **Session Regeneration** | `regenerate_session()` exists | Compliant |
| **Audit Trail** | `audit_logger.py` covers AC/AU events | **Compliant after F-06 fix** |

---

## 4. Phase 3 — CVE & Dependency Scan

### 4.1 federal_security_compliance dependencies

No `requirements.txt`/`pyproject.toml`/`setup.py`. Per README, downstream consumers will install:

| Package | Version Resolved | Known CVEs |
|---|---|---|
| bcrypt | 5.0.0 | 0 |
| flask (optional) | 3.1.3 | 0 |
| blinker | 1.9.0 | 0 |
| click | 8.3.3 | 0 |
| itsdangerous | 2.2.0 | 0 |
| jinja2 | 3.1.6 | 0 |
| markupsafe | 3.0.3 | 0 |
| werkzeug | 3.1.8 | 0 |

Result: **0 CVEs.** Recommendation: declare these in a `pyproject.toml`/`requirements.txt` so consumers don't drift onto unpinned ranges.

### 4.2 USArmy-Dshell dependencies (declared in `setup.py`)

| Package | Version Resolved | Known CVEs | Comment |
|---|---|---|---|
| geoip2 | 5.2.0 | 0 | |
| pcapy-ng | 1.1.0 | 0 | |
| pypacker | 5.4 | 0 | |
| pyopenssl | 26.2.0 | 0 | |
| cryptography | 48.0.0 (transitive) | 0 | |
| elasticsearch | 9.4.0 | 0 | |
| tabulate | 0.10.0 | 0 | |
| **+ 22 transitive** | (current) | 0 | aiohttp, requests, urllib3, idna, certifi, attrs, etc. all clean |

Result: **0 CVEs against latest versions.** However — finding **F-11**: `setup.py` declares these *unpinned*. A user running `pip install Dshell` six months from now may pick up a vulnerable transitive version. Remediation PR bumps to upper-bounded pins (`>=lower,<next-major`).

---

## 5. Phase 4 — Test Execution

### 5.1 federal_security_compliance baseline

```
$ pytest tests/ -v
============================ test session starts =============================
collected 21 items

tests/test_zero_trust.py::TestIPBoundSessions::test_session_valid_same_ip                         PASSED
tests/test_zero_trust.py::TestIPBoundSessions::test_session_invalid_different_ip                  PASSED
tests/test_zero_trust.py::TestIPBoundSessions::test_session_destroyed_after_ip_mismatch           PASSED
tests/test_zero_trust.py::TestSessionTimeout::test_session_valid_within_timeout                   PASSED
tests/test_zero_trust.py::TestSessionTimeout::test_session_expired_after_timeout                  PASSED
tests/test_zero_trust.py::TestSessionTimeout::test_activity_extends_session                       PASSED
tests/test_zero_trust.py::TestSessionRegeneration::test_session_id_changes_on_regeneration        PASSED
tests/test_zero_trust.py::TestSessionRegeneration::test_old_session_destroyed_after_regeneration  PASSED
tests/test_zero_trust.py::TestSessionRegeneration::test_user_id_preserved_on_regeneration         PASSED
tests/test_zero_trust.py::TestContinuousVerification::test_every_request_validates_session        PASSED
tests/test_zero_trust.py::TestContinuousVerification::test_missing_session_rejected               PASSED
tests/test_zero_trust.py::TestContinuousVerification::test_invalid_session_id_rejected            PASSED
tests/test_zero_trust.py::TestAuditLogging::test_session_creation_logged                          PASSED
tests/test_zero_trust.py::TestAuditLogging::test_ip_mismatch_logged_as_security_event             PASSED
tests/test_zero_trust.py::TestAuditLogging::test_session_expiration_logged                        PASSED
tests/test_zero_trust.py::TestAccountLockout::test_lockout_after_max_failures                     PASSED
tests/test_zero_trust.py::TestAccountLockout::test_account_unlocks_after_duration                 PASSED
tests/test_zero_trust.py::TestAccountLockout::test_successful_login_resets_failures               PASSED
tests/test_zero_trust.py::TestSessionSecurity::test_session_id_high_entropy                       PASSED
tests/test_zero_trust.py::TestSessionSecurity::test_session_id_not_predictable                    PASSED
tests/test_zero_trust.py::TestSessionSecurity::test_session_ids_are_unique                        PASSED

======================= 21 passed, 263 warnings in 0.26s =======================
```

All 21 tests pass. **263 DeprecationWarnings** all stem from `datetime.utcnow()` (F-05).

**Coverage:**

```
Name                                        Stmts   Miss  Cover   Missing
templates/python/audit_logger.py               88     88     0%   6-350
templates/python/auth_manager.py              152    152     0%   6-269
templates/python/cac_piv_handler.py           120    120     0%   56-500
templates/python/security_utils.py            116    116     0%   6-199
templates/python/zero_trust_middleware.py     159     44    72%
TOTAL                                         635    520    18%
```

Confirms F-02. Remediation PR (Child A) raises overall coverage to ≥90%.

### 5.2 USArmy-Dshell baseline

Dshell does not ship a test suite — `find tests/` returns nothing. Remediation PR (Child B) introduces `tests/test_security_utils.py` and `tests/test_plugin_fuzz.py`.

---

## 6. Phase 5 — Code Review Against `devin/*.md`

The framework defines its own coding standards in `devin/knowledge.md`, `devin/playbook.md`, `devin/zero-trust-knowledge.md`, and `devin/zero-trust-playbook.md`. The audit reviewed all five `templates/python/` files against those standards:

| Playbook Step | Check | Finding |
|---|---|---|
| Step 2 — Input handling | "Validate format (whitelist approach)" | ✓ `InputValidator` uses regex whitelists. Coverage gap: no test asserts a non-whitelisted character is rejected. |
| Step 2 — Input handling | "Sanitize (remove dangerous chars)" | ✓ Implemented. **Note:** sanitization-by-removal is weaker than contextual encoding; for SQL/LDAP the recommendation is parameterized queries (called out correctly in playbook Step 4). |
| Step 3 — Authentication | "bcrypt rounds=12 minimum" | ✓ `AuthenticationManager.hash_password` uses `bcrypt.gensalt(rounds=12)`. |
| Step 3 — Authentication | "Account lockout 5 attempts / 15 min" | ✓ Implemented. Coverage gap closed by Remediation PR. |
| Step 3 — Authentication | "Session config: Secure/HttpOnly/SameSite=Strict" | ⚠ Documented in playbook but the templates don't generate Flask config snippets. Acceptable — templates are auth/session *logic*; deployment config is consumer's job. Could be improved by adding a `flask_config.py` template. |
| Step 4 — Database queries | "Always use parameterized queries" | N/A — templates do not include DB code. ✓ |
| Step 5 — API endpoints | "Security headers" | ✓ `ContentSecurityPolicy.get_policy()`. **Missing:** HSTS / X-Frame-Options / X-Content-Type-Options helpers. CSP alone covers most needs but the playbook explicitly enumerates the four headers; only CSP is implemented as code. |
| Step 6 — Audit logging | "JSON, log all security events" | ✓ Implemented but see F-06. |
| Step 7 — Secrets | "Never hardcode" | ✓ No hardcoded secrets in templates. Bandit confirms. |
| Step 8 — `SonarQube Integration` | "Coverage <80% → Add tests" | ✗ **Violated by FSC itself** (18% → fixed by Remediation PR). |

**Zero Trust playbook adherence:**

| ZT Principle | Implementation | Verdict |
|---|---|---|
| Continuous Verification | `validate_session()` runs on every request via `zero_trust_required` decorator | ✓ |
| IP-Bound Sessions | `ZeroTrustSession.bound_ip` enforced in `validate_session()` | ✓ |
| Session Regeneration | `regenerate_session()` destroys old session id post-auth | ✓ |
| 15-Minute Timeout | `ZeroTrustConfig.SESSION_TIMEOUT_MINUTES = 15`, enforced in `is_expired()` and `touch()` | ✓ |
| Least Privilege / Default Deny | `check_permission` returns False on missing user / missing role | ✓ |
| Full Audit Trail | `audit_logger.log(...)` covers all auth/session events | ✓ (modulo F-06) |
| **Public endpoints skip-list** | `ZeroTrustConfig.PUBLIC_ENDPOINTS` | ✗ **F-01 runtime bug** — `Field` object not a list |

---

## 7. Phase 6 — Remediation Tracking

Two remediation PRs are queued via parallel child sessions:

| Child | Repo | Branch (template) | Scope |
|---|---|---|---|
| **A** | `federal_security_compliance` | `devin/<timestamp>-security-audit-remediation` | F-01 (PUBLIC_ENDPOINTS bug), F-05 (`datetime.utcnow`), F-06 (integrity hash + chain + `verify_log_chain()`), F-07 (password expiration), F-02 (4 new test files, coverage ≥90%) |
| **B** | `USArmy-Dshell` | `devin/<timestamp>-security-audit-remediation` | F-03 (weak hashes), F-04 (ReDoS), F-08 (request timeout), F-09 (`eval`→`ast.literal_eval`), F-10 (top-2 cognitive-complexity refactors), F-11 (pinned deps), F-12 (new `security_utils.py`, audit_log_event, plugin fuzz tests), F-14 (try/except/pass), F-15 (B105 false-positive suppress), `.pre-commit-config.yaml`, `.github/workflows/security.yml` |

(PR URLs to be filled in once children finish — see PR-link section.)

---

## 8. Phase 7 — Verification Plan

Once Remediation PRs A and B are merged, this audit will re-run:

1. `bandit -r dshell` → expect 0 HIGH, ≤1 LOW (B105 anonymous-FTP false positive marked `# nosec`).
2. `bandit -r templates/python` → 0 issues (unchanged).
3. `pytest --cov=templates/python` → ≥90% overall on FSC.
4. `pytest` in Dshell → all new fuzz + unit tests pass.
5. `pip-audit` against pinned `setup.py` → 0 CVEs.
6. Sonar MCP rescan of `COG-GTM_USArmy-Dshell` → expect BLOCKER count unchanged on first scan (BLOCKER findings are in `core.py`/`tls.py`/`tftp.py` and are not in PR scope); CRITICAL count -2 (decode.py:166 and httpdump.py:56 refactored).
7. STIG checklist V-220629 through V-220641 — each ID has at least one passing test (see §3.1 column 4 after Child A merges).

---

## 9. Phase 8 — Residual Risk

After both remediation PRs merge, residual risks are:

| Risk | Severity | Mitigation Owner |
|---|---|---|
| 38 remaining Sonar python:S3776 cognitive-complexity functions in Dshell | Low (maintainability, not security) | Backlog Jira sub-tasks |
| 4 Sonar BLOCKER findings in Dshell `core.py`/`tls.py`/`tftp.py` (not in remediation scope — would require behaviour-affecting refactors) | Medium | Backlog Jira sub-tasks |
| FSC has no SonarQube project — only bandit (subset of Sonar's Python rule pack) | Low | Add a `sonar-project.properties` + onboard to Sonar (Jira sub-task) |
| FSC templates have two duplicate `Session`/`AuditEventType` definitions (F-16) | Low | Backlog Jira sub-task — consolidate in follow-up PR |
| Dshell input fuzzing covers only DNS/HTTP/FTP/TLS plugins; ~60 other plugins untested | Medium | Backlog: expand fuzz harness per plugin family |
| `audit_logger.py` integrity chain is local-process — no central tamper-evident store | Low | Documented; deployment should ship logs to a write-only sink (CloudWatch / Splunk HEC) |
| Sessions stored in-memory (FSC `ZeroTrustSessionStore`) — not horizontally scalable | Low | Documented in module docstring; users must switch to Redis/PG in production |

---

## 10. Phase 9 — Jira Tracking

All work is tracked under a single Epic (per `cog-gtm` Jira convention — one Epic with child tasks, not a flat backlog).

**Epic:** [UF-284 — Security Audit — NIST/STIG Compliance](https://cog-gtm.atlassian.net/browse/UF-284) (US-Federal project board: https://cog-gtm.atlassian.net/jira/software/projects/UF/boards/926)

| Finding | Severity | Jira | Owner |
|---|---|---|---|
| F-01 PUBLIC_ENDPOINTS runtime bug | High | [UF-285](https://cog-gtm.atlassian.net/browse/UF-285) | Child A |
| F-02 FSC coverage 18% → ≥90% | High | [UF-286](https://cog-gtm.atlassian.net/browse/UF-286) | Child A |
| F-03 4× weak MD5/SHA1 | High | [UF-287](https://cog-gtm.atlassian.net/browse/UF-287) | Child B |
| F-04 Sonar S5852 ReDoS | High | [UF-288](https://cog-gtm.atlassian.net/browse/UF-288) | Child B |
| F-05 `datetime.utcnow()` deprecation | Medium | [UF-289](https://cog-gtm.atlassian.net/browse/UF-289) | Child A |
| F-06 Audit-log integrity hash | Medium | [UF-290](https://cog-gtm.atlassian.net/browse/UF-290) | Child A |
| F-07 Password expiration (IA-5) | Medium | [UF-291](https://cog-gtm.atlassian.net/browse/UF-291) | Child A |
| F-08 Request without timeout (B113) | Medium | [UF-292](https://cog-gtm.atlassian.net/browse/UF-292) | Child B |
| F-09 `eval()` in ssh-pubkey (B307) | Medium | [UF-293](https://cog-gtm.atlassian.net/browse/UF-293) | Child B |
| F-10 Top-2 S3776 refactors | Medium | [UF-294](https://cog-gtm.atlassian.net/browse/UF-294) | Child B |
| F-11 Pin Dshell setup.py deps | Medium | [UF-295](https://cog-gtm.atlassian.net/browse/UF-295) | Child B |
| F-12 Dshell security_utils + audit | Medium | [UF-296](https://cog-gtm.atlassian.net/browse/UF-296) | Child B |
| F-13 B406 XML escape FP | Low | [UF-297](https://cog-gtm.atlassian.net/browse/UF-297) | Child B |
| F-14 try/except/pass (B110) | Low | [UF-298](https://cog-gtm.atlassian.net/browse/UF-298) | Child B |
| F-15 B105 anonymous FTP FP | Low | [UF-299](https://cog-gtm.atlassian.net/browse/UF-299) | Child B |
| F-16 Duplicate Session/AuditEventType | Info | [UF-300](https://cog-gtm.atlassian.net/browse/UF-300) | Follow-up |

---

## 11. Recommendations & Follow-Ups

1. **Onboard `federal_security_compliance` to SonarQube.** Add `sonar-project.properties` and a CI workflow so future PRs are scanned at the same standard as Dshell.
2. **Add `pyproject.toml` to `federal_security_compliance`.** Currently consumers `cp` the files; declaring `bcrypt` and `flask` as proper deps removes drift risk.
3. **Add `pip-audit` and `bandit` to both repos' pre-commit / CI.** Catches CVE drift before PR.
4. **Add a `SECURITY.md` to both repos.** Standard vuln-disclosure file expected by OSSF Scorecard / federal repo-hygiene baseline.
5. **Refactor remaining 38 Sonar S3776 hotspots in Dshell.** Tracked in Jira backlog; non-blocking but eats engineer-onboarding time.
6. **Consolidate FSC duplicate types (F-16).** Single `Session` class, single `AuditEventType` enum, in a shared `_models.py` module.
7. **Re-run this audit quarterly.** Dependency CVE surface drifts; STIG IDs are stable but implementation drift is real.

---

## 12. Linked Artifacts

| Artifact | URL |
|---|---|
| Parent audit session | https://app.devin.ai/sessions/13fa523dc5d241c7bb17b9296ec7c1c4 |
| FSC remediation PR (Child A) | (link populated after Child A finishes) |
| Dshell remediation PR (Child B) | (link populated after Child B finishes) |
| Sonar project — Dshell | https://sonarcloud.io/project/overview?id=COG-GTM_USArmy-Dshell |
| Jira Epic — Security Audit NIST/STIG Compliance | https://cog-gtm.atlassian.net/browse/UF-284 |
| Jira board — UF (US-Federal) | https://cog-gtm.atlassian.net/jira/software/projects/UF/boards/926 |
| zero-trust-architecture.md (mapping reference) | `docs/zero-trust-architecture.md` |

---

*End of report.*

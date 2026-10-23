---
id: TECH-013
title: Security in the review and the pipeline
---

# Code review of TECH-013

**Result:** Passed
**Date:** 2026-10-23, review run 1
**Summary:** TECH-013 meets R1 to R7: the security point in the guide, the `/security-review` step, the CI job `security` (audit, Semgrep with a custom SQL rule, Gitleaks), Dependabot and the hardening from the one-time review all match `solution.md`. Nothing in the sign-in or server action changes weakens security.
**Security:** Passed. Every admin server action still goes through `run()`, which checks `isAdmin()` on the server; queries stay parameterised; the two `nosemgrep` lines take table and column names only from constants in the same file; error messages show no internals; the password is compared as hashes with `timingSafeEqual`; secrets reach only the `npm test` step. `/security-review`: run (the change touches sign-in and server actions): no findings. It checked the admin actions, the sign-in, `passwordMatches`, the input checks, the `nosemgrep` lines, the headers, the trace setting and the workflows (read-only token, secrets per step, `pull_request` not `pull_request_target`, no secrets in the security job).

How the review works: `wiki/system/code-review.md`. A later run is added at the top as "Review run 2".

## Must fix

None.

## Should fix

- `lib/reviews.ts:21` `createReview` assumed strings (`input.title.trim()`), unlike the other admin input after this change, and so didn't match `architecture.md` ("texts strings"). **Done:** non-strings are read as empty and get the normal message.
- `specs/TECH-013-security/verification.md:19` R8 had no result while the repo was still private. **Done:** the repo was made public on 2026-10-23 and the result recorded.
- `.github/workflows/ci.yml:62` The job `security` had `timeout-minutes: 10`, over the 8-minute budget, and its time wasn't recorded. **Done:** timeout 8; it took 43 s (run 39965901244), recorded.

## Suggestions

- `lib/travel.ts:40`, `scripts/db-setup.mjs:142` A bare `// nosemgrep` turns off every rule on the line. **Done:** both name the rule, `// nosemgrep: semgrep.sql-built-from-text`.
- `.semgrep/sql.yml:14` The rule only sees SQL built inside the call, not in a variable first. **Done:** said in `testing.md`, so the review's point on parameters still matters.
- `wiki/system/testing.md:65` "The card's test plan says whether it is needed" was a second rule for `/security-review`. **Done:** the rule is what the change touches; the test plan only records it.

## Outside the change

- `lib/admin.ts:325` `validateAircraft` didn't check that the class and add-on ids in the lists are integers. **Done:** checked here as well, a two-line addition next to the other input checks.
- The actions are still pinned to tags: TECH-012.
- The closed demo pull request #54 keeps its made-up token visible now that the repo is public. It was never a real token; noted in `verification.md`.

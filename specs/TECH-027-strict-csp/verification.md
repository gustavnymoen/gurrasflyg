---
id: TECH-027
title: Strict Content Security Policy
---

# Verification of TECH-027

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-027-R1 | Manual (an experiment, not repeatable as a test): `experimental.sri` sha256 and `script-src 'self'` in a production build (`next build`, `next start`, own `distDir`), page loaded in Chromium. Result in [solution.md](solution.md) and `wiki/system/security-headers.md` | local production build | Pass (recorded). Not run on a Vercel preview: the fallback leaves the policy unchanged, so there is nothing new to test there | 2026-11-03 |
| TECH-027-R2 | Fallback case: the policy is unchanged. Test `TECH-026-R3 …` still checks the exact header value and that an inline script runs; the build with SRI showed 6 blocked inline scripts and no hydration, which is why | local | Pass (policy unchanged, reason in R1) | 2026-11-03 |
| TECH-027-R3 | Manual: `style-src 'self'` set in the browser on the same build gave 293 inline style violations on `/` and `/charter`, so `'unsafe-inline'` stays; the wiki page names the cause (React `style` attributes) | local production build | Pass (recorded) | 2026-11-03 |
| TECH-027-R4 | Existing tests: `TECH-026-R3 …` (no `securitypolicyviolation` and no CSP console error on `/`, `/charter`, `/min-bokning`, `/admin/login`), the first smoke test, and the whole suite. Not run for `/flyg/boka` or a destination page in that test: the policy is unchanged, so what it covers is as before | local | Pass | 2026-11-03 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | Not applicable, no logic; `npm run test:unit` passes | local | Pass | 2026-11-03 |
| Browser tests | No new test: the policy is unchanged, and the existing TECH-026-R3 test already checks it exactly. Nothing loosened | local | Pass | 2026-11-03 |
| Smoke test | Unchanged. Not run on a preview, see R1; Live tests against main after PR #112 passed | live | Pass | 2026-11-03 |
| Accessibility | Not applicable, no page changes | | | |
| Security | Security points in the review; `/security-review` run on the diff: no findings (only a comment changed) | local | Pass | 2026-11-03 |
| Code review | [review.md](review.md) | local | Passed | 2026-11-03 |

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 222 unit, 178 browser | 0.9 s + 139.6 s | 5.3 s (TECH-019-R1, over budget as before) |
| After | 222 unit, 178 browser | see below | 5.3 s (same test) |

After: browser tests 140.6 s. No tests added or removed.

## Definition of Done

- [x] Tests: nothing new needed; `npm run test:unit` and `npm run test:local` (via `test:time`) pass
- [x] Test suite: 178 tests, 140.6 s (budget 180 s, was 139.6 s); one test over its own budget, as before this change (TECH-019-R1)
- [x] Deployed, and the smoke tests pass against production (Live tests): green against main after PR #112, 2026-11-03
- [x] Accessibility: not applicable, visitors see no change
- [x] Requirements as built below, no open questions; `solution.md` describes the work
- [x] Manual not affected; system docs (`security-headers.md`, index) and `wiki/log.md` updated
- [x] No leftovers: SRI is not enabled; only a comment changed in `next.config.ts`
- [x] Clean code: `npm run lint`, `npm run typecheck` pass; the build ran inside `test:time`
- [x] Code review done, no must-fix findings left: see [review.md](review.md)
- [x] Technical tasks: none found

## Requirements as built

### TECH-027-R1 The experiment is recorded
`solution.md` and `wiki/system/security-headers.md` say that Next's inline scripts are blocked by `script-src 'self'` with SRI, what was measured (local production build, 6 blocked inline scripts, no hydration) and the decision (policy unchanged).

### TECH-027-R2 No inline scripts in production
Fallback: the policy is unchanged, because SRI does not cover the inline scripts; R1 says why.

### TECH-027-R3 Styles
`'unsafe-inline'` is kept in `style-src`; the wiki page names React `style` attributes as the cause.

### TECH-027-R4 The site works as before
The policy is unchanged, so the site works as before; the whole suite passes.

## Notes

CI failed on `TECH-019-R1` (the calendar test), which had "april 2027" written into it. The last bookable month follows today's date (today plus `MAX_MONTHS_AHEAD`), so from 1 November it is May. The test now computes the month from `lib/dates.ts`; the check itself is not weakened. Unrelated to the CSP work, fixed here because it blocked the pull request.

The experiment used `NEXT_DIST_DIR=.next-exp` and a throwaway database file, both deleted afterwards. The build added the folder to `tsconfig.json`; that change was reverted.

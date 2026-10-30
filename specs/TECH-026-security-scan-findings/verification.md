---
id: TECH-026
title: Security scan findings
---

# Verification of TECH-026

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-026-R1 | Unit tests `TECH-026-R1 …` in `lib/my-booking.test.ts` (four wrong guesses, a right lookup and a wrong one: the count is kept and the address locked, another address not; five right lookups in a row all work). Browser test `TECH-026-R1 a right lookup between wrong guesses does not stop the lock` in `tests/TECH-026-security-scan-findings.spec.ts` | local | Pass | 2026-10-30 |
| TECH-026-R2 | Unit tests `TECH-026-R2 …` in `lib/search-text.test.ts` (1 000 characters cut to 100, short text trimmed, missing text empty). Browser test `TECH-026-R2 …` (1 000 characters to `/api/airports` gives 200 and a list) | local | Pass | 2026-10-30 |
| TECH-026-R3 | Browser test `TECH-026-R3 …` (exact values of the three headers on a page and an API response; no `securitypolicyviolation` and no CSP console error on `/`, `/charter`, `/min-bokning` and `/admin/login`; an inline script runs, a script from another origin is blocked). The first smoke test checks the headers on the start page | local, preview, live | Pass (the smoke test passed in Preview tests and in Live tests after the merge) | 2026-10-30 |
| TECH-026-R4 | Manual: `git ls-files .vitest` is empty, `/.vitest/` is in `.gitignore`, and the README's step 2 says `chmod 600 .env.local` (documentation only, can't be meaningfully automated) | local | Pass | 2026-10-30 |
| TECH-026-R5 | Code review: `wiki/system/admin-sign-in.md` has the section "Known limit: no server-side session" ([review.md](review.md)) | local | Pass | 2026-10-30 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `lib/my-booking.test.ts` (the old "right lookup clears the count" test replaced by two R1 tests; the R12 test now uses an address per request, since nine lookups from one address would lock it) and the new `lib/search-text.test.ts`. `npm run test:unit`: 222 pass | local | Pass | 2026-10-30 |
| Browser tests | `tests/TECH-026-security-scan-findings.spec.ts` (3 tests; the lookup test runs only locally). `tests/TRIP-023-my-booking.spec.ts` clears the count of the test server's address after each test, since right lookups no longer do. The full suite: 178 pass. Run on port 3199 with its own `HOME`, since another run held port 3100 | local | Pass | 2026-10-30 |
| Smoke test | The headers are checked in `SMOKE-1` in `tests/smoke.spec.ts` (CSP contains `default-src 'self'`, Permissions-Policy exact, HSTS starts with `max-age=63072000; includeSubDomains`). Passed in Preview tests (before the merge) and in Live tests (run 2026-10-30 10:29 UTC, after the merge) | preview, live | Pass | 2026-10-30 |
| Accessibility | Not applicable: no page changes; the existing axe checks pass | local | Pass | 2026-10-30 |
| Security | `/security-review`: no findings at confidence 8 or higher. The review's security points: [review.md](review.md) | local | Pass | 2026-10-30 |
| Code review | [review.md](review.md) | local | Passed | 2026-10-30 |

## Test suite

`npm run test:time` before and after the change (budgets and rules in `wiki/system/testing.md`).

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before (TECH-025, `verification.md`) | 219 unit, 175 browser | 0.9 s + 167.2 s | 5.3 s |
| After (a quiet computer, `npm run test:time`) | 222 unit, 178 browser | 0.9 s + 177.1 s | 4.6 s, `TRIP-012-R1 R4 R5 R6 R10` |

Within the budgets (30 s, 180 s, 5 s per test). The total grew by 9.9 s (6 %) from the last record; the three new tests take about 3.5 s of it. An earlier run on the same day took 204.9 s while the computer was shared with another project's test run, so that number was load, not this change.

## Definition of Done

- [x] Tests: every check in the card's test plan is done; every requirement has a test or a recorded manual check; `npm run test:unit` passes and the full browser suite passes
- [x] Test suite: within the time budgets, total time grown by 6 %, and the new tests follow the quality rules
- [x] Deployed, and the smoke tests pass against production (Live tests)
- [x] Accessibility: not applicable, visitors see no change
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual: nothing visitors see changes, so `wiki/manual/` is unchanged; system docs (`wiki/system/`, new page `security-headers.md`) and `wiki/log.md` updated
- [x] No leftovers: the local `MAX_QUERY_LENGTH` of `/api/destination-search` and the cleared-count code and test are gone
- [x] Clean code: `npm run lint`, `npm run typecheck` pass; the build ran as part of `test:local`
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements noticed along the way added to the board: TECH-027 Strict Content Security Policy (#103)

## Requirements as built

### TECH-026-R1 The lookup counter is not cleared by a success

The site shall not reset the attempt counter of an address when a booking lookup or cancellation succeeds; the counter expires with its window.

Acceptance criteria:

- **Given** an address that has made four wrong guesses, **when** it looks up its own booking successfully and then guesses again, **then** the counter has kept counting and the address is locked after the limit in TRIP-023-R3.
- **Given** a visitor who looks up their own booking a few times in a row, **when** they stay under the limit, **then** every lookup works.

### TECH-026-R2 The airport search text is cut

The site shall cut the search text of `/api/airports` to the same maximum length as `/api/destination-search`.

Acceptance criteria:

- **Given** a request with a search text of 1 000 characters, **when** it is sent to `/api/airports`, **then** only the first 100 characters are used and the response is a normal list.

### TECH-026-R3 More security headers

The site shall send these headers on every page:

- `Permissions-Policy` that turns off camera, microphone and geolocation.
- `Strict-Transport-Security` with `max-age=63072000; includeSubDomains` (two years). No `preload`, since that can't easily be undone.
- A `Content-Security-Policy` set in `next.config.ts` that replaces today's `frame-ancestors 'none'`: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`. In `next dev` only, `script-src` also has `'unsafe-eval'` (React's debugging needs it). Directives are widened only if a real resource turns out to be blocked, and the reason is written in `solution.md`.

A strict script policy (no `'unsafe-inline'`) is not part of this card: nonces need every page to be rendered dynamically, which does not work with `cacheComponents` and `partialPrefetching` (Next.js docs, "Content Security Policy"), and Next's SRI option is experimental. The limit is written in `wiki/system/` and a Backlog card is added for a strict CSP.

Acceptance criteria:

- **Given** any page, **when** it is requested, **then** the three headers are present with the values above.
- **Given** the browser tests, **when** they run against the policy, **then** they pass without console errors from blocked resources (CSP violations).
- **Given** a page with an inline script injected by a test, **when** it is loaded, **then** that is not blocked (known limit, recorded in the wiki), while an external script from another origin is blocked.

### TECH-026-R4 No local files in Git, and the secrets file is closed

The repository shall not contain `.vitest/json/output.json`, and the README shall tell the developer to close the secrets file.

Acceptance criteria:

- **Given** the repository, **when** its files are listed, **then** `.vitest/json/output.json` is gone and `.vitest/` is in `.gitignore`.
- **Given** the README's setup steps, **when** they are read, **then** they include `chmod 600 .env.local` after the file is created (the command only, no values; `.env.local` is already ignored by Git). No script changes the mode.

### TECH-026-R5 The sign-in limit is documented

`wiki/system/` shall state that the admin sign-in is stateless (logging out deletes the cookie only, a stolen cookie works until it expires after 8 hours), that this is a known limit, and what would remove it (server-side sessions).

Acceptance criteria:

- **Given** the wiki, **when** the sign-in page is read, **then** the limit is described. Checked by code review (documentation only).

## Notes

- Vercel preview deployments load the Vercel toolbar from `vercel.live`, which `script-src 'self'` may block. It does not affect the site or the smoke tests; if the Preview tests show a CSP error, the reason is added to `solution.md` and the directive is widened.
- The card asked for the CSP check in the existing page tests; it is one test in the new spec over four main pages, since the policy is the same for every page (see `solution.md`).

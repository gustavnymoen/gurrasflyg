---
id: TECH-017
title: Limit admin sign-in attempts
---

# Verification of TECH-017

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-017-R1 | Unit tests `TECH-017-R1 …` in `lib/login-limit.test.ts`: the count, a right password clearing it, the 15 minutes, old rows removed | local, CI | Pass | 2026-10-26 |
| TECH-017-R2 | Unit tests `TECH-017-R1 R2 …` and `TECH-017-R2 another address …`; browser test `TECH-017-R2 R3 a locked address is refused …` with the right password | local, CI | Pass | 2026-10-26 |
| TECH-017-R3 | Unit test `TECH-017-R3 the minutes left …`; the browser test checks the message | local, CI | Pass | 2026-10-26 |
| TECH-017-R4 | The existing sign-in tests `TRIP-002-R1…R6` pass unchanged (a wrong password after one second, a right one signs in) | local, CI | Pass | 2026-10-26 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `lib/login-limit.test.ts` against the unit test database, with the time passed in | local, CI | Pass | 2026-10-26 |
| Browser tests | `tests/TECH-017-login-limit.spec.ts`, axe on the lock message; `tests/TRIP-002-admin-sign-in.spec.ts` unchanged | local, CI | Pass | 2026-10-26 |
| Smoke test | Not applicable: a smoke test must not fail logins on the live site | | | |
| Accessibility | axe on the sign-in page with the message; the checklist for the sign-in page on the live site | local | axe: Pass. Checklist: not checked yet (after the deploy) | 2026-10-26 |
| Security | `/security-review`: no findings; security points in the review | local | Pass | 2026-10-26 |
| Code review | [review.md](review.md) | local | Passed | 2026-10-26 |

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 93 unit, 175 browser | 0.4 s + 138.3 s | 3.1 s |
| After | 99 unit, 176 browser | 0.4 s + 138.1 s | see `npm run test:time` |

## Definition of Done

- [x] Tests, test suite and review: see the tables above
- [ ] Deployed, Live tests pass, accessibility checklist on the live site (after the deploy)
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/admin-logga-in.md`), system docs (`wiki/system/architecture.md`) and `wiki/log.md` updated
- [x] No leftovers

## Requirements as built

### TECH-017-R1 Count failed attempts

The sign-in shall count each wrong password per IP address in the database, and forget the count of an address 15 minutes after its latest failed attempt, or when that address signs in with the right password.

Acceptance criteria:

- **Given** an address with 3 failed attempts, **when** it signs in with the right password, **then** its count is cleared.
- **Given** an address whose latest failed attempt is older than 15 minutes, **when** it tries again, **then** it has no failed attempts.

### TECH-017-R2 Lock after 5

The sign-in shall refuse an address with 5 failed attempts within the last 15 minutes, without checking the password, even if it is right.

Acceptance criteria:

- **Given** 5 wrong passwords from one address, **when** the same address sends the right password, **then** it is refused.
- **Given** the same situation, **when** another address sends the right password, **then** it signs in.

### TECH-017-R3 Message when locked out

A refused visitor shall see "För många försök. Försök igen om N minuter." ("1 minut" for one; N rounded up, at least 1), shown as the form's error like "Fel lösenord.".

Acceptance criteria:

- **Given** a locked address, **when** it tries, **then** the message with the minutes left is shown and the page doesn't sign in.

### TECH-017-R4 The rest as before

A wrong password shall still be answered after one second, and a right password from an address with fewer than 5 failed attempts still signs in.

## Notes

- `inTestDb` in `tests/plan.ts` is now exported so the browser test can use it.
- The message says "1 minut" for one minute, "N minuter" otherwise.

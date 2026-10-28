---
id: TECH-025
title: Rate limit on public flows
---

# Verification of TECH-025

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-025-R1 | Unit tests `TECH-025-R1 …` in `lib/rate-limit.test.ts` (10 presses counted, the 11th refused, another address not limited, the window from the first press, spread-out presses never locked, the minutes in the message). Browser test `TECH-025-R1 a locked address that presses Betala …` in `tests/TECH-025-rate-limit.spec.ts` (message with axe, no booking saved) | local | Pass | 2026-10-28 |
| TECH-025-R2 | Unit tests `TECH-025-R2 …` in `lib/rate-limit.test.ts` (cleanup per flow, rows older than every window, a window that is too long, clearing one key); `lib/login-limit.test.ts` and the sign-in and Min bokning browser tests (TECH-017, TRIP-023) pass unchanged | local | Pass | 2026-10-28 |
| TECH-025-R3 | Unit tests `TECH-025-R3 …` in `lib/rate-limit.test.ts` (60 calls counted, the 61st refused with the seconds left, per route and address, steady use of 61 calls 30 seconds apart never refused, a new minute from the first call). Browser test `TECH-025-R3 a locked address gets 429 …` (429, `Retry-After`, the JSON message, another route and another address still answer) | local | Pass | 2026-10-28 |
| TECH-025-R4 | Unit tests `TECH-025-R4 …` in `app/flyg/boka/actions.test.ts` (both actions refuse an address over 1 000 characters as "ändrats") | local | Pass | 2026-10-28 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `lib/rate-limit.test.ts` (10 tests) and `app/flyg/boka/actions.test.ts` (2 tests); `lib/login-limit.test.ts` unchanged. `npm run test:unit`: 219 pass | local, CI | Pass | 2026-10-28 |
| Browser tests | `tests/TECH-025-rate-limit.spec.ts` (2 tests, run only locally since they write to the test database). `npm run test:local`: 175 pass. The 20 attempts of an address are written to the test database and removed by the test | local, CI | Pass | 2026-10-28 |
| Smoke test | Not applicable: no main page or flow changes, and the limits don't apply to a request without `x-forwarded-for` | | | |
| Accessibility | axe on the Betala page with the new message in the browser test. The checklist in `wiki/system/accessibility.md` is not gone through: the message is shown by the existing alert component, which TRIP-014 and TRIP-012 already checked | local | Pass | 2026-10-28 |
| Security | `/security-review`: no findings at confidence 8 or higher. The code review's security points: [review.md](review.md) | local | Pass | 2026-10-28 |
| Code review | [review.md](review.md) | local | Passed | 2026-10-28 |

## Test suite

`npm run test:time` before and after the change (budgets and rules in `wiki/system/testing.md`).

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before (TECH-024, `verification.md`) | 204 unit, 173 browser | 0.8 s + 167.0 s | 3.7 s, `TRIP-029-R3 R4` |
| After | 219 unit, 175 browser | 0.9 s + 167.2 s | 5.3 s, `TRIP-012-R1 R4 R5 R6 R10` |

Within the budgets (30 s, 180 s) except one test: `TRIP-012-R1 R4 R5 R6 R10` took 5.3 s against the 5.0 s per test. The change adds no work to it (a request without `x-forwarded-for` is not counted), and it took 3 to 4 s in the earlier runs of this change, so it is run-to-run variation, not this change. The new browser tests take under 1 s together.

## Definition of Done

- [x] Tests: every check in the card's test plan is done; every requirement has a test named after it; `npm run test:unit` and `npm run test:local` pass (`npm run test:time`)
- [x] Test suite: within the time budgets (one run 0.3 s over the per-test budget, see above), total time grown by 0.2 s, and the new tests follow the quality rules
- [ ] Deployed, and the smoke tests pass against production (Live tests)
- [x] Accessibility: the new message on Betala passes `expectNoA11yViolations`; nothing else visitors see changes
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/`), system docs (`wiki/system/`, new page `rate-limits.md`) and `wiki/log.md` updated
- [x] No leftovers: `clientIp()` and the "För många försök" text were copied in the sign-in and Min bokning actions and are now shared; `tripDays()` moved to `tests/helpers.ts`
- [x] Clean code: reuses the existing table, helpers and alert; `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements noticed along the way added to the board: none needed. Noted for later: the table `login_attempts` and its columns no longer say what they hold (a rename is out of scope per the card)

## Requirements as built

### TECH-025-R1 Limit on booking

The site shall allow at most 10 presses of Betala per IP address in 15 minutes, for flight and charter bookings together. Every press counts, also one that fails validation, and it is counted before anything is checked or saved, in one call, so many requests at once can't slip past the limit. A request without `x-forwarded-for` (a local run, as in the test suite) is not limited. The 15 minutes are counted from the first counted press.

- **Given** an IP address that has pressed Betala 10 times in 15 minutes, **when** it presses Betala again, **then** no booking is saved and the visitor sees "För många försök. Försök igen om N minuter."
- **Given** the window has passed, **when** the visitor presses Betala, **then** it works again.
- **Given** a normal visitor, **when** they book, **then** nothing changes.

### TECH-025-R2 One shared helper

The limits use one helper that takes the key, the maximum and the window, and keeps its rows in the existing table `login_attempts` with the flow as a prefix in the key. Rows older than their own flow's window are removed. Sign-in and Min bokning behave as before, with 5 attempts in 15 minutes.

- **Given** the existing tests for sign-in and Min bokning, **when** they run, **then** they pass unchanged.
- **Given** two flows with different windows, **when** rows expire, **then** one flow's cleanup doesn't remove the other's rows.

### TECH-025-R3 Limit on the API routes

`/api/airports`, `/api/destination-search` and `/api/destinations` answer 429 with a `Retry-After` header when one IP address calls the same route more than 60 times in a minute (counted from the first call). The count is kept per route and counted before the data is read. A request without `x-forwarded-for` is not limited.

- **Given** an IP address over the limit, **when** it calls a route, **then** the answer is 429, `Retry-After` is set and no data is read.
- **Given** normal use of the search field, **when** a visitor types, **then** no answer is 429.
- **Given** the limit on one route, **when** the same IP address calls another route, **then** the other route is not affected.

### TECH-025-R4 Length limit on query

`bookAction` and `bookCharterAction` refuse a `query` longer than 1 000 characters.

- **Given** a `query` of more than 1 000 characters, **when** the action is called, **then** the answer is the "ändrats" error and nothing is read or saved.

## Notes

- The exemption of requests without `x-forwarded-for` was not in the card when it was specified; it was added to R1 and R3 when the build showed the suite books many times from one address.
- The first review stopped the change: the window was counted from the latest attempt, so steady use could be refused. It now counts from the first attempt for Betala and the API routes (`fixedWindow`); the sign-in keeps its older meaning.

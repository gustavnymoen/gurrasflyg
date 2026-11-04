---
id: TECH-029
title: Audit cleanups
---

# Verification of TECH-029

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-029-R1 | Tests `TECH-029-R1 …` in `lib/destinations.test.ts`: one read equals the destination in the whole list, an unknown id and a destination without flights give `null`. The browser tests of the destination pages and the charter flow pass | local | Pass | 2026-11-04 |
| TECH-029-R2 | Tests `TECH-029-R2 …` in `lib/booking-common.test.ts` (number format, prefix, a taken number skipped, lookup by `request_id`, which errors the visitor sees). `lib/bookings.test.ts` and `lib/charter-bookings.test.ts` pass unchanged (same request id twice gives one booking, same error texts). Code review: table names come only from the typed `BookingTable` in the repo | local | Pass | 2026-11-04 |
| TECH-029-R3 | Tests `TECH-029-R3 …` in `lib/reviews.test.ts` (4 tests) | local | Pass | 2026-11-04 |
| TECH-029-R4 | `npm run test:time`: 237 unit and 178 browser tests pass; no test removed or changed in what it checks (the only edit to an old file is two added tests in `lib/destinations.test.ts`) | local | Pass | 2026-11-04 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `lib/reviews.test.ts`, `lib/booking-common.test.ts`, two tests in `lib/destinations.test.ts` | local | Pass | 2026-11-04 |
| Browser tests | Not applicable: none new; the existing ones for destination pages, charter and flight booking pass | local | Pass | 2026-11-04 |
| Smoke test | Not applicable: none new; the existing ones cover both flows | | | |
| Accessibility | Not applicable: no page changes | | | |
| Security | Security points in the review; `/security-review` not needed (no sign-in, admin, API route or query input changes) | local | Pass | 2026-11-04 |
| Code review | [review.md](review.md) | local | Passed | 2026-11-04 |

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 228 unit, 178 browser | 0.8 s + 138.3 s | 2.9 s |
| After | 237 unit, 178 browser | 0.8 s + 136.2 s | 2.8 s |

## Definition of Done

- [x] Tests: the plan's checks are done; `npm run test:unit` and `npm run test:local` (via `test:time`) pass
- [x] Test suite: within the budgets; nine fast unit tests added
- [ ] Deployed, and the smoke tests pass against production (Live tests): not checked, nothing is pushed yet
- [x] Accessibility: not applicable, visitors see no change
- [x] Requirements as built below, no open questions; `solution.md` describes the work
- [x] Manual not affected; system docs and `wiki/log.md` updated
- [x] No leftovers: `randomBookingCode`, `newBookingNumber`, the `INVALID` texts and the try/catch copies are gone from the two booking files and actions; `.claude/launch.json` is not committed
- [x] Clean code: `npm run lint`, `npm run typecheck` pass; the build ran
- [x] Code review done, no must-fix findings; one should-fix fixed (empty id): see [review.md](review.md)
- [x] Technical tasks: none new

## Requirements as built

### TECH-029-R1 One destination per lookup
`getCharterDestination(id)` and `getDestinationAirport(id)` read only the destination with that id (row, aliases, tags, transport, photo). `getDestinations()` uses the same `readDestinations()`. Unknown id and no flights give `null`.

### TECH-029-R2 Shared booking helpers
`lib/booking-common.ts` holds `BookingError` (`CharterBookingError` is a subclass), `INVALID`, `newBookingNumber()` (table and prefix as parameters), `findBookingByRequestId()` and `bookingFailure()`, used by both bookings and both actions. Table names come only from code, with the `nosemgrep` note.

### TECH-029-R3 Unit test for reviews
`lib/reviews.test.ts` runs against the unit-test database and cleans up: rating, empty/blank/non-text fields, limits (over refused, at the limit saved), trimming, newest first, delete.

### TECH-029-R4 Behaviour unchanged
All tests pass; the number of tests grew from 228 to 237 unit tests.

## Notes

- The first `npm run test:time` after the build showed 3 failed unit tests. The same unit tests passed in seven later runs, alone and in `test:time`, and the failures were not captured; the cause is not known. Not reproduced.

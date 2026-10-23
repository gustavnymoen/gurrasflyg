---
id: TRIP-011
title: Choose aircraft and classes
---

# Verification of TRIP-011

How each requirement was checked. Unit tests in `lib/fare-rules.test.ts`, `lib/trip.test.ts`, `lib/numbers.test.ts`, `lib/format.test.ts` and `db/migrations/008_factors.test.ts`; browser tests in `tests/TRIP-011-aircraft-and-classes.spec.ts`.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-011-R1 | Browser: `TRIP-011-R1 Fortsätt opens the chosen flights …`, `… an address without a chosen flight says what to do`; unit: `TRIP-011-R1` in `lib/trip.test.ts` | local | Pass | 2026-10-23 |
| TRIP-011-R2 | Browser: `TRIP-011-R2 each aircraft shows its price, time, arrival …`; unit: `TRIP-011-R2` in `lib/fare-rules.test.ts` and `lib/trip.test.ts`. Different aircraft per flight kept: the R10 browser tests | local | Pass | 2026-10-23 |
| TRIP-011-R3 | Browser: `TRIP-011-R3 the classes start with everyone in the cheapest …`, `… at 320 px …`; unit: `TRIP-011-R3` in `lib/fare-rules.test.ts`. "Fortsätt cannot be used": step Klasser has no Fortsätt until TRIP-012 (R5) | local | Pass | 2026-10-23 |
| TRIP-011-R4 | Browser: `TRIP-011-R4 the prices per class, per flight and for the trip …`; unit: `TRIP-011-R4` (1 000 × 1,20 × 1,50; 2 × 1 800 + 1 200 = 4 800) | local | Pass | 2026-10-23 |
| TRIP-011-R5 | Code review: the page ends with the prices; the button is checked in TRIP-012 | local | Pass (as far as it goes now) | 2026-10-23 |
| TRIP-011-R6 | Browser: `TRIP-011-R6 a class's price factor is shown, checked and used in the prices`; unit: `TRIP-011-R6` (reading, 1–10, migration data, `CHECK`) | local | Pass | 2026-10-23 |
| TRIP-011-R7 | Browser: the R2 and R8 tests (time and arrival per aircraft); unit: `TRIP-011-R7` (140 × 4,00 = 9 h 20 min, "+1" over midnight, time zones, summer time) | local | Pass | 2026-10-23 |
| TRIP-011-R8 | Browser: `TRIP-011-R8 an aircraft's factors are shown, checked and used in the times`; unit: `TRIP-011-R8` (reading, limits, migration data) | local | Pass | 2026-10-23 |
| TRIP-011-R9 | Browser: `TRIP-011-R9 the från price in the results is the cheapest aircraft with room for everyone`; unit: `TRIP-011-R9` | local | Pass | 2026-10-23 |
| TRIP-011-R10 | Browser: two `TRIP-011-R10` tests (another aircraft, back and on, another flight); unit: `TRIP-011-R10` in `lib/trip.test.ts` | local | Pass | 2026-10-23 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | As above; 69 unit tests in all | local | Pass | 2026-10-23 |
| Browser tests | 12 in `tests/TRIP-011-aircraft-and-classes.spec.ts`, with their own classes and aircraft (worker fixture); TRIP-004's cell positions updated | local | Pass | 2026-10-23 |
| Smoke test | `TRIP-011-R1 @smoke the page for a chosen flight loads and lists aircraft` | local | Pass locally; preview and live not checked yet | 2026-10-23 |
| Accessibility | axe: step Plan with an aircraft chosen, step Klasser with a message, step Plan with a message, the admin class and aircraft forms with errors; 320 px without sideways scrolling. The checklist on the live site: not checked yet (after the deploy) | local | Pass (axe); checklist not checked yet | 2026-10-23 |
| Security | Security points in the review, and `/security-review`: no findings | local | Pass | 2026-10-23 |
| Code review | [review.md](review.md) | local | Passed | 2026-10-23 |

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before (TRIP-010's verification) | 39 unit, 139 browser | about 99 s | under 5 s |
| After | 69 unit, 153 browser | 111.0 s (budget 180 s) | 2.8 s |

Growth about 12 %, within the 25 % rule. The new browser tests take 0.3–2.7 s each.

## Definition of Done

- [x] Tests: every check in the test plan is done except those after the deploy; every requirement is tested; `npm run test:unit` and `npm run test:local` pass
- [x] Test suite: within the budgets, growth about 12 %, the new tests follow the quality rules
- [ ] Deployed, and the smoke tests pass against production (Live tests): not yet
- [ ] Accessibility: axe passes on every new state; the checklist on the live site: not checked yet
- [x] Requirements in the card match what was built (R6 and R8 got the cap of 10,00 with the user), no open questions; `solution.md` describes how it was built
- [x] Manual, system docs and `wiki/log.md` updated
- [x] No leftovers
- [x] Clean code: `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings; see [review.md](review.md)
- [x] Technical tasks: none needed (see "Outside the change" in review.md)

## Requirements as built

The card's requirements as of 2026-10-23 (`gh issue view 16`), built as written, with R6 and R8 including the cap: every factor is at most 10,00 (price factors 1,00–10,00, time factor more than 0 and at most 10,00). An aircraft that can't be chosen shows its time, arrival and price but isn't compared.

## Notes

- The smoke test needs at least one aircraft in the database. Production has some; whether Preview's Turso database has any is not checked.
- Also recorded on this branch: TRIP-010's Live tests after its merge, in its `verification.md`.
- When TRIP-011 was done, the user asked for a change to its flow: the aircraft chosen together with the departure and shown in the summary, and the classes starting at 0 with no going on until everyone is placed. Added as TRIP-024 (#62), at the top of Backlog.

---
id: TECH-021
title: Faster browser tests
---

# Verification of TECH-021

How each requirement was checked. Only tests changed; the site did not.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-021-R1 | Code review: every old test of the twelve files is in a combined test named after its requirements (list below), every assertion moved as it was; the whole suite passes with no retries; every page and state that had an axe check still has one | local | Pass | 2026-10-26 |
| TECH-021-R2 | `npm run test:time`: 148 browser tests in 145.4 s (was 201 in 189.2 s), slowest 3.7 s | local | Pass | 2026-10-26 |

## Old test to combined test

Each row is a group of old tests (short names), and the one test that now checks them.

| Old tests | Now |
|---|---|
| TRIP-003-R2, R3, R4, R5 | `TRIP-003-R2 R3 R4 R5 …` (one class) |
| TRIP-003-R6, R7, R8, R9 | `TRIP-003-R6 R7 R8 R9 …` (one add-on) |
| TRIP-004-R1, R2, R7, R8, R9 | `TRIP-004-R1 R2 R7 R8 R9 …` (one aircraft) |
| TRIP-004-R3, R4, R5, R6 | `TRIP-004-R3 R4 R5 R6 …` (the new aircraft's form) |
| TRIP-006-R1, R2 | `TRIP-006-R1 R2 …` |
| TRIP-006-R3, R4 | `TRIP-006-R3 R4 …` (the text is emptied before the "required" checks) |
| TRIP-010-R1 missing value, R1 same airport | `TRIP-010-R1 a missing value … and the same airport …` |
| TRIP-010-R2 new tab, R4 count, R5, R7 | `TRIP-010-R2 R4 R5 R7 …` |
| TRIP-010-R6 card, R9 one-way | `TRIP-010-R6 R9 …` (3 travellers) |
| TRIP-010-R2 form and new date, R8, R9 return trip, R6 at 320 px | `TRIP-010-R2 R6 R8 R9 …` (searches a later outbound date first; resizes to 320 px mid-test) |
| TRIP-011-R2, R9 | `TRIP-011-R2 R9 …` |
| TRIP-011-R3, R3 at 320 px | `TRIP-011-R3 …` |
| TRIP-011-R4, R10 (both) | `TRIP-011-R4 R10 …` |
| TRIP-011-R8, R8 at 320 px | `TRIP-011-R8 …` |
| TRIP-012-R1, R4, R5 R6, R10 | `TRIP-012-R1 R4 R5 R6 R10 …` (return trip; outbound in the 2,00 class, return in the 1,00 class) |
| TRIP-012-R2, R3 | `TRIP-012-R2 R3 …` (add-ons added and taken off before the classes are swapped) |
| TRIP-013-R1 no match, R2 and R3 Rensa | `TRIP-013-R1 R2 R3 R9 …` (axe on the no-match and results states) |
| TRIP-013-R3 Plats, R3 Aktivitet | `TRIP-013-R3 R9 …` (axe on the start cards) |
| TRIP-013-R9 `/charter` axe, destination pages axe | axe moved into `TRIP-013-R1 R9` (suggestions open), `R1 R2 R3 R9`, `R3 R9`, `R7 R9` (Teufelsberg) and `R8 R9` (no flights) |
| TRIP-018-R1 four tab tests | `TRIP-018-R1 choosing Charter …` |
| TRIP-018-R2 plan page, R3 Nej/Escape, R3 plan abort, R4 axe on the plan page | `TRIP-018-R2 R3 R4 the plan page …` |
| TRIP-018-R4 modal, R4 axe on `/charter` | `TRIP-018-R4 is a modal …` |
| TRIP-019-R3 shadows, R4 add-on, R5 buttons, accessibility | `TRIP-019-R3 R4 R5 …` |
| TRIP-021-R1 suggestions, R3 carousel focus | `TRIP-021-R1 R3 …` |
| TRIP-021-R1 aircraft axe, R3 at 320 px | `TRIP-021-R1 R3 axe … and at 320 px …` |
| TRIP-021-R4 limits, trim, longest | `TRIP-021-R4 …` |
| TRIP-024-R2, R3, R5 | `TRIP-024-R2 R3 R5 …` |
| TRIP-026-R2, R3 | `TRIP-026-R2 R3 …` (the aircraft is Snabb) |
| TRIP-026-R4, R5 | `TRIP-026-R4 R5 …` |

Not combined: the smoke tests, TRIP-001, TRIP-002, TRIP-009, TRIP-016, TRIP-025, TRIP-027, TECH-005, TECH-007, TECH-017, TECH-018 and TECH-019.

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | Not applicable: nothing changes outside the tests (124 pass, 0.7 s) | local | Pass | 2026-10-26 |
| Browser tests | The combined tests; the whole suite (`npm run test:time`) passes | local | Pass | 2026-10-26 |
| Smoke test | Not applicable: no page or flow changes | | | |
| Accessibility | The axe checks are kept on the same pages and states | local | Pass | 2026-10-26 |
| Security | Not applicable: tests only | | | |
| Code review | [review.md](review.md) | local | Passed | 2026-10-26 |

## Test suite

`npm run test:time` before and after the change, on `main` without TRIP-014. Run with its own `HOME`, so another checkout's run could not delete the test database.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 201 | 189.2 s (over the 180 s budget) | 3.5 s |
| After | 148 | 145.4 s (budget 180 s) | 3.7 s (`TRIP-012-R1 R4 R5 R6 R10 …`) |

Unit tests: 124, 0.7 s.

After `main` (with TRIP-014 and TRIP-028) was merged into the branch on 2026-10-26: 160 browser tests in 155.7 s, slowest 3.6 s; unit tests 160, 0.7 s. Without this change the same code would be about 200 s. The 150 s of R2 was measured on the base before that merge; the new features add about 10 s.

## Definition of Done

- [x] Tests: every check in the card's test plan is done; `npm run test:unit` and `npm run test:local` pass
- [x] Test suite: 145.4 s of 180 s, no test over 5 s, quality rules followed
- [ ] Deployed, and the smoke tests pass against production (Live tests)
- [x] Accessibility: not applicable, visitors see no change; the axe checks are kept
- [x] Requirements in the card match what was built, no open questions left; copied below; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/`, no change), system docs (`wiki/system/testing.md`) and `wiki/log.md` updated
- [x] No leftovers: unused imports and helpers removed
- [x] Clean code: `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left
- [x] Technical task noted: a test database per checkout (see `solution.md`)

## Requirements as built

Copied from the card (#84) on 2026-10-26.

### TECH-021-R1 The site behaves as before

Every requirement that had a browser test before still has a check named after it (a combined test is named after all the requirements it checks), no check is weakened, and the suite passes.

### TECH-021-R2 A suite within the budget

`npm run test:time` shows at most 150 s for the browser tests (now 189 s), and no single test over 5 s. Built: 145.4 s, slowest 3.7 s.

## Notes

Three small differences in how a state is reached are in `solution.md`. Two more: the no-match axe check in TRIP-013 loads `?sok=zzzzqx&varldsdel=Europe` (was `?sok=zzzzqx`), and the plain admin page's axe check in TRIP-019 now comes first in the combined test.

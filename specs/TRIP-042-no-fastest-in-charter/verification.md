---
id: TRIP-042
title: No "Snabbast" in the charter plan step
---

# Verification of TRIP-042

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-042-R1 | Charter: `TRIP-039-R1 R2 R3 TRIP-042-R1 …` in `tests/TRIP-039-charter-aircraft.spec.ts` (no card has "Snabbast", the cheapest still has "Billigast"). Flights: `TRIP-011-R2 R9 TRIP-042-R1 …` in `tests/TRIP-011-aircraft-and-classes.spec.ts` (every card has "Snabbast" or "+x min", unchanged) | local | Pass | 2026-11-06 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | None planned: hiding the badge is presentation; `lib/fare-rules.ts` and its tests are unchanged (317 pass) | local | Pass | 2026-11-06 |
| Browser tests | The two tests above, with axe as in the existing plan tests; TRIP-040 tests also run | local | Pass | 2026-11-06 |
| Smoke test | None planned | | | |
| Accessibility | Not applicable beyond the existing axe checks (a badge is removed) | | | |
| Security | `/security-review` not needed (no input, data or sign-in touched) | | | |
| Code review | [review.md](review.md) | local | Passed | 2026-11-06 |

## Test suite

No test was added: the two checks went into existing tests, so the count is the same.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before (TECH-031, 2026-11-06) | 317 unit + 223 browser | unit 6.5 s, browser 191.2 s | 3.7 s |
| After | 317 unit + 223 browser | unit 6.2 s, browser 190.5 s | 4.3 s |

The browser tests are over the 3 minute budget in `wiki/system/testing.md` (since TRIP-039 and TRIP-040, before this change); not handled here. The slowest test is the TRIP-039 plan-step test, within the 5 s budget; its time varies from run to run.

## Definition of Done

Not all checked: the deploy and the Live tests are left.

## Requirements as built

### TRIP-042-R1 No "Snabbast" in charter

**Given** the plan step of a charter trip, **then** no aircraft card shows "Snabbast". **Given** the plan step of flights, **then** it is shown as before.

## Notes

None.

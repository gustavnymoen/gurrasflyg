---
id: TRIP-029
title: Price lists per area and beer from 18
---

# Verification of TRIP-029

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-029-R1 | Unit: `TRIP-029-R1 R2 a charter total is split 40/30/20/10/0 …` in `lib/booking-rules.test.ts`; browser: `TRIP-014-R8 R9 R10 TRIP-029-R1 …` (charter's Betala lists the five rows) | local | Pass | 2026-10-26 |
| TRIP-029-R2 | Unit: `TRIP-027-R1 TRIP-029-R2 …` and the charter test; browser: `TRIP-027-R2 R4 TRIP-029-R2 …`, `TRIP-027-R3 R4 TRIP-029-R2 …` | local | Pass | 2026-10-26 |
| TRIP-029-R3 | Unit: `TRIP-029-R3 beer is the add-on named Öl …`, `TRIP-029-R3 the server refuses beer …`; browser: `TRIP-029-R3 R4 Öl waits for 18 …` | local | Pass | 2026-10-26 |
| TRIP-029-R4 | Unit: `TRIP-029-R4 a passenger under 18 loses the beer …`; browser: `TRIP-029-R3 R4 …` (the text, the price, axe) | local | Pass | 2026-10-26 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | As above; 204 unit tests in all | local | Pass | 2026-10-26 |
| Browser tests | `tests/TRIP-029-price-lists-and-beer.spec.ts` (only locally: it creates the add-on Öl), TRIP-027's and TRIP-014's tests updated | local | Pass | 2026-10-26 |
| Smoke test | Not applicable: no new page or flow | | | |
| Accessibility | axe on the passenger card with the text, and on the price lists (TRIP-027, TRIP-014). The checklist on the live site: not checked yet (after the deploy) | local | Pass (axe); checklist not checked yet | 2026-10-26 |
| Security | Security points in the review; `/security-review` not needed | local | Pass | 2026-10-26 |
| Code review | [review.md](review.md) | local | Passed | 2026-10-26 |

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before (TRIP-023, PR #92) | 200 unit, 172 browser | not recorded here | |
| After | 204 unit, 173 browser | 173.3 s (budget 180 s) | 6.2 s, `TRIP-013-R1` (over budget, not this change) |

The new test takes 3.6 s. The suite is close to its budget and one older test is over it: TECH-023 (#94) is at the top of Backlog.

## Definition of Done

- [x] Tests: every check in the test plan done except those after the deploy; `npm run test:unit` and `npm run test:local` pass
- [ ] Test suite: within the total budget, but `TRIP-013-R1` is over 5 s (not this change; TECH-023)
- [ ] Deployed, and the smoke tests pass against production (Live tests): not yet
- [ ] Accessibility: axe passes; the checklist on the live site: not checked yet
- [x] Requirements in the card match what was built, no open questions
- [x] Manual, system docs and `wiki/log.md` updated
- [x] No leftovers (`ADULT_AGE` moved, not copied)
- [x] Clean code: lint, type check and build pass
- [x] Code review done, no must-fix findings
- [x] Technical tasks: TECH-023 (#94); `vitest` no longer runs `.claude/` (fixed here)

## Requirements as built

As in the card (`gh issue view 93`) on 2026-10-26: R1 charter's price list Bränsle 40, Mutor 30, Diverse ospecificerade avgifter 20, Försäkring 10, Skatt 0; R2 "Diverse ospecificerade avgifter" in both lists; R3 Öl (by name, any case) only for a passenger aged 18 or more, "Från 18 år" otherwise, refused by the server; R4 beer removed on every flight with "Ölen togs bort eftersom passageraren är under 18 år." when the age goes below 18.

## Notes

- Also fixed: `vitest.config.mts` excludes `.claude/**`, where other sessions' worktrees made `npm run test:unit` run thousands of unrelated tests.

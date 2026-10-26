---
id: TRIP-025
title: Departures fill in from the top
---

# Verification of TRIP-025

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-025-R1 | Tests `TRIP-025-R1 …` in `tests/TRIP-025-departures-fill-in.spec.ts` (outbound and return list: every card has `fill-in`, card N starts at N × 60 ms) and `TRIP-025-R1 …` in `lib/flight-rules.test.ts` | local | Pass | 2026-10-26 |
| TRIP-025-R2 | Unit test `TRIP-025-R2 …` (the 11th and later cards get the tenth's delay); browser test `TRIP-025-R2 …` (a card chosen with the keyboard right after the list appears). Not in a browser: the routes have 5–7 departures a day, so no list has an 11th card | local | Pass | 2026-10-26 |
| TRIP-025-R3 | Test `TRIP-025-R3 …`: after the animation, changing the sorting both ways leaves no animation on any card. Going back with Ändra utresa mounts a new list, as the same code path as the step change in R1 (code review, `solution.md`) | local | Pass | 2026-10-26 |
| TRIP-025-R4 | Test `TRIP-025-R4 …` with `reducedMotion: "reduce"`: no card has an animation and all are fully opaque | local | Pass | 2026-10-26 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `fillInDelay` for the first cards and the cap at the tenth | local | Pass | 2026-10-26 |
| Browser tests | `tests/TRIP-025-departures-fill-in.spec.ts`, 5 tests | local | Pass | 2026-10-26 |
| Smoke test | Not applicable: no page or flow added | | | |
| Accessibility | axe on the finished list (`TRIP-025-R1 the finished list …`); item 11 of `wiki/system/accessibility.md` (reduced motion) | local | Pass (axe); live checklist not checked yet | 2026-10-26 |
| Security | Not applicable: styling only, `/security-review` not needed | | | |
| Code review | [review.md](review.md) | local | Passed | 2026-10-26 |

## Test suite

`npm run test:time` before and after the change (budgets and rules in `wiki/system/testing.md`). Before: the numbers recorded by TECH-020 (main has gained the tests of TRIP-016 since).

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 100 unit + 181 browser | 0.4 s + 141.4 s | 2.8 s |
| After | 104 unit + 188 browser | 0.4 s + 166.1 s | 2.8 s |

The time went up by 17 %, within the 25 % allowed; the new tests add about 8 s (5 tests, two of which search twice).

Live tests after the deploy: not checked yet.

## Definition of Done

- [x] Tests: every check in the card's test plan is done; `npm run test:unit` and `npm run test:local` pass
- [x] Test suite: within the time budgets, total time grown by 17 %, new tests follow the quality rules
- [ ] Deployed, and the smoke tests pass against production (Live tests): not checked yet
- [ ] Accessibility: axe passes locally; the checklist item 11 on the live site: not checked yet
- [x] Requirements in the card match what was built, no open questions left; copied below; `solution.md` describes how it was built
- [x] Manual, system docs and `wiki/log.md` updated
- [x] No leftovers
- [x] Clean code: `npm run lint`, `npm run typecheck` and `npm run build` (in `test:local`) pass
- [x] Code review done, no must-fix findings; see [review.md](review.md)
- [x] No larger improvements noticed

## Requirements as built

Unchanged from the card (`gh issue view 65`):

- **R1 Departures fill in from the top:** each card fades in and slides about 8 px down, one after another from the top, about 60 ms after the previous one, 250 ms each, for the outbound and the return list.
- **R2 Never slow for long lists:** only the first 10 cards are delayed one after another; the list is usable during the animation.
- **R3 Only when a list appears:** not when the sorting changes or in the summary; a list shown again after going back counts as appearing.
- **R4 No motion when the visitor asks for less:** with `prefers-reduced-motion: reduce` the cards appear at once.

---
id: TRIP-034
title: Styled multi-choice charter filters
---

# Verification of TRIP-034

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-034-R1 | `TRIP-034-R1 R5 a filter is a button …` in `tests/TRIP-034-charter-filters.spec.ts` (button text, keyboard, Escape, outside click, other filter, counts); look in `TRIP-034-R1 R5 the charter filters …` in `tests/TECH-018-design.spec.ts` | local | Pass | 2026-11-05 |
| TRIP-034-R2 | Unit `TRIP-034-R2 several choices …`; browser `TRIP-034-R2 R3 R5 several choices …` and `TRIP-034-R2 R3 unchecking the last choice …` | local | Pass | 2026-11-05 |
| TRIP-034-R3 | Unit `TRIP-034-R3 …` (two tests); browser: reload, back, old link, unknown value, link back from a destination page | local | Pass | 2026-11-05 |
| TRIP-034-R4 | Unit `TRIP-034-R4 …` (three tests); browser `TRIP-034-R4 a panel lists no option without hits …` | local | Pass | 2026-11-05 |
| TRIP-034-R5 | 320 px: `TRIP-013-R5 and R9 and TRIP-014-R11 …` in `TECH-018-design.spec.ts` (panels inside the screen, no sideways scroll); row height ≥ 24 px in the TECH-018 test; axe closed, open and with choices in the TRIP-034 test; focus in `TRIP-013-R9 a filter keeps focus …` and the TRIP-034 test; names with count read through `getByRole("checkbox", { name })` | local | Pass | 2026-11-05 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | 6 new tests and 4 rewritten in `lib/destinations.test.ts` | local | Pass | 2026-11-05 |
| Browser tests | `tests/TRIP-034-charter-filters.spec.ts` (5 tests); the selects in `tests/TRIP-013-destinations.spec.ts` rewritten to the new control | local | Pass | 2026-11-05 |
| Smoke test | None new; the `/charter` smoke test (TRIP-013-R7) passes locally and in Live tests after the merge | local, live | Pass | 2026-11-05 |
| Accessibility | axe in the TRIP-034 test (closed, panel open, with choices); the checklist on the live site: not checked | local | axe pass; checklist not checked | 2026-11-05 |
| Security | Not needed (card); values from the address are checked against the data as before | – | Not applicable | 2026-11-05 |
| Code review | [review.md](review.md) | local | Passed | 2026-11-05 |

## Test suite

`npm run test:time`. Before is the record of TRIP-033.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 270 unit, 196 browser | 1.8 s + 143.8 s | 2.8 s |
| After | 276 unit, 202 browser | 1.8 s + 162.5 s | 3.5 s |

Within the budgets; +13 % in total. The slowest, `TRIP-013-R2 a choice shows …`, goes through three pages; one more TRIP-013 test was rewritten, not added.

## Definition of Done

- [x] Tests: every check in the card's test plan that can run locally is done; `npm run test:unit` and `npm run test:local` pass
- [x] Test suite: within the time budgets, total time grown by 13 %, the new tests follow the quality rules
- [x] Deployed, and the smoke tests pass against production (Live tests): passed 2026-11-05
- [ ] Accessibility: axe passes; the checklist on the live site is not checked yet
- [x] Requirements in the card match what was built, no open questions left; copied below; `solution.md` describes how it was built
- [x] Manual, system docs and `wiki/log.md` updated
- [x] No leftovers: the `<select>`s, `Field` wrappers for them and the `selectOption` tests are gone
- [x] Clean code: `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements: none noticed

## Requirements as built

As in the card (`gh issue view 125`), unchanged: R1 Filter control in the site's look, R2 Several choices per filter, R3 Choices in the address, R4 No dead choices, R5 Works on a phone and with a screen reader.

## Notes

- The card's example "Kategori Gruva" does not exist in the data; the tests use "Industriplats".
- With Världsdel Antarktis the Land panel lists only the countries that have a destination there (GS and AQ), since options without hits are hidden; "as today" for the list of countries to choose from.
- An address like `?tillgang=Open&varldsdel=Antarctica` (typed by hand) has no result, and the Land panel is then empty; the controls cannot lead there.

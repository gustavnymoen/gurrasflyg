---
id: TRIP-028
title: Clickable destination cards, no start cards
---

# Verification of TRIP-028

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-028-R1 | Browser test `TRIP-013-R2 and TRIP-028-R1 Rensa …` (no Plats or Aktivitet after Rensa, focus on the search field); the tests of the start cards are deleted | local | Pass | 2026-10-26 |
| TRIP-028-R2 | Browser test `TRIP-013-R5 and TRIP-028-R2 …` (one link named by the title, a mouse press on the photo opens the page); design test `TRIP-013-R5 and R8 and TRIP-028-R2 the charter list …` (focus ring on the card, none on the link); 320 px in `TRIP-013-R5 and R9 … 320 px`; axe in `TRIP-013-R9` | local | Pass | 2026-10-26 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `TRIP-013-R3 the top six categories …` deleted with `topCategories`; `npm run test:unit` passes | local | Pass | 2026-10-26 |
| Browser tests | As in the table; no test added. A race in `TRIP-013-R1 suggestions …` (the count read before the list narrowed, 1 run in 15) is fixed by waiting for the list | local | Pass | 2026-10-26 |
| Smoke test | Unchanged: `TRIP-013-R7 @smoke /charter …` passes locally | local | Pass | 2026-10-26 |
| Accessibility | axe in `TRIP-013-R9`; the checklist on the live site: not checked yet (after the deploy) | local | axe: Pass | 2026-10-26 |
| Security | Not applicable: no input, query or data change | | | |
| Code review | [review.md](review.md) | local | Passed | 2026-10-26 |

## Test suite

Measured with `npx playwright test` on port 3128, since another session was using port 3100 (so not `npm run test:time`).

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 124 unit, 201 browser | not measured | not measured |
| After | 123 unit, 199 browser | 186 s | 3.1 s |

Two browser tests and one unit test were removed and none added. The suite was already over the 180 s budget.

## Definition of Done

- [x] Tests and test suite: see the tables above (the suite is over its budget since before; fewer tests than before)
- [ ] Deployed, Live tests pass, accessibility checklist on the live site (after the deploy)
- [x] Requirements in the card match what was built; copied below; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/charter-resmal.md`), system docs (`wiki/system/charter-destinations.md`) and `wiki/log.md` updated; TRIP-013-R3 is marked replaced in its `verification.md`
- [x] No leftovers: `StartCards`, `topCategories`, `continentChoices`, `countriesIn`, the results focus and the export are deleted
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done; see [review.md](review.md)
- [x] No larger improvements found

## Requirements as built

### TRIP-028-R1 No start cards

`/charter` shall not show the start cards Plats and Aktivitet. This replaces TRIP-013-R3.

- **Given** `/charter` with no search or filter, **when** shown, **then** there are no start cards, and the list of all destinations follows the filters directly.
- **Given** a search or filter, **when** "Rensa" is pressed, **then** the search and filters are cleared and focus goes to the search field (as before).

### TRIP-028-R2 The whole card is the link

A destination card shall open the destination's page wherever on the card it is pressed, with one link for screen readers.

- **Given** a destination card, **when** pressed anywhere (photo, text, price, "Visa"), **then** it opens `/charter/<id>`, with the search and filters carried in the address as before (TRIP-013-R5).
- **Given** a card, **when** read by a screen reader, **then** it has one link, named by the destination's title and country (the heading), and "Visa" is not a second link.
- **Given** a card, **when** it has keyboard focus, **then** a focus ring is drawn around the whole card, and **when** the pointer is over it, **then** the pointer is a hand (nothing else changes); "Visa" still looks like the secondary button.
- **Given** a card on a phone (320 px), **when** shown, **then** nothing overflows.

## Notes

- The focus ring is only shown for keyboard focus (`:focus-visible`); the hand pointer comes from the link. The card was reworded to say so (no ring on hover). The card was reworded to say so (no ring on hover).

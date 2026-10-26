---
id: TRIP-027
title: Detailed price list
---

# Verification of TRIP-027

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-027-R1 | Unit tests `TRIP-027-R1 the total is split 40/20/20/10/10/0 in whole kronor` and `… the rows always add up to the total, the remainder going to Bränsle` in `lib/booking-rules.test.ts` | local, CI | Pass | 2026-10-26 |
| TRIP-027-R2 | Test `TRIP-027-R2 R4 Betala lists the six rows …` in `tests/TRIP-027-price-list.spec.ts` | local, CI | Pass | 2026-10-26 |
| TRIP-027-R3 | Test `TRIP-027-R3 R4 the summary lists the same six rows …` (local only: it makes a booking in the test database and deletes it) | local, CI | Pass | 2026-10-26 |
| TRIP-027-R4 | `expectNoA11yViolations` on Betala and the summary in the same tests; the list is a `<dl>` | local, CI | Pass | 2026-10-26 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `priceList()` in `lib/booking-rules.test.ts` | local, CI | Pass | 2026-10-26 |
| Browser tests | `tests/TRIP-027-price-list.spec.ts`, and `tests/TRIP-012-book-a-flight.spec.ts` after its helpers moved to `tests/plan.ts` | local, CI | Pass | 2026-10-26 |
| Smoke test | Not applicable: the plan says none; a smoke test never pays | | | |
| Accessibility | axe on Betala and the summary (above); the checklist in `wiki/system/accessibility.md` for Betala and the summary on the live site | local, live | axe: Pass. Checklist: not checked yet (after the deploy) | 2026-10-26 |
| Security | Not applicable: no input, route, query or personal data is added. Security points in the review | local | Pass | 2026-10-26 |
| Code review | [review.md](review.md) | local | Passed | 2026-10-26 |

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 91 unit, 173 browser | 0.4 s + 134.3 s | 2.9 s |
| After | 93 unit, 175 browser | 0.4 s + 136.7 s | 2.8 s |

Within the budgets (30 s, 180 s, 5 s per test). Two unit tests and two browser tests added.

## Definition of Done

- [x] Tests: every check in the card's test plan is done; every requirement is tested; `npm run test:unit` and `npm run test:local` pass (`npm run test:time`)
- [x] Test suite: within the time budgets, total time grown by 2 %, the new tests follow the quality rules in `wiki/system/testing.md`
- [ ] Deployed, and the smoke tests pass against production (Live tests)
- [ ] Accessibility: axe passes on both pages; the checklist items on the live site (after the deploy)
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/boka-resan.md`), system docs (`wiki/system/booking.md`) and `wiki/log.md` updated
- [x] No leftovers: the helpers moved, nothing left unused
- [x] Clean code: reuses `formatPrice` and `Card`; `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements noticed along the way: none

## Requirements as built

### TRIP-027-R1 The split

The site shall split a total into six rows, in this order, with these shares: Bränsle 40 %, Mutor 20 %, Alla möjliga avgifter 20 %, Stänga luftrummet vid avgång och ankomst 10 %, Försäkring 10 % and Skatt 0 %.

Acceptance criteria:

- **Given** a total of 10 000 kr, **when** it is split, **then** the rows are 4 000, 2 000, 2 000, 1 000, 1 000 and 0 kr.
- **Given** any whole-kronor total, **when** it is split, **then** every row is whole kronor and the rows add up to exactly the total. A remainder from rounding is added to Bränsle.

### TRIP-027-R2 Price list on Betala

The page Betala shall show the price list under "Att betala", with the sum of each row in kronor and no percentages, except Skatt, which reads "Skatt 0 %" and "0 kr".

Acceptance criteria:

- **Given** a trip on Betala, **when** the page is shown, **then** the six rows are listed with their sums and their sum equals "Att betala".
- **Given** the list, **when** read, **then** no percentage is shown except "0 %" on the tax row.

### TRIP-027-R3 Price list on the summary

The summary at `/flyg/bokad` shall show the same price list for the booked total, above "Totalt".

Acceptance criteria:

- **Given** a made booking, **when** the summary is shown, **then** the six rows are listed and add up to "Totalt".

### TRIP-027-R4 Accessible list

The price list shall be readable by screen readers as a list of label and sum, and meet WCAG 2.2 AA.

Acceptance criteria:

- **Given** the list on Betala and on the summary, **when** checked with axe, **then** there are no violations.

## Notes

- The test helpers `fillPassenger`, `fillAll`, `passenger`, `countBookings` and `deleteBookings` moved from the TRIP-012 test to `tests/plan.ts` (a small related cleanup) so that both tests use them.

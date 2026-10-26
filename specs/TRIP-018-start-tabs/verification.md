---
id: TRIP-018
title: Switch between flight booking and charter
---

# Verification of TRIP-018

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-018-R1 | Tests `TRIP-018-R1 …` in `tests/TRIP-018-start-tabs.spec.ts` (default, switching, keyboard, search still works, link to `/charter`) | local | Pass | 2026-10-26 |
| TRIP-018-R2 | Tests `TRIP-018-R2 …`: no link to the other area or the start page on `/charter`, the results and the plan page; `/flyg/bokad` is not a flow | local | Pass | 2026-10-26 |
| TRIP-018-R3 | Tests `TRIP-018-R3 …`: Ja, avbryt (results, plan, charter, booking page) clears `sessionStorage` and shows the start page; Nej, Escape and a click outside keep everything; wordmark and Start ask; `lib/flow.test.ts` for which paths are a flow. `/flyg/boka/betala` is covered by the unit test and by the same header component, not opened by a test (it needs a filled-in booking) | local | Pass | 2026-10-26 |
| TRIP-018-R4 | Tests `TRIP-018-R4 …`: `aria-modal`, heading, focus moved in, kept in with Tab and Shift+Tab, returned to the opener, axe with the dialog open, 320 px | local | Pass | 2026-10-26 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `lib/flow.test.ts` (`isInFlow`). `clearBooking()` is two calls to `store()` and is tested in the browser tests, since it needs `sessionStorage` | local | Pass | 2026-10-26 |
| Browser tests | `tests/TRIP-018-start-tabs.spec.ts`, 19 tests; `TRIP-008-R9` updated (the tab is now between the wordmark and the first field) | local | Pass | 2026-10-26 |
| Smoke test | `TRIP-018-R1 @smoke` (tabs) and `TRIP-018-R3 @smoke` (`/charter` and its heading) | local; preview and live: not checked yet | Pass locally | 2026-10-26 |
| Accessibility | axe on the start page with each tab and on `/charter` and the plan page with the dialog open; checklist on the live site: not checked yet | local | Pass locally | 2026-10-26 |
| Security | Not needed (no sign-in, API, database or server action; only browser storage is cleared); security points in the review | local | Pass | 2026-10-26 |
| Code review | [review.md](review.md) | local | Passed | 2026-10-26 |

## Test suite

`npm run test:time` before and after the change (budgets and rules in `wiki/system/testing.md`). Before: the numbers recorded by TRIP-025 (104 unit + 188 browser, 166.1 s).

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 104 unit + 188 browser | 0.4 s + 166.1 s | 2.8 s |
| After | 106 unit + 207 browser | 0.4 s + 176.4 s | 2.9 s |

The time went up by 6 %, within the 25 % allowed: 19 new browser tests, most of them about 0.2–1.2 s.

Live tests after the deploy: not checked yet.

## Definition of Done

- [x] Tests: every check in the card's test plan is done; `npm run test:unit` and `npm run test:local` pass
- [x] Test suite: within the time budgets, total time grown by 6 %, new tests follow the quality rules
- [ ] Deployed, and the smoke tests pass against production (Live tests): not checked yet
- [ ] Accessibility: axe passes locally; the checklist items on the live site: not checked yet
- [x] Requirements in the card match what was built, no open questions left; copied below; `solution.md` describes how it was built
- [x] Manual, system docs and `wiki/log.md` updated
- [x] No leftovers (the admin's `Dialog` moved to `app/components/Dialog.tsx`, not copied)
- [x] Clean code: `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] No larger improvements noticed

## Requirements as built

Unchanged from the card (`gh issue view 24`):

- **R1 Start page tabs:** two tabs above the search form, Flyg and Charter, following the WAI-ARIA tabs pattern; Flyg selected at first and shows the flight form as before; Charter shows a short text and the link **Utforska charterresor** to `/charter`.
- **R2 One area at a time:** on `/flyg` and the pages after it, and on `/charter`, no link, tab or other way to the other area; the only ways out are Avbryt (R3) and Admin in the footer.
- **R3 Abort the flow:** `/flyg`, `/flyg/plan`, `/flyg/boka`, `/flyg/boka/betala` and `/charter` have **Avbryt**, opening a dialog with **Ja, avbryt** and **Nej, fortsätt**; the wordmark and the footer's Start open the same dialog. Ja removes `gurrasflyg-bokning` and `gurrasflyg-bokad` and goes to the start page; Nej, Escape or a click outside keep everything.
- **R4 The dialog is accessible:** a modal (`role="dialog"`, `aria-modal`, a heading); focus moves in, stays in, Escape closes, the page behind cannot be reached, focus returns to the opener; WCAG 2.2 AA; fits a phone; uses the shared components.

## Notes

- The Avbryt control is one component in the shared header, not one per page, so it also covers the charter pages that TRIP-013 and TRIP-014 add under `/charter`.

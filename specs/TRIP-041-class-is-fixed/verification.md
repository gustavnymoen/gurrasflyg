---
id: TRIP-041
title: The class is chosen once, in the plan step
---

# Verification of TRIP-041

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-041-R1 | Test `TRIP-041-R1 R2 …` in `tests/TRIP-041-class-is-fixed.spec.ts` (class as text, no "Klass" field, link back, add-ons stay after a reload, axe); unit test `TRIP-041-R1` in `lib/booking-rules.test.ts`; `TRIP-012-R2 R3` and `TRIP-014`/`TRIP-039` tests (no "Klass" field in charter) | local | Pass | 2026-11-06 |
| TRIP-041-R2 | Same browser test (another aircraft: the removed add-on is listed, name and e-mail stay); unit test `TRIP-041-R2` (`removedAddons()`, `fitForm()`) | local | Pass | 2026-11-06 |
| TRIP-041-R3 | Unit test `TRIP-041-R3` (`fitsTrip()` refuses a wrong number per class and a wrong order); `lib/bookings.test.ts` saves a booking with the classes in order | local | Pass | 2026-11-06 |
| TRIP-041-R4 | Unit tests `TRIP-041-R4` in `lib/agent.test.ts` (rules, page text, `set_plan` from Resenärer goes to the plan step); browser test `TRIP-041-R4 …` (the fake agent on charter's Resenärer) | local | Pass | 2026-11-06 |
| TRIP-041-R5 | Search for `changeClass`, `classProblem`, `klasser-`, `-klass-` and "Byt klass" in `app`, `lib`, `tests`, `wiki`, `specs`: only this folder, the card's history and `wiki/log.md` mention them; `npm run lint`, `npm run typecheck`, `npm run build` | local | Pass | 2026-11-06 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `lib/booking-rules.test.ts`, `lib/agent.test.ts` | local | Pass | 2026-11-06 |
| Browser tests | `tests/TRIP-041-class-is-fixed.spec.ts` (new); `TRIP-012` updated (no class swap, exact link name) | local | Pass | 2026-11-06 |
| Smoke test | None planned; Live tests (the existing smoke tests) passed against the merged commit `ee97851` | live | Pass | 2026-11-06 |
| Accessibility | axe on Resenärer in the new test, with the note, the link and the removed-add-ons status (local); the live checklist, see below | local, live | Pass; live checklist partly done, see below | 2026-11-06 |
| Security | `/security-review` not needed (the checks are unchanged, only the form's field is removed and the class check is stricter) | | | |
| Code review | [review.md](review.md) | local | Passed | 2026-11-06 |

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before (TRIP-042, 2026-11-06) | 317 unit + 223 browser | unit 6.2 s, browser 190.5 s | 4.3 s |
| After | 320 unit + 225 browser | unit 6.3 s, browser 194.4 s | 4.2 s |

Two browser tests and three unit tests were added; one old unit test and one old step of a browser test (the class swap) were replaced. The browser suite was already over the 3 minute budget before this change (since TRIP-039/TRIP-040) and grew 2 %; the new tests take 1.9 s and 1.0 s. Not handled here.

## Accessibility checklist on the live site

Checked 2026-11-06 on https://gurrasflyg.vercel.app in the built-in browser (Chromium), after Live tests passed for `ee97851`. Page: `/flyg/boka` (Resenärer) for one traveller, ARN → LHR, with the class shown as text, the link "Ändra plan och klasser", and the status "Dessa tillägg togs bort …" after going back, changing the plan (Baloos plan → Hindenburg, Första klass) and coming back with a Burgare added.

| # | Check | Result |
|---|---|---|
| 1 | Keyboard | Partly: Shift+Tab from the first field reaches the link, which comes after the trip summary and before "Passagerare 1" (logical order); the link is a normal `<a>`. Not done: Enter on the link and a full Tab through the page by hand |
| 2 | Focus visible | Pass: the link's focus ring (2 px, `rgb(200,53,96)`, offset 3 px) is fully visible on the page, not covered by anything |
| 3 | Screen reader | Not checked (VoiceOver not used). The status is a `role="status"` region with the heading sentence and a list, and no "Klass" field or combobox exists on the page (checked in the DOM) |
| 4 | Zoom and reflow | 320 px width: Pass, no sideways scrolling (page width 320 px), the link and the status fit. 200 % zoom: not checked |
| 5 | Text spacing | Not checked |
| 6 | Contrast | Pass by calculation: the note under the summary `rgb(169,161,150)` on `rgb(18,17,19)` is 7.4:1; the link text 15.2:1; the focus ring 3.7:1 (at least 3:1). The status text is `rgb(236,230,220)`, the same 15.2:1 |
| 7 | Target size | Pass: the link is 247 × 52 px |
| 8 | Hover and focus content | Not affected: the change adds none |
| 9 | Errors and labels | Not affected: the change adds no error and removes the "Klass" field; the other fields' labels are unchanged (names, e-mail and so on are visible labels in the DOM) |
| 10 | Title, language, images | Pass: title "Resenärer – Gurras Flyg", `<html lang="sv">`; no new images |
| 11 | Reduced motion | Not affected: the change adds no motion |

## Definition of Done

- [x] Tests: every check in the plan is done, `npm run test:unit` and `npm run test:local` passed locally, and Live tests passed against production (`ee97851`, 2026-11-06)
- [ ] Test suite: browser time over the 3 minute budget as before this change (not handled here)
- [ ] Accessibility: axe passes locally; the live checklist is done for items 2, 4 (320 px), 6, 7 and 10, partly for 1, and not checked for 3, 4 (200 % zoom) and 5
- [x] Requirements in the card match what was built, no open questions left; `solution.md` describes how it was built
- [x] Manual, system docs and `wiki/log.md` updated
- [x] No leftovers
- [x] Clean code: `npm run lint`, `npm run typecheck` and `npm run build` passed locally (TRIP-041-R5 row)
- [x] Code review: [review.md](review.md), no must-fix findings left

## Requirements as built

### TRIP-041-R1 Class is fixed on the passengers page

Each traveller's class on each flight is shown as text, with no choice to change it. No "Klass" field on the passengers page in flight booking or charter. The add-ons of the traveller's class are chosen as before. A link back to the plan step is there.

### TRIP-041-R2 Going back to change the classes

After going back to the plan step and changing the plan or the numbers per class of a flight, that flight's classes start again and its add-ons are removed, as in charter (TRIP-039-R8). The page tells which add-ons were removed, and the form keeps the rest (names, ages, contact details) and the other flight.

### TRIP-041-R3 The booking checks it

A booking whose classes do not match the numbers per class in the address is rejected by the server.

### TRIP-041-R4 Agneta follows the rule

Her rules, the page text and the fake agent say that classes are set only in the plan step; she sends a visitor who wants another class back to the plan step.

### TRIP-041-R5 The old code is removed

`changeClass`, the class field, focus and error handling, `classProblem`, `fieldIds.classes`, the old message and the tests and wiki text about the old choice are deleted.

## Notes

- The card's R2 was reworded with the owner (2026-11-06) to match: all of a flight's add-ons are removed and listed when its plan or numbers change, as in charter.
- Flight booking has no agent yet, so R4 updated charter's Agneta only.

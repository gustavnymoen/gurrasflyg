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
| Smoke test | None planned | | | |
| Accessibility | axe on Resenärer in the new test, with the note, the link and the removed-add-ons status; the live checklist is left | local | Pass | 2026-11-06 |
| Security | `/security-review` not needed (the checks are unchanged, only the form's field is removed and the class check is stricter) | | | |
| Code review | [review.md](review.md) | local | Passed | 2026-11-06 |

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before (TRIP-042, 2026-11-06) | 317 unit + 223 browser | unit 6.2 s, browser 190.5 s | 4.3 s |
| After | 320 unit + 225 browser | unit 6.3 s, browser 194.4 s | 4.2 s |

Two browser tests and three unit tests were added; one old unit test and one old step of a browser test (the class swap) were replaced. The browser suite was already over the 3 minute budget before this change (since TRIP-039/TRIP-040) and grew 2 %; the new tests take 1.9 s and 1.0 s. Not handled here.

## Definition of Done

Not all checked: the deploy and the Live tests are left.

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

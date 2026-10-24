---
id: TRIP-026
title: One choice at a time on the plan page
---

# Verification of TRIP-026

How each requirement was checked. Tests in `tests/TRIP-026-one-choice-at-a-time.spec.ts` unless another file is named.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-026-R1 | Test `TRIP-026-R1 an aircraft without room for every traveller is not shown`; unit tests `TRIP-026-R1 only the aircraft with room …` and `… compared with each other` in `lib/fare-rules.test.ts`; `TRIP-011-R9` (the från price) updated | local | Pass | 2026-10-24 |
| TRIP-026-R1 (no aircraft has room) | Manual: `/flyg/plan` for 5 travellers on a fresh test database without aircraft (`scripts/test-server.mjs` on port 3101) shows "Inget plan har plats för 5 resenärer." and **Till flygen** linking to `/flyg?…&ut=08%3A20`. Can't be a browser test: every database the tests run against has an aircraft with room for 10, the most a search allows. The empty list is also the unit test above. | local | Pass | 2026-10-24 |
| TRIP-026-R2 | Test `TRIP-026-R2 one card per flight: Välj puts the aircraft at the top and its classes below` (keyboard: Enter opens, Tab to Välj, Enter; focus on "Klasser på utresan") | local | Pass | 2026-10-24 |
| TRIP-026-R3 | Test `TRIP-026-R3 the counter counts down, Klar says who is missing or folds the card` (Klar with the keyboard; focus on "Hemresa"); unit tests `TRIP-026-R3 the counter …` in `lib/fare-rules.test.ts` and `TRIP-026-R3 a flight is done …` in `lib/trip.test.ts` | local | Pass | 2026-10-24 |
| TRIP-026-R4 | Test `TRIP-026-R4 an earlier choice opens again, and only another aircraft clears its classes` (folded card opened with the keyboard); `TRIP-011-R10` tests updated | local | Pass | 2026-10-24 |
| TRIP-026-R5 | Tests `TRIP-026-R5 after a reload …` and `TRIP-026-R5 the steps are Flyg, Plan och klass and Resenärer`; unit test `TRIP-026-R5 after a reload …` in `lib/trip.test.ts` | local | Pass | 2026-10-24 |

TRIP-011's and TRIP-024's browser tests that used the steps Plan and Klasser, the radio buttons or the disabled aircraft were updated to the cards (helpers in `tests/plan.ts`): TRIP-011-R1, R2, R3, R4, R9, R10 (both), R3 at 320 px (now also with a folded card), R6, the smoke test, and TRIP-024-R1, R2, R3, R4, R5. TRIP-024-R4's unit test moved to `lib/trip.test.ts` with `legDone()`.

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | Counter text, which card is open after a reload, aircraft with room, when a flight is done (`npm run test:unit`, 74) | local | Pass | 2026-10-24 |
| Browser tests | A test per requirement, with the keyboard for Välj, Klar and opening a folded card, checking where focus goes; TRIP-011 and TRIP-024 updated (`npm run test:local`, 165) | local | Pass | 2026-10-24 |
| Smoke test | `TRIP-011-R1 @smoke …` updated to the aircraft cards' buttons; passed locally | local | Pass | 2026-10-24 |
| Smoke test | Against the preview and the live site | preview, live | Not checked yet | |
| Accessibility | `expectNoA11yViolations` on an open aircraft list with an aircraft opened (R2), the card with the chosen aircraft, the classes and the counter (R2), the message at Klar (R3), and both cards folded (R4) | local | Pass | 2026-10-24 |
| Accessibility | Checklist in `wiki/system/accessibility.md` for `/flyg/plan` on the live site (keyboard, screen reader, 320 px) | live | Not checked yet (after the deploy) | |
| Security | `/security-review` not needed: no sign-in, admin, API routes, server actions or database queries change; prices are still calculated on the server. Security points in the review | local | Pass | 2026-10-24 |
| Code review | [review.md](review.md); after its fixes lint, typecheck, unit tests and the 24 plan-page browser tests ran again | local | Passed | 2026-10-24 |

## Test suite

`npm run test:time` before and after the change (budgets and rules in `wiki/system/testing.md`).

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before (main at 35654d9) | 71 unit, 159 browser | 119.0 s, unit 0.5 s | 2.9 s |
| After | 74 unit, 165 browser | 123.6 s (budget 180 s, +4 %), unit 0.5 s (budget 30 s) | 2.8 s |

## Definition of Done

- [x] Tests: every check in the card's test plan is done locally; every requirement is tested or has a recorded manual check; `npm run test:unit` and `npm run test:local` pass
- [x] Test suite: within the time budgets, total time grown by 4 %, and the new tests follow the quality rules in `wiki/system/testing.md`
- [ ] Deployed, and the smoke tests pass against production (Live tests)
- [ ] Accessibility: changed states pass `expectNoA11yViolations` (done); the checklist items of `wiki/system/accessibility.md` on the live site (after the deploy)
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/valja-plan-och-klass.md`), system docs (`wiki/system/aircraft-and-classes.md`, `testing.md`, `index.md`) and `wiki/log.md` updated
- [x] No leftovers: the steps Plan and Klasser (`TripStep`, `parseStep`, `steg=klasser`), the step button in `Steps`, `everyoneSeated()`, the radio cards and "För få platser" and `toClasses()` in the tests are removed
- [x] Clean code: reuses `Card`, `Button`, `Message`, `RoundButton`, `ChevronIcon`, `FlightTime`; `aircraftFare()` replaces three copies of the cheapest-class price; `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements noticed along the way added to the board: TECH-020 (#69), a shared choice card and the traveller plural

## Requirements as built

Copied from the card (#68) on 2026-10-24.


### TRIP-026-R1 Only aircraft with room

The aircraft list for a flight shows only the aircraft with at least as many seats as there are travellers, compared with each other as before (Billigast, Snabbast). If no aircraft has room, the list says "Inget plan har plats för 5 resenärer." with a link back to the flights.

Acceptance criteria:

- **Given** 5 travellers and an aircraft with 4 seats, **when** the aircraft list is shown, **then** that aircraft is not in it.
- **Given** more travellers than any aircraft has seats, **when** the list is shown, **then** the message and the link to the flights are shown.

### TRIP-026-R2 One card per flight: the aircraft first

Each flight has one card, "Utresa" and "Hemresa", and the page goes flight by flight: the outbound card, then, when it is done (R3), the return card. The cards after the one being chosen are not shown until it is done.

The card starts with the flight's aircraft. Clicking an aircraft opens it with a button **Välj**, as a departure card on `/flyg`. Välj replaces the list with a summary of the chosen aircraft at the top of the same card (name, flight time, arrival, price per person in its cheapest class, no comparison), and the aircraft's classes appear below it in the card, with focus on their heading.

Acceptance criteria:

- **Given** the outbound card, **when** the traveller opens an aircraft and presses Välj, **then** the top of the card is a summary of that aircraft, the classes are shown below it in the same card, and their heading has focus.
- **Given** the aircraft list, **when** the traveller opens an aircraft without pressing Välj, **then** nothing is chosen.
- **Given** a return trip, **when** the page opens, **then** only the outbound card is shown; the return card is shown when the outbound card is done.

### TRIP-026-R3 The classes count the travellers, and Klar folds the card

Under the aircraft summary, a counter "Placera ut 3 resenärer" ("1 resenär" in the singular) counts down with every traveller placed and removed, and shows a check and "Alla resenärer har en klass" when everyone is placed; screen readers hear the change. The message "N resenärer har ingen klass. Lägg till dem i en klass." is shown only when the traveller presses **Klar** with someone not placed, and then the card stays open. Klar with everyone placed folds the whole card into a summary: the aircraft, the number per class and the flight's total. On a return trip the return card then opens, with focus on its heading.

Acceptance criteria:

- **Given** 3 travellers, **when** the classes appear, **then** the counter says "Placera ut 3 resenärer" and no message is shown.
- **Given** 2 of 3 placed, **when** the counter is shown, **then** it says "Placera ut 1 resenär"; with all 3 placed it shows the check and "Alla resenärer har en klass".
- **Given** 1 of 3 placed, **when** the traveller presses Klar, **then** "2 resenärer har ingen klass. Lägg till dem i en klass." is shown and the card stays open.
- **Given** everyone placed on the outbound flight of a return trip, **when** the traveller presses Klar, **then** the outbound card is a summary with the aircraft, the numbers and the total, and the return card is open.

### TRIP-026-R4 Changing an earlier choice

Clicking a folded card opens it again with its classes; the other card stays as it is. Clicking the aircraft summary at the top of an open card shows the aircraft list again. Pressing Välj on the same aircraft keeps the classes; another aircraft clears them, and they start from 0 (TRIP-011-R10, TRIP-024-R2). The other flight is not affected. An opened card folds again at Klar.

Acceptance criteria:

- **Given** a return trip with both cards done, **when** the traveller opens the outbound card, clicks its aircraft and chooses another one, **then** the outbound classes are at 0 and the return card is still a folded summary, unchanged.
- **Given** an open card, **when** the traveller clicks the aircraft summary and presses Välj on the same aircraft, **then** the classes are kept.

### TRIP-026-R5 The steps and a reload

The step list is Flyg, Plan och klass, Resenärer. After a reload, every card that is done (an aircraft chosen and everyone placed) is folded, and the first card that is not done is open: with its aircraft list if no aircraft is chosen, else with the aircraft summary and the classes.

Acceptance criteria:

- **Given** `/flyg/plan`, **when** the step list is shown, **then** it is Flyg, Plan och klass (current), Resenärer.
- **Given** the outbound card done, **when** the page is reloaded, **then** it is folded and the return card is open.


## Notes

- Klar with everyone placed opens the next card that is not folded. On a return trip with both cards done, Klar on a reopened outbound card leaves the return card folded and moves focus to the outbound summary (R4: "the other card stays as it is").
- After Klar the message follows the numbers, and goes away when everyone is placed.
- The chosen aircraft and the folded summary are plain buttons named by their visible label (no `aria-expanded`), since they are replaced rather than expanded (review suggestion).
- An opened aircraft lists its classes and seats above Välj, as an opened departure on `/flyg` shows its details.
- Every change replaces the address; the browser's Back now goes to the flights (there are no steps on the page to go back to).

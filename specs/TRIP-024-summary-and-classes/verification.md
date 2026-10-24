---
id: TRIP-024
title: Aircraft in the summary, classes from zero
---

# Verification of TRIP-024

How each requirement was checked. Unit tests in `lib/fare-rules.test.ts`; browser tests in `tests/TRIP-024-summary-and-classes.spec.ts`, and TRIP-011's updated ones in `tests/TRIP-011-aircraft-and-classes.spec.ts`.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-024-R1 | Browser: `TRIP-024-R1 Din resa shows the chosen aircraft, its flight time and arrival, after a change and a reload` (one aircraft on a return trip, a change, a reload, axe on step Plan) | local | Pass | 2026-10-24 |
| TRIP-024-R2 | Unit: `TRIP-024-R2 at first every class has 0 travellers`; browser: `TRIP-024-R2 every class starts at 0 with a message, …` (axe at zero), and `TRIP-011-R10 another aircraft clears the classes; …` (0 again after another aircraft) | local | Pass | 2026-10-24 |
| TRIP-024-R3 | Unit: `TRIP-024-R3 the totals are the sum for the travellers placed so far`; browser: `TRIP-024-R3 the totals are 0 kr at first and then the sum so far`, `TRIP-011-R4 …` | local | Pass | 2026-10-24 |
| TRIP-024-R4 | Unit: `TRIP-024-R4 the traveller goes on only when everyone has a class on every flight`; browser: `TRIP-024-R4 nothing leads on until everyone on every flight has a class` (also per flight on a return trip) | local | Pass | 2026-10-24 |
| TRIP-024-R5 | Browser: `TRIP-024-R5 focus stays on Fler and Färre when they become unavailable` (Enter with the keyboard, `aria-disabled`, nothing happens, Tab goes on) | local | Pass | 2026-10-24 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | 3 new in `lib/fare-rules.test.ts`; TRIP-011's test of the first placement in the cheapest class replaced; 71 unit tests in all | local | Pass | 2026-10-24 |
| Browser tests | 5 new in `tests/TRIP-024-summary-and-classes.spec.ts`; TRIP-011's R3, R4 and R10 updated (R9 and 320 px needed no change); the shared fixture and steps moved to `tests/plan.ts` | local | Pass | 2026-10-24 |
| Smoke test | Unchanged (`TRIP-011-R1 @smoke …`), passed in `npm run test:local`. Preview and live: not checked yet | local | Pass | 2026-10-24 |
| Accessibility | axe on step Klasser at zero with the message (R2) and on step Plan with Din resa showing an aircraft (R1). The checklist in `wiki/system/accessibility.md` on the live site: not checked yet (after the deploy) | local | Pass (axe) | 2026-10-24 |
| Security | Not needed per the card: no sign-in, admin, API routes, server actions or database queries change. Security points in the review passed | local | Pass | 2026-10-24 |
| Code review | [review.md](review.md): passed, no must-fix; the should-fix and a suggestion fixed | local | Passed | 2026-10-24 |

`npm run lint`, `npm run typecheck` and `npm run build`: pass without warnings (2026-10-24).

## Test suite

`npm run test:time` before and after the change (budgets and rules in `wiki/system/testing.md`).

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before (TRIP-011's verification, 2026-10-23; PR #64 changed tests since) | 69 unit, 153 browser | 111.0 s | 2.8 s |
| After | 71 unit, 159 browser | 117.6 s (budget 180 s), unit 0.4 s (budget 30 s) | 2.8 s |

## Definition of Done

- [x] Tests: every check in the card's test plan is done locally; every requirement is tested; `npm run test:unit` and `npm run test:local` pass
- [x] Test suite: within the time budgets, total time grown by 6 %, and the new tests follow the quality rules in `wiki/system/testing.md`
- [ ] Deployed, and the smoke tests pass against production (Live tests)
- [ ] Accessibility: changed states pass `expectNoA11yViolations`; the checklist on the live site is not done yet
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/valja-plan-och-klass.md`), system docs (`wiki/system/aircraft-and-classes.md`) and `wiki/log.md` updated
- [x] No leftovers: `defaultSeating()` and its test are removed
- [x] Clean code: reuses `RoundButton`, `FlightTime` (now shared by the aircraft list and Din resa) and the test fixture (moved to `tests/plan.ts` instead of copied); lint, type check and build pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements noticed along the way added to the board: TECH-019 (#66)

## Requirements as built

Copied from the card (#62) on 2026-10-24.

### TRIP-024-R1 The chosen aircraft in Din resa

On `/flyg/plan`, the summary card Din resa shows, under each flight that has an aircraft chosen, the aircraft's name, its flight time and its arrival time (with "+1" when it lands on a later day), the same values as in the aircraft list. A flight without a chosen aircraft shows nothing about aircraft. The card follows a change of aircraft at once, and shows the same after a reload.

Acceptance criteria:

- **Given** a one-way trip, **when** the traveller chooses Hindenburg, **then** Din resa shows "Hindenburg", its flight time and its arrival under the flight.
- **Given** a chosen aircraft, **when** the traveller chooses another one, **then** Din resa shows the new aircraft at once.
- **Given** a return trip with only the outbound aircraft chosen, **when** Din resa is shown, **then** it shows an aircraft for the outbound flight only.
- **Given** a chosen aircraft, **when** the page is reloaded, **then** Din resa shows the same aircraft.

### TRIP-024-R2 Classes start at zero

When step Klasser opens for a flight whose aircraft has just been chosen (the first time, or after another aircraft), every class has 0 travellers, and the message says how many have no class ("2 resenärer har ingen klass. Lägg till dem i en klass."). The traveller places every traveller with Fler and Färre; a class still takes at most as many as it has seats, and no more than the number of travellers can be placed (TRIP-011-R3). Going back and on without changing anything keeps the numbers (TRIP-011-R10).

Acceptance criteria:

- **Given** 2 travellers and a chosen aircraft, **when** step Klasser opens, **then** every class shows 0 and the message says that 2 travellers have no class.
- **Given** 1 of 2 travellers placed, **when** the traveller adds the second, **then** the message is gone.
- **Given** placed travellers, **when** the traveller goes back to Plan and on without changing the aircraft, **then** the numbers are kept.

### TRIP-024-R3 Totals while placing

The price per person is shown for every class from the start. The total per flight and the total for the trip are the sum for the travellers placed so far (0 kr when none are), and follow every change at once (TRIP-011-R4).

Acceptance criteria:

- **Given** no traveller placed, **when** step Klasser opens, **then** the flight's total and the trip's total are 0 kr.
- **Given** 1 of 2 travellers placed in a class of 1 200 kr, **when** the totals are shown, **then** the flight's total is 1 200 kr.

### TRIP-024-R4 No going on until everyone is placed

Until every traveller on every flight has a class, the message stays and nothing on the page leads on to the next step (Resenärer). When TRIP-012 adds Fortsätt, it can be used only when everyone is placed (checked in TRIP-012).

Acceptance criteria:

- **Given** 1 of 2 travellers placed, **when** step Klasser is shown, **then** the message is shown and there is no way on to Resenärer.
- **Given** a return trip with everyone placed on the outbound flight only, **when** step Klasser is shown, **then** the return flight's message is still shown.

### TRIP-024-R5 Focus stays when a button becomes unavailable

When Fler or Färre becomes unavailable while it has keyboard focus (Fler when everyone is placed or the class is full, Färre when the class reaches 0), focus stays on the button, which is then announced as unavailable (`aria-disabled`) and does nothing; focus is never lost to the page. WCAG 2.4.3 and 4.1.2.

Acceptance criteria:

- **Given** 1 of 2 travellers placed, **when** the traveller presses Enter on Fler in a class and so places the last one, **then** focus is still on that button, and it is marked unavailable.
- **Given** a class with 1 traveller, **when** the traveller presses Enter on Färre, **then** focus is still on Färre, which is marked unavailable, and the next Tab goes to the next control.

## Notes

- Small cleanups in the same change: `Arrival.tsx` became `FlightTime.tsx`, one component for "9 h 20 min · landar 15:40" in the aircraft list and Din resa; the browser tests of `/flyg/plan` share their aircraft fixture and steps in `tests/plan.ts`.
- The other `RoundButton`s still use `disabled` and may lose focus the same way (search form travellers, calendar months, review carousel, admin): TECH-019 (#66).

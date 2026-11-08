---
id: TRIP-036
title: Booking agent for flights
---

# Verification of TRIP-036

All checks were run locally on 2026-11-06 (unit tests; `npm run test:local`, a production build on port 3100 with its own test database, and the fake agent `LLM_MOCK=1`). **Not done:** the real model has not been tried (no key used in this session), the live checklist is not checked, the smoke tests and Live tests have not run (not deployed), and `/security-review` was not run (see the test plan table).

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-036-R1 | Browser tests `TRIP-036-R1` (button on every flight page, conversation and mode from charter to flights, panel pushes the page, axe) and `TRIP-017-R7 TRIP-036-R1`; unit test `TRIP-030-R3 TRIP-036-R1` (the flight addresses an action may open) | local | Pass | 2026-11-06 |
| TRIP-036-R2 | Unit tests `TRIP-036-R2` in `lib/agent.test.ts` (airports, flights as the page shows, wrong searches, results with departures, the shortcut, the page read); browser tests `TRIP-036-R2` (search, results with `ut`/`hem` chosen in Din resa, no bookable dates, a changed page drops the answer) and `TRIP-036-R2 R3` (the shortcut). Found while testing: the results page did not show a choice added to the same search, fixed (`key` in `app/flyg/page.tsx`) | local | Pass | 2026-11-06 |
| TRIP-036-R3 | Unit test `TRIP-036-R3` (flight time, arrival, price per class, comparison; `set_plan` and what it refuses); browser test `TRIP-036-R3` (the plan in the address, refusals, the page after reload). The funny, negative recommendation is the model's: **not checked** with the real model | local | Pass (tone not checked) | 2026-11-06 |
| TRIP-036-R4 | Unit tests `TRIP-036-R4` (list, set per class, beer warning, extras refused); browser tests `TRIP-036-R4` (add-ons in every traveller's form, the visitor changes one) and `beer` (the add-on Öl set, removed at age 16 with the page's message; needs the admin password) | local | Pass | 2026-11-06 |
| TRIP-036-R5 | Unit test `TRIP-036-R5` (`show_travellers`, `show_payment` refused for an invalid form); browser test `TRIP-036-R5 R6` (no payment page and no button with an invalid form, nothing personal in the requests) | local | Pass | 2026-11-06 |
| TRIP-036-R6 | Unit tests `TRIP-036-R6` (summary, the button only on the flight payment page); browser test `TRIP-036-R5 R6` (no press no booking, a refused booking shows the message, two presses one booking, the chat says the number) | local | Pass | 2026-11-06 |
| TRIP-036-R7 | `expectNoA11yViolations` in every state of the browser tests. Keyboard and focus are the chat's own from TRIP-030; the live checklist is **not checked** | local | Pass (live not checked) | 2026-11-06 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `lib/agent.test.ts` (+14), `lib/agent-rules.test.ts` | local | Pass | 2026-11-06 |
| Browser tests | `tests/TRIP-036-flight-agent.spec.ts` (7 tests); `TRIP-017-R7` test updated | local | Pass | 2026-11-06 |
| Smoke test | None planned | | | |
| Accessibility | axe in each state of the new tests; the live checklist is **not checked** | local | Pass | 2026-11-06 |
| Real model | **Not checked.** Recommendations and tone are left to be tried by hand on the preview and live | | | |
| Security | `/security-review` is needed by the card and has **not been run** in this session; the review covers the security points | | Not done | |
| Code review | [review.md](review.md) | local | See file | 2026-11-06 |

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before (TRIP-038) | 322 unit + 237 browser | unit 6.7 s, browser 223.4 s | 4.2 s |
| After | 336 unit + 244 browser | unit 12.3 s, browser 240.4 s | 5.2 s |

The browser suite was over the 180 s budget before this change; it grew 7 %. The slowest test is the unchanged TRIP-017-R7 (it visits one page more now, and ran 5.2 s once). Unit time includes noise from a parallel run.

## Definition of Done

- [x] Tests: every requirement is tested; `npm run test:unit` and `npm run test:local` pass (one design test failed once on a contrast check on Min bokning and passed on rerun)
- [ ] Test suite: browser suite over the 180 s budget (already before)
- [ ] Deployed, and the smoke tests pass against production (Live tests): not yet
- [ ] Accessibility: axe passes; the live checklist is not checked
- [x] Requirements in the card match what was built, no open questions; `solution.md` describes how
- [x] Manual, system docs and `wiki/log.md` updated
- [x] No leftovers
- [x] Clean code: `npm run lint`, `npm run typecheck` pass; the build is run by `test:local`
- [ ] Code review: see [review.md](review.md)
- [x] Technical tasks: none added

## Requirements as built

### TRIP-036-R1 Agneta on the flight pages

The chat button and panel are on `/flyg` and every step under it, as on the charter pages, and the agent mode works there.

Acceptance criteria:

- **Given** any page under `/flyg`, **then** "Fråga Agneta" is there and the conversation and mode follow the visitor between the start page, charter and flight pages in the tab.
- The panel does not cover the flight booking's forms and totals (the page is pushed, as today).

### TRIP-036-R2 Searching and choosing flights

Agneta searches flights for a visitor and shows the results, with the choice of departures in the address.

Acceptance criteria:

- **Given** airports, dates and a number of travellers, **then** the page goes to `/flyg?…` (`resultsUrl()`) with the results of the same search, and she tells what is there (the prices and times the page shows, from `findFlights()`), never from memory.
- **Given** a departure the visitor and she agree on, **then** the address gets `ut` and `hem`; the page shows it chosen in Din resa.
- **Given** the visitor changed the search or the choice on the page, **then** she goes on from that (the page's address as context, as in TRIP-030-R4).
- No flight on the date: she says so and suggests another date.
- **The shortcut** (TRIP-030-R4): **given** airports, dates and a number of travellers in one sentence and flights on those dates, **then** she can go straight to the aircraft and class step with the departures already chosen in the address, and says what she chose; the rule about not overwriting the visitor's changes (TRIP-030-R4) applies. She is the grumpy Agneta in every answer.

### TRIP-036-R3 Aircraft and classes

Agneta helps choose the aircraft and the number of travellers per class for each flight, with a recommendation in her voice.

Acceptance criteria:

- **Given** a flight, **then** she is told the aircraft with room for all travellers, their flight time, arrival, price per person per class and the comparison (`aircraftOptions()`, `classOptions()`), and recommends one; the recommendation uses the real numbers and is funny and negative about the plan (e.g. the slow, the very expensive, the one that crashes in the news).
- **Given** the visitor agrees, **then** the address gets `ut-plan`/`hem-plan` and `ut-klasser`/`hem-klasser`, validated by `checkChoice()`; an aircraft that is too small or numbers that don't fit are dropped, and she says what was refused.
- The page and the totals follow the address as when the visitor does it by hand.

### TRIP-036-R4 Add-ons

Agneta asks once whether the visitor sees an add-on they like, and sets what they choose.

Acceptance criteria:

- **Given** a flight and its classes, **then** she lists the add-ons that can be bought in the chosen classes, with price, in her voice, and asks once.
- **Given** the visitor names add-ons, **then** the form in the tab gets them for all passengers or the ones named, per flight, only add-ons of the passenger's class, 0–10 each; the Resenärer page shows them and the visitor can change them.
- **Given** the add-on "Öl" and a passenger under 18, **then** the form's own rule removes it and the page tells (TRIP-029); she warns that beer is for adults only, and does not ask for ages.

### TRIP-036-R5 The visitor fills in their details

As TRIP-030-R7: the visitor fills in names, ages, contact details and the three questions on `/flyg/boka`. Nothing of the form goes to the model, into an address or a log; the chat is told only whether the form is valid.

Acceptance criteria:

- **Given** the choices are done, **then** she opens `/flyg/boka` and tells the visitor to fill in the form and waits.
- **Given** the form is not valid (`travellerProblems()`), **then** the booking button is not offered.

### TRIP-036-R6 The visitor books with a button

As TRIP-030-R8: she summarises (flights, aircraft, classes, add-ons, total) and the chat shows **Boka och betala**; it calls `bookAction()` with the same checks, total and rate limit as Betala.

Acceptance criteria:

- **Given** a valid form, a payment method and the trip in the address, **then** the summary is followed by the button; **given** no press, no booking is saved.
- A success goes to `/flyg/bokad` and the chat says the booking number; a failure shows the action's message; two presses give one booking.

### TRIP-036-R7 Accessibility

Every state the card adds is checked with axe; keyboard, focus and announcements as in TRIP-030-R10.

## Notes

- Beer is set by the agent for flights (the card's R4), unlike charter where it is left to the visitor. If ages are already filled in, the form shows its own error until the visitor fixes it.
- The total in her summary does not include add-ons the visitor chose by hand or Dåliga nerver. (Solved by TRIP-044.)

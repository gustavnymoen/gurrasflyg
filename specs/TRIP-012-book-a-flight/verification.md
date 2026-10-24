---
id: TRIP-012
title: Book a flight
---

# Verification of TRIP-012

How each requirement was checked. Browser tests ran with `npm run test:local` (a local production build with its own test database); unit tests with `npm run test:unit`. Nothing is deployed yet, so nothing is checked on the live site.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-012-R1 | Test `TRIP-012-R1 Fortsätt comes when every card is folded and opens the booking page` (no Fortsätt while a card is open, the steps, Din resa with aircraft, times and classes, the same total, axe); smoke test `TRIP-012-R1 @smoke the booking page loads for a chosen trip`; `TRIP-024-R4` updated for the new texts | local | Pass | 2026-10-24 |
| TRIP-012-R2 | Test `TRIP-012-R2 the passengers start in the chosen classes, and missing fields are red` (most expensive class first, red fields with messages and focus, axe with messages, a swap of one gives the class message and a swap of both lets the traveller on); unit tests `TRIP-012-R2 …` in `lib/booking-rules.test.ts` | local | Pass | 2026-10-24 |
| TRIP-012-R3 | Test `TRIP-012-R3 the add-ons of the passenger's class are offered and added to the total` (only the class's add-ons, name, description, price, 2 + 1 added to the total); unit tests `TRIP-012-R3 …` (the total, a new class keeps only its add-ons) | local | Pass | 2026-10-24 |
| TRIP-012-R4 | Test `TRIP-012-R4 Dåliga nerver adds 1 000 kr per flight, and its tip is shown on focus` (tip on focus and hover, accessible description, Esc hides it, +2 000 kr on a return trip, axe with the tip shown); unit test `TRIP-012-R4 …` | local | Pass | 2026-10-24 |
| TRIP-012-R5 | Test `TRIP-012-R5 R6 a wrong e-mail and an unticked question keep the traveller on the page` ("anna@" red with its message and focus); unit test `TRIP-012-R5 the contact's e-mail and phone number are checked` | local | Pass | 2026-10-24 |
| TRIP-012-R6 | The same browser test (two of three ticked: stays on the page, the message at the unticked box, focus moves there); unit test `TRIP-012-R6 every question must be ticked` | local | Pass | 2026-10-24 |
| TRIP-012-R7 | Test `TRIP-012-R7 R8 R9 the payment method, going back, Betala and the summary` (the total and two methods, "Välj hur du vill betala." with focus, back keeps everything, axe); unit test `TRIP-012-R7 …` | local | Pass | 2026-10-24 |
| TRIP-012-R8 | The same browser test (a double click on Betala saves one booking, checked in the test database); unit tests in `lib/bookings.test.ts` against the unit test database: saved with the database's prices and every value, a price sent from the browser ignored, two calls with one request id give one booking, an add-on not allowed refused with nothing saved, nothing saved when the aircraft is gone, the departure has left or a field is missing; unit tests `TRIP-012-R8 …` in `lib/booking-rules.test.ts` (the shape check, flights no longer done) | local | Pass | 2026-10-24 |
| TRIP-012-R9 | The same browser test (the booking number, flights, passengers with classes and add-ons, contact, payment method and total, axe; another visitor at the address sees "Ingen bokning"); unit test `TRIP-012-R9 …` (the summary's contents). Code review: no page or endpoint reads a saved booking, so a booking number in an address can't open one | local | Pass | 2026-10-24 |
| TRIP-012-R10 | Test `TRIP-012-R10 another aircraft clears that flight's add-ons, and keeps the names and the contact` (back and on without a change keeps the add-ons; another aircraft on the outbound flight clears its add-ons, keeps the return flight's, the names and the contact); `TRIP-026-R5` checks the four steps on `/flyg/plan`; unit test `TRIP-012-R10 …` (other numbers, aircraft or flight) | local | Pass | 2026-10-24 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `lib/booking-rules.test.ts` (13) and `lib/bookings.test.ts` (4, against the unit test database, which they clean up) | local | Pass | 2026-10-24 |
| Browser tests | `tests/TRIP-012-book-a-flight.spec.ts` (8); the test that pays runs only locally (`runsLocally`) and deletes its booking from the test database | local | Pass | 2026-10-24 |
| Smoke test | `TRIP-012-R1 @smoke the booking page loads for a chosen trip`, read-only | local; preview and live not checked yet | Pass locally | 2026-10-24 |
| Accessibility | axe on the booking page (empty, with messages, with the tip shown), the payment page with its message and the summary. The checklist in `wiki/system/accessibility.md` on the live site: not checked yet (not deployed). By hand locally: 320 px wide without sideways scrolling (booking page and summary) | local | Pass (axe, 320 px); live checklist not checked | 2026-10-24 |
| Security | Security points in the review; `/security-review` (personal data, server action, database): no high-confidence findings, see [review.md](review.md) | local | Pass | 2026-10-24 |
| Code review | [review.md](review.md): passed, the should-fix findings fixed | local | Passed | 2026-10-24 |

## Test suite

`npm run test:time` before and after the change (budgets and rules in `wiki/system/testing.md`).

| | Unit tests | Browser tests | Total time (browser) | Slowest test |
|---|---|---|---|---|
| Before | 74 (0.5 s) | 165 | 121.6 s | 2.8 s |
| After | 91 (0.4 s) | 173 | 132.5 s (+9.0 %) | 2.8 s |

Within the budgets. Measured after the review's fixes; all passed. The first run after the change had one unit test fail with "database is locked": `lib/bookings.test.ts` writes to the unit test database while `db/migrations/006_charter_data.test.ts` did. `vitest.config.mts` now runs the files one at a time (`fileParallelism: false`); the unit tests then passed three runs in a row, about 1.6 s each in all.

## Definition of Done

- [x] Tests: every check in the card's test plan is done locally; every requirement has tests; `npm run test:unit` and `npm run test:local` pass
- [x] Test suite: within the time budgets, total time grown by 9.0 %, the new tests follow the quality rules
- [ ] Deployed, and the smoke tests pass against production (Live tests)
- [ ] Accessibility: axe passes for every new page and state; the checklist on the live site is not done yet (after the deploy)
- [x] Requirements in the card match what was built (updated with the user on 2026-10-24), no open questions left; copied below; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/boka-resan.md` and others), system docs (`wiki/system/booking.md` and others) and `wiki/log.md` updated
- [x] No leftovers: the old booking tables, `getAvailableSeats` and the old `createBooking` are gone; the plan page's `Overview` and `Problem` moved to shared components
- [x] Clean code: `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks: none needed; small cleanups done in the change (below)

Small cleanups done in this change: `TripOverview`, `Problem`/`TripProblem`, `loadTrip()` and `seatingText()` shared instead of copied; the migration table in `wiki/system/architecture.md` got the missing `008_factors.sql`.

## Requirements as built

Copied from the card on 2026-10-24.

### TRIP-012-R1 The booking page

On `/flyg/plan`, when every flight's card is folded (Klar pressed with everyone placed, or every flight already done when the page opens; TRIP-026), **Fortsätt** appears under the cards, in Totalt för resan, instead of the text about the next step. It opens the booking page, the step **Resenärer**. The booking page shows the chosen flights with aircraft, classes, flight times and arrival times, and a total price that updates at once as add-ons are chosen.

Acceptance criteria:

- **Given** a flight with a card not yet folded, **when** the page is shown, **then** there is no Fortsätt.
- **Given** every card folded, **when** the traveller presses Fortsätt, **then** the booking page shows the flights, aircraft, classes and the total price.

### TRIP-012-R2 Passengers

There is one section per passenger (Passagerare 1, 2, …) with first name, last name and age (a list from 1 to 120), all required. Each passenger has a class on each flight; they start in the numbers chosen on `/flyg/plan`, the most expensive class first (for example the first two in Business) and can be changed, but the number per class must still match TRIP-011.

Acceptance criteria:

- **Given** a passenger without a last name or age, **when** the traveller goes on, **then** the field is shown in red with a message saying what to do.
- **Given** 2 in Business and 1 in Ekonomi, **when** the page is shown, **then** Passagerare 1 and 2 are in Business and 3 in Ekonomi; **when** the traveller swaps 1 and 3, **then** the numbers still match.

### TRIP-012-R3 Add-ons

For each flight, a passenger can choose add-ons, several kinds and several of the same (at most 10 of each). Only the add-ons that can be bought in the passenger's class on that flight's aircraft are offered. Each add-on shows its name, description and price.

Acceptance criteria:

- **Given** a passenger in a class with Måltid and Extra bagage, **when** they choose 2 Måltid and 1 Extra bagage, **then** the total price grows by 2 × Måltid + 1 × Extra bagage.
- **Given** an add-on not allowed in the passenger's class on the aircraft, **when** the add-ons are shown, **then** it is not offered, and the server refuses it if sent anyway.

### TRIP-012-R4 Dåliga nerver

Each passenger has a checkbox "Dåliga nerver" with the tip "Flyget blir mindre spännande, men kostar 1 000 kr mer", shown on hover and on keyboard focus. Ticking it adds 1 000 kr per flight for that passenger, saved as an add-on.

Acceptance criteria:

- **Given** a return trip, **when** one passenger ticks Dåliga nerver, **then** the total grows by 2 000 kr.
- **Given** the keyboard, **when** the checkbox has focus, **then** the tip is shown and can be read by a screen reader.

### TRIP-012-R5 The contact person

The contact person has first name, last name, e-mail, phone and address (one field), all required. The e-mail must look like an e-mail address and the phone number may have digits, spaces, hyphens and a leading +, at least 7 digits.

Acceptance criteria:

- **Given** the e-mail "anna@", **when** the traveller goes on, **then** the field is shown in red with a message saying what to do.

### TRIP-012-R6 Three required checkboxes

The booking page has three checkboxes: "Är du försäkrad?", "Är alla du bokar åt försäkrade???!" and "Har du läst våra villkor? Du hittar dom någonstans på sidan." The traveller can only go on to payment when all three are ticked and every field is valid; otherwise a message says what is missing.

Acceptance criteria:

- **Given** a filled-in page with two of three boxes ticked, **when** the traveller goes on, **then** they stay on the page and a message points to the unticked box.

### TRIP-012-R7 Payment

The payment page shows the total price and two payment methods, "Cash till piloten" and "Vi hämtar pengarna hos dig"; one must be chosen. The traveller can go back to the booking page without losing what they filled in. Betala creates the booking.

Acceptance criteria:

- **Given** the payment page, **when** no method is chosen and the traveller presses Betala, **then** a message asks them to choose one.
- **Given** the payment page, **when** the traveller goes back, **then** the booking page still has everything they filled in.

### TRIP-012-R8 Saving the booking

Betala saves the booking in one go: the contact, the passengers with names and age, each flight with its date, departure, aircraft and each passenger's class, the add-ons with number and price, Dåliga nerver, the payment method and a new six-character booking number. All prices are calculated on the server from the database: the departure's price × the aircraft's price factor × the class factor, plus the add-ons. Pressing Betala twice gives one booking. If something has changed so that the booking is no longer valid (for example an aircraft was deleted), nothing is saved and a message says what to do.

Acceptance criteria:

- **Given** a valid booking, **when** the traveller presses Betala, **then** it is saved with the values above and the prices from the database.
- **Given** a price changed in the browser, **when** the booking is sent, **then** the saved price is still the database's.
- **Given** a double click on Betala, **when** the booking is saved, **then** there is one booking.

### TRIP-012-R9 The summary

After Betala, a summary shows the booking number, the flights with aircraft, each passenger with class and add-ons, the contact person, the payment method and the total price. It is shown only right after booking; the booking cannot be opened by typing a booking number in the address.

Acceptance criteria:

- **Given** a saved booking, **when** the summary is shown, **then** it has the booking number and everything above.
- **Given** another visitor, **when** they open the summary's address or guess a booking number, **then** they see no booking.

### TRIP-012-R10 The last steps

The steps are Flyg, Plan och klass, **Resenärer** (the booking page: passengers, add-ons, contact) and **Betala** (the payment page), the last steps of the step-by-step booking (TRIP-011-R10, TRIP-026-R5). The traveller can go back to any earlier step. Going back without changing anything keeps what they filled in; changing an earlier choice clears what depends on it: another aircraft, or other numbers per class, for a flight starts that flight's passenger classes over in the new numbers and clears the add-ons chosen for that flight (they depend on the aircraft and class), and another flight clears its aircraft, classes and add-ons. The other flight is not affected. Names, ages and the contact person are kept.

Acceptance criteria:

- **Given** add-ons chosen on a flight, **when** the traveller goes back and chooses another aircraft for it, **then** that flight's add-ons are cleared, and the names and the contact person are kept.
- **Given** the payment page, **when** the traveller goes back and forward without changing anything, **then** everything filled in is kept.

## Notes

- Admin's "in use" texts changed with the new tables: an aircraft in a booking gives "… används av en eller flera bokningar." (before "flighter"), and the class and capacity checks on an aircraft read the bookings.
- Next.js keeps an earlier page hidden in the document after a client-side navigation; tests that look for something on the new page wait for its address first (`TRIP-024-R2`), or look only at visible elements (`total()` in the TRIP-012 tests).
- CI on the pull request failed once in `TRIP-010-R3`: near its end axe opens and closes a blank page of its own, and a `clock.runFor` step of `axeWhileSearching` that was running just then failed with "Target page … has been closed". The race was in the helper before this change. The helper now skips such a step, and axe's own result still decides the test. Run 10 times in a row locally: all passed.

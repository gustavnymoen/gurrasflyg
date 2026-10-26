---
id: TRIP-023
title: Manage my booking
---

# Verification of TRIP-023

All checks were run locally on 2026-10-26 (`npm run test:time`: unit tests and `npm run test:local`). Nothing is deployed yet, so nothing has been checked on the live site: those rows say "not checked".

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-023-R1 | Tests `TRIP-023-R1 …` (3) in `tests/TRIP-023-my-booking.spec.ts` (open by click and keyboard, `aria-expanded`, Escape and click outside return focus, phone width, the question mid-booking, footer without the links, axe); `TRIP-018-R3 …` updated to the menu's Start; `TRIP-023-R1 and R2 …` in `TECH-018-design.spec.ts` | local | Pass | 2026-10-26 |
| TRIP-023-R2 | Unit tests in `lib/cancel-rules.test.ts` and `lib/my-booking.test.ts` (case, spaces, same answer for a wrong number and a wrong last name, charter); browser test `TRIP-023-R2 R4 R5 …` (missing field named, fields keep their text, nothing in the address, a reload starts over) | local | Pass | 2026-10-26 |
| TRIP-023-R3 | Unit tests (6th refused, window of 15 minutes, a right lookup clears the count, another address not locked, kept apart from the admin's key); browser test `TRIP-023-R3 …` | local | Pass | 2026-10-26 |
| TRIP-023-R4 | Unit test `TRIP-023-R4 the booking shows each flight …` (contact, flights, seats, add-ons and prices add up to the total; re-read after cancelling); browser tests (everything shown, totals Återbetalat and Kvar att betala follow the lottery) | local | Pass | 2026-10-26 |
| TRIP-023-R5 | Unit test for the charter lookup (trips, passengers, extras, total); browser tests `TRIP-023-R2 R4 R5 …` and `TRIP-023-R7 R10 …` | local | Pass | 2026-10-26 |
| TRIP-023-R6 | Unit tests of the ticking rules (flight takes all passengers, one seat, nothing ticked, flight and booking cancelled when every seat is, return kept); browser test `TRIP-023-R6 R9 R10 R11 …` (button disabled, ticking, cancelled flight kept, whole booking Avbokad, no boxes left) | local | Pass | 2026-10-26 |
| TRIP-023-R7 | Unit tests (traveller amount, charter selection, all cancelled), `lib/my-booking.test.ts` (charter cancel); browser test `TRIP-023-R7 R10 …` (whole trip, one traveller, no box for one leg) | local | Pass | 2026-10-26 |
| TRIP-023-R8 | Unit tests of the 24 hour rule (exactly 24 h, summer time, New York) and of the server's refusal; browser tests `TRIP-023-R8 …` (3: past and within 24 h greyed with the reason and `aria-describedby`, a far flight still cancellable, a charter within 24 h) | local | Pass | 2026-10-26 |
| TRIP-023-R9 | Browser test `TRIP-023-R6 R9 R10 R11 …` (the rules and the amount before the button, the dialog repeats them, Escape and Nej change nothing); `TRIP-023-R4 and R6 and R9 …` in the design file | local | Pass | 2026-10-26 |
| TRIP-023-R10 | Unit tests with an injected random number (win, loss, exactly one half loses, same confirmation twice and at once = one draw); browser tests accept either outcome and check the numbers follow it. The request carries only credentials, a request id and ids (code review) | local | Pass | 2026-10-26 |
| TRIP-023-R11 | Unit tests (cancelled parts and the total kept, a fully cancelled booking found with its history); browser test (looked up again). Migration `012_cancellations.sql` only adds: applied to a copy of the local database (no bookings in it) and read by inspection | local | Pass | 2026-10-26 |
| TRIP-023-R12 | Unit tests: a seat from another booking, one already cancelled, empty, duplicate, negative, fractional, empty request id; a wrong last name or number is refused and counted | local | Pass | 2026-10-26 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `lib/cancel-rules.test.ts` (17) and `lib/my-booking.test.ts` (23), the latter on the unit-test database | local | Pass | 2026-10-26 |
| Browser tests | `tests/TRIP-023-my-booking.spec.ts` (10 tests, 7 write bookings into the test database and remove them), 2 new design tests in `TECH-018-design.spec.ts`; `TRIP-018-start-tabs.spec.ts` changed for the menu. 4 of the card's 5 combined groups became 10 smaller tests: lookup and limit are split because the limit needs an address of its own, and the too-late cases are separate | local | Pass | 2026-10-26 |
| Smoke test | `TRIP-023-R1 @smoke …`: the menu opens and Min bokning shows its form; it writes nothing | local; preview and live not checked | Pass (local) | 2026-10-26 |
| Accessibility | axe in every state of the browser tests (menu open, phone, question mid-booking, form, errors, found flight and charter booking, selection, dialog, after cancelling, fully cancelled, too late, locked). The manual checklist on the live site: not checked | local | Pass (axe); checklist not checked | 2026-10-26 |
| Security | The security points of the review and `/security-review`: no finding (see [review.md](review.md)) | local | Pass | 2026-10-26 |
| Code review | [review.md](review.md) | local | Passed | 2026-10-26 |

## Test suite

`npm run test:time`. Before: the card's figures for the suite (160 browser tests, about 156 s); not measured again before the change.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 160 browser | about 156 s | not recorded |
| After | 172 browser, 200 unit | 164.4 s browser, 0.8 s unit | 3.6 s |

The first run after the change had two failing tests (the menu button changed the Tab order that `TECH-018` expects, and a radius check) and ended at 175.8 s because of their timeouts; both were fixed and the second run is the figure above. 12 new browser tests (10 + 2); the budget is 180 s, so the suite is close to it (91 %) and growing it further needs combining tests (see Notes).

## Definition of Done

- [x] Tests: every check in the card's test plan is done locally; every requirement has a test named after it; `npm run test:unit` and `npm run test:local` pass
- [x] Test suite: within the budgets (164.4 s of 180 s, slowest test 3.6 s of 5 s); total time grew about 5 % on the card's figures; the new tests wait for what they read (no read before the list is drawn)
- [ ] Deployed, and the smoke tests pass against production (Live tests): not checked, nothing is pushed
- [ ] Accessibility: axe passes for every changed state; the manual checklist items on the live site: not checked
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/min-bokning.md`), system docs (`wiki/system/my-booking.md` and others) and `wiki/log.md` updated
- [x] No leftovers: nothing made unused (the footer links and `footerStart` in a test are replaced)
- [x] Clean code: `npm run lint`, `npm run typecheck` and `npm run build` (run by `test:local`) pass without warnings
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements: none added (see review.md, Outside the change)

## Requirements as built

Copied from the card (`gh issue view 59`). One wording changed in the build: the result texts of R10 are as the card proposed.

### TRIP-023-R1 The hamburger menu

A menu button in the header of every page with the wordmark opens a list with Start, Min bokning and Admin; the footer no longer links to Start and Admin. It opens with a click or the keyboard, says `aria-expanded`, and Escape or a click outside closes it and returns focus to the button. It works the same on a phone and a wide screen. In the middle of a booking a link asks "Är du säker?" like the wordmark, and the booking is dropped only on Ja, avbryt.

### TRIP-023-R2 Find a booking

A flight or charter booking is shown when the visitor types its booking number (any case, spaces around ignored) and the contact's last name (any case). A number that doesn't exist and a last name that doesn't match give the same answer, "Vi hittar ingen bokning med de uppgifterna.", and the fields keep what was typed. An empty field is named. The number and last name are not in the address, and a reload starts over.

### TRIP-023-R3 A limit on wrong guesses

After 5 wrong attempts from one address within 15 minutes a sixth is refused for 15 minutes, even with the right number and last name, with a message to try again later and nothing shown; counted apart from the admin sign-in. A right lookup clears the count, and attempts older than 15 minutes are deleted.

### TRIP-023-R4 See a flight booking

Booking number, contact (name, e-mail, phone, address), payment method, and per flight the route, date, departure and arrival time, aircraft, and per passenger the name, age, class and add-ons with prices, and the total. Cancelled parts are struck through with "Avbokad"; the total shows what was paid, what has been refunded and what is left to pay.

### TRIP-023-R5 See a charter booking

Booking number, destination, contact, payment method, the outbound and return trips with timetable, date and times, the passengers, the extras with prices and the total; cancelled passengers or a cancelled trip as in R4.

### TRIP-023-R6 Choose what to cancel on a flight booking

Ticking a flight ticks all its passengers; ticking one passenger cancels only that seat. A cancelled seat takes its add-ons with it. Nothing ticked disables the button. A flight with every passenger cancelled is cancelled; every flight cancelled makes the booking "Avbokad" with nothing to tick. Outbound and return can be cancelled apart.

### TRIP-023-R7 Choose what to cancel on a charter booking

The whole trip or single passengers; a passenger is cancelled on both trips with their share of the extras. Neither trip alone. Every passenger cancelled makes the booking "Avbokad".

### TRIP-023-R8 Not within 24 hours, and not the past

A flight (or a passenger's seat on it) that departs in 24 hours or less, or has left (the departure airport's time zone), can't be cancelled: its box is greyed out and says "Det är för sent att avboka", and the server refuses it. A charter booking is judged by its outbound trip.

### TRIP-023-R9 The rules are told before the click

Before the button, the page lists what is ticked, the amount refunded on a win, and that it is a 50/50 lottery where a loss means paying the full price. The button opens "Är du säker?", which repeats it and says it is final; only its confirm button cancels, Escape and "Nej" change nothing.

### TRIP-023-R10 The lottery

The server draws once per cancellation, 50/50: on a win the price of everything cancelled is subtracted from what is left to pay and the page says "Grattis! Vi får se om du får några pengar tillbaka – du får det!"; on a loss "Du måste betala fullt pris ändå, ledsen för det. Hör av dig till våra advokater om du är missnöjd." The browser never says what to draw or refund. The same confirmation sent twice gives one cancellation and one draw. The outcome is saved and shown afterwards.

### TRIP-023-R11 Cancelled stays visible

Cancelled parts are kept, marked with the time, the outcome and the amount refunded; a fully cancelled booking is still found and shown "Avbokad" with its history. The migration only adds.

### TRIP-023-R12 The server decides

Every cancellation is checked against the database: number and last name, that the parts belong to the booking and aren't cancelled, the 24 hour rule, and the refund. A part from another booking, an already cancelled part, a missing part or an empty selection is refused with nothing changed; a request without a matching number and last name is refused and counts as a wrong attempt.

## Notes

- The browser tests that need a booking write it straight into the test database and run only against the local test server (like the TECH-017 test); against production only the menu tests and the smoke test run.
- The suite is at 91 % of its time budget. The next feature that adds browser tests should combine some of the older ones first.
- The two flaky tests named in the task (TRIP-013-R1 and TRIP-027-R2) did not fail in either run; no new test reads a list before it is drawn.
- The guess limit's reset on a right lookup is as the card says; see the review's first should-fix.

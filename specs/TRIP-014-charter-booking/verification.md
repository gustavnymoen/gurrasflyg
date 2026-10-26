---
id: TRIP-014
title: Search and book charter trips
---

# Verification of TRIP-014

How each requirement was checked. "local" is `npm run test:local` against a production build with its own test database; "unit" is Vitest against the unit test database.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-014-R1 | Browser tests `TRIP-014-R1 the destination page has the form …`, `… a destination without flights has no form` and `… an address with something missing or wrong shows no search` (unknown airport, 11 travellers, wrong date); unit tests `TRIP-014-R1 …` in `lib/charter-rules.test.ts` (address in both directions, all invalid values) | local, unit | Pass | 2026-10-26 |
| TRIP-014-R2 | Browser test `TRIP-014-R2 only days when a trip runs can be chosen, and another airport clears …` (calendar, typed day, no "Tur och retur", another airport); unit test `TRIP-014-R2 a timetable runs on its weekdays inside its period` and `lib/charter.test.ts` `TRIP-014-R2 dates beyond six months …` | local, unit | Pass | 2026-10-26 |
| TRIP-014-R3 | Browser tests `TRIP-014-R3 R4 …` (the four and three trips, card contents, sorting, a day without trips) and `TRIP-014-R3 R5 the return list …`; unit tests in `lib/charter.test.ts` (Monday and Saturday, trips that have left, seasonal route) and `lib/charter-rules.test.ts` (sorting, the return list) | local, unit | Pass | 2026-10-26 |
| TRIP-014-R4 | Unit tests `TRIP-014-R4 …` (06:25 + 840 min = 21:25 at Windhoek, midnight, the change to summer time on 28 March 2027, with course data in `lib/charter.test.ts`); the browser test checks the arrival on the page | unit, local | Pass | 2026-10-26 |
| TRIP-014-R5 | Browser tests `TRIP-014-R5 choosing the trips …` (steps, Fortsätt, total, address, reload) and `TRIP-014-R5 R6 the steps link back …`; `TRIP-014-R3 R5 … a changed outbound clears a return` | local | Pass | 2026-10-26 |
| TRIP-014-R6 | Browser tests `TRIP-014-R5 R6 …` and `TRIP-014-R6 R10 the form is kept in the tab only …`; unit tests for the checks (the same functions as the flight booking's) and `fitCharterForm` | local, unit | Pass | 2026-10-26 |
| TRIP-014-R7 | Browser test `TRIP-014-R7 the extras add up …` (two extras, under 18, removed with a message, total); unit tests `TRIP-014-R7 …` and `lib/charter-bookings.test.ts` (refused on the server); the extras are defined in `EXTRAS` only | local, unit | Pass | 2026-10-26 |
| TRIP-014-R8 | Browser test `TRIP-014-R8 R9 R10 Betala asks for a payment method, saves …` (price list, message and focus, booking number, rows saved, then deleted; locally only); unit tests in `lib/charter-bookings.test.ts` (database prices, sent price ignored, changed price, one booking for two calls, trip changed) and `db/migrations/011_charter_bookings.test.ts` | local, unit | Pass | 2026-10-26 |
| TRIP-014-R9 | The same browser test (the summary, and "Ingen bokning" in another tab) and the unit test `TRIP-014-R9 the summary …` | local, unit | Pass | 2026-10-26 |
| TRIP-014-R10 | Browser test `TRIP-014-R6 R10 … Avbryt asks before throwing it away` (Nej keeps, Ja goes to `/charter` and removes the saved form); unit test `TRIP-014-R10 Avbryt goes to the charter page …` | local, unit | Pass | 2026-10-26 |
| TRIP-014-R11 | axe in every state (the form with and without messages, the results with trips, with none and with an invalid address, Resenärer with problems and with extras, Betala, the summary); 320 px in `tests/TECH-018-design.spec.ts`; focus and announcements in the choosing, sorting and extras tests | local | Pass | 2026-10-26 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `lib/charter-rules.test.ts`, `lib/charter.test.ts`, `lib/charter-bookings.test.ts`, `db/migrations/011_charter_bookings.test.ts`, `lib/flow.test.ts` (`abortTarget`) | local | Pass | 2026-10-26 |
| Browser tests | `tests/TRIP-014-charter-booking.spec.ts` (12 tests), two assertions added to the design tests, one test changed in `tests/TRIP-013-destinations.spec.ts` (see Notes) | local | Pass | 2026-10-26 |
| Smoke test | `TRIP-014-R1 @smoke …` in `tests/TRIP-014-charter-booking.spec.ts`: from a destination page's form to results, and a trip is chosen (read-only) | local; preview and live: not checked yet (after the push and the deploy) | Pass locally | 2026-10-26 |
| Accessibility | axe in every state (above). The checklist in `wiki/system/accessibility.md` for the destination page with the form, the results, Resenärer, Betala and the summary on the live site: not checked yet (after the deploy) | local | axe: Pass. Checklist: not checked | 2026-10-26 |
| Security | The security points in the review, and `/security-review` run on the branch: no findings of high confidence | local | Pass | 2026-10-26 |
| Code review | [review.md](review.md) | local | Passed | 2026-10-26 |

## Test suite

`npm run test:time` before and after the change.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 124 unit, 201 browser | 0.6 s + 188.7 s | 3.3 s |
| After | 161 unit, 214 browser | 0.7 s + 209.4 s | 3.9 s |

The browser suite grew by 13 tests (6 %) and by 20.7 s (11 %), which is within 25 % but leaves it 29 s over the 180 s budget; it was already 9 s over before this change (see TRIP-013), and no single test is over 5 s. The 12 new tests cover the form, the dates, the results, choosing, Resenärer, the extras, the form kept in the tab, Avbryt and paying, merged so that each page is loaded few times; the suite needs a technical task to get back under its budget (proposed to the user). One flaky assertion in TRIP-013 (`… Enter lists every match` counted the cards before the list was filtered) was made to wait for the count, and the TRIP-013 test `no booking button` was changed since the destination page now has a form (below).

## Definition of Done

- [x] Tests: every check in the card's test plan is done locally; every requirement is tested; `npm run test:unit` and `npm run test:local` pass (`npm run test:time`)
- [ ] Test suite: 11 % slower, but 29 s over the 180 s budget (see above; the suite was already over); the new tests follow the quality rules in `wiki/system/testing.md`
- [ ] Deployed, and the smoke tests pass against production (Live tests): not yet, after the merge
- [ ] Accessibility: axe passes in every state; the checklist on the live site: not checked yet, after the deploy
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/boka-charter.md` and others), system docs (`wiki/system/charter-booking.md` and others) and `wiki/log.md` updated
- [x] No leftovers: nothing made unused by the change remains (the duplicated form parts were moved, not copied); no commented-out code or debug output
- [x] Clean code: reuses existing components and helpers; `npm run lint`, `npm run typecheck` and `npm run build` pass without warnings
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements noticed along the way: the suite's time (above), and the charter list's clickable cards and redundant start cards (TRIP-013), proposed to the user

## Requirements as built

Copied from the card when the feature was done. One change was made to the card during the work: R2 says that another airport also clears an Utresa that no longer fits.

### TRIP-014-R1 The search form

The page of a destination with flights shall have a form with **Avresa från** (Stockholm Arlanda or Köpenhamn Kastrup), **Utresa**, **Hemresa** and **Resenärer** (1–10), and a button **Sök resor**. The traveller returns to the airport they left from.

Acceptance criteria:

- **Given** `/charter/teufelsberg`, **when** it is shown, **then** it has the form, with Arlanda chosen, one traveller and no dates.
- **Given** the button pressed with a date missing, **when** checked, **then** what is missing is marked in red with a message under the field ("Välj datum för utresan.", "Välj datum för hemresan."), focus moves to the first one, and nothing is searched.
- **Given** valid values, **when** Sök resor is pressed, **then** the traveller comes to `/charter/<id>/resor`, with the search in the address (`fran`, `utresa`, `hemresa`, `resenarer`) so the page can be reloaded and shared.
- **Given** a destination without flights, **when** its page is shown, **then** it has no form (TRIP-013-R8).
- **Given** an address with an invalid or missing value (an unknown airport, a wrong date, 0 or 11 travellers), **when** the results page is opened, **then** it shows "Sökningen saknar något. Börja med att välja en destination." with a link to `/charter`, and nothing is searched.

### TRIP-014-R2 The dates

The calendars shall follow the flight booking's rules for dates and, in addition, allow only days when a trip runs.

Acceptance criteria:

- **Given** the calendar for Utresa, **when** shown, **then** a day can be chosen only when it is today or later, not more than six months ahead, and a timetable from the chosen airport to the destination's airport runs on it (period and weekday).
- **Given** the calendar for Hemresa, **when** shown, **then** a day can be chosen only when it is the outbound day or later, at most two months after it, and a timetable from the destination's airport back to the chosen airport runs on it.
- **Given** another airport or another outbound date, **when** it is changed, **then** a Hemresa that no longer fits is cleared, and with another airport also an Utresa that no longer fits.
- **Given** a typed date that is not allowed, **when** checked, **then** the field says why, as in the flight booking.

### TRIP-014-R3 Trips in the results

The results page shall list, for the outbound date and for the return date, every trip that runs, as cards sorted by departure time or price, with the traveller choosing one of each.

Acceptance criteria:

- **Given** ARN to BER on Monday 2027-01-11, **when** the results are shown, **then** the outbound trips are `ARN-BER-SK1122`, `ARN-BER-EW488`, `ARN-BER-SK2291` and `ARN-BER-DY6077` (and on Saturday 2027-01-16 three, without `ARN-BER-EW488`).
- **Given** a trip, **when** its card is shown, **then** it has the airline, the flight numbers, the departure time, the arrival time with "+1" for a later day, the travel time ("1 h 40 min"), "Direkt" or "1 byte i Frankfurt" (all airports in order), and the price per person.
- **Given** a trip date that is today, **when** the results are shown, **then** trips that have already left (local time at the departure airport) are not listed.
- **Given** the return list, **when** shown, **then** it lists only trips that depart after the chosen outbound trip has arrived (on the same day, or any trip on a later day).
- **Given** a date without trips, **when** the results are shown, **then** the page says "Inga resor den här dagen" with a link back to the search.
- **Given** the sort choice, **when** changed, **then** the order changes without a new search, and equal prices are ordered by time.

### TRIP-014-R4 Arrival and travel time

The arrival shall be worked out from the departure date and time at the departure airport and the timetable's travel time, read in the arrival airport's time zone, never from the course data's `arrives`.

Acceptance criteria:

- **Given** `ARN-WDH-LH1570` leaving 06:25 with 840 min, **when** its arrival is worked out, **then** it is 21:25 local time at Windhoek on the same day.
- **Given** a trip that crosses midnight or the change to summer time (late March 2027), **when** its arrival is worked out, **then** the time and the day ("+1") follow the airports' time zones on that date (unit tests with course data).

### TRIP-014-R5 Your trip and the steps

The page shall show **Din resa**: the chosen trips, the number of travellers and the total so far, and the steps Resa, Resenärer and Betala, with **Fortsätt** when both trips are chosen.

Acceptance criteria:

- **Given** the outbound trip chosen, **when** the page is shown, **then** the return list opens, and Fortsätt is not offered until both are chosen.
- **Given** both trips chosen, **when** the page is shown, **then** Din resa lists them and "Totalt för resan" is (outbound price + return price) × the number of travellers.
- **Given** a changed outbound trip, **when** chosen, **then** a chosen return trip that no longer fits (R3) is cleared, and the rest is kept.
- **Given** the chosen trips, **when** the page is reloaded or the traveller goes back and on, **then** the choices are kept, since they are in the address.
- **Given** the steps, **when** shown, **then** the current step is marked (`aria-current="step"`) and the earlier ones are links back with everything chosen.

### TRIP-014-R6 Resenärer

The step Resenärer shall have, as in the flight booking, one block per traveller with first name, last name and age (1–120), the contact (first name, last name, e-mail, phone, address), and the three questions, but no classes, aircraft or add-ons per flight.

Acceptance criteria:

- **Given** the step, **when** shown, **then** it has "Passagerare 1…n", "Kontaktperson" and "Tre viktiga frågor", with the same checks and messages as in the flight booking (`travellerProblems()`), and no "Dåliga nerver".
- **Given** a field with a problem, **when** Till betalning is pressed, **then** it is marked and its message read out, and focus moves to the first one.
- **Given** the form, **when** the traveller moves between the steps or reloads, **then** it is kept in the tab only (sessionStorage) and never in the address, and it is fitted to the trip (a changed number of travellers adds or removes travellers, the rest is kept).

### TRIP-014-R7 Extras for the whole booking

The step Resenärer shall offer three extras, chosen by check boxes for the whole booking, with the price per person multiplied by the number of travellers:

- **Den ultimata upplevelsen**: "Vår guide förbereder något extraordinärt till din resa." 1 000 kr per person.
- **Bear Grylls Experience**: "Utan guide. Du blir lämnad i vildmarken på väg till destinationen och får själv hitta dit – på egen risk! 2 000 kr per person för extra försäkring." 2 000 kr per person.
- **Dryckespaket XXXL**: "Dryck så det räcker hela resan." 4 000 kr per person. It can't be chosen when any traveller is under 18.

Any of them can be chosen together with any other.

Acceptance criteria:

- **Given** two travellers and Den ultimata upplevelsen and Bear Grylls Experience both chosen, **when** the total is worked out, **then** they add (2 × 1 000 + 2 × 2 000 kr), and neither turns the other off.
- **Given** a traveller whose age is under 18, **when** the step is shown, **then** Dryckespaket XXXL is unavailable (`aria-disabled`, and focus can still reach it) with "Går inte att välja när någon resenär är under 18 år" as its description.
- **Given** Dryckespaket XXXL chosen, **when** an age is changed to under 18, **then** it is removed and a message says so.
- **Given** a booking sent with Dryckespaket XXXL and a traveller under 18, or with an unknown extra, **when** it is saved, **then** it is refused (checked on the server, not only in the page).
- **Given** the extras, **when** the total is shown, **then** each chosen extra is listed with its sum, and the total is updated on every change.
- **Given** the extras' names, texts and prices, **when** read, **then** they are defined once in the code, not in the database or in admin.

### TRIP-014-R8 Betala and saving

The step Betala shall show the trip, the extras, "Att betala" with the price list (TRIP-027) and the payment methods Cash till piloten and Vi hämtar pengarna hos dig, and **Betala** shall save the booking with prices from the database.

Acceptance criteria:

- **Given** the step, **when** shown, **then** the price list splits "Att betala" in six rows that add up to it, as in the flight booking.
- **Given** Betala pressed with a payment method, **when** saved, **then** the booking gets a booking number "CH-" and six characters (no 0/O or 1/I), the traveller comes to the summary, and what is saved is in the tables of migration `011_charter_bookings.sql`: the booking with contact, payment and total, the travellers, the two trips (timetable, date, price per person at the time) and the extras (name, price per person at the time).
- **Given** a price, a total or an extra sent from the browser, **when** the booking is saved, **then** it is ignored and everything is worked out from the database and the code (unit test with a changed price).
- **Given** Betala pressed twice (the same request id), **when** saved, **then** one booking is made.
- **Given** a timetable that doesn't run on the date, a date that has passed, or a return that doesn't fit, **when** Betala is pressed, **then** nothing is saved and the page says "Något i resan har ändrats sedan du valde den. Gå tillbaka till Resa och välj igen.".
- **Given** a missing payment method, **when** Betala is pressed, **then** "Välj hur du vill betala." is shown, with focus on the first method.

### TRIP-014-R9 The summary

The page `/charter/bokad` shall show the booking number, the trips with times and arrival, the travellers, the extras, the contact, the payment method and the total, only straight after the booking is made.

Acceptance criteria:

- **Given** a made booking, **when** the summary is shown, **then** it has "Tack för din bokning!", "Bokningsnummer CH-K7M2QX" (the number made) and the rest above.
- **Given** the summary opened another way, **when** shown, **then** it says "Ingen bokning" and "Det finns ingen bokning att visa här. En bokning visas bara direkt efter att den är gjord.".

### TRIP-014-R10 Abort

Everything in the charter flow after the search shall have **Avbryt**, which asks before it throws away the booking, as in the flight booking (TRIP-018).

Acceptance criteria:

- **Given** the results, Resenärer or Betala, **when** Avbryt is pressed, **then** a question is shown; answering yes goes to `/charter` and removes the saved form, and no keeps everything.

### TRIP-014-R11 Accessibility and phone

The new pages and states shall meet WCAG 2.2 level AA and work on a phone.

Acceptance criteria:

- **Given** the destination page with the form, the results (with trips, with none and with errors), Resenärer (with problems and with extras), Betala and the summary, **when** checked with axe, **then** there are no violations.
- **Given** a 320 px wide screen, **when** the pages are used, **then** nothing is cut off and nothing needs sideways scrolling.
- **Given** a choice of trip, an extra or a changed sort order, **when** made, **then** focus is never lost and the change is read out.

## Notes

- **The destination page changed layout** (the user asked for the width to be used better): two columns on a wide screen, the price, form and airport on the right. The TRIP-013 design test still finds a photo wider than 800 px at 1280 px (824 px) and now also checks that the form is beside it. The TRIP-013 test `there is no booking button, and the link back keeps the search and filters` lost its "no booking button" part, which TRIP-014 makes untrue; the link back is still tested.
- **The browser tests choose dates from today**, a week ahead and not before 2 November 2026, so they need today to be before about 23 April 2027, when the timetables end on 30 April 2027 (the card names this limit). After that the results, choosing, Resenärer, extras and the smoke test fail with "no trips", and the timetables need extending first. The unit tests use fixed dates.
- **A repeated request id** returns the saved booking's number, and the summary is built from the form of the second request; with the same form (a double press) it is the same. Left as it is, as in the flight booking (review suggestion).
- **Not changed:** `sessionStorage` is shared by the flight and charter flows only by key; they have separate keys, and Avbryt clears all four.

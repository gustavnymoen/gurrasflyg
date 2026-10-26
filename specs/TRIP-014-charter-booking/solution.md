---
id: TRIP-014
title: Search and book charter trips
card: "#19"
depends_on: [TRIP-007, TRIP-009, TRIP-012, TRIP-013, TRIP-018, TRIP-027]
---

# TRIP-014 Search and book charter trips: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 19`.

## Data

Migration `db/migrations/011_charter_bookings.sql` adds four tables, separate from the flight booking's (`wiki/system/charter-booking.md` has the columns):

- `charter_bookings`: the booking number (`CH-` and six characters, checked by the table), the request id (unique, so two Betala make one booking), the destination, the contact, the payment method and the total.
- `charter_booking_passengers`, `charter_booking_trips` (position 0 outbound, 1 return; the timetable, the date and the price per person at the time) and `charter_booking_extras` (code, name and price per person at the time). All three are deleted with their booking.

The extras are not data: `EXTRAS` in `lib/charter-rules.ts` defines their code, name, text and price once; the database stores what was chosen and what it cost.

## Interface

**Pages**

- `/charter/<id>` gets the search form **Sök resa** (`CharterSearchForm`) and a two-column layout: the text on the left, the price, the form and the airport on the right (under the photo on a phone).
- `/charter/<id>/resor` (`CharterResults`): the outbound list, then the return list, **Din resa** and **Fortsätt**.
- `/charter/<id>/boka` (`CharterTravellersForm`): the passengers, the contact, the three questions and the extras.
- `/charter/<id>/boka/betala` (`CharterPaymentForm`): the payment method, "Att betala" with the price list, **Betala**.
- `/charter/bokad` (`CharterBooked`): the summary, from the tab.

The three pages after the search share `app/charter/[id]/CharterStep.tsx`, which reads the search and the choices from the address (`loadCharter()` in `lib/charter.ts`) and hands the page its data, or says what is missing ("Sökningen saknar något. Börja med att välja en destination." with a link to `/charter`).

**The address.** `/charter/teufelsberg/resor?fran=ARN&utresa=2027-01-11&hemresa=2027-01-16&resenarer=2&ut=ARN-BER-SK1122&hem=BER-ARN-SK1123`: the search, and the chosen timetables' ids. Names and other personal data never go in the address; the form is kept in `sessionStorage` under `gurrasflyg-charter` and the summary under `gurrasflyg-charter-bokad` (`app/flyg/boka/store.ts`).

**Logic** (`lib/`, no database, usable in the browser): `charter-rules.ts` (the search and its address, `runsOn`, `makeTrip` with the arrival, sorting, the return list, the extras, the form, its checks, the total and the summary). Server only: `charter.ts` (reads timetables and trips) and `charter-bookings.ts` (`createCharterBooking`), called by the server action `bookCharterAction` in `app/charter/actions.ts`.

**Shared parts reused, and what was taken out of the flight booking to share them**

- `Steps`, `Problem`, `PriceList`, `Card`, `Checkbox`, `Button`, `Field`, `Message`, `DatePicker`, `Calendar`, `AbortFlow`: used as they are (see the additions below).
- From `TravellersForm` into `app/flyg/boka/FormParts.tsx`: `PersonFields` (name and age), `ContactCard`, `QuestionsCard`, `TextField`. From `PaymentForm` into `PaymentParts.tsx`: `PaymentMethodCard` and `PayCard`. From `FlightResults` into `app/flyg/SortChoice.tsx`. From `SearchForm` into `app/components/TravellerCount.tsx`.
- `lib/booking-rules.ts`: `travellerProblems()` is built from `passengerProblems()` and `contactProblems()`, and `fitsTrip()` from `fitsForm()` and `fitsPerson()`, so charter has the same checks and messages. `lib/bookings.ts` exports `randomBookingCode()`.

**Small additions to shared components**

- `DatePicker` got `runs(leg, day)`: when it is given, only days when a trip runs can be chosen or typed ("Det går ingen resa den dagen."), and "Tur och retur" is not offered. `Calendar` got `isChoosable` and an optional `onRoundTripChange`.
- `Checkbox` got `unavailable`: `aria-disabled`, still focusable, not changed by a click.
- `AbortFlow`: Ja, avbryt from the charter flow after the search goes to `/charter` (`abortTarget()` in `lib/flow.ts`); the wordmark and Start still go to `/`. `/charter/bokad` is not a flow page, like `/flyg/bokad`.

**Texts to visitors (Swedish)** are in the card and the components. The ones that aren't in the card: "Det går ingen resa den dagen.", "Välj din resa", "Inte vald än", "Inga hemresor går efter att utresan har landat.", "Tillbaka till sökningen", "Välj en utresa och en hemresa först.", "Dryckespaket XXXL är borttaget eftersom en resenär är under 18 år.".

## Decisions

- **The arrival is worked out, never read.** `makeTrip()` takes the departure date and time in the departure airport's time zone, adds the travel time and reads the result in the arrival airport's time zone (`instant()` and `arrival()` in `lib/fare-rules.ts`, shared with the flight booking), so summer time on 28 March 2027 moves the arrival and not the travel time. The return list compares instants (`departsAt > arrivesAt`), which is the same as "after the outbound has landed" across time zones and midnight.
- **The trips are not in the page's data per choice but per date.** The server sends every trip of the outbound date and of the return date once; the page filters the return list and checks the choices itself (`chosenTrips`), so a choice is instant. The address follows with `window.history.replaceState` (as the destination list does), and the server reads the choices again when the page is reloaded or reached from the steps.
- **The server decides everything that matters.** `createCharterBooking()` reads the timetables in the write transaction, checks that both trips run on their dates, haven't left and fit each other, checks the form's shape, the extras (`extrasProblem()`: known codes, no duplicates, no Dryckespaket with a traveller under 18), the fields and the payment method, and works out every price from the database and `EXTRAS`. A price, a total or an extra's price in the request is never read.
- **One query set for both uses.** `readTimetables()` reads all timetables of a route with their weekdays, flights and changes (four queries, a handful of rows); the date filter is `runsOn()` in the code, the same function the date picker uses in the browser, so the calendar and the server can't disagree. The destination page sends the weekdays and periods of the timetables (`getSchedules()`), not the timetables.
- **The destination's airport is `tripTo()`'s.** `getDestinationAirport()` in `lib/travel.ts` uses the same rule as the destination page (nearest airport if a timetable from ARN or CPH goes there, otherwise the gateway), so the page and the booking can't disagree.
- **Dates count in Swedish time.** `readCharter()` takes "today" from Stockholm's clock (Copenhagen is the same), not the server's (UTC on Vercel).
- **Another airport clears dates that don't fit.** `CharterSearchForm` clears Utresa as well as Hemresa when they don't run from the new airport (the card says Hemresa; an outbound that doesn't run would be refused by the results page anyway), and rebuilds the date picker (`key`) so its fields show it.
- **The booking number has its own table's prefix.** `CH-` plus the six characters the flight booking uses; the table's `CHECK` allows only that shape.
- **The total is `(out + return) × travellers + extras × travellers`**, in `charterTotal()`; the price list (TRIP-027) splits it, so there is no charter-specific rounding.
- **The destination page uses the width.** The text and the photo are on the left, and the price, the form and the airport on the right, sticky on a wide screen (`max-w-7xl`); on a phone everything follows the photo in one column. The photo is still larger than 800 px on a 1280 px screen.
- **Not done here** (found along the way, proposed as their own card): the charter list's cards could be clickable as a whole, and the start cards Plats and Aktivitet are redundant now that every filter choice is shown (TRIP-013).

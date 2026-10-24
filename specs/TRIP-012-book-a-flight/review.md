---
id: TRIP-012
title: Book a flight
---

# Code review of TRIP-012

**Result:** Passed
**Date:** 2026-10-24, review run 1
**Summary:** The change does what the card asks for. Prices and every check run again on the server in one write transaction, a second Betala gives the same booking through `request_id`, personal data stays in the tab and out of the address, and every requirement has unit tests and a browser test named after it. No must-fix findings. The should-fix findings were small duplicates, leftovers, an R10 edge case and an axe check that was missing; all are fixed.
**Security:** Passed on every security point in the guide:
- Server input is checked by `fitsTrip`, `travellerProblems` and `paymentProblems` in `bookAction` and `createBooking`: lengths, classes on the aircraft, allowed add-ons, and 0–10 of each.
- Prices come only from the database, and every query takes parameters (`json_each(?)` in `readAddons` included).
- Visitors see only Swedish messages without internals.
- No route shows a booking by its number.

`/security-review` was run because the change touches a server action, database writes and personal data. Its result: no high-confidence vulnerabilities. It checked SQL injection, price tampering, getting round the class, count and add-on rules, malformed input, departed flights, a repeated request id, IDOR and data exposure, the booking number's randomness, XSS, personal data in logs, admin's "in use" rules and the migration. It also noted that capacity is checked per booking, not added up across bookings on a departure. That is by design: each booking gets its own aircraft.

How the review works: `wiki/system/code-review.md`.

## Must fix

None.

## Should fix

- `lib/trip.ts` (`legKey()`) The key was the departure time, the aircraft and the numbers per class, without the route or the date. Booking another date or route with the same time, aircraft and numbers kept the passengers' classes and add-ons, but R10 says another flight clears them. **Done:** `legKey(search, i, leg)` adds the route and the date. `bookingLegs()` now takes the search. The unit test `TRIP-012-R10 …` covers another date and another route.
- `lib/booking-rules.ts` `BookingLeg.of` and the summary's "Utresa"/"Hemresa" repeated `LEG_NAMES` from `app/flyg/TripOverview.tsx`. **Done:** `LEG_NAMES` moved to `lib/trip.ts`, and `lib` and `app` both use it.
- `app/components/Checkbox.tsx` The props `className` and `children` were never used. **Done:** removed.
- `tests/TRIP-012-book-a-flight.spec.ts` The new state "Ingen bokning" had no axe check. **Done:** `expectNoA11yViolations` runs on the other visitor's page, which now opens in its own browser context (axe needs one, and it is a truer "another visitor").

## Suggestions

- `lib/bookings.ts` A second Betala is safe because three things work together:
  - a request id made in the browser, stored in a `UNIQUE` column;
  - the lookup inside a write transaction;
  - the full checks, which still run before the existing booking is returned.
  
  The summary is built from the form just sent, not from the saved rows. **Done:** left as it is. The two differ only if a response is lost and the form is changed in between. Recorded in `solution.md`.
- `app/flyg/boka/store.ts` `useSyncExternalStore` returns nothing on the server. That keeps personal data out of the server-rendered HTML and avoids a hydration mismatch, at the cost of the form appearing after hydration. **Done:** a pattern worth reusing for other state kept in the tab; described in `wiki/system/booking.md`.
- `app/flyg/boka/actions.ts` `bookAction` reads the whole trip with `loadTrip` for the summary's flights, and `createBooking` reads the departures again in its transaction. **Done:** left as it is. Which read counts (the transaction) is clear.

## Outside the change

- `db/seed.test.ts` still names `flight_prices` and `booking_flight_addons`, which migration 009 drops, and `db/schema.sql` still creates the old tables and the view `available_seats` for a new database before the migrations replace them. The test still passes, and a new database ends up right. This is a small cleanup candidate, not added to the board: too small for a task of its own; take it with the next change to the schema.

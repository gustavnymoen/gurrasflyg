---
type: Feature
title: Booking
description: The steps Resenärer and Betala after /flyg/plan, the summary with the booking number, how the form is kept in the tab, how a booking is checked, priced and saved, and the booking tables.
resource: app/flyg/boka/
feature: TRIP-012
tags: [booking, passengers, add-ons, payment, personal-data, flight-booking, accessibility, security]
timestamp: 2026-10-24
---

# Booking

When every flight's card on [`/flyg/plan`](aircraft-and-classes.md) is folded, **Fortsätt** in Totalt för resan leads to the last two steps: **Resenärer** (`/flyg/boka`) and **Betala** (`/flyg/boka/betala`). Betala saves the booking and shows the summary at `/flyg/bokad`. The steps (`tripSteps()` in `app/flyg/Steps.tsx`) are Flyg, Plan och klass, Resenärer and Betala, the earlier ones links back with everything chosen.

## The trip and the form

- **The trip** is in the address, the same as on `/flyg/plan` (`bookingUrl()`, `paymentUrl()` in `lib/trip.ts`). The server pages read it with `loadBookingTrip()` in `lib/flights.ts`: the search, the chosen departures and the fleet from the database (`loadTrip()`, shared with `/flyg/plan`), the add-ons per class on the chosen aircraft (`readAddons()`), and from them the flights as the booking works with them (`bookingLegs()` in `lib/booking-rules.ts`: departure price, aircraft, numbers per class and add-ons per class). A flight without an aircraft or with someone not placed gives "Välj plan och klass för varje flyg först." and **Till plan och klass**.
- **The form** (`BookingForm`: passengers, contact, the three questions, the payment method and a request id) is personal data, so it never goes in the address. It is kept in the tab's `sessionStorage` under `gurrasflyg-bokning` (`app/flyg/boka/store.ts`, read with `useSyncExternalStore`), so it stays when the traveller moves between the steps or reloads, and is gone when the tab closes. It is saved on every change.
- **What a change clears** (TRIP-012-R10): the form records which flights its classes and add-ons belong to (`legKeys`, from `legKey()`: route, date, departure time, aircraft and numbers per class). Every time it is read, `fitForm()` fits it to the trip in the address: a flight whose key changed starts its passengers' classes over in the new numbers, the most expensive class first (`firstClasses()`), without add-ons. Names, ages, Dåliga nerver, the contact and the other flight are kept.

## Resenärer

`TravellersForm` (`app/flyg/boka/TravellersForm.tsx`):

- **Din resa** (`TripOverview`) with aircraft, flight time, arrival and the numbers per class.
- **Passagerare 1, 2 …**, a region each: Förnamn, Efternamn, Ålder ("Välj", "1 år" … "120 år"), **Dåliga nerver**, and per flight a group "Utresa"/"Hemresa" with **Klass** (the aircraft's classes with their price per person) and the add-ons that can be bought in that class on that aircraft, with name, description, price per item and − / + (0–10, read out when changed). A new class keeps only the add-ons that can be bought in it (`changeClass()`).
- **Dåliga nerver** costs 1 000 kr per flight. Its tip, "Flyget blir mindre spännande, men kostar 1 000 kr mer", is a `role="tooltip"` shown on hover and focus, hidden by Esc, and the checkbox's `aria-describedby`, so screen readers read it as the description.
- **Kontaktperson**: Förnamn, Efternamn, E-post, Telefon, Adress (one field), with `autocomplete`.
- **Tre viktiga frågor**: "Är du försäkrad?", "Är alla du bokar åt försäkrade???!", "Har du läst våra villkor? Du hittar dom någonstans på sidan." There are no terms anywhere; that is the joke.
- **Totalt för resan** (`bookingTotal()`), recalculated on every change, and **Till betalning**.

Till betalning runs `travellerProblems()`. Each problem marks its field (`aria-invalid`, red border) with the message under it (`aria-describedby`), "Något saknas. Rätta det som är rött ovan." appears above the button, and focus moves to the first problem. Numbers per class that don't match the plan page give "På utresan ska 1 sitta i Ekonomi, men 2 gör det. Byt klass för någon passagerare." under the passengers, with focus on Passagerare 1's class for that flight. The checks: names required and at most 100 characters, an age 1–120, an e-mail with something on both sides of @ and a dot after it, a phone number of digits, spaces, hyphens and a leading + with at least 7 digits, an address of at most 200 characters, and all three questions ticked. With nothing wrong, the form gets a request id (`crypto.randomUUID()`) and the page goes to Betala.

## Betala

`PaymentForm`: Din resa, "Hur vill du betala?" with **Cash till piloten** and **Vi hämtar pengarna hos dig** (radio buttons), "Att betala" with the price list under it (below), **Betala** and **Tillbaka till resenärerna**. Without a method, Betala gives "Välj hur du vill betala." and focus on the first method. Opened without filled-in travellers (directly, or after a booking) it says "Fyll i resenärerna först." with **Till resenärerna**.

Betala calls the server action `bookAction(query, form)` (`app/flyg/boka/actions.ts`), shows "Betalar…" meanwhile, and shows its message if it fails. On success the summary is saved in the tab under `gurrasflyg-bokad`, the form is removed, and the page is replaced by `/flyg/bokad`.

## The price list

Under "Att betala", and above "Totalt" in the summary, `PriceList` (`app/flyg/PriceList.tsx`, TRIP-027) shows the total split into Bränsle (40 %), Mutor (20 %), Alla möjliga avgifter (20 %), Stänga luftrummet vid avgång och ankomst (10 %), Försäkring (10 %) and Skatt (0 %, shown as "Skatt 0 %" and "0 kr"). Only the sums are shown. `priceList(total)` in `lib/booking-rules.ts` rounds each row down to whole kronor and adds the remainder to Bränsle, so the rows always add up to the total. The rows are calculated, not saved: nothing in the database changes.

## Saving

`bookAction` reads the trip from the address with `loadTrip()` and calls `createBooking()` (`lib/bookings.ts`), which does everything in one write transaction:

1. Looks up the request id; a booking already saved with it is returned at the end instead of a new one, so two Betala give one booking.
2. Reads each departure (it must exist and not have left), the fleet (`readFleet(tx)`) and the add-ons (`readAddons(ids, tx)`) inside the transaction, and builds the flights with `bookingLegs()`. A missing departure or aircraft, or numbers that no longer fit, give "Något i resan har ändrats sedan du valde den. Gå tillbaka till Plan och klass och välj igen.".
3. Checks the form: its shape (`fitsTrip()`: the number of passengers and flights, classes on the aircraft, only add-ons of the passenger's class, 0–10 of each, strings and booleans where expected) and its contents (`travellerProblems()`, `paymentProblems()`). Anything wrong gives "Bokningen gick inte att spara. Gå tillbaka till Resenärer och kontrollera uppgifterna.".
4. Saves the booking with a new six-character booking number (no 0/O or 1/I) and the prices it calculated: per seat the departure's price × the aircraft's × the class's price factor (`seatPrice()`), the add-ons at their price in the database, Dåliga nerver 1 000 kr per flight, and the total.

Nothing from the browser is used as a price. Since the reads and the insert are in the same write transaction, admin can't change an aircraft, class or add-on in between: either the whole booking is saved with what applied, or nothing. Other errors give "Något gick fel, försök igen." and are logged on the server.

## The summary

`/flyg/bokad` (`BookedSummary`) shows "Tack för din bokning!", "Bokningsnummer K7M2QX", the flights with aircraft, time and arrival, each passenger with age and per flight the class and add-ons ("2 × Måltid", Dåliga nerver), the contact, the payment method and the total, from the tab. There is no page that shows a booking from the database, so another visitor at the same address, or someone guessing a booking number, sees "Ingen bokning" and "Det finns ingen bokning att visa här. En bokning visas bara direkt efter att den är gjord.".

## The tables

Migration `009_bookings.sql` replaced the old flight and booking tables, built for a shared aircraft per flight with free seats, and stops if they have any rows.

| Table | Content |
|---|---|
| `bookings` | `booking_number` (unique), `request_id` (unique), the contact's `first_name`, `last_name`, `email`, `phone`, `address`, `payment` (`cash` or `collect`), `total`, `created_at` |
| `booking_passengers` | `booking_id`, `position`, `first_name`, `last_name`, `age` (1–120) |
| `booking_flights` | `booking_id`, `position` (0 outbound, 1 return), `route_id`, `date`, `departure_time`, `aircraft_id`, `price` (the departure's, per person) |
| `booking_seats` | `booking_flight_id`, `passenger_id`, `class_id`, `price` |
| `booking_addons` | `booking_seat_id`, `addon_id` (NULL for Dåliga nerver), `name`, `count` (1–10), `price` per item |

Everything below `bookings` is deleted with it (`ON DELETE CASCADE`). Admin (`lib/admin.ts`) treats an aircraft, class or add-on used by a booking as in use: an aircraft in a booking can't be deleted ("… används av en eller flera bokningar."), a class can't be removed from an aircraft its bookings use it on, nor get fewer seats than one booking has in it.

## Tests

Unit tests: `lib/booking-rules.test.ts` (the price list's shares and that it adds up, the starting classes, the numbers per class, the field checks, e-mail and phone, the questions and the payment method, the total with factors, add-ons and Dåliga nerver, what a change clears, the server's shape check, the summary) and `lib/bookings.test.ts` (saving with the database's prices against the unit test database, a price sent from the browser ignored, two calls with one request id giving one booking, an add-on not allowed refused, nothing saved when the aircraft is gone, the departure has left or a field is missing). `vitest.config.mts` maps `server-only` to its empty module for them.

Browser tests: `tests/TRIP-012-book-a-flight.spec.ts`, with the add-ons on the tests' own aircraft in `tests/plan.ts` and `openBooking()`. The test that pays runs only locally (`runsLocally`), checks the booking in the test database and deletes it. `tests/TRIP-027-price-list.spec.ts` checks the list on Betala and (locally only) in the summary. The smoke test chooses the first aircraft for one traveller on a deployed site and checks that the booking page loads, without saving anything.

[System documentation](index.md)

---
id: TRIP-012
title: Book a flight
card: "#17"
depends_on: [TRIP-003, TRIP-004, TRIP-010, TRIP-011, TRIP-024, TRIP-026]
---

# TRIP-012 Book a flight: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 17`.

## Data

Migration `db/migrations/009_bookings.sql`:

- **Removes the old tables** for flights and bookings: `flights`, `flight_prices`, `contacts`, `passengers`, `bookings`, `booking_flights`, `booking_flight_addons` and the view `available_seats`. They were built for one aircraft per flight with free seats; since TRIP-011 the routes (`routes`, `route_departures`) are flown and every booking gets its own aircraft, and no page could book, so they were empty. The migration first checks that: a table `migration_009_check` with `CHECK (n = 0)` gets the number of rows in them, so if anything is there the migration stops and nothing changes (tried on a copy with a booking in it).
- **New tables:**
  - `bookings`: `booking_number` (six characters, unique), `request_id` (unique; made by the browser per booking, so a second Betala finds the first), the contact (`first_name`, `last_name`, `email`, `phone`, `address`), `payment` (`cash` = Cash till piloten, `collect` = Vi hämtar pengarna hos dig), `total` and `created_at`.
  - `booking_passengers`: `position` (Passagerare 1, 2 …), `first_name`, `last_name`, `age` (1–120).
  - `booking_flights`: `position` (0 outbound, 1 return), `route_id`, `date`, `departure_time`, `aircraft_id` and `price` (the departure's price per person when booked).
  - `booking_seats`: one per passenger and flight, with `class_id` and `price` (departure × aircraft × class).
  - `booking_addons`: per seat, `addon_id`, `name`, `count` (1–10) and `price` per item. Dåliga nerver is a row with `addon_id` NULL, name "Dåliga nerver" and 1 000 kr.
  - Everything below `bookings` is deleted with it (`ON DELETE CASCADE`), which the tests use to clean up.
- **Admin's "in use" rules** now read the new tables (`lib/admin.ts`): a class is in use if an aircraft has it or a booking seat uses it; an add-on if an aircraft has it or a booking has it; an aircraft can't be deleted if a booking uses it ("<name> används av en eller flera bokningar.", before "flighter"); a class can't be removed from an aircraft that bookings use it on, and its seats can't be fewer than the most booked in it in one booking.
- `lib/db.ts` loses `getAvailableSeats` (the view is gone, and nothing used it).

## Interface

Pages and steps: **Flyg**, **Plan och klass**, **Resenärer** (`/flyg/boka`), **Betala** (`/flyg/boka/betala`), then the summary `/flyg/bokad`. `tripSteps()` in `app/flyg/Steps.tsx` gives the steps with links back, with everything chosen in the address, and is used by all three pages.

- **Fortsätt** (R1): on `/flyg/plan`, `TripTotal` shows the link Fortsätt to `/flyg/boka?<same address>` when every card is folded. Before that it says "Lägg alla resenärer i en klass på varje flyg för att gå vidare." or, with everyone placed but a card still open, "Tryck Klar på varje flyg för att gå vidare.".
- **The address** is the plan page's (`bookingUrl()`, `paymentUrl()` in `lib/trip.ts`). What the traveller fills in is personal data and never goes in the address.
- **The server pages** (`app/flyg/boka/page.tsx`, `betala/page.tsx`) read the trip with `loadBookingTrip()` (`lib/flights.ts`): `loadTrip()` (the search, the chosen departures and the fleet from the database, moved here from the plan page, which uses it too) and the add-ons per class on the chosen aircraft (`readAddons()`). `bookingLegs()` (`lib/booking-rules.ts`) turns them into the flights the booking works with; a flight without an aircraft or with someone not placed gives "Välj plan och klass för varje flyg först." and **Till plan och klass**. An incomplete address or a departure that is gone gives the plan page's messages (`TripProblem` in `app/flyg/Problem.tsx`, shared).
- **Resenärer** (`TravellersForm`, R1–R6), one `<form noValidate>`:
  - Din resa (`TripOverview`, moved out of `TripBuilder` and shared) with the numbers per class (`seatingText()` in `lib/fare-rules.ts`, also used by the folded card).
  - A card per passenger, "Passagerare 1" (a region): Förnamn, Efternamn, Ålder (a list "Välj", "1 år" … "120 år"), the checkbox **Dåliga nerver**, and per flight a group "Utresa"/"Hemresa" with **Klass** (a list of the aircraft's classes with the price per person, "Business, 1 800 kr") and the add-ons of that class, each with name, description, "120 kr / st" and − / + (0–10, read out when changed). With none: "Inga tillägg i den här klassen.".
  - The tip of Dåliga nerver, "Flyget blir mindre spännande, men kostar 1 000 kr mer", is a `role="tooltip"` element shown on hover and on focus, hidden with Esc, and is the checkbox's `aria-describedby`.
  - Kontaktperson: Förnamn, Efternamn, E-post, Telefon, Adress, with `autocomplete`.
  - Tre viktiga frågor: the three checkboxes (`Checkbox`, a new shared component).
  - Totalt för resan (`bookingTotal()`), updated at once, and **Till betalning**.
  - Till betalning checks everything (`travellerProblems()`). A problem makes its field red (`aria-invalid`) with its message under it (`aria-describedby`), "Något saknas. Rätta det som är rött ovan." above the button, and focus moves to the first problem. Numbers per class that don't match give "På utresan ska 1 sitta i Ekonomi, men 2 gör det. Byt klass för någon passagerare." after the passengers, and focus goes to Passagerare 1's class on that flight. With nothing wrong the form is saved with a new request id and the page goes to Betala.
  - Messages: "Skriv passagerarens förnamn." / "efternamn.", "Välj passagerarens ålder.", "Skriv ditt förnamn." / "efternamn.", "Skriv din e-postadress.", "Skriv en hel e-postadress, t.ex. anna@exempel.se.", "Skriv ditt telefonnummer.", "Skriv ett telefonnummer med minst 7 siffror, t.ex. 070-123 45 67.", "Skriv din adress.", "Högst 100 tecken." (200 for the address), "Kryssa i rutan för att gå vidare.".
- **Betala** (`PaymentForm`, R7–R8): Din resa, "Hur vill du betala?" with two radio buttons, "Att betala", **Betala** and **Tillbaka till resenärerna**. Betala without a method gives "Välj hur du vill betala." and focus on the first method. Opened without filled-in travellers it says "Fyll i resenärerna först." with **Till resenärerna**. Betala calls the server action `bookAction` (`app/flyg/boka/actions.ts`), shows "Betalar…" meanwhile, and shows the action's message if it fails.
- **The summary** (`/flyg/bokad`, `BookedSummary`, R9): "Tack för din bokning!", "Bokningsnummer K7M2QX", Flyg (each flight with aircraft, time and arrival), Passagerare (name, age, and per flight the class and add-ons, "2 × Måltid", Dåliga nerver), Kontaktperson, Betalsätt and Totalt. Without a booking in the tab: "Ingen bokning" and "Det finns ingen bokning att visa här. En bokning visas bara direkt efter att den är gjord." with **Till sökningen**.
- **Saving** (`createBooking()` in `lib/bookings.ts`, R8), in one write transaction: reads the departures (they must exist and not have left), the fleet and the add-ons with the transaction; builds the flights (`bookingLegs()`, null → "Något i resan har ändrats sedan du valde den. Gå tillbaka till Plan och klass och välj igen."); checks the form's shape (`fitsTrip()`: the right number of passengers and flights, classes on the aircraft, only add-ons of the passenger's class, 0–10 of each, strings and booleans where expected) and its contents (`travellerProblems()`, `paymentProblems()`), else "Bokningen gick inte att spara. Gå tillbaka till Resenärer och kontrollera uppgifterna."; returns the existing booking if the request id is already saved; otherwise saves everything with the prices it calculated and a new booking number (`newBookingNumber()`, six characters without 0/O and 1/I). Other errors give "Något gick fel, försök igen." and are logged.

## Decisions

- **The form lives in the tab (`sessionStorage`), not the address or a cookie.** Names, ages, e-mail and phone are personal data and must not end up in addresses, logs or the browser history. The tab keeps them when the traveller goes back and forth between the steps (R7, R10), and they are gone when the tab closes. `app/flyg/boka/store.ts` reads it with `useSyncExternalStore` (nothing on the server, so the form appears after hydration), and a write tells every reader. The summary is kept the same way after Betala, so only that tab can show it (R9); nothing on the server shows a booking, so a booking number in an address shows nothing.
- **What the form belongs to is in it** (`legKeys`, from `legKey()` in `lib/trip.ts`: the route, the date, the departure time, the aircraft and the numbers per class). `fitForm()` fits the saved form to the trip in the address every time it is read: a flight whose key changed starts its classes over in the new numbers (most expensive class first, `firstClasses()`) without add-ons; everything else is kept (R10). This needs no rule about which step was changed, and also covers an address edited by hand.
- **Dåliga nerver is one checkbox per passenger**, costing 1 000 kr per flight, so changing a flight keeps it. It is saved as an add-on row without `addon_id`, since it is not an add-on in admin.
- **The server checks everything again inside the transaction**, with the same rules as the page (`lib/booking-rules.ts` has no `server-only`). A server action can be called with anything, so prices are never taken from the browser, and reading the departures, aircraft and add-ons in the same write transaction as the insert means admin can't change one in between: either the whole booking is saved with what applied, or nothing (R8). Inside the transaction the queries run one after another (`readFleet()` no longer uses `Promise.all`).
- **The summary is built from the form that was sent**, not read back from the saved rows. For a repeated request id the two differ only if a response was lost and the form changed in between, which is acceptable for a summary that is only shown once.
- **Two Betala give one booking** through `request_id`: the browser makes one when the traveller goes to Betala, and the write transaction makes a second call wait and then find the first. A button that is merely disabled would not stop two requests sent before the page re-renders.
- **The old booking tables are replaced, not changed.** They assumed a shared aircraft per flight and free seats, which TRIP-011 removed; the new ones describe what is booked now (route, date, departure, aircraft per booking), and admin's rules were moved to them with the same meaning.
- **Unit tests run the save against their own database.** `lib/bookings.test.ts` sets `TURSO_DATABASE_URL` to the unit test database before importing `lib/bookings.ts`, and `vitest.config.mts` maps `server-only` to its empty module, so the server code can be tested without a server.

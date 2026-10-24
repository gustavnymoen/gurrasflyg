---
type: Feature
title: Aircraft and classes
description: The page /flyg/plan, where the traveller chooses an aircraft and the travellers per class for each chosen flight, and the price and time factors behind its prices, flight times and the "från" price.
resource: app/flyg/plan/
feature: TRIP-011
tags: [aircraft, classes, prices, flight-time, factors, flight-booking, admin, accessibility]
timestamp: 2026-10-23
---

# Aircraft and classes

After choosing flights on [the results page](search-results.md), the traveller presses **Fortsätt** in **Din resa** and comes to `/flyg/plan`, "Välj plan och klass". There they choose an aircraft for each flight (step **Plan**) and how many travellers sit in each of its classes (step **Klasser**), and see what it costs and how long it takes. Booking comes in TRIP-012.

## Factors

Every aircraft has a **price factor** (1,00–10,00) and a **time factor** (more than 0, at most 10,00), and every class a **price factor** (1,00–10,00), set in admin. They are stored as percent in whole numbers (1,20 = 120), in `aircraft.price_percent`, `aircraft.time_percent` and `classes.price_percent` (migration `008_factors.sql`):

- **Price per person** in a class on an aircraft = the departure's price × the aircraft's price factor × the class's price factor, rounded to whole kronor (`fare()` in `lib/fare-rules.ts`). Example: 1 000 kr × 1,20 × 1,50 = 1 800 kr.
- **Flight time** = the route's flight time × the aircraft's time factor, rounded to whole minutes and at least 1 (`flightMinutes()`). Example: 140 min × 4,00 = 9 h 20 min.
- **Arrival** = the departure as a moment (from the departure airport's time zone), plus the flight time, read in the arrival airport's time zone (`arrival()`), with "+1" (or "+2" …) when it lands on a later local day than it left.
- **"från" in the results** = the lowest price per person among the aircraft with room for all travellers, in each one's cheapest class (`cheapestFare()`, used by `findFlights()`). Without any such aircraft it is the departure's own price.

The migration started the classes at Ekonomi 1,00, Business 1,50, Första klass 2,50 (others 1,00), and the aircraft by name at Hindenburg 1,20 and 4,00, Millenium Falcon 3,00 and 0,30, F35 8,00 and 0,40 (others 1,00 and 1,00).

In admin the factors are typed with a decimal comma and at most two decimals (`parseFactor()` in `lib/numbers.ts`) and shown with two (`formatFactor()`). The class form has **Prisfaktor**; the aircraft form **Prisfaktor** and **Tidsfaktor**, both 1,00 for a new aircraft. The form checks them before saving (`parsePriceFactor`, `parseTimeFactor`) and marks a wrong one red with `aria-invalid` and the message under the form; the server checks again (`requireFactor` in `lib/admin.ts`), and the database's `CHECK` refuses anything outside the limits.

## The address

Everything chosen after the search is in the address (`lib/trip.ts`), so the page can be reloaded and the traveller can go back and on without losing anything:

```
/flyg/plan?fran=ARN&till=LHR&utresa=2026-11-13&hemresa=2026-11-20&resenarer=3
  &ut=08:20&ut-plan=3&ut-klasser=1:2,2:1&hem=15:35&hem-plan=2&hem-klasser=2:3&steg=klasser
```

- `ut`, `hem`: the departure times of the chosen flights; the route follows from the search.
- `ut-plan`, `hem-plan`: the chosen aircraft's id. `ut-klasser`, `hem-klasser`: the number per class, as class id and number.
- `steg=klasser`: step Klasser; without it, step Plan.

`planUrl()` writes it and `parseLegs()` and `parseStep()` read it. The results page `/flyg` takes the same parameters (`resultsUrl()`), starts at **Din resa** with those flights, and its **Fortsätt** carries the choices on (`keepChoice()`).

On `/flyg/plan` a changed choice replaces the address with `history.replaceState`, and a new step adds one with `history.pushState`, so the browser's Back goes back a step. Next.js gives both back through `useSearchParams`, without a new request to the server.

The address is never trusted. The server (`app/flyg/plan/page.tsx`) finds the chosen departures with `findFlights()`; an incomplete address gives "Adressen saknar något. Börja med att söka efter ett flyg.", a departure that doesn't exist or has left "Flyget finns inte eller har redan gått. Välj ett annat flyg.". `checkChoice()` drops an aircraft that doesn't exist or is too small, and numbers that don't fit the aircraft. Prices and times are calculated from the database's prices, flight times and factors (`listFleet()` in `lib/flights.ts`), never taken from the address.

## The page

`TripBuilder` (`app/flyg/plan/TripBuilder.tsx`) shows:

- **The steps** (`Steps`, shared with the results page): Flyg, Plan, Klasser, Resenärer, with `aria-current="step"`. Flyg is a link back to the results with everything chosen; Plan is a button back from Klasser. Resenärer comes in TRIP-012. When the step changes, focus goes to the first heading of the new step.
- **Din resa**: each flight's date, departure time and airports, its aircraft and arrival once chosen, and the number of travellers.
- **Step Plan** (`AircraftList`): for each flight, a fieldset "Plan för utresan" / "Plan för hemresan" with one radio card per aircraft: name, flight time, "landar 15:40" (with "+1"; screen readers hear "nästa dag"), the price per person in its cheapest class, and **Billigast** or "+4 500 kr / person", **Snabbast** or "+3 h 10 min". The comparison is with the aircraft that can be chosen (`aircraftOptions()`). An aircraft with fewer seats than travellers is disabled, with its time, arrival and price and "För få platser: 4 platser för 5 resenärer", and is not compared. Seats taken by other bookings don't count: each booking gets its own aircraft. **Fortsätt** goes to Klasser; a flight without an aircraft gets "Välj ett plan för utresan.".
- **Step Klasser** (`ClassList`): for each flight, the aircraft's classes, cheapest first, each with its price per person, its seats, **Billigast** or "+1 200 kr / person" (`classOptions()`), and − / + around the number, which is read out when it changes. The first time, everyone sits in the cheapest class with room for all, or no one if no class has (`defaultSeating()`). + is disabled when the class is full or every traveller is placed (`canAdd()`). Too few placed gives "1 resenär har ingen klass. Lägg till den i en klass." (`seatingProblem()`). "Totalt för utresan" is each class's price times its number (`legTotal()`), and "Totalt för resan" the sum of the flights.

Changing an earlier step clears what depends on it: another aircraft clears its classes (`chooseAircraft()`), so they start over in the cheapest class; another flight on the results page clears its aircraft and classes (`keepChoice()`). Going back and on without a change keeps everything.

## Tests

Unit tests: `lib/fare-rules.test.ts` (prices, totals, times, arrivals across midnight, time zones and summer time, which aircraft can be chosen, the comparisons, the classes, the "från" price), `lib/trip.test.ts` (the address and what a change clears), `lib/numbers.test.ts` and `lib/format.test.ts` (factors and durations), and `db/migrations/008_factors.test.ts` (the starting factors and the `CHECK`s). Browser tests: `tests/TRIP-011-aircraft-and-classes.spec.ts`, with their own classes and aircraft created in admin once by a worker-scoped fixture and deleted afterwards. The smoke test opens the page for a chosen flight and checks that it lists aircraft, without writing anything.

[System documentation](index.md)

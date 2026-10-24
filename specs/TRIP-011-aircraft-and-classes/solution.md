---
id: TRIP-011
title: Choose aircraft and classes
card: "#16"
depends_on: [TRIP-003, TRIP-004, TRIP-010]
---

# TRIP-011 Choose aircraft and classes: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 16`. How it works in more detail is in [wiki/system/aircraft-and-classes.md](../../wiki/system/aircraft-and-classes.md).

## Data

Migration `db/migrations/008_factors.sql`:

- `classes.price_percent INTEGER NOT NULL DEFAULT 100 CHECK (price_percent BETWEEN 100 AND 1000)` (R6); Business 150, Första klass 250, every other class 100.
- `aircraft.price_percent INTEGER NOT NULL DEFAULT 100 CHECK (price_percent BETWEEN 100 AND 1000)` and `aircraft.time_percent INTEGER NOT NULL DEFAULT 100 CHECK (time_percent BETWEEN 1 AND 1000)` (R8); by name: Hindenburg 120 and 400, Millenium Falcon 300 and 30, F35 800 and 40, every other aircraft 100 and 100.

The factors are stored as **percent in whole numbers** (1,20 = 120), like prices in whole kronor: the price is `price × aircraft × class / 10 000`, rounded once, with no decimal errors on the way. The admin forms read and write them with a decimal comma (`parseFactor`, `formatFactor`).

## Interface

- **`/flyg` (TRIP-010):** the summary **Din resa** ends with **Fortsätt** (a link styled as a button) to `/flyg/plan` (R1), instead of "Snart väljer du plan och klass här." The "från" price on the cards, in the summary and for sorting is `Flight.fromPrice`, the cheapest combination (R9); `Flight.price` stays the departure's own price. When the address holds chosen flights (`ut`, `hem`, from the plan page), the results start at **Din resa** with them (R10).
- **`/flyg/plan`** (`app/flyg/plan/page.tsx`, R1): the search and the chosen flights from the address; an incomplete address shows "Adressen saknar något. Börja med att söka efter ett flyg." with **Till sökningen**, a flight that doesn't exist or has left "Flyget finns inte eller har redan gått. Välj ett annat flyg." with **Till flygen**. The heading is "Välj plan och klass".
- **`TripBuilder`** (`app/flyg/plan/TripBuilder.tsx`): the steps **Flyg · Plan · Klasser · Resenärer** (R10; Flyg is a link back, Plan a button back from Klasser, Resenärer comes in TRIP-012), the card **Din resa** with the flights, the aircraft and its arrival once chosen, and "N resenärer" (R1). Step Plan: one `AircraftList` per flight and **Fortsätt**; without an aircraft for a flight, "Välj ett plan för utresan." / "… hemresan." Step Klasser: one `ClassList` per flight and "Totalt för resan, N resenärer" with "Snart fyller du i resenärerna och bokar här." (R5).
- **`AircraftList`** (R2, R7): radio buttons in a fieldset ("Plan för utresan"), one card per aircraft: name, flight time ("9 h 20 min"), "landar 15:40" with "+1" for a later day (screen readers: "nästa dag"), the price per person in the cheapest class, and **Billigast** / "+4 500 kr / person" and **Snabbast** / "+3 h 10 min". An aircraft with too few seats is disabled, shows its time, arrival and price, and "För få platser: 4 platser för 5 resenärer", but is not compared. The radio's name is the aircraft's name, the rest its description. `Arrival` and `Comparison` are small shared pieces in their own files.
- **`ClassList`** (R3, R4): per class its price per person, seats and **Billigast** / "+1 200 kr / person", and − / + ("Färre i Business", "Fler i Business") around the number, which is read out when it changes. "1 resenär har ingen klass. Lägg till den i en klass." (or "N resenärer … dem …"), and "Totalt för utresan".
- **`Steps`** (`app/flyg/Steps.tsx`): the step list moved out of `FlightResults`, used by both pages; an earlier step can have a link or a button. **`FlightLine`** moved out of `FlightResults` too.
- **`buttonClass()`** in `Button.tsx`: the button classes, for a link that looks like a button.
- **Admin:** `FactorField` (`admin-ui.tsx`) is the factor field of both forms. The class form has **Prisfaktor** (a new class starts at 1,00) and the class list a column Prisfaktor (R6); the aircraft form has **Prisfaktor** and **Tidsfaktor** next to the name (a new aircraft starts at 1,00 and 1,00) and the aircraft list the two columns (R8). An invalid factor makes the field red (`aria-invalid`) with "Prisfaktorn måste vara ett tal från 1 till 10 med högst två decimaler, t.ex. 1,50." or "Tidsfaktorn måste vara ett tal större än 0 och högst 10 med högst två decimaler, t.ex. 0,50.", checked in the form and again on the server (`lib/admin.ts`).
- **`lib/fare-rules.ts`** (shared by the browser and the server): `fare`, `flightMinutes`, `arrival`, `canSeat`, `aircraftOptions`, `classOptions`, `defaultSeating`, `canAdd`, `seatingProblem`, `validSeating`, `legTotal`, `cheapestFare`.
- **`lib/trip.ts`**: the trip's address: `planUrl`, `resultsUrl`, `parseLegs`, `parseStep`, `checkChoice`, `chooseAircraft`, `keepChoice`. `lib/search.ts` got `searchParams()`.
- **`lib/flights.ts`**: `listFleet()` (aircraft with their classes and factors), and `findFlights()` takes the travellers and the fleet for the "från" price and returns the route's flight time and the airports' time zones.
- **`lib/numbers.ts`**: `parseFactor`, `formatFactor`, `parsePriceFactor`, `parseTimeFactor` and the two messages. **`lib/format.ts`**: `formatDuration`.

## Decisions

- **Everything chosen is in the address**: `ut`/`hem` (departure times; the route follows from the search), `ut-plan`/`hem-plan` (aircraft id), `ut-klasser`/`hem-klasser` ("1:2,2:1", class id and number) and `steg=klasser`. So the page can be reloaded (R1), and going back to the flights and on again keeps everything (R10), with no storage in the browser. A changed choice replaces the address (`history.replaceState`), a new step adds one (`history.pushState`), so the browser's Back goes back a step. Next.js reads both back through `useSearchParams` (see `node_modules/next/dist/docs`, "Native History API"), without asking the server again.
- **The address is never trusted**: the server finds the chosen departures in the database (an unknown or departed one gives the message above), and `checkChoice` drops an aircraft that doesn't exist or is too small, and numbers that don't fit the aircraft. The prices and times are calculated from the departure's price, the route's flight time and the factors in the database, never read from the address (the non-functional security requirement). The page calculates them in the browser from that data, so that they follow every change at once (R4); TRIP-012 will calculate them again on the server when booking.
- **Clearing later choices (R10)** is two small rules: another aircraft clears its classes (`chooseAircraft`), and another flight clears its aircraft and classes (`keepChoice`, used by the results' Fortsätt). The first time step Klasser is shown, everyone sits in the cheapest class with room for all (`defaultSeating`, R3); that is what "cleared, chosen again" looks like.
- **Plan and Klasser are two steps on one page,** as R10 lists them, with both flights in each step. Step Klasser needs an aircraft for every flight; a `steg=klasser` without them shows step Plan.
- **R3's "Fortsätt cannot be used"**: step Klasser has no Fortsätt until TRIP-012 (R5); the message says what is missing. The + button can't put more travellers in a class than its seats, or more than the travellers in all.
- **The comparison is only with aircraft that can be chosen** (R2): a fighter jet with one seat doesn't make every other aircraft "+3 h" for five travellers. Several equally cheap or fast are all marked.
- **The "från" price (R9)** uses the aircraft with room for all travellers and the cheapest class on that aircraft, even if that class alone has no room for everyone. Without any such aircraft it is the departure's own price, so the results still show something; the plan page then has nothing to choose.
- **The arrival** is the departure as a moment (from the departure airport's time zone, `instant()`), plus the flight time, read in the arrival airport's time zone (`localNow`); "+1" counts the local dates. Summer time is handled; departures are never in the hour that is skipped.
- **Every factor is at most 10,00** (decided with the user during the work, added to R6 and R8): a higher one makes no sense for the prices and times, and so a factor always fits in the database. The form, the server and the database's `CHECK` have the same limits.
- **Browser tests use their own aircraft**: a worker-scoped Playwright fixture creates two classes and three aircraft in admin once, the first time a test asks for them, and deletes them at the end. So the tests can compute prices and times against any database, and the smoke test, which doesn't ask for them, writes nothing. The admin tests sign in inside the test, since a `beforeEach` would run before the fixture.
- **TRIP-004's browser tests** read the aircraft table's cells by position and now skip the two new columns.

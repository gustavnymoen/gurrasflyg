---
id: TRIP-039
title: Choose aircraft and classes in charter
card: "#134"
depends_on: [TRIP-011, TRIP-014, TRIP-024, TRIP-026, TRIP-029]
---

# TRIP-039 Choose aircraft and classes in charter: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 134`. How aircraft and classes work in flight booking is in [wiki/system/aircraft-and-classes.md](../../wiki/system/aircraft-and-classes.md); how charter works is in [wiki/system/charter-booking.md](../../wiki/system/charter-booking.md).

## Data

Migration `db/migrations/013_charter_aircraft.sql`, only additions (R7): existing rows are not touched.

- `charter_booking_trips.aircraft_id INTEGER REFERENCES aircraft(id)`, `NULL` for bookings from before the plan step.
- `charter_booking_seats (booking_trip_id, passenger_id, class_id, price)`: one seat per traveller and trip, with the price the traveller pays for it (the departure's price × the aircraft's × the class's factor), like `booking_seats` for flights.
- `charter_booking_addons (booking_seat_id, addon_id, name, count, price)`: the add-ons of the traveller's class, with name and price per piece when booked, like `booking_addons`.

`charter_booking_trips.price` keeps meaning "the departure's price per person when it was booked", the base of the factors. `charter_bookings.total` is the sum of the seats, the add-ons of the classes and the charter extras. A booking without seats is worth, per traveller, the trips' price plus the extras, as before (`lib/my-booking.ts`), so cancelling in Min bokning is unchanged for old bookings.

## Interface

- **The step `/charter/[id]/plan`** ("Välj plan och klass", `app/charter/[id]/plan/page.tsx`, `CharterPlan.tsx`) between Resa and Resenärer. The steps are now **Resa · Plan och klass · Resenärer · Betala** (`app/charter/steps.ts`); Fortsätt on the results leads to the plan step.
- **`PlanBuilder`** (`app/flyg/plan/PlanBuilder.tsx`) is the plan step's cards, counters, Klar, Fortsätt and total, moved out of `TripBuilder` and used by both areas. `TripBuilder` (flights) and `CharterPlan` only read the choices from the address, say how to write them back, and give the steps and Din resa. `AircraftList`, `ClassList`, `LegCard` and `FlightTime` take a `PlanFlight` (a departure with its price, flight time and airports) instead of a `Flight`, so a charter trip fits them (`toPlanFlight()`).
- **Din resa** (`CharterOverview`) shows the aircraft and the travellers per class under each trip; on the plan step it has no total of its own, since the step has one.
- **Resenärer** (`CharterTravellersForm`): per traveller and trip a fieldset with the class as text ("Klass: Business, 4 560 kr") and the add-ons of that class with − and + (`AddonList`, moved out of the flight form and shared). A link **Ändra plan och klasser** goes back. When the plan or the numbers have changed, a status lists the add-ons that were removed ("Passagerare 1, utresan: Måltid (2 st)").
- **Betala** and **the booked page** show the aircraft and classes: the booked page has "Plan · Ekonomi: 2 · Business: 1" under each trip and the class and add-ons of every traveller on every trip.
- **The address** has the same names as the flights': `ut`/`hem` are the trips, `ut-plan`/`ut-klasser` and `hem-plan`/`hem-klasser` the aircraft id and "1:2,2:1" (`lib/trip.ts`: `setPlanParams`, `parsePlan`).
- **Texts:** "Välj plan och klass", "Plan för utresan", "Klasser på hemresan", "Ändra antal resenärer" (when no aircraft seats the party), "Dessa tillägg togs bort eftersom klasserna ändrats:", "Klasserna är valda i steget Plan och klass och går inte att ändra här."

## Logic

- **`lib/charter-rules.ts`** (browser and server): `CharterChoice` is now `{ out, back, plans }` with a `PlanChoice` per trip; `charterParams`, `parseChoice`, `planUrl`, `chooseOutbound`/`chooseHome` (another trip clears that trip's plan, and a return that no longer fits clears its own), `toPlanFlight`, `planText`/`legText`; the form has `legKeys` and, per traveller, `legs` (class and add-ons per trip); `fitCharterForm` places the travellers, `removedAddons` tells what was dropped, `fitsCharterForm` is the server's check of the form, `charterTotal(legs, form)` the price, `charterSummary` the summary. The old price without a plane is `departuresTotal` (the results page).
- **`lib/charter.ts`**: `readCharter` also reads the fleet, checks each trip's plan with `checkChoice` (as flights do) and builds `legs` (`BookingLeg[]`) with `bookingLegs`, which flights use too, with the trip's id where a flight has its departure time. `legs` is `null` until both trips are chosen and both have an aircraft and everyone placed (R6).
- **`lib/booking-rules.ts`** (shared with flights): `fitPassengerLegs` (the class from the numbers, add-ons kept only while the trip's key is the same), `seatCost`, `fitsLeg` and the beer rule are used by both areas; `lib/trip.ts` has `PlanChoice`, `parsePlan`, `setPlanParams` and a generic `checkChoice`.
- **`lib/charter-bookings.ts`**: `createCharterBooking` calculates every price from the database, refuses anything that doesn't fit with `CHANGED` (trips, aircraft, numbers) or `INVALID` (form), and saves the aircraft, the seats and the add-ons in the same transaction as the booking.
- **Admin** (`lib/admin.ts`): a class, add-on or aircraft that a charter booking uses counts as in use, like those of flight bookings.
- **Min bokning** (`lib/my-booking.ts`): a charter traveller is worth their seats, add-ons and extras when the booking has seats.

## Decisions

- **One plan step, shared with flights.** The plan step of flights (TRIP-011, TRIP-024, TRIP-026) is the model, so the cards, the counters, "only aircraft with room" and Klar behave the same, and `PlanBuilder` is one component, not a copy. Only the address, the steps, Din resa and the link when no aircraft seats the party differ.
- **Departure price is the base; the time factor is ignored (R2).** `readCharter` sets every aircraft's `timePercent` to 100, so the cards show the departure's own flight time and arrival, and the shared rules need no special case. The factor still applies to flights.
- **One aircraft and one placement per trip, any aircraft on any departure (R1).** Aircraft are not tied to routes in charter; only the seats decide. As in flights (TRIP-026-R1) the aircraft that are too small are not shown at all, so there is no "För få platser" card (the card's first wording was changed to say so).
- **Class add-ons come in addition to the charter extras (R4).** The charter extras stay in the form's `extras`; the add-ons of the classes are in each traveller's `legs`. Both count in the total.
- **The class is not chosen on Resenärer (R8).** Travellers get classes in the order `firstClasses()` gives (the dearest class first, as in flight booking today), computed from the numbers per class, so there is no "Klass" choice and nothing to remove by changing it. The server checks that the form's classes are exactly those, in order (`fitsCharterForm`).
- **Going back to the plan step (R8).** The form remembers which trips, aircraft and numbers its classes and add-ons were chosen for (`legKeys`); when a trip's key changes, its classes start again and its add-ons are removed, and the others stay. The names of the removed add-ons come from `addons` by id (`readAddonNames`), since the old aircraft is not in the new trip.
- **An address without an aircraft goes to the plan step (R6).** `CharterStep` redirects Resenärer and Betala to `/plan` with the trips kept when `legs` is `null`; nothing is chosen for the visitor. The server checks the same in `createCharterBooking`.
- **Old bookings are left as they are (R7).** The migration only adds; `aircraft_id` is `NULL` and there are no seats, so Min bokning and its cancelling use the old rule. A booked summary saved in a tab before the change has no classes and is shown without them.
- **Agneta (TRIP-030) is not changed here** (TRIP-040 does it). Her shortcut to Resenärer ends on the plan step through R6, her price summary (`summarise`) is the departures' prices plus the extras and does not know the classes yet, and her booking button books only a form that has its classes, which the page saves once the visitor edits it.
- **Browser tests** use the aircraft fixture of `tests/plan.ts` (the same as the flight plan tests) through `openCharterBooking()`.

---
id: TRIP-036
title: Booking agent for flights
card: "#128"
depends_on: [TRIP-030, TRIP-038, TRIP-040]
---

# TRIP-036 Booking agent for flights: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 128`. It builds on the agent of TRIP-030 (`specs/TRIP-030-booking-agent/solution.md`); this page only says what is new.

## Data

None. No table or migration. The flight form is the one that is already in the tab (`gurrasflyg-bokning`, `app/flyg/boka/store.ts`).

## Interface

- **The chat on the flight pages** (`app/flyg/layout.tsx`): `<Chat />` in a layout for every page under `/flyg`, as `app/charter/layout.tsx`. The saved chat (`agneta-chat` in the tab) is the same one, so the conversation and the mode follow the visitor between the start page, charter and flights. The panel pushes the page aside as before.
- **`POST /api/chat`** is unchanged. The context (`{ url, extras, payment, valid }`) has the flight page's address; `extras` is always empty for flights.
- **New tools** (`lib/agent-tools.ts`): `find_airports` (a city, a country or a code to IATA codes), `find_flights` (the departures and "from" prices of the results page, opens nothing), `show_flights` (the results page, with the departures chosen only when both are given) and `show_flight_plan` (the shortcut: the plan step with the departures chosen).
- **The tools of TRIP-030/040 work on both kinds of booking**: `list_aircraft`, `set_plan`, `list_addons`, `set_addons`, `show_travellers`, `show_payment`, `set_payment` and `summarise` read the page the visitor is on and do the same for a charter booking or a flight booking. `set_extras` is refused on a flight page (a flight has add-ons per class, no extras).
- **`lib/chat-prompt.ts`**: the plain chat now ends with `[[HELP]]` also when the visitor asks for an ordinary flight to be found or booked, so the button **Hjälp mig** is offered on the flight pages.
- **`app/flyg/boka/book.ts`**: `bookFlight()` calls `bookAction()` and stores the summary; Betala (`PaymentForm`) and the chat's button both use it, so there is one booking path, as `bookCharter()`.

## Code

| File | What |
|---|---|
| `lib/agent-flight.ts` | `readFlight()`: the flight page's search, the departures that run on the dates, the chosen ones and their plan, checked with the pages' own parsers and `checkChoice()`; `flightLine()`; `flightAircraftText()` (`aircraftOptions()` and `classOptions()`, as the plan step); `flightDatesProblem()`. |
| `lib/agent-page.ts` | `PageInfo` has a `flight` kind; `flightText()` is what the model is told about a flight page. |
| `lib/agent-tools.ts` | The new tools; `Booking`: what the shared tools need of a page (plans, legs, the aircraft text, the address of the next step), built by `charterBooking()` or `flightBooking()`. |
| `lib/agent-rules.ts` | `isAgentUrl` accepts `/flyg`, `/flyg/plan`, `/flyg/boka`, `/flyg/boka/betala`; `isFlightUrl()`. |
| `lib/agent.ts` | The agent rules have a section for flights; `canBook()` accepts the flight payment page. |
| `app/components/chatAgent.ts` | The page's address says which form (`gurrasflyg-bokning` or the charter's) `readContext()`, `applyActions()` and `bookNow()` use. |
| `lib/booking-rules.ts` | `seatsTotal()`, the seats and add-ons of all passengers, shared by `charterTotal()` and the agent's summary; `emptyPassenger` exported. |

## Decisions

- **One agent, one set of tools.** The card asks to look at what is shared with TRIP-030. The tools that follow the booking's steps (plan, add-ons, Resenärer, payment, summary) were charter-only because they read `CharterData`. They now go through `Booking`, a small description of the page's booking (plans, legs, how to list the aircraft, the next address), built from `CharterData` or from `FlightData`. Only what differs sits in `charterBooking()` and `flightBooking()`: how the aircraft are listed (a flight's time and arrival depend on the aircraft, a charter trip's do not) and the addresses.
- **A departure is named by its time.** A flight has no id in the address, only its departure time (`ut=08:20`), so `find_flights` gives the time as the id and the tools take it back. The results page can only show a choice when all legs are in the address, so `show_flights` takes both departures or none.
- **Beer.** The charter agent refuses to set beer (ages are unknown to the server). The card says that for flights she sets what the visitor names, warns that beer is for adults, and the form's own rule removes it (TRIP-029): the form takes it away when an age under 18 is chosen and tells why. If the ages are already filled in, the form shows its error "Öl går bara att köpa från 18 år." until the visitor fixes it. `Booking.beer` is the difference.
- **The total in the summary** is the seats and the add-ons she set, from the database. What the visitor chose in the form herself, and Dåliga nerver, are not known to the server (nothing personal or chosen in the form goes to it); the summary tool says so, and the payment page shows the total with them.
- **No new action type.** The actions of TRIP-030 (`goto`, `payment`, `addons`) carry flights as well; the chat writes them to the form that belongs to the page it is on, so a flight page writes to `gurrasflyg-bokning`.
- **The button** is offered, and works, on the payment page of flights only (`/flyg/boka/betala`), with the same rule as TRIP-038. `bookNow()` calls `bookAction()` through `bookFlight()`: the same checks, total and rate limit as Betala.
- **Tried by hand with the real model:** see `verification.md`.
- **Known limit: beer and the "valid" flag.** The chat's `valid` is `travellerProblems(form, [])`: it has no legs in the browser, so the rule "beer needs 18" is not part of it (as for charter). If she has set beer and a traveller's age under 18 is already filled in, `valid` can be true while `bookAction()` refuses the form, and the button then shows the action's message. Nothing wrong is saved. The page's own form shows the error on Resenärer.

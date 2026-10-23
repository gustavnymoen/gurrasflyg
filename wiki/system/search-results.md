---
type: Feature
title: Search results
description: The flight search: the Sök button, the results page /flyg, its simulated search, flight cards, sorting and the steps for choosing flights, and the route and price data behind it.
resource: app/flyg/
feature: TRIP-010
tags: [search, results, flights, prices, routes, flight-booking, accessibility]
timestamp: 2026-10-23
---

# Search results

A traveller fills in the search form and presses **Sök**. The results page `/flyg` lists the flights between the two airports on the chosen date as cards, and the traveller chooses an outbound flight and, for a return trip, a return flight. **Fortsätt** then goes on to [aircraft and classes](aircraft-and-classes.md) (TRIP-011).

## The search in the address

The search is part of the address, so a results page can be reloaded and shared (`lib/search.ts`):

```
/flyg?fran=ARN&till=LHR&utresa=2026-11-13&hemresa=2026-11-20&resenarer=2
```

`searchUrl()` writes it and `parseSearch()` reads it back. A search is valid when both airports are three capital letters and differ, the dates are real days in the form `YYYY-MM-DD`, the return (if any) is not before the outbound, and the number of travellers is a whole number from 1 to 10. Without `hemresa` it is a one-way trip. An invalid address shows the empty form and "Sökningen saknar något. Fyll i formuläret och tryck på Sök." The page also shows that message when an airport code doesn't exist.

## The search form

`SearchForm` (`app/components/SearchForm.tsx`) has a **Sök** button to the right of Resenärer, below it on a phone. Pressing it marks what is missing in red, with a message under the field: "Välj var du vill flyga från.", "Välj vart du vill flyga.", "Välj datum för utresan." and, with Tur och retur on, "Välj datum för hemresan.". A message disappears when the value is chosen. The same airport in Från and Till keeps its message from TRIP-001. A valid search goes to the results page with `router.push`.

In the airport fields, Tab (or Shift+Tab) chooses the highlighted suggestion as Enter does, and focus moves on as usual; the first suggestion is highlighted from the start, so with one match Tab is enough (R13, `Autocomplete`). With the list closed or empty, Tab only moves focus. Neither Tab nor Enter chooses from a list that answers an earlier text (`answered` in `Autocomplete`), which also fixes the old problem of Enter choosing from the previous list when pressed quickly.

On the results page the form is filled in from the search (`initial`): `Autocomplete` takes an `initial` item, and `DatePicker` starts its texts from the dates it gets. `DatePicker` shows the missing-date messages it gets in `missing`, after its own messages for a typed date.

## The results page

`app/flyg/page.tsx` is a server component. The search is read inside `<Suspense>` (the site has `cacheComponents` on), the airports are looked up with `getAirportPair()`, and the flights with `findFlights()` (`lib/flights.ts`): one query per direction, every departure of the route, ordered by time. Departures that have already left are removed when the date is today at the departure airport (`localNow()` and `hasLeft()` in `lib/flight-rules.ts`, with the airport's time zone). The form and the results get the search's address as `key`, so a new search starts over.

`FlightResults` (`app/flyg/FlightResults.tsx`, a client component) does the rest:

- **Simulated search:** the flights are already loaded, but are shown 1–4 seconds after the page starts in the browser (`searchDelay()`), to feel like a real flight search. Meanwhile four skeleton cards (`FlightSkeleton`) pulse, unless the visitor prefers reduced motion. A hidden status (`role="status"`) is empty on the server, says "Söker flyg…" when the page has started and the timer runs, and "7 flyg hittades" when it is done, so screen readers hear both.
- **The list:** a heading per step ("Utresa Stockholm – London"), the date and the number of flights ("lör 24 okt · 7 flyg"), and the sort choice, Avgångstid or Pris: two radio buttons styled as a button group. Sorting (`sortFlights()`) happens in the browser without a new search; equal prices are ordered by time. With no flights left, the page says "Inga flyg kvar den här dagen. Prova ett annat datum i sökningen ovan."
- **The steps:** for a return trip, a list of steps (Utresa, Hemresa, Din resa) with `aria-current="step"` on the current one. Välj on an outbound flight shows the return flights, with the chosen outbound flight above them and **Ändra utresa**, which goes back to step 1 and clears the return flight. The last choice shows **Din resa**: each flight with its flight number and price, a button to change it, the total for all travellers, and **Fortsätt** to `/flyg/plan`. When the step changes, focus goes to the new step's heading. When the address holds chosen flights (`ut`, `hem`, see [aircraft and classes](aircraft-and-classes.md#the-address)), the page starts at Din resa with them, and Fortsätt keeps what was chosen for each flight that is still the same.

`FlightCard` (`app/flyg/FlightCard.tsx`) is a `Card` in the new size `flush`, filled by one button: the departure time, the airports as IATA code and city, and "från 1 290 kr / person". It has `aria-expanded`, and opens the details: flight number, the airports' full names and countries, the date, the total for all travellers, and **Välj**. Flight time and arrival time are not shown: they depend on the aircraft, chosen on the next page.

## Flight numbers and prices

- **Flight number:** "GF" and the route's id times ten plus the departure's number in the day (`flightNumber()`), for example route 201's third departure is GF 2013. It is counted before departed flights are removed, so it is the same all day.
- **Price:** each departure has its own price per person in whole kronor (`route_departures.price`, `Flight.price`), the same every date. "från" (`Flight.fromPrice`) is the cheapest the traveller can fly it: that price times the lowest aircraft and class factors among the aircraft with room for everyone (TRIP-011-R9, see [aircraft and classes](aircraft-and-classes.md#factors)). Sorting by price uses it. The total is the price times the travellers (`totalPrice()`).

## The route data

Migration `007_all_routes.sql`, generated by `scripts/generate-all-routes.mjs` with a fixed seed:

- Every ordered pair of the 51 airports has a route: the 200 routes from `002_routes_data.sql` keep their id, flight time and departures, and 2 350 new routes (ids 201–2550) are added, also for pairs closer than 150 km. A new route's flight time follows from the distance like the old ones (`flightMinutes()`, about 800 km/h plus 30 minutes).
- Every route has at least 5 departures a day between 06:00 and 21:30. Old routes with 2–3 get new departures at least an hour from the others; new routes get 5–7, one in each equal part of the day.
- Every departure gets a price: about 80 % 150–5 000 kr, 10 % 5 000–100 000 kr and 10 % 100 000–1 000 000 kr, rounded to tens.
- `routes.aircraft_id` is dropped (the traveller chooses the aircraft, see [aircraft and classes](aircraft-and-classes.md)), and with it "Tilldela plan" in admin and the column Rutter in the aircraft table.
- `airports.city` is added, for the cards.

`scripts/generate-routes.mjs` exports its airports, distance, flight time and routes, so the new generator builds on them; its own output is unchanged. `db/migrations/007_all_routes.test.ts` checks the data.

## Tests

Unit tests: `lib/search.test.ts`, `lib/flight-rules.test.ts` and `db/migrations/007_all_routes.test.ts`. Browser tests: `tests/TRIP-010-search-results.spec.ts`, which never wait the 1–4 seconds: `openResults()` in `tests/helpers.ts` fakes the browser's clock with `page.clock.install()`, waits for "Söker flyg…" (which shows that the timer runs) and moves the clock 4 seconds on. The smoke test searches ARN → LHR for tomorrow.

[System documentation](index.md)

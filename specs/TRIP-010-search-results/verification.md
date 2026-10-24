---
id: TRIP-010
title: Flight search results
---

# Verification of TRIP-010

How each requirement was checked. "local" is `npm run test:unit` and `npm run test:local`; CI and the live site are checked after the push and the deploy.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-010-R1 | Tests `TRIP-010-R1 a filled-in search opens the results page`, `… a missing value is shown in red and nothing is searched` (with axe), `… the same airport in Från and Till gives no search` in `tests/TRIP-010-search-results.spec.ts` | local | Pass | 2026-10-23 |
| TRIP-010-R2 | Unit tests `TRIP-010-R2 the search is written into the address and read back`, `… a one-way search has no return date`, `… an incomplete or invalid search in the address is refused` in `lib/search.test.ts`; tests `TRIP-010-R2 the results page shows the search in the form, and a new date searches again`, `… the address of a results page shows the same search in a new tab`, `… an incomplete address shows the empty form and what to do` in `tests/TRIP-010-search-results.spec.ts` | local | Pass | 2026-10-23 |
| TRIP-010-R3 | Unit test `TRIP-010-R3 the simulated search takes 1–4 seconds` in `lib/flight-rules.test.ts`; test `TRIP-010-R3 skeleton cards first, the flights 1–4 seconds later, and screen readers are told` (fake clock, axe while searching) in `tests/TRIP-010-search-results.spec.ts`. Reduced motion: code review (`motion-safe:animate-pulse`, and the global reduced-motion rule in `globals.css`) | local | Pass | 2026-10-23 |
| TRIP-010-R4 | Unit tests `TRIP-010-R4 localNow gives the date and time in the airport's time zone`, `… departures that have already left today are left out` in `lib/flight-rules.test.ts`; tests `TRIP-010-R4 every departure of the route is shown, at least 5, and the number matches`, `… a search for today shows no departure that has already left`, `… with no departures left the page says so and suggests another date` (axe), and the smoke test `TRIP-010-R4 @smoke a search ARN → LHR for tomorrow shows at least 5 flights` in `tests/TRIP-010-search-results.spec.ts` | local | Pass | 2026-10-23 |
| TRIP-010-R5 | Test `TRIP-010-R5 the card shows the departure, the airports and the price, no flight time` in `tests/TRIP-010-search-results.spec.ts`; unit test `TRIP-010-R5 every airport has a city for the flight cards` in `db/migrations/007_all_routes.test.ts` | local | Pass | 2026-10-23 |
| TRIP-010-R6 | Unit tests `TRIP-010-R6 the total price is …`, `… the flight number comes from the route and the departure` in `lib/flight-rules.test.ts`; tests `TRIP-010-R6 a card expands with the details and Välj, and collapses again` (click, Enter, Space, axe), `… at 320 px an expanded card and the summary fit without sideways scrolling` in `tests/TRIP-010-search-results.spec.ts` | local | Pass | 2026-10-23 |
| TRIP-010-R7 | Unit test `TRIP-010-R7 sorting by departure time and by price` in `lib/flight-rules.test.ts`; test `TRIP-010-R7 sorted by departure first, by price on request, at once` in `tests/TRIP-010-search-results.spec.ts` | local | Pass | 2026-10-23 |
| TRIP-010-R8 | Test `TRIP-010-R8 a return trip is chosen in two steps, and changing the outbound starts over` (steps, focus, axe) in `tests/TRIP-010-search-results.spec.ts` | local | Pass | 2026-10-23 |
| TRIP-010-R9 | Tests `TRIP-010-R9 a one-way trip ends with the chosen flight and its total price` (axe), `… a return trip ends with both flights and the sum of their prices` in `tests/TRIP-010-search-results.spec.ts` | local | Pass | 2026-10-23 |
| TRIP-010-R10 | Unit tests `TRIP-010-R10 every ordered pair of airports has a route with at least 5 departures`, `… the existing routes keep their flight times and departures` in `db/migrations/007_all_routes.test.ts`; the migration run on a copy of the local database (2 550 routes) | local | Pass | 2026-10-23 |
| TRIP-010-R11 | Unit tests `TRIP-010-R11 every departure has a price of 150–1 000 000 kr, shared about 80/10/10`, `… generating the routes again gives the same migration and prices` in `db/migrations/007_all_routes.test.ts`; test R2 "same search in a new tab" compares the prices | local | Pass | 2026-10-23 |
| TRIP-010-R12 | Unit test `TRIP-010-R12 routes have no aircraft` in `db/migrations/007_all_routes.test.ts`; test `TRIP-010-R12 admin has no Tilldela plan` in `tests/TRIP-010-search-results.spec.ts` | local | Pass | 2026-10-23 |
| TRIP-010-R13 | Test `TRIP-010-R13 Tab chooses the highlighted airport and moves on` (one match, the second with Arrow down, Shift+Tab, no matches) in `tests/TRIP-010-search-results.spec.ts`. Not choosing from an older list: code review (`answered` in `Autocomplete`) | local | Pass | 2026-10-23 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `lib/search.test.ts`, `lib/flight-rules.test.ts`, `db/migrations/007_all_routes.test.ts` (15 new); TRIP-005's R2 and R4 data checks replaced by TRIP-010-R10's | local | Pass (39) | 2026-10-23 |
| Browser tests | 20 tests in `tests/TRIP-010-search-results.spec.ts`; TRIP-005's browser tests deleted (they tested "Tilldela plan"); TRIP-004-R1 without the column Rutter; TRIP-021-R3's carousel focus test starts from Sök | local | Pass | 2026-10-23 |
| Smoke test | `TRIP-010-R4 @smoke a search ARN → LHR for tomorrow shows at least 5 flights` | local, preview, live | Pass; Live tests after the merge (run 39999944608, commit efba442): 6 smoke tests passed in 6.0 s, this one in 0.7 s | 2026-10-23 |
| Accessibility | axe on: missing values in the form, searching (skeleton cards), results, expanded card, step 2, summary, no flights; 320 px without sideways scrolling. The checklist in `wiki/system/accessibility.md` on the live site: see [the checklist](#the-accessibility-checklist-on-the-live-site) | local, live | Pass (axe); checklist: one failure (item 6, the sort choice's focus ring), fixed on branch `TRIP-011-live-checks`; VoiceOver not checked | 2026-10-23, 2026-10-24 |
| Security | Security points in the review: passed. `/security-review`: no findings | local | Pass | 2026-10-23 |
| Code review | [review.md](review.md), run 2 | local | Passed | 2026-10-23 |

## The accessibility checklist on the live site

Gone through on https://gurrasflyg.vercel.app on 2026-10-24, in the built-in browser of the Claude desktop app (Chromium), on `/flyg?fran=ARN&till=LHR&utresa=2026-10-25&resenarer=2`: the results, an expanded card, the summary after Välj. The keyboard was used through real key presses; names, states and sizes were read from the page.

| # | Check | Result |
|---|---|---|
| 1 | Keyboard | Pass. Tab goes Från, Till, Utresa (the calendar opens and is passed through), the two Resenärer buttons, Sök, the sort choice (one stop; the arrow keys switch to Pris and the list is re-sorted at once), the five flight cards, the footer. Enter expands a card, Tab reaches Välj, and Enter on Välj shows the summary with focus on "Din resa". Focus never got stuck |
| 2 | Visible focus | **Failed, fixed.** Every control shows the 2 px ring in `accent-strong`, except the sort choice: its radio buttons are visually hidden and the label only got a ring in `accent-glow` (40 % opacity), about 1.4:1 against the card, which was hard to see. Changed to the same 2 px outline in `accent-strong` (`has-focus-visible:outline-*` in `SortChoice`, `app/flyg/FlightResults.tsx`); not yet checked on a deploy. Nothing is hidden behind the header |
| 3 | Screen reader | Not checked with VoiceOver (needs the user). Read from the page instead: `lang="sv"`, one `h1` "Välj ditt flyg", `h2` "Utresa Stockholm – London", landmarks header, main, nav, footer; the cards are buttons with `aria-expanded`; the sort choice is a fieldset with the legend "Sortera på"; the status "5 flyg hittades" (`role="status"`) replaces "Söker flyg…" |
| 4 | Zoom and 320 px | Pass. At 320 px and at 640 px (1280 px at 200 %) the page is exactly as wide as the window, with an expanded card |
| 5 | Text spacing | Pass. With the bookmarklet's values applied as a style, no text is cut off and nothing overlaps (only the search fields scroll their own long airport names, as before) |
| 6 | Contrast | Text: axe. The sort choice's focus ring failed (see 2) and is fixed; the cards' focus ring (`ink`) and the field borders (`line-strong`) are as on the start page |
| 7 | Target size | Pass. Sort buttons about 105 × 32 px, cards full width × 64 px, Välj and Sök larger. The footer links (20 px high) have more than 24 px between their centres |
| 8 | Content on hover or focus | Not affected: the results page shows nothing on hover or focus; the form's lists and calendar are TRIP-001's and TRIP-009's |
| 9 | Errors and labels | Pass (tested in R1 with axe): missing values are shown in text under the field, and every field has a visible label |
| 10 | Title, language, images | Pass. Title "Välj flyg – Gurras Flyg", `lang="sv"`, no images |
| 11 | Reduced motion | Pass by code review: the skeleton cards pulse only with `motion-safe:animate-pulse`, and the global reduced-motion rule turns animations off |

## Test suite

`npm run test:time` before (TECH-015, the last change) and after.

| | Unit tests | Browser tests | Total time (browser) | Slowest test |
|---|---|---|---|---|
| Before | 26 (0.1 s) | 124 | 92.9 s | 2.8 s |
| After | 39 (0.4 s) | 141 | 98.9 s (+6 %) | 2.8 s (`TRIP-009-R12 …`, not this change's) |

Within every budget. The new browser tests take at most about 1 s each: they never wait the simulated 1–4 seconds (the browser's clock is faked).

## Definition of Done

- [x] Tests: every check in the card's test plan is done locally; every requirement is tested; `npm run test:unit` and `npm run test:local` pass
- [x] Test suite: within the time budgets, total time +6 %, and the new tests follow the quality rules (no fixed waits: the clock is moved instead)
- [x] Deployed, and the smoke tests pass against production (Live tests): run 39999944608 after the merge of #60, 6 passed (recorded on TRIP-011's branch)
- [x] Accessibility: axe passes on every new state; the checklist on the live site on 2026-10-24: one failure (the sort choice's focus ring) fixed on branch `TRIP-011-live-checks`; VoiceOver not checked
- [x] Requirements in the card match what was built (R13 was added with the user during the work), no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/valja-flyg.md`, `soka-flyg.md`, `admin-plan.md`; `admin-tilldela-plan.md` deleted), system docs (`wiki/system/search-results.md`, architecture, index) and `wiki/log.md` updated
- [x] No leftovers: "Tilldela plan" (button, action, functions, column Rutter, manual page, tests) deleted; no debug output
- [x] Clean code: reuses `Card`, `Button`, `Field`, `Message`, `formatPrice` and the date helpers; `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks: none needed. Small related fixes made here: Enter no longer chooses from an older suggestion list (noted in TRIP-001's verification), the airport test helpers moved to `tests/helpers.ts`

## Requirements as built

Copied from the card (#15) on 2026-10-23.

### TRIP-010-R1 Search button

The search form has a Sök button to the right of Resenärer (below it on a phone). Pressing it with a valid search opens the results page. Från, Till and Utresa are required, and Hemresa when Tur och retur is on; a missing or invalid value is shown in red with a short message under the field, and no search is made.

Acceptance criteria:

- **Given** a filled-in search, **when** the traveller presses Sök, **then** the results page opens for that search.
- **Given** a search without Till, **when** the traveller presses Sök, **then** Till is shown in red with a message saying what to do, and the page does not change.
- **Given** the same airport in Från and Till, **when** the traveller presses Sök, **then** no search is made (the existing message shows).

### TRIP-010-R2 The search on the results page

The results page shows the search form at the top, filled in with the search, so the traveller can change it and search again. The search is part of the page's address, so it can be reloaded and shared.

Acceptance criteria:

- **Given** the results page, **when** it is shown, **then** the form at the top has the search's airports, dates and number of travellers.
- **Given** the results page, **when** the traveller changes the date and presses Sök, **then** the results for the new date are shown.
- **Given** the address of a results page, **when** it is opened in a new tab, **then** the same search is shown.

### TRIP-010-R3 Simulated search with skeleton cards

The search takes a random time between 1 and 4 seconds, to feel like a real flight search. Meanwhile, skeleton cards in the shape of the flight cards are shown, and screen readers are told that the search is in progress and when the results are ready. With reduced motion the skeletons do not animate.

Acceptance criteria:

- **Given** a search, **when** the results page opens, **then** skeleton cards are shown first, and the flights between 1 and 4 seconds later.
- **Given** a screen reader, **when** the results are ready, **then** it is told how many flights were found.

### TRIP-010-R4 The flights and their number

The results are every departure of the route between the chosen airports on the chosen date, and their number is shown, for example "7 flyg". On today's date, departures that have already left (local time at the departure airport) are not shown. If there are none, the page says so and suggests another date.

Acceptance criteria:

- **Given** a search ARN → LHR on a date, **when** the results are shown, **then** every departure of that route on that date is shown, at least 5, and the number matches the cards.
- **Given** a search for today, **when** the results are shown, **then** no departure earlier than now is shown.

### TRIP-010-R5 The flight card

Each flight is a card showing: the departure time (local time at the departure airport), the departure and arrival airports with IATA code and city, and the price per person as "från 1 290 kr / person". The flight time and the arrival time are not shown, since they depend on the aircraft chosen in TRIP-011 (an airship and a fighter jet take very different times). Until TRIP-011, "från" is the departure's own price; TRIP-011-R9 makes it the cheapest aircraft and class.

Acceptance criteria:

- **Given** a result, **when** it is shown, **then** its card shows the departure time, the airports and the price as above, and no flight time or arrival time.

### TRIP-010-R6 The card expands

Clicking a card, or pressing Enter or Space on it, expands it and shows more: the flight number (for example "GF 1234"), the airports' full names and countries, the date of departure, the total price for all travellers ("från …"), and a Välj button. Clicking again collapses it. Screen readers are told whether it is expanded.

Acceptance criteria:

- **Given** a collapsed card, **when** the traveller clicks it, **then** it shows the details and Välj; **when** they click it again, **then** it collapses.
- **Given** a search for 3 travellers, **when** a card is expanded, **then** the total price is 3 × the price per person.

### TRIP-010-R7 Sorting

The flights are sorted by departure time, earliest first. The traveller can sort them by price instead, cheapest first, and back. Sorting does not search again.

Acceptance criteria:

- **Given** the results, **when** they are first shown, **then** they are in order of departure time.
- **Given** the results, **when** the traveller chooses sorting by price, **then** they are in order of the price shown ("från"), cheapest first, at once without skeleton cards.

### TRIP-010-R8 Choosing flights in two steps

For a one-way trip the traveller chooses one flight. For a return trip they choose in two steps: first the outbound flight on the outbound date, then the return flight (Till → Från) on the return date. The page shows which step they are on, and the chosen outbound flight with a way to change it.

Acceptance criteria:

- **Given** a return-trip search, **when** the traveller presses Välj on an outbound flight, **then** the return flights on the return date are shown, with the chosen outbound flight above them.
- **Given** step 2, **when** the traveller chooses to change the outbound flight, **then** step 1 is shown again, and the return flight must be chosen again.

This is the first part of the step-by-step booking (TRIP-011-R10): going back to an earlier step and changing it clears the choices of the steps after it.

### TRIP-010-R9 The chosen trip

When the last flight is chosen, the page shows a summary of the trip: the chosen flights and the total price for all travellers ("från …"). Going on to choose aircraft and classes comes in TRIP-011.

Acceptance criteria:

- **Given** a one-way search, **when** the traveller presses Välj, **then** the summary shows that flight and the total price.
- **Given** a return trip, **when** both flights are chosen, **then** the summary shows both and the sum of their total prices.

### TRIP-010-R10 Flights every day between every pair of airports

Every pair of the 51 airports has a route in each direction, also pairs closer than 150 km, with at least 5 departures a day spread over the day. Each route's flight time follows from the distance between the airports; it is stored but not shown, since TRIP-011 scales it by the aircraft's time factor. Existing routes keep their flight time and departures and get more departures if they have fewer than 5. The data is created by a migration, so it exists locally, in Preview and in production.

Acceptance criteria:

- **Given** the database after the migration, **when** it is checked, **then** every ordered pair of airports has a route with at least 5 departures, and the existing routes' flight times and departures are unchanged.
- **Given** any two different airports and any bookable date, **when** they are searched, **then** at least 5 flights are shown (unless they have already left today).

### TRIP-010-R11 A price per departure

Every departure has its own price per person in whole kronor, between 150 kr and 1 000 000 kr, the same every date. The prices are random but skewed: about 80 % cost 150–5 000 kr, 10 % 5 000–100 000 kr and 10 % 100 000–1 000 000 kr. The migration sets the prices once, so they don't change between deploys. The price of a trip also depends on the aircraft and the class (TRIP-011).

Acceptance criteria:

- **Given** the database after the migration, **when** it is checked, **then** every departure has a price between 150 and 1 000 000 kr, and the shares are close to 80/10/10.
- **Given** a search, **when** it is made again, **then** the prices are the same.

### TRIP-010-R12 Routes without aircraft

Routes no longer have an assigned aircraft, and the "Tilldela plan" button and its card are removed from admin.

Acceptance criteria:

- **Given** a signed-in administrator, **when** `/admin` is shown, **then** there is no "Tilldela plan".
- **Given** the database after the migration, **when** it is checked, **then** routes have no aircraft.

### TRIP-010-R13 Tab chooses the highlighted airport

Added with the user on 2026-10-23. When the list of airport suggestions in Från or Till is open and a suggestion is highlighted (the first one is, from the start, for example when there is only one match), pressing Tab (or Shift+Tab) chooses it, as Enter does, and focus moves on as usual. With the list closed or empty, Tab only moves focus. While the list still shows the suggestions for an earlier text (the new ones haven't come yet), neither Tab nor Enter chooses from it, so the choice always matches what is typed.

Acceptance criteria:

- **Given** "arlanda" typed in Från and its one suggestion highlighted, **when** the traveller presses Tab, **then** Från shows "Stockholm Arlanda (ARN)", the list is closed and focus is in Till.
- **Given** a list with several suggestions and the second highlighted with Arrow down, **when** the traveller presses Tab, **then** the second is chosen.
- **Given** no suggestions ("Inga flygplatser matchar"), **when** the traveller presses Tab, **then** nothing is chosen and focus moves on.

### Non-functional requirements

- Accessibility: the results page in each state (searching, results, expanded card, step 2, summary, no flights) passes `expectNoA11yViolations`, and the checklist in `wiki/system/accessibility.md` is gone through on the live site.
- Mobile: the page works at 320 px without sideways scrolling.
- Performance: apart from the simulated wait, the results come in under a second, also with about 2 550 routes.
- Tests do not wait the random 1–4 seconds; the wait can be turned off or shortened in tests.

## Notes

- `npm run build` and the dev server were run against a copy of the local database, so your own database gets migration 007 only after the merge (when `npm run dev` runs it).
- Also recorded on this branch: the Live tests after TECH-014's and TECH-015's merges, in their `verification.md`.

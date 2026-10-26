---
id: TRIP-013
title: "Charter: Destination pages and search"
---

# Verification of TRIP-013

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-013-R1 | Unit tests `TRIP-013-R1 …` in `lib/destinations.test.ts` (matching, case, suggestions); browser tests `TRIP-013-R1 …` in `tests/TRIP-013-destinations.spec.ts` (other name, Enter, case, arrow keys and the announcement, no match); axe with the suggestions open | local, CI | Pass | 2026-10-26 |
| TRIP-013-R2 | Unit tests `TRIP-013-R2 …` (filters, countries, counts, address, unknown values); browser tests `TRIP-013-R2 …` (address, reload, Back, counts, Antarctica, Rensa, unknown value) | local, CI | Pass | 2026-10-26 |
| TRIP-013-R3 | Unit test `TRIP-013-R3 the top six categories …`; browser tests `TRIP-013-R3 …` and `TRIP-013-R2 and R3 Rensa …` | local, CI | Pass | 2026-10-26 |
| TRIP-013-R4 | Unit tests `TRIP-013-R4 …` in `lib/destination-names.test.ts`, against the test database | local, CI | Pass | 2026-10-26 |
| TRIP-013-R5 | Unit test `TRIP-013-R5 a card has the first sentence …`; browser test `TRIP-013-R5 a destination card shows its facts …` (card, link, no photo); design test `TRIP-013-R5 and R8 the charter list …` in `tests/TECH-018-design.spec.ts` (18 own colours, contrast 4.5:1); 320 px in `TRIP-013-R5 and R9 … 320 px` | local, CI | Pass | 2026-10-26 |
| TRIP-013-R6 | Unit tests `TRIP-013-R6 …` in `lib/destinations.test.ts` (Teufelsberg 780, range 780–22 680, 95 with a trip, 24 through the gateway, none for Chernobyl) | local, CI | Pass | 2026-10-26 |
| TRIP-013-R7 | Browser tests `TRIP-013-R7 a destination page shows …` (sections, credits, facts, airport, ways, gateway, sea voyage, 404) and `… no booking button, and the link back …`; design test `TRIP-013-R7 and R8 the destination page …`; unit tests for the back link and the text parsing | local, CI | Pass. The 404 page has status 200 (see Notes) | 2026-10-26 |
| TRIP-013-R8 | Browser test `TRIP-013-R8 …` (card and page); design tests for the red text, the alert without a box and the contrast; unit test `TRIP-013-R6 and R8 …` | local, CI | Pass | 2026-10-26 |
| TRIP-013-R9 | axe in `TRIP-013-R9 …` for the start, a search, filters, no match, a destination page and Chernobyl; focus and announcement in `TRIP-013-R9 a filter keeps focus …` and `TRIP-013-R3 Plats …`; 320 px in the design file | local, CI | Pass | 2026-10-26 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `lib/destinations.test.ts`, `lib/destination-names.test.ts`, `lib/markdown.test.ts` (against the unit test database) | local | Pass | 2026-10-26 |
| Browser tests | `tests/TRIP-013-destinations.spec.ts` and the design tests in `tests/TECH-018-design.spec.ts` | local | Pass | 2026-10-26 |
| Smoke test | `TRIP-013-R7 @smoke …` in `tests/TRIP-013-destinations.spec.ts`: `/charter` lists destinations and a destination page opens with its photo credit and airport (read-only) | local; preview and live: not checked yet (after the deploy) | Pass locally | 2026-10-26 |
| Accessibility | axe in every state (above). The checklist in `wiki/system/accessibility.md` for `/charter`, a destination page and Chernobyl's on the live site: not checked yet (after the deploy) | local | axe: Pass. Checklist: not checked | 2026-10-26 |
| Security | The security points in the review, and `/security-review` run on the branch: no findings | local | Pass | 2026-10-26 |
| Code review | [review.md](review.md) | local | Passed | 2026-10-26 |

## Test suite

`npm run test:time` before and after the change.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 106 unit, 181 browser | 0.4 s + 172.8 s (the unit time from TRIP-027) | 3.8 s |
| After | 124 unit, 201 browser | 0.6 s + 188.7 s | 3.3 s |

The browser suite grew by 20 tests (9 %) and is 9 s over the 180 s budget; no single test is over 5 s. The new tests were first 27, then merged to 17 in the TRIP-013 file plus 3 design tests, to save page loads. The suite was already at 96 % of its budget before the change, so a new feature with this many pages cannot fit; a technical task to speed the suite up is proposed to the user.

## Definition of Done

- [x] Tests: every check in the card's test plan is done locally; every requirement is tested; `npm run test:unit` and `npm run test:local` pass (`npm run test:time`)
- [ ] Test suite: grown by 9 %, but 9 s over the 180 s budget (see above); the new tests follow the quality rules in `wiki/system/testing.md`
- [ ] Deployed, and the smoke tests pass against production (Live tests)
- [ ] Accessibility: axe passes in every state; the checklist items on the live site (after the deploy)
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/charter-resmal.md`), system docs (`wiki/system/charter-destinations.md`) and `wiki/log.md` updated
- [x] No leftovers: nothing made unused; the temporary files and test config used while debugging are deleted
- [x] Clean code: reuses `Autocomplete`, `Card`, `Field`, `Button`, `Message` and `formatPrice`; `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [ ] Technical tasks for larger improvements noticed along the way added to the board

## Requirements as built

### TRIP-013-R1 Free-text search

`/charter` shall have a search field with autocomplete that finds destinations by title, other names, locality, region, country (in Swedish and English) and tags, and list every match.

Acceptance criteria:

- **Given** `/charter`, **when** the traveller types "field station", **then** the suggestions include Teufelsberg listening station (a match on its other name), and pressing Enter lists every destination that matches.
- **Given** the text "BERLIN" or "berlin", **when** searching, **then** the same destinations are found (case does not matter).
- **Given** a text that matches nothing, **when** searching, **then** the page says "Inga destinationer matchar" and offers to clear the search and the filters.
- **Given** the search field, **when** used with the keyboard and a screen reader, **then** the suggestions are a labelled list, one is chosen with the arrow keys and Enter, and the number of suggestions is announced, as in the airport autocomplete.

### TRIP-013-R2 Filters

`/charter` shall have the filters Världsdel, Land, Tillträde and Kategori, which work alone or together with the free-text search, each choice shows how many destinations it gives, and the search and filters are in the address.

Acceptance criteria:

- **Given** no search, **when** the traveller chooses Världsdel Europa, **then** all 47 destinations in Europe are listed and the choices under Land are only the countries that have destinations in Europe.
- **Given** a search and filters, **when** the page is reloaded or the address is shared, **then** the same search and filters are shown, and Back goes to the previous state.
- **Given** a choice, **when** it is made, **then** its count is the number of destinations it would give together with the other filters and the search.
- **Given** the continent Antarktis (no country), **when** it is chosen, **then** its destinations are listed directly, and the other choices under Land are unchanged.
- **Given** an active search or filter, **when** the traveller presses "Rensa", **then** all of them are cleared and the start cards are shown again.
- **Given** an address with an unknown continent, country, category or access value, **when** the page opens, **then** it is ignored and the list shows what is left of the search.

### TRIP-013-R3 Start cards

Before a search or filter, `/charter` shall show the start cards Plats and Aktivitet as ways to start.

Acceptance criteria:

- **Given** `/charter` with no search or filter, **when** the traveller chooses a continent on Plats, **then** the page goes on to the countries of that continent (Antarktis goes straight to the list), and when a country is chosen the list shows its destinations with Världsdel and Land already filled in.
- **Given** the card Aktivitet, **when** shown, **then** it has the six categories with the most destinations, in that order and by name when equal (today: Ghost town or village 34, Industrial site 14, Military or Cold War site 12, Abandoned resort or hotel 8, Hospital or sanatorium 7, Prison 4), each with its count, and a choice lists the category's destinations with Kategori filled in.
- **Given** any search or filter, **when** shown, **then** the start cards are hidden.

### TRIP-013-R4 Swedish names

The site shall show continents, countries, categories, access values and ways of getting there in Swedish, from names defined once.

Acceptance criteria:

- **Given** every continent, category, access value and way of getting there in the database, **when** checked, **then** each has a Swedish name; a new value without one fails a test (unit test).
- **Given** every country in the destinations, **when** shown, **then** its Swedish name comes from its country code (`Intl.DisplayNames`), for example "Tyskland" for DE.

### TRIP-013-R5 Destination card

Every destination in a list shall be a compact card with its title and country, its photo, the first sentence of its description, a tag for its category and a tag for its access, and "Från X kr / person", with a link to its page.

Acceptance criteria:

- **Given** a destination, **when** its card is shown, **then** it has "Teufelsberg listening station, Tyskland", the photo, the first sentence of the description, the tags with the Swedish names (R4) of "Military or Cold War site" and "Open", and "Från 780 kr / person" (the cheapest round trip, see R6), and one button "Visa" that opens `/charter/teufelsberg`.
- **Given** the tags, **when** shown, **then** each category and each access value has its own subdued colour, the meaning is also in the text, and the text has enough contrast (WCAG 2.2 AA).
- **Given** a destination without a photo (Project Riese – Osówka), **when** its card is shown, **then** a plain placeholder area takes the photo's place, with no broken image.
- **Given** a destination, **when** its card is on a phone (320 px), **then** nothing overflows or is cut off.

### TRIP-013-R6 The "från" price

The "från" price per person shall be the cheapest round trip, in whole kronor: the cheapest timetable from ARN or CPH to the destination's airport plus the cheapest back, over the whole period of the timetables.

Acceptance criteria:

- **Given** the timetables, **when** a destination's price is worked out, **then** it is the lowest price among timetables from ARN and CPH to its airport plus the lowest among timetables from its airport to ARN and CPH (unit test with course data).
- **Given** a destination where the nearest airport has no timetables from ARN or CPH, **when** its airport is chosen, **then** the gateway airport is used.
- **Given** a destination without timetables, **when** shown, **then** it has no price, see R8.

### TRIP-013-R7 Destination page

`/charter/<id>` shall show everything on the card, the rest of the description, more information about the destination, a large photo with its credit, the airport and distance, and the ways of getting there.

Acceptance criteria:

- **Given** `/charter/teufelsberg`, **when** it is shown, **then** it has the heading with the title and country, the large photo with photographer, licence (with its link when it has one) and a link to the photo's source, and the three sections of the text: Översikt, Ta sig dit and Besöka.
- **Given** the page, **when** shown, **then** it has region and locality, category and access, the other names ("Även kallad: Field Station Berlin"), the tags, and when the details were checked and from which source (when the course data has them).
- **Given** the page, **when** shown, **then** it says which airport the traveller flies to (name and code, for example "Du flyger till Berlin Brandenburg Airport (BER)") and how far it is from the destination ("35 km från destinationen"); when the course data gives no distance (only a long sea voyage) it says "Nås bara med lång båtresa". When the destination is reached through its gateway airport, that airport is named, with the nearest airport as a note.
- **Given** the page, **when** shown, **then** the ways of getting there from the airport are listed in Swedish, in the order of the course data ("Tåg, Promenad, Bil, Taxi").
- **Given** the page, **when** shown, **then** it says that the text is in English: "Texterna är hämtade från vår samarbetspartner Gurras charter AB och är jobbiga att översätta", and credits Wikipedia as the source of the text, next to the photo credit.
- **Given** an id that doesn't exist, **when** `/charter/<id>` is opened, **then** the page is a 404 with a link back to `/charter`.
- **Given** the page, **when** shown, **then** there is no button to book, and a link back to the list that keeps the search and filters.

### TRIP-013-R8 No flights

A destination without timetables from ARN or CPH shall show a notice in red, no price and no booking, on its card and on its page.

Acceptance criteria:

- **Given** Chernobyl Exclusion Zone and Pripyat, **when** its card is shown, **then** it has the red text "Inga flyg dit just nu, luftrummet är stängt. Du får ta dig dit på egen hand." in the place of the price.
- **Given** its page, **when** shown, **then** the same notice is shown prominently and the airport is named (Kyiv Boryspil, KBP, 170 km), with no price.
- **Given** any destination without timetables, **when** shown, **then** the same rule applies, and the notice's text is chosen by the rule, not by the destination's id.
- **Given** the notice, **when** read, **then** its contrast meets WCAG 2.2 AA and it is not only colour: it is text, and on the page it is an alert region marked for screen readers.

### TRIP-013-R9 Accessibility and phone

`/charter` and `/charter/<id>` shall meet WCAG 2.2 level AA in every state and work on a phone.

Acceptance criteria:

- **Given** `/charter` (start, with a search, with filters, with no match) and a destination page (with and without flights), **when** checked with axe, **then** there are no violations.
- **Given** a 320 px wide screen, **when** the pages are used, **then** nothing is cut off and nothing needs sideways scrolling.
- **Given** a filter or a start card, **when** chosen, **then** focus is never lost and the new number of results is announced.

## Notes

- **Antarktis (R2, R3).** The course data gives Antarctica's two destinations country codes (GS, AQ). As built, choosing the continent Antarktis offers no country: Land keeps its full list, and the Plats card goes straight to the list.
- **The 404 page (R7)** has the status code 200, since the page is already streaming when the id is found missing (Next.js with Cache Components). Next.js adds `noindex`; see `solution.md`.
- **`Autocomplete` (R1).** The airport fields also announce the number of suggestions and name their list ("Förslag"); the card asked for it "as in the airport autocomplete", which did not do it before.
- **The start cards (R3)** are laid out as two cards with equally sized buttons in a grid (name left, count right), on the user's request during the work.
- **Accessibility checklist and the live smoke test** wait for the deploy.

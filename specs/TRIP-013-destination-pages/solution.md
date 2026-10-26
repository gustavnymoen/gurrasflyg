---
id: TRIP-013
title: Charter: Destination pages and search
card: "#18"
depends_on: [TRIP-007, TRIP-018]
---

# TRIP-013 Charter: Destination pages and search: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 18`.

## Data

None: no migration. Everything is read from the tables of TRIP-007 (`wiki/system/data-charter.md`).

The price and the airport come from the timetables (`charter_timetables`) in two queries in `lib/travel.ts`: the cheapest price per destination airport from ARN or CPH, and the cheapest per airport back to ARN or CPH, over the whole period. Both queries use parameters (`IN (?, ?)`).

## Interface

**Pages and routes**

- `/charter` (`app/charter/page.tsx`): the heading, and `DestinationBrowser` (a client component) with all 96 destination cards as props.
- `/charter/<id>` (`app/charter/[id]/page.tsx`): the destination page; `not-found.tsx` beside it is the page for an unknown id.
- `GET /api/destination-search?q=` (`app/api/destination-search/route.ts`): at most five suggestions (`id`, `name`, `detail`) for the search field.

**Logic, in `lib/` and without a database so that the browser can use it**

- `destinations.ts`: the card type, the search (`matchesSearch`, `applyFilters`), the filters and their counts (`facetCounts`, `filterOptions`), the address (`filtersToParams`, `parseFilters`, `listHref`), the start cards' data (`topCategories`, `continentChoices`, `countriesIn`), the suggestions, the first sentence, and the airport and price (`tripTo`).
- `destination-names.ts`: the Swedish names of continents, categories, access values and ways of getting there, and `countryName(code)` from `Intl.DisplayNames` (R4).
- `markdown.ts`: reads the texts (paragraphs, bullet lists, `**bold**`) into parts.
- `travel.ts` (server only): `getDestinationCards()` and `getCharterDestination(id)` read the database and use the above.

**Components in `app/charter/`:** `DestinationBrowser` (search, filters, list), `StartCards` (Plats in two steps, Aktivitet), `DestinationCard`, `DestinationTag`. Shared: `Prose` (a text from the course data as plain text), and `Autocomplete`, which gets three small additions (below).

**Texts to visitors (Swedish):** "Sök resmål", the filters Världsdel, Land, Tillträde, Kategori ("Alla" first, each choice with its count), "Rensa", "Inga destinationer matchar. Rensa sökningen eller filtren för att se alla.", "Från X kr / person", "Visa", the notice "Inga flyg dit just nu, luftrummet är stängt. Du får ta dig dit på egen hand.", and on the page "Du flyger till … (XXX).", "N km från destinationen.", "Nås bara med lång båtresa.", and "Texterna är hämtade från vår samarbetspartner Gurras charter AB och är jobbiga att översätta." An unknown id: "Resmålet finns inte" with a link "Till charterresorna".

## Decisions

- **The list is filtered in the browser.** The page sends all 96 cards (about 50 kB) once, and `DestinationBrowser` filters them with the same functions the unit tests use. Every choice answers at once, the counts per choice are cheap, and no query ever contains the search text, which also makes the security review simple. The address is kept in step with `window.history.pushState` and read with `useSearchParams` (Next.js supports both together), so Back, reload and sharing work without a request to the server.
- **The autocomplete is shared with the airports'.** `Autocomplete` is used as it is, with three additions: `enterSearches` (Enter sends the form with the text, a suggestion is chosen with the arrow keys and Enter or with the mouse), `name` (so the form can read the text), and a screen-reader line that announces "N förslag" and a name for the list ("Förslag"). The airport fields get the announcement and the list name too (that gap was in R1's "as in the airport autocomplete"). A chosen suggestion opens the destination's page; Enter or **Sök** lists every match.
- **Search is "every word somewhere".** Title, other names, locality, region, the country in Swedish and English, and tags are joined, case and accents are ignored, and every word of the search must be in the text. "field station" finds Teufelsberg through its other name.
- **Counts per choice leave out the filter itself** (the usual facet count): the numbers under Kategori say what each category would give with the other filters and the search. Under Land, only the countries of the chosen continent are offered. Antarktis is the exception (`CONTINENT_WITHOUT_COUNTRIES`): its two destinations are in territories, so no country is offered and Land stays as it was. Choosing another continent clears the country.
- **Start cards are local state for step two.** "Plats: Europa" with its countries is state in `StartCards`, not in the address, because any filter in the address hides the start cards (R3). The page goes to the address when a country, Antarktis or a category is chosen. Focus then moves to the heading over the results (the chosen button is gone). Rensa and "Rensa sökning och filter" move focus to the search field; the field is rebuilt when the search text in the address changes (Back, Rensa, Enter), and `refocusSearch` gives it focus again.
- **Price and airport are one rule** (`tripTo`): the nearest airport when a timetable from ARN or CPH goes there, otherwise the gateway, otherwise no trip. The notice text belongs to "no trip", not to a destination id (R8). Today only Chernobyl has none.
- **Tags have a hue each** (`DestinationTag`): a number on the colour wheel gives both background and text (`tag` in `globals.css`, `oklch`), so the contrast is the same for all 18 values; the meaning is always in the text too.
- **Texts are never HTML.** `lib/markdown.ts` reads the three Markdown features the course data uses into parts and `Prose` renders them as React text; a `<b>` in a text is shown as it is. The status source on the page is a link only when it starts with `http://` or `https://`.
- **The unknown id is a 404 page, but the status code is 200.** The destination is read inside `<Suspense>` (needed with Cache Components, since the page reads the database), so the page is already streaming when the id is found missing. Next.js adds `noindex` and shows the 404 page; the status code can only be 404 before streaming starts.
- **The layout's address readers are in `<Suspense>`** (`Wordmark`, `AbortButton`, `PhotoCredit`, the footer's `StartLink`). They read `usePathname()`, which for a route with a dynamic id isn't known when the shell is built, and Next.js refuses that outside `Suspense`. On other pages nothing changes.
- **`getCharterDestination` reads all destinations** and picks one, instead of a second query for the same joins. 96 rows are cheap, and the card list and the page can't disagree.

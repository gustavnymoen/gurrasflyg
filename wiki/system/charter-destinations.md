---
type: Feature
title: Charter destinations
description: The page /charter with search, filters and start cards, the destination pages /charter/<id>, and the price, airport and notice for destinations without flights.
resource: app/charter/
feature: TRIP-013
tags: [charter, destinations, search, filters, prices, accessibility]
timestamp: 2026-10-26
---

# Charter destinations

`/charter` lists the course's 96 destinations as cards that can be searched and filtered, and `/charter/<id>` is one destination's page. Choosing the dates and booking the trip is on the destination page ([Charter booking](charter-booking.md), TRIP-014).

## The list

`app/charter/page.tsx` reads all destinations as cards (`getDestinationCards()` in `lib/travel.ts`) and hands them to `DestinationBrowser`, a client component. The browser filters them itself with the functions of `lib/destinations.ts`, so every choice answers at once.

- **Search:** the field "Sök resmål" is the shared `Autocomplete` with `enterSearches`. Suggestions come from `GET /api/destination-search?q=` (at most five; titles starting with the text first). A suggestion opens its page; Enter or **Sök** lists every match. The search finds title, other names, locality, region, country (Swedish and English) and tags; every word must be somewhere, and case and accents don't matter.
- **Filters:** Världsdel, Land, Tillträde and Kategori are `<select>`s. Each choice shows the count it would give with the other filters and the search (`filterOptions`). Land offers the countries of the chosen continent; for Antarktis it is unchanged, and changing the continent clears the country.
- **Address:** `?sok=berlin&varldsdel=Europe&land=DE&tillgang=Open&kategori=Prison`, written with `window.history.pushState` and read with `useSearchParams`, so reload, sharing and Back work. A value that no destination has is ignored (`parseFilters`).
- **Start cards** (`StartCards`), shown only with no search or filter: **Plats** (continent, then country; Antarktis goes straight to the list) and **Aktivitet** (the six categories with most destinations). The step "Plats: Europa" is local state, not in the address.
- **Rensa** clears everything. With no match the page says "Inga destinationer matchar" and offers "Rensa sökning och filter".
- **Focus and announcements:** a filter keeps focus; a start card moves focus to the heading over the results (the chosen button disappears); Rensa moves focus to the search field. The number of results is announced ("N destinationer matchar") and so is the number of suggestions ("N förslag").

## The card

`DestinationCard`: photo (a plain area when there is none; lazy except the first three), "Title, Land", the first sentence of the description, a tag for the category and one for the access (`DestinationTag`, a colour of its own each, text also says it), "Från X kr / person" and **Visa**. The link to the page carries the search and filters in its address.

## The price and the airport

`tripTo()` in `lib/destinations.ts`: the airport is the nearest if a timetable from ARN or CPH goes there, otherwise the gateway airport, otherwise there is no trip. The price is the cheapest timetable from ARN or CPH to the airport plus the cheapest back, in whole kronor (`getFares()` in `lib/travel.ts`). A destination with no trip (today Chernobyl) shows the red notice "Inga flyg dit just nu, luftrummet är stängt. Du får ta dig dit på egen hand." instead of a price, as an alert on its page.

## The destination page

The page has two columns on a wide screen (`max-w-7xl`): the heading, tags, photo and the texts on the left, and on the right (sticky) the price or the notice, the search form **Sök resa** and the airport; on a phone everything follows the photo in one column. Heading with title and country, tags, photo with photographer, licence (linked when it has a link), a link to the photo's source and the credit "Text: sammanfattad från Wikipedia"; the price or the notice; the airport ("Du flyger till … (BER)", distance, or "Nås bara med lång båtresa", or the gateway with the nearest airport as a note); the ways of getting there in Swedish; the sections Översikt, Ta sig dit and Besöka (`Prose`); facts (region, locality, other names, tags, when it was checked and the source); and the note that the texts are in English. "← Tillbaka till listan" keeps the search and filters. An unknown id shows "Resmålet finns inte" (status code 200 because the page is already streaming; Next.js adds `noindex`).

The texts are Markdown from the course data, shown as plain text (`lib/markdown.ts`): never HTML.

## Names

`lib/destination-names.ts` defines the Swedish names once; countries come from `Intl.DisplayNames`. A unit test fails when the database has a value without a name.

## Related

- Data: [Charter data](data-charter.md); read by `lib/travel.ts`
- Tests: `lib/destinations.test.ts`, `lib/destination-names.test.ts`, `lib/markdown.test.ts`, `tests/TRIP-013-destinations.spec.ts`, and the look in `tests/TECH-018-design.spec.ts`
- Booking: [Charter booking](charter-booking.md) (the form on the page and everything after it)
- Feature: card TRIP-013 (#18), `specs/TRIP-013-destination-pages/`

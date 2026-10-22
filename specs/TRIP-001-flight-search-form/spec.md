---
id: TRIP-001
title: Flight search form
area: Flight booking
status: done
created: 2026-10-20
updated: 2026-10-20
depends_on: []
---

# TRIP-001 Flight search form

## Goal

A traveller can enter a trip on the start page: from which airport, to which airport, on which date, how many travellers, and whether they want a return trip. Mistakes are pointed out directly in the form.

## Background

Built before specification-driven development was introduced and specified afterwards. The form collects the search, but there is no search button or result list yet. Showing results is a later feature.

The airports are the airline's own (table `airports`, 51 airports), not the course data.

## Users

Traveller.

## Scope

**In scope**

- The search form on the start page and its validation.
- The airport search endpoint `GET /api/airports`.

**Out of scope**

- Searching for flights and showing results (later feature).
- Choosing a return date (later, with search results).
- Destinations and charter trips from the course data.

## Requirements

### TRIP-001-R1 Search form on the start page

The start page shall show the heading "Gurras Flyg", the subtitle "Ditt livs flygresa" and a search form in a card with the fields Från, Till, Datum and Antal resenärer, and the checkbox "Boka returresa". On wide screens the fields are on one row; on a phone they are stacked.

*Changed by TRIP-020-R2 (2026-10-22): the heading is "Vi ordnar det ingen annan kan" and the text under it "Ditt livs flygresa, till städer och till platser andra flygbolag glömt bort."; the name "Gurras Flyg" is in the wordmark in the header. On a phone, Datum and Resenärer are side by side (TRIP-020-R6).*

Acceptance criteria:

- **Given** a visitor opens `/`, **then** the heading, the subtitle and the four fields with placeholders "Från", "Till" and "Datum" are shown, together with the checkbox.

### TRIP-001-R2 Airport suggestions

When the traveller types in Från or Till, the site shall suggest at most 5 airports whose name or IATA code contains the text, regardless of case. Airports whose name starts with the text come first, then the rest alphabetically. Each suggestion shows the airport's name, country and IATA code, with the matching part of the name highlighted.

Acceptance criteria:

- **Given** the traveller types "lon" in Från, **then** a list appears with at most 5 airports, including "London Heathrow".
- **Given** the traveller types "arn", **then** "Stockholm Arlanda" is suggested (match on IATA code).
- **Given** the traveller types "a", **then** at most 5 suggestions are shown.

### TRIP-001-R3 No matching airport

When no airport matches, the list shall say "Inga flygplatser matchar".

Acceptance criteria:

- **Given** the traveller types "zzzz", **then** the list shows "Inga flygplatser matchar".

### TRIP-001-R4 Choosing an airport

The traveller shall be able to choose a suggestion with the mouse, or with the arrow keys and Enter. The field then shows "<name> (<IATA>)" and the list closes. Escape closes the list. Changing the text afterwards clears the choice.

Acceptance criteria:

- **Given** suggestions for "lon", **when** the traveller clicks "London Heathrow", **then** the field shows "London Heathrow (LHR)".
- **Given** several suggestions, **when** the traveller presses Arrow down or Arrow up, **then** the next or previous suggestion is highlighted.
- **Given** suggestions for "arlanda", **when** the traveller presses Enter, **then** the highlighted suggestion is chosen and the field shows "Stockholm Arlanda (ARN)".
- **Given** an open list, **when** the traveller presses Escape, **then** the list closes.

### TRIP-001-R5 Same airport in both fields

When Från and Till are the same airport, the site shall show "Ajja bajja, du måste flyga någonstans!" under the field that was chosen last, and show that field's value in red.

Acceptance criteria:

- **Given** Från is Stockholm Arlanda, **when** the traveller chooses Stockholm Arlanda in Till, **then** the message is shown under Till.
- **Given** Till is Stockholm Arlanda, **when** the traveller chooses Stockholm Arlanda in Från, **then** the message is shown under Från.
- **When** one of the fields is changed to another airport, **then** the message disappears.

### TRIP-001-R6 Bookable dates

The date field shall show the placeholder "Datum" when empty, and its calendar shall only offer dates from today up to six months ahead. When six months ahead doesn't exist (for example 31 August + 6 months), the last day of that month is used.

Acceptance criteria:

- **Given** the start page, **then** the date field's earliest date is today and its latest date six months ahead, in the visitor's local time.

### TRIP-001-R7 Invalid date

A date typed by hand that is outside the bookable dates shall be shown in red with a message under the field: "Datumet har redan passerat." for a past date, "Du kan boka max 6 månader framåt." for a date too far ahead.

Acceptance criteria:

- **When** the traveller enters a date before today, **then** "Datumet har redan passerat." is shown.
- **When** the traveller enters a date more than six months ahead, **then** "Du kan boka max 6 månader framåt." is shown.
- **When** the traveller enters a bookable date, **then** no message is shown.

### TRIP-001-R8 Number of travellers

The number of travellers shall start at 1 and be changed with − and + buttons, between 1 and 10. The − button is disabled at 1 and the + button at 10. A person icon is shown next to the number.

Acceptance criteria:

- **Given** the start page, **then** the number is 1 and − is disabled.
- **When** the traveller presses + nine times, **then** the number is 10 and + is disabled.

### TRIP-001-R9 Return trip

The checkbox "Boka returresa" shall be unchecked from the start and can be checked and unchecked.

Acceptance criteria:

- **Given** the start page, **then** the checkbox is unchecked; **when** it is clicked, **then** it is checked.

### TRIP-001-R10 Airport search endpoint

`GET /api/airports?q=<text>` shall return a JSON array of at most 5 airports matching as in R2, each with `id`, `name`, `iata`, `country` and `timezone`. An empty or missing `q` returns an empty array.

Acceptance criteria:

- **When** `GET /api/airports?q=lon` is called, **then** the answer is status 200 with 1–5 airports, each with the five fields.
- **When** `GET /api/airports?q=` is called, **then** the answer is `[]`.

## Data

Reads the table `airports`. No changes.

## Interface

- Start page `app/page.tsx`, form `app/components/SearchForm.tsx`, suggestion list `app/components/Autocomplete.tsx`.
- Endpoint `app/api/airports/route.ts`, documented in `wiki/system/api-airports.md`.

## Non-functional requirements

- Suggestions are fetched 150 ms after the last key press, and an older answer never replaces a newer one.
- The fields have labels for screen readers, invalid fields are marked `aria-invalid` and linked to their message.
- Today's date is the visitor's, not the server's.

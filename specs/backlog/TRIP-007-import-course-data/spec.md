---
id: TRIP-007
title: Import the course data
area: Charter
status: backlog
created: 2026-10-20
updated: 2026-10-20
depends_on: [TECH-005]
---

# TRIP-007 Import the course data

## Goal

The course's charter data (airports, destinations, destination pages, photo credits and timetables) is in the database, in tables of its own, with prices in SEK. The charter features (destination pages, search and booking) can then be built on the database with ordinary queries, in the same way as flight booking.

## Background

The course data is read-only and lives in three files and two folders:

| Source | Content |
|---|---|
| `data/airports.json` | 136 charter airports: IATA code, name, city, country, latitude, longitude and time zone. |
| `data/destinations.json` | 96 destinations, generated from the destination pages. |
| `knowledge/<continent>/<country>/<id>.md` | One page per destination: frontmatter with the same fields as `destinations.json` (plus `status_source`), and three sections: Overview, Getting there and Visiting. The `index.md` pages only list the folders' contents. |
| `public/images/` | 96 photos. |
| `data/flights.json` | 500 timetables from or to ARN and CPH, 1 November 2026 to 30 April 2027, with prices in euros. |

Today only `GET /api/destinations` uses the data, and it reads `data/destinations.json` directly (`lib/travel.ts`). The decisions in `specs/overview.md` ("Decisions for charter") apply: new tables of their own, photos stay as files, timetables used as they are, and 1 EUR = 10 SEK.

The format is described in `knowledge/index.md` and `wiki/system/data-flights.md`.

### What the data check showed

The files were checked against each other on 2026-10-20 before this spec was written:

- **Consistent:** every destination has a unique ID that matches its page's file name; the page's frontmatter is identical to its record in `destinations.json`; every page has exactly the three sections; every airport referred to by a destination or a timetable exists in `airports.json`; every timetable starts or ends at ARN or CPH, has one flight number per leg (`via` plus one), and has a return timetable on the same route; IDs follow `<from>-<to>-<first flight number>`; all prices are whole euros (39–1 179).
- **Chernobyl** (`chernobyl-pripyat`) has no timetables, since there are no flights to Kyiv (KBP). This is documented in the course data.
- **Project Riese – Osówka** has no photo (`image: null`), although `public/images/project-riese-osowka.jpg` exists. Without an author and licence the photo can't be shown, so it is not imported.
- **Summer time:** the times are consistent with `duration_min` until mid-March 2027. When Europe and North America change to summer time (14 and 28 March), 64–132 of the timetables have `departs`, `arrives` and `duration_min` that no longer add up (by 1–2 hours), because the data doesn't follow the time change. The data is imported as it is (the decision "timetables used as they are"). The charter search works out the arrival from the departure time and the travel time, in each airport's time zone on that date (settled 2026-10-20), so `arrives` is stored but not used to show the arrival.
- `nearest_airport` is described as possibly `null`, but no destination has that; `gateway_airport` is `null` for 62 destinations.

## Users

None directly. Developers and the later charter features use the tables. Visitors see no difference.

## Scope

**In scope**

- New tables for charter airports, destinations, destination pages, photo credits and timetables.
- A script that generates the data migration from the course files, and the migration itself.
- Prices converted to whole kronor (1 EUR = 10 kr).
- `GET /api/destinations` reads from the database instead of the JSON file.

**Out of scope**

- Pages that show the data: destination pages and browsing (later feature), charter search and booking (later feature).
- Copying the photos into the database (decided against: they stay in `public/images/`).
- The `index.md` pages in `knowledge/`: their content can be derived from the destinations.
- Fixing the summer-time inconsistency in the course data (it is read-only).
- The airline's own tables (`airports`, `routes` and the rest): they are not changed, and the charter tables don't refer to them.

## Requirements

### TRIP-007-R1 Charter airports

The database shall have a table of charter airports with all 136 airports in `data/airports.json` and all their fields: IATA code (unique), name, city, country code, country name, latitude, longitude and time zone. It is separate from the airline's `airports` table, even where the same IATA code is in both.

Acceptance criteria:

- **Then** the table has 136 rows.
- **Then** WDH has the name "Hosea Kutako International Airport", the city "Windhoek", the country "NA" (Namibia) and the time zone "Africa/Windhoek".
- **Then** the airline's `airports` table is unchanged.

### TRIP-007-R2 Destinations

The database shall have a table of destinations with all 96 destinations and their fields: ID, title, description, continent, country code, country name, region, locality, category, access, nearest airport and its distance in km, gateway airport (or none), access status checked date and source (or none), and the path of its page. Aliases, tags and ways of getting there are stored in tables of their own, in the order they have in the data. The airports are references to the charter airports.

Acceptance criteria:

- **Then** there are 96 destinations, each with the same values as in `data/destinations.json`.
- **Then** `teufelsberg` has the alias "Field Station Berlin", the tags "cold-war", "berlin", "street-art" and "viewpoint" in that order, the nearest airport BER at 35 km, and no gateway airport.
- **Then** `denniston` has the nearest airport WSZ and the gateway airport CHC.

### TRIP-007-R3 Destination pages

The database shall have the text of each destination page, as three Markdown texts: Overview, Getting there and Visiting, without the headings and frontmatter.

Acceptance criteria:

- **Then** there are 96 pages, one per destination.
- **Then** the Overview of `teufelsberg` starts with "Teufelsberg is an artificial hill in Berlin's Grunewald forest", and its Getting there contains the two list items "Train and walk" and "Car or taxi".

### TRIP-007-R4 Photos and their credits

The database shall have the photo of each destination that has one: its address under `/images/`, author, licence, licence address (none for public domain) and source page. The photo files stay in `public/images/`.

Acceptance criteria:

- **Then** there are 95 photos, and every one has an author, a licence and a source, and its file exists in `public/images/`.
- **Then** `project-riese-osowka` has no photo.
- **Then** `denniston` has the photo `/images/denniston.jpg` by Mike Dickison, licence "CC BY 4.0".

### TRIP-007-R5 Timetables

The database shall have all 500 timetables in `data/flights.json`, as they are: ID, airline, departure and arrival airport, period (first and last date), weekdays, departure and arrival time (local time), days to arrival, total travel time, the flight numbers of the legs in order, and the change airports in order. The airports are references to the charter airports.

Acceptance criteria:

- **Then** there are 500 timetables.
- **Then** `ARN-BER-EW488` is flown by Eurowings, flight EW488, direct, Monday to Friday from 2026-11-01 to 2027-04-30, departs 07:00, arrives 08:40 the same day, 100 minutes.
- **Then** `ARN-WDH-LH1570` has the flights LH1570 and 4Y653 with a change in FRA, on Monday, Wednesday, Friday and Sunday.
- **Then** the timetables that run from ARN to BER on Monday 2027-01-11 are `ARN-BER-SK1122`, `ARN-BER-EW488`, `ARN-BER-SK2291` and `ARN-BER-DY6077` (the example in `wiki/system/data-flights.md`).

### TRIP-007-R6 Prices in SEK

Each timetable's price shall be stored in whole kronor, the rule for all prices on the site after TECH-005: the price in euros times 10. The price in euros is not stored.

Acceptance criteria:

- **Then** `ARN-BER-EW488` (129 €) costs 1 290 kr.
- **Then** `ARN-WDH-LH1570` (629 €) costs 6 290 kr.
- **Then** the cheapest timetable costs 390 kr (39 €) and the most expensive 11 790 kr (1 179 €).

### TRIP-007-R7 The data holds together

The tables shall reject data that doesn't hold together: references to airports that don't exist, a destination or timetable without its required fields, a period that ends before it starts, an unknown weekday, a negative price, or a departure airport that is the same as the arrival airport. If the course data broke a rule, the migration would fail instead of storing it.

Acceptance criteria:

- **Then** inserting a timetable to an airport that isn't a charter airport fails.
- **Then** inserting a timetable with the weekday "Mon" twice, or the weekday "Xyz", fails.

### TRIP-007-R8 Generated from the course files

The data migration shall be generated by a script from the course files, and not edited by hand, in the same way as `scripts/generate-routes.mjs` generates `002_routes_data.sql`. The tables are created by their own migration. Both run with `scripts/db-setup.mjs`, locally and on Turso, and existing data (bookings, reviews, the administrator's aircraft and routes) is kept.

Acceptance criteria:

- **When** the script is run again, **then** it gives exactly the same migration file.
- **When** `npm run dev` runs on a copy of the local database, **then** the charter tables are created and filled, and the existing tables have the same rows as before.
- **Then** the course files are unchanged.

### TRIP-007-R9 The destination API reads from the database

`GET /api/destinations` shall read the destinations from the database (settled 2026-10-20: this also lets the import be tested against the live site), with the same response as today: all 96 destinations sorted by ID, each with the fields of `data/destinations.json`.

Acceptance criteria:

- **When** `GET /api/destinations` is called, **then** the response is identical to `data/destinations.json` sorted by ID.
- **Then** `lib/travel.ts` no longer imports `data/destinations.json`.

## Data

Two new migrations. The data is a generated SQL migration, as for the routes, so it is versioned, runs once per database and is the same locally and on Turso (settled 2026-10-20):

- `db/migrations/004_charter.sql`: the tables.
- `db/migrations/005_charter_data.sql`: the data, generated by `scripts/generate-charter-data.mjs`.

New tables (names may be adjusted during the work; the spec is updated if so):

| Table | One row per | Main columns |
|---|---|---|
| `charter_airports` | charter airport | `iata` (key), `name`, `city`, `country`, `country_name`, `latitude`, `longitude`, `timezone` |
| `destinations` | destination | `id` (key, e.g. `teufelsberg`), `title`, `description`, `continent`, `country`, `country_name`, `region`, `locality`, `category`, `access`, `nearest_airport` → `charter_airports`, `nearest_distance_km`, `gateway_airport` → `charter_airports` or null, `status_checked`, `status_source`, `path` |
| `destination_aliases`, `destination_tags`, `destination_transport` | alias, tag or way of getting there | `destination_id`, `position`, the value |
| `destination_pages` | destination | `destination_id` (key), `overview`, `getting_there`, `visiting` (Markdown) |
| `destination_photos` | destination with a photo | `destination_id` (key), `src`, `author`, `license`, `license_url`, `source` |
| `charter_timetables` | timetable | `id` (key, e.g. `ARN-BER-EW488`), `airline`, `from_airport`, `to_airport` → `charter_airports`, `valid_from`, `valid_to`, `departs`, `arrives`, `arrival_day`, `duration_minutes`, `price` (kr) |
| `charter_timetable_days` | weekday of a timetable | `timetable_id`, `weekday` (`Mon` … `Sun`) |
| `charter_timetable_flights` | leg of a timetable | `timetable_id`, `position`, `flight_number` |
| `charter_timetable_stops` | change airport of a timetable | `timetable_id`, `position`, `airport` → `charter_airports` |

Dates are stored as `YYYY-MM-DD` and times as `HH:MM`, as in the course data and in `route_departures`.

## Interface

No visible change.

- `scripts/generate-charter-data.mjs` (new): reads `data/` and `knowledge/`, writes the data migration.
- `lib/travel.ts`: reads the destinations from the database.
- `app/api/destinations/route.ts`: unchanged response.

## Non-functional requirements

- The migrations run in a few seconds, locally and on Turso (the data migration is about 1 MB, mostly page text).
- `GET /api/destinations` answers as fast as before (within about 500 ms on the live site).

## Open questions

None.

---
id: TRIP-007
title: Import the course data
---

# Verification of TRIP-007

How each requirement was checked.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-007-R1 | Test `TRIP-007-R1 the charter airports are imported, apart from the airline's` in `tests/TRIP-007-import-course-data.spec.ts` | local | Pass | 2026-10-21 |
| TRIP-007-R2 | Test `TRIP-007-R2 the destinations have the values of the course data` | local | Pass | 2026-10-21 |
| TRIP-007-R3 | Test `TRIP-007-R3 each destination has its page text, without headings` | local | Pass | 2026-10-21 |
| TRIP-007-R4 | Test `TRIP-007-R4 95 photos with their credits, the files stay in public/images` | local | Pass | 2026-10-21 |
| TRIP-007-R5 | Test `TRIP-007-R5 the timetables are imported as they are` | local | Pass | 2026-10-21 |
| TRIP-007-R6 | Test `TRIP-007-R6 prices are whole kronor, euros times 10` | local | Pass | 2026-10-21 |
| TRIP-007-R7 | Test `TRIP-007-R7 the tables reject data that doesn't hold together` (airport that doesn't exist, same airport both ways, period ending before it starts, negative price, "Mon" twice, "Xyz", destination without required fields) | local | Pass | 2026-10-21 |
| TRIP-007-R7 | The first run of the migration on a copy of the local database stopped on `destinations.nearest_distance_km` (two destinations without a distance, see Notes) and stored nothing of 006 | local (copy) | Pass | 2026-10-21 |
| TRIP-007-R8 | Tests `TRIP-007-R8 generating the charter data again gives the same migration` and `TRIP-007-R8 the course files are unchanged` | local | Pass | 2026-10-21 |
| TRIP-007-R8 | Manual: `db-setup.mjs` on a copy of the local database (`TURSO_DATABASE_URL=file:<copy>`): 005 and 006 ran; all 16 existing tables have the same number of rows and the same content (checksum per table) before and after; 11 new tables filled. A database run can't be repeated by a test without touching real data | local (copy) | Pass | 2026-10-21 |
| TRIP-007-R9 | Test `TRIP-007-R9 GET /api/destinations reads the destinations from the database` | local | Pass | 2026-10-21 |
| TRIP-007-R9 | The same test against the preview and the live site, which shows that the import reached Turso | live | Not checked yet | |
| Non-functional | Migration time and the response time of `GET /api/destinations` on the live site | live | Not checked yet | |
| All | `npm run lint`, `npm run typecheck`, `npm run build`: no errors or warnings; `npm run test:local`: 66 passed | local | Pass | 2026-10-21 |

## Definition of Done

- [x] Tests: every requirement is tested or has a recorded manual check; `npm run test:local` passes
- [ ] Deployed, and `npm test` passes against the live site
- [x] Accessibility: not applicable, visitors see no change
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual: not applicable (nothing visitors or the administrator see changes); system docs (`wiki/system/data-charter.md` new, `architecture.md`, `api-destinations.md`, `data-flights.md`, `index.md`) and `wiki/log.md` updated
- [x] No leftovers: `lib/travel.ts` no longer imports the JSON; TRIP-005's own copy of the test-database query is replaced by `queryTestDb` in `tests/helpers.ts`
- [x] Clean code: reuses existing components and helpers; `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements noticed along the way added to the board: none needed

## Requirements as built

Copied from card #11 on 2026-10-21.

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


## Notes

- **Found while building:** Grytviken and Whalers Bay (Antarctica) have no distance to their nearest airport (`distance_km: null`), because the only way there is a long sea voyage, as the course format documents. The data check before the spec missed it. `nearest_distance_km` may therefore be empty; R2 doesn't require a distance.
- From the review: the generator sorts with a plain comparison instead of `localeCompare`, so the file is the same on every computer, and names a missing value; the R2 test also checks `status_source`.
- Small cleanup: TRIP-005's tests had their own function for reading the test database; it is now `queryTestDb` in `tests/helpers.ts`, shared with TRIP-007.
- `npm run build` ran the two migrations on the local database too (the normal path, as `npm run dev` does), after saving a backup in `db/backups/`.

---
type: Product overview
title: Gurras Flyg
description: Purpose, product areas, terms, scope, features and shared rules of the Gurras Flyg booking site.
timestamp: 2026-10-20
---

# Gurras Flyg

## Purpose

Gurras Flyg is a fictional airline's booking site. It has two separate product areas:

- **Flight booking:** the airline's own scheduled flights. A traveller searches for a flight from airport A to airport B on a date and books it. Built on the airline's own data: airports, routes, aircraft, cabin classes and add-ons, managed in admin.
- **Charter:** trips to urban exploration destinations (abandoned towns, industrial sites, Cold War relics and more) from Stockholm Arlanda (ARN) and Copenhagen (CPH). Built on the course's sample data: destinations, destination pages, photos and timetables.

The two areas share the site, the design, the database and the reviews, but not their data: flight booking never uses the charter data, and charter never uses the airline's routes and aircraft.

An administrator manages the airline's data and the reviews shown on the start page.

All data is fake. No real payments are taken and no real personal data should be entered.

The site is also a course project: it is built to practise real product development (specifications, backlog, tests, deploys, documentation and manuals), so how it is built matters as much as what it does.

## Users

- **Traveller:** a visitor who searches, compares and books. No account; a booking is identified by its booking number.
- **Administrator:** signs in at `/admin` with a shared password and manages the airline's data.

## Terms

### Shared

| Term | Meaning |
|---|---|
| Booking | One or more flights or trips booked together for one or more passengers, with a contact person and a six-character booking number. |
| Passenger | A person travelling on a booking. |
| Contact | The person responsible for a booking, with name, address, phone and e-mail. |
| Review | A traveller's rating (1–5 stars), title, text and name, shown on the start page. |

### Flight booking

| Term | Meaning |
|---|---|
| Airport | One of the airline's 51 airports, with IATA code, name, country and time zone (table `airports`). |
| Route | A connection between two airports, flown in one direction, with a flight time and usually an assigned aircraft. Every route has a return route. |
| Departure | A time of day when a route is flown. A route has 2–3 departures a day. |
| Flight | One departure of a route on one date, with a given aircraft. This is what a traveller books. |
| Aircraft | One of the airline's planes. It has one or more cabin classes, each with a number of seats. |
| Cabin class | A part of the aircraft with its own seats and price, for example Ekonomi, Business or Första klass. |
| Add-on | An extra a traveller can buy, such as a meal. Which add-ons can be bought depends on the aircraft and cabin class. |

### Charter

| Term | Meaning |
|---|---|
| Destination | An urban exploration site from the course data, with its nearest airport and main international (gateway) airport. 96 destinations. |
| Destination page | The text about a destination in `knowledge/`: overview, getting there and visiting. |
| Timetable | A recurring trip from `data/flights.json`: from ARN or CPH to a destination's airport, or back, on certain weekdays during a period, direct or with changes. Identified by its ID, for example `ARN-BER-EW488`. |
| Trip | One timetable on one date, for example `ARN-BER-EW488` on 2027-01-11. This is what a traveller books. |
| Charter airport | An airport in `data/airports.json`, used by the timetables and destinations. |

## Scope

**In scope**

- Flight booking: searching for and booking flights between the airline's airports, and managing aircraft, cabin classes, add-ons and routes in admin.
- Charter: discovering destinations and booking trips to them from ARN and CPH.
- Reviews on the start page, managed in admin.
- A user manual that can later feed a chatbot.

**Out of scope**

- Real payments, e-mail and SMS.
- Traveller accounts and sign-in.
- Hotels, car hire and other travel products.
- Seat maps and choosing seats.
- Mixing the areas, for example a charter trip with a connecting flight on the airline's routes.

## Features

Features built before this way of working was introduced were specified afterwards, so `specs/done/` describes the site as it is.

| ID | Feature or task | Area | Status |
|---|---|---|---|
| TRIP-001 | Flight search form on the start page | Flight booking | Done |
| TRIP-002 | Admin sign-in and sign-out | Administration | Done |
| TRIP-003 | Admin: cabin classes and add-ons | Flight booking | Done |
| TRIP-004 | Admin: aircraft with classes, seats and add-ons per class | Flight booking | Done |
| TRIP-005 | Routes and departures, and assigning aircraft to routes | Flight booking | Done |
| TRIP-006 | Reviews: carousel on the start page and managing them in admin | Shared | Done |
| TECH-001 | Automatic pipeline (CI) on GitHub | Shared | Done |
| TECH-002 | Small cleanups: template images, unused code, review text limit defined once | Shared | Done |
| TECH-006 | Code review: guide, reviewer agent, review step and report on the pull request | Shared | Done |

## Backlog

One backlog for the whole site. **Feature** and **Fix** items get a `TRIP-` ID and a spec in `specs/backlog/` when they are specified; **Tech** items (improvements to the code that don't change what the site does) get a `TECH-` ID. The spec's `area` says which part of the site it belongs to. In priority order: the top item is next.

| ID | Item | Type | Area |
|---|---|---|---|
| TECH-005 | Store all prices as whole kronor instead of öre, so the code and data are easier to read: a migration converts the existing prices, the code stops converting, add-on prices must be whole kronor (an error otherwise), and the rule is updated in `CLAUDE.md`, `specs/overview.md`, `wiki/` and the TRIP-003 spec | Tech | Shared |
| TRIP-007 | Import the course data into the database, in tables of its own, with prices converted to whole kronor (EUR × 10) | Feature | Charter |
| TRIP-008 | Update the visual design: tokens, shared components and the "Loungen" look for the whole site (dark, wine red and brass, photo background, animated wordmark) | Feature | Shared |
| TECH-003 | The bookable-date rules (today to six months ahead, `toDateString`, `addMonths`) live inside `app/components/SearchForm.tsx`. Move them to a shared module so later features (search results, charter) use the same rules | Tech | Flight booking |
| TRIP-009 | Return trip date picker: typed or chosen in a designed calendar, outbound and return date, with a "Tur och retur" switch, replacing the browser's date picker and the "Boka returresa" checkbox | Feature | Flight booking |
| | Search results for a flight search. Prices are shown as 0 kr until flights have prices per class | Feature | Flight booking |
| | Turn routes and departures into bookable flights with prices per class | Feature | Flight booking |
| | Booking a flight: passengers, contact, class and add-ons. The database rules (no overbooking, only allowed add-ons) already exist in `lib/bookings.ts` | Feature | Flight booking |
| | Destination pages, and browsing and searching destinations | Feature | Charter |
| | Searching for trips to a destination, and booking them. The arrival is worked out from the departure time and travel time in each airport's time zone, since the course data's arrival times don't follow summer time (see TRIP-007) | Feature | Charter |
| | Enter in the airport field before new suggestions have loaded chooses from the previous list (found in TRIP-001) | Fix | Flight booking |
| | Right after deleting an aircraft, its add-ons and classes briefly still look in use, and deleting them shows "Du kan ej ta bort" (found in TRIP-004) | Fix | Administration |
| TECH-004 | Remove `scripts/copy-to-prod.mjs` and `npm run copy-to-prod` once production and local data are kept separate | Tech | Administration |
| | A chatbot that answers questions from the user manual | Feature | Shared |
| | Switching between flight booking and charter on the site (to be designed with the product owner) | Feature | Shared |

## Decisions for charter

Settled with the product owner, to be written into the charter specifications:

- The course data is imported into **new tables of its own**: destinations, destination pages, photo credits, timetables and charter airports. The existing flight booking tables are not changed.
- **Photos stay as files** in `public/images/`. The database stores each photo's path, author, licence and source. Storing 31 MB of images in the database would make every page slower and couldn't be cached.
- **Timetables are used as they are** in `data/flights.json`. They are not regenerated or randomised, so the course's IDs and examples stay valid.
- **Prices** in the course data are in euros and are converted at 1 EUR = 10 SEK.

## Rules for all features

- **Language:** everything visitors see is in Swedish.
- **Prices:** stored as whole öre (SEK) and shown in kronor, for example "1 290 kr".
- **Time:** departure and arrival times are local time at each airport.
- **Dates:** a traveller can book from today up to six months ahead (`MAX_MONTHS_AHEAD` in `lib/dates.ts`). A return is on the same day as the outbound or later, at most two months after it. Charter trips can also only be booked within their timetable's period.
- **Errors:** an invalid value is shown in red, with a short red message under the field. Messages say what to do, not what went wrong in the code.
- **Course data** in `data/`, `knowledge/` and `public/images/` is read-only, and photos are always shown with their credit (author and licence).
- **Accessibility:** the site meets WCAG 2.2 level AA. Every field has a label, and everything can be done with the keyboard. A feature that changes what visitors see is checked with axe in its tests (`expectNoA11yViolations` in `tests/helpers.ts`) and with the manual checklist in `wiki/system/accessibility.md`, and the result is recorded in its `verification.md`. Both come with TRIP-008.
- **Mobile:** every page works on a phone screen.
- **Admin:** every admin page and action requires a valid sign-in. A sign-in lasts until the browser closes, at most 8 hours.
- **Data integrity:** something that is in use cannot be deleted (for example a cabin class on an aircraft), and the administrator is told why.

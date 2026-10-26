---
type: Product overview
title: Gurras Flyg
description: Purpose, product areas, terms, scope, features and shared rules of the Gurras Flyg booking site.
timestamp: 2026-10-24
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

## How we work

The site is built by **specification-driven development (SDD)**, the method the course teaches:

- **The requirements are the source of truth.** Each change starts as a card on the board ["Gurras Flyg"](https://github.com/users/gustavnymoen/projects/2), with a goal, a scope, numbered requirements (`TRIP-010-R1`, …) with acceptance criteria, and a test plan. It is built only when no open questions remain.
- **Code, tests and documentation follow from the requirements.** `specs/<ID>-<name>/solution.md` says how a card is built, each test is named after the requirement it checks, and the manual and the system documentation describe what was built.
- **Every requirement is traceable:** from the card, to its tests, to a row in the feature's `verification.md` that says how it was checked, where, with what result and when. When the feature is done, its requirements are copied into `verification.md` as built.
- **A requirement that turns out wrong is changed in the card first,** together with the product owner, and then in the code. Code and requirements never disagree.

The steps from card to deploy are in `CLAUDE.md`; how each kind of requirement is checked (unit tests, browser tests, smoke tests, accessibility, security and code review) is in [Testing](../wiki/system/testing.md).

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
| Route | A connection between two airports, flown in one direction, with a flight time. Every pair of airports has a route in each direction. |
| Departure | A time of day when a route is flown, with its own price per person, the same every date. A route has at least 5 departures a day. |
| Flight | One departure of a route on one date, with a flight number such as GF 2013. This is what a traveller searches for and books; the traveller also chooses its aircraft (TRIP-011). |
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

The finished features and technical tasks. Each one's folder `specs/<ID>-<name>/` describes how it was built and how it was verified. The ones finished before the board (TRIP-001 to TECH-007) keep their `spec.md` as history; TRIP-001 to TRIP-006 were specified after they were built, so theirs describes the site as it is.

What comes next, and the requirements of work not yet done, are on the board ["Gurras Flyg"](https://github.com/users/gustavnymoen/projects/2): the top card in Backlog is next.

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
| TECH-005 | All prices in whole kronor | Shared | Done |
| TECH-007 | Better pipeline: preview tests before merge, CI once per change, shared workflow setup, one whole-number parser | Shared | Done |
| TECH-008 | The backlog on a GitHub board: requirements in the cards, solution in the repo | Shared | Done |
| TRIP-007 | The course's charter data imported into the database, prices in whole kronor | Charter | Done |
| TRIP-008 | Visual design "Loungen", foundation: tokens, one font, shared components, axe check | Shared | Done |
| TRIP-019 | Visual design "Loungen", admin page: shared components in compact size, floating dialogs | Administration | Done |
| TRIP-020 | Visual design "Loungen", start page: wordmark header, new heading, background photo, smaller carousel, reduced motion, phone layout | Shared | Done |
| TECH-011 | Faster and healthier test suite: test jobs in the Playwright image, version check, `npm run test:time`, time budgets and quality rules | Shared | Done |
| TECH-010 | The old project folder in OneDrive deleted, after checking that nothing was only there | Shared | Done |
| TRIP-021 | Accessibility: WCAG 2.2 AA checklist, missing axe states, and the fixes it found (carousel focus, admin labels, dialogs, 320 px, review limits) | Shared | Done |
| TECH-003 | The bookable-date rule and its messages in a shared module, `lib/dates.ts` | Shared | Done |
| TRIP-009 | Return trip date picker: Utresa and Hemresa typed or chosen in the site's own calendar, the switch "Tur och retur" | Flight booking | Done |
| TRIP-022 | One border colour for cards and buttons: cards, review cards and buttons have the fields' border, the brass edge is removed, primary buttons have a faint wine red tone | Shared | Done |
| TRIP-016 | Deleted aircraft still looks in use: the server alone decides whether a class, add-on or aircraft is in use, so they can be deleted at once after the aircraft | Administration | Done |
| TECH-020 | Shared choice card and traveller plural: one `ChoiceCard` for the flight and aircraft cards, and `travellersText(n)` for "1 resenär" / "N resenärer" | Shared | Done |
| TECH-019 | Keep focus on the other round buttons: every `RoundButton` is `aria-disabled` when unavailable, so keyboard focus stays on it; `keepFocus` is gone | Shared | Done |
| TECH-017 | Limit admin sign-in attempts: 5 attempts per IP address in 15 minutes, counted in the database before the password is checked, with a message with the minutes left | Administration | Done |
| TECH-016 | SDD and the test strategy: "How we work" in this overview, `wiki/system/testing.md`, a test plan in every card | Shared | Done |
| TECH-013 | Security: security points and `/security-review` in the code review, a CI job with `npm audit`, Semgrep and Gitleaks, Dependabot, hardening from a review of the whole code base, the repo public | Shared | Done |
| TECH-012 | GitHub Actions v7 on Node.js 24, pinned to commits, monthly updates by Dependabot | Shared | Done |
| TECH-014 | Whole suite once in CI, read-only smoke tests against the preview and production via `deployment_status`, branch protection on `main` | Shared | Done |
| TECH-015 | Unit tests with Vitest next to the code, with their own test database; the tests without a browser moved there, fewer repeated browser cases | Shared | Done |
| TRIP-010 | Flight search results: the Sök button, the results page with a simulated search, flight cards, sorting and choosing outbound and return flights; routes between every pair of airports with a price per departure | Flight booking | Done |
| TRIP-011 | Choose aircraft and classes: `/flyg/plan` with an aircraft per flight (price, flight time, arrival, compared) and travellers per class, prices that follow every change, everything in the address; price and time factors in admin; the "från" price from the cheapest aircraft | Flight booking | Done |
| TRIP-024 | Aircraft in the summary, classes from zero: the chosen aircraft with flight time and arrival in Din resa, every class starting at 0, totals so far, no going on until everyone is placed, focus kept on Fler and Färre | Flight booking | Done |
| TRIP-026 | One choice at a time on the plan page: one card per flight, flight by flight; only aircraft with room, chosen with Välj; the classes under the chosen aircraft with a counter of travellers left; Klar folds the card; steps Flyg, Plan och klass, Resenärer | Flight booking | Done |
| TRIP-012 | Book a flight: Fortsätt when every flight is done; Resenärer with passengers, class and add-ons per flight, Dåliga nerver, the contact and three required questions; Betala with two payment methods; the booking saved with the database's prices, once per Betala; a summary with the booking number shown only in that tab; new booking tables | Flight booking | Done |
| TRIP-025 | Departures fill in from the top: the flight cards on `/flyg` fade in and slide down one after another (60 ms apart, the first ten delayed), not when sorting changes, none with reduced motion | Flight booking | Done |
| TRIP-027 | Detailed price list: the total on Betala and in the summary split into fuel, bribes, fees, closed airspace, insurance and 0 % tax, in whole kronor adding up to the total | Flight booking | Done |
| TRIP-018 | Switch between flight booking and charter: the tabs Flyg and Charter on the start page, the page `/charter`, one area at a time, and Avbryt with a question that throws away the booking | Shared | Done |

## Decisions for charter

Settled with the product owner, to be written into the charter cards' requirements:

- The course data is imported into **new tables of its own**: destinations, destination pages, photo credits, timetables and charter airports. The existing flight booking tables are not changed.
- **Photos stay as files** in `public/images/`. The database stores each photo's path, author, licence and source. Storing 31 MB of images in the database would make every page slower and couldn't be cached.
- **Timetables are used as they are** in `data/flights.json`. They are not regenerated or randomised, so the course's IDs and examples stay valid.
- **Prices** in the course data are in euros and are converted at 1 EUR = 10 SEK.

## Rules for all features

- **Language:** everything visitors see is in Swedish.
- **Prices:** stored and shown as whole kronor, for example "1 290 kr".
- **Time:** departure and arrival times are local time at each airport.
- **Dates:** a traveller can book from today up to six months ahead (`MAX_MONTHS_AHEAD` in `lib/dates.ts`). A return is on the same day as the outbound or later, at most two months after it. Charter trips can also only be booked within their timetable's period.
- **Errors:** an invalid value is shown in red, with a short red message under the field. Messages say what to do, not what went wrong in the code.
- **Course data** in `data/`, `knowledge/` and `public/images/` is read-only, and photos are always shown with their credit (author and licence).
- **Accessibility:** the site meets WCAG 2.2 level AA. Every field has a label, and everything can be done with the keyboard. A feature that changes what visitors see is checked with axe in its tests (`expectNoA11yViolations` in `tests/helpers.ts`) and with the manual checklist in `wiki/system/accessibility.md`, and the result is recorded in its `verification.md`. The axe helper comes with TRIP-008, the checklist with TRIP-021.
- **Mobile:** every page works on a phone screen.
- **Admin:** every admin page and action requires a valid sign-in. A sign-in lasts until the browser closes, at most 8 hours.
- **Data integrity:** something that is in use cannot be deleted (for example a cabin class on an aircraft), and the administrator is told why.

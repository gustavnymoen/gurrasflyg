# System documentation

How the site works, for developers. Start with the architecture.

## Overview

- [Architecture](architecture.md): The parts of Gurras Flyg, how they fit together, the database, environments and deploys.
- [Pipeline](pipeline.md): How a change goes from a branch to the live site: the GitHub workflows, Vercel's deploys, which checks run where, and the branch protection on main.
- [Testing](testing.md): How Gurras Flyg is tested: which kind of check verifies what, when it is written, where it runs, and the rules and time budgets for the tests.
- [Code review](code-review.md): Why and how every feature and technical task is reviewed before it is done, what the reviewer looks for and how strict the review is.
- [Accessibility](accessibility.md): How the site is kept at WCAG 2.2 level AA: the axe check in the tests, the manual checklist, and when a feature must go through it.
- [Design](design.md): How the design "Loungen" is built from tokens and shared components, the rules that keep it consistent and accessible, and where each part is described in DESIGN.md and tested.
- [Date picker](date-picker.md): The date fields Utresa and Hemresa in the search form, the calendar under them, and the date rules they use.
- [Search results](search-results.md): The flight search: the Sök button, the results page /flyg, its simulated search, flight cards, sorting and the steps for choosing flights, and the route and price data behind it.
- [Aircraft and classes](aircraft-and-classes.md): The page /flyg/plan, where the traveller chooses an aircraft and the travellers per class for each chosen flight, and the price and time factors behind its prices, flight times and the "från" price.
- [Flows](flows.md): How the start page separates flight booking and charter, why a traveller in one cannot reach the other, and how Avbryt throws away the booking.
- [Charter destinations](charter-destinations.md): The page /charter with search and filters, the destination pages /charter/<id>, and the price, airport and notice for destinations without flights.
- [Booking](booking.md): The steps Resenärer and Betala after /flyg/plan, the summary with the booking number, how the form is kept in the tab, how a booking is checked, priced and saved, and the booking tables.
- [My booking](my-booking.md): The menu, the page Min bokning where a traveller finds a flight or charter booking by its number and the contact's last name and cancels parts of it in a 50/50 lottery, the guess limit, the 24 hour rule and the cancellation tables.
- [Administration](admin.md): The admin page /admin where the administrator manages cabin classes, add-ons and aircraft (and reviews), how every change is checked and saved on the server, what counts as "in use", and the route data the admin no longer assigns aircraft to.
- [Admin sign-in](admin-sign-in.md): How the administrator signs in and out, the signed session cookie, the three places that check it, and the limit on wrong passwords per IP address.
- [Reviews](reviews.md): The carousel of reviews on the start page and the card Omdömen in admin where the administrator creates and deletes them, with the limits on length and how they are checked and stored.
- [Security headers](security-headers.md): The Content Security Policy, Permissions-Policy and HSTS that every response carries, why the policy keeps 'unsafe-inline', and what a strict policy would need.
- [Rate limits](rate-limits.md): The limits per IP address on sign-in, Min bokning, Betala and the API routes, how they are counted in the database, and what is not limited.
- [Charter booking](charter-booking.md): The search form on a destination page, the results, the steps Resenärer and Betala, the three extras, the summary, how a charter booking is checked and saved, and the charter booking tables.

## Data

- [Flight timetables](data-flights.md): Sample flight timetables between Stockholm Arlanda or Copenhagen and the airports used by the destinations, in both directions, November 2026 to April 2027.
- [Charter data](data-charter.md): The tables that hold the course's charter data (airports, destinations, pages, photo credits and timetables), how they are generated from the course files, and their rules.

## API endpoints

- [GET /api/airports](api-airports.md): Searches the airline's airports by name or IATA code, for the autocomplete in the search form.
- [GET /api/destinations](api-destinations.md): Returns all destinations with their location, category, access, airports and photo.
- `GET /api/destination-search?q=`: up to five destinations for the search field on `/charter`, described on the Charter destinations page above.

## Features


Each feature's requirements and how they were verified are in `specs/<feature>/`:

| Feature | Area | Folder |
|---|---|---|
| TRIP-001 Flight search form | Flight booking | `specs/TRIP-001-flight-search-form/` |
| TRIP-002 Admin sign-in | Administration | `specs/TRIP-002-admin-sign-in/` |
| TRIP-003 Admin: cabin classes and add-ons | Flight booking | `specs/TRIP-003-admin-classes-and-addons/` |
| TRIP-004 Admin: aircraft | Flight booking | `specs/TRIP-004-admin-aircraft/` |
| TRIP-005 Routes, departures and aircraft assignment | Flight booking | `specs/TRIP-005-routes-and-aircraft-assignment/` |
| TRIP-006 Reviews | Shared | `specs/TRIP-006-reviews/` |
| TRIP-007 Import the course data | Charter | `specs/TRIP-007-import-course-data/` |
| TRIP-008 Visual design: foundation | Shared | `specs/TRIP-008-visual-design/` |
| TRIP-009 Return trip date picker | Flight booking | `specs/TRIP-009-return-trip-datepicker/` |
| TRIP-016 Deleted aircraft still looks in use | Administration | `specs/TRIP-016-deleted-aircraft-in-use/` |
| TRIP-019 Visual design: admin page | Administration | `specs/TRIP-019-admin-design/` |
| TRIP-020 Visual design: start page | Shared | `specs/TRIP-020-start-page-design/` |
| TRIP-021 Accessibility: WCAG 2.2 AA | Shared | `specs/TRIP-021-wcag/` |
| TRIP-010 Search results | Flight booking | `specs/TRIP-010-search-results/` |
| TRIP-011 Choose aircraft and classes | Flight booking | `specs/TRIP-011-aircraft-and-classes/` |
| TRIP-024 Aircraft in the summary, classes from zero | Flight booking | `specs/TRIP-024-summary-and-classes/` |
| TRIP-026 One choice at a time on the plan page | Flight booking | `specs/TRIP-026-one-choice-at-a-time/` |
| TRIP-012 Book a flight | Flight booking | `specs/TRIP-012-book-a-flight/` |
| TRIP-018 Switch between flight booking and charter | Shared | `specs/TRIP-018-start-tabs/` |
| TRIP-028 Clickable destination cards, no start cards | Charter | `specs/TRIP-028-clickable-cards/` |
| TRIP-013 Charter: Destination pages and search | Charter | `specs/TRIP-013-destination-pages/` |
| TRIP-014 Search and book charter trips | Charter | `specs/TRIP-014-charter-booking/` |

[Wiki](../index.md)

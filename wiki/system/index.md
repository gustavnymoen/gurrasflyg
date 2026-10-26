---
type: Index
title: System documentation
description: How Gurras Flyg is built: architecture, data, API endpoints and features.
timestamp: 2026-10-24
---

# System documentation

How the site works, for developers. Start with the architecture.

## Overview

- [Architecture](architecture.md): the parts of the site, the database, environments and deploys.
- [Pipeline](pipeline.md): how a change goes from a branch to the live site: the workflows, Vercel's deploys, which checks run where, and the branch protection on `main`.
- [Testing](testing.md): how the site is tested: unit tests, browser tests, smoke tests, accessibility, security and code review, and the rules and time budgets for the tests.
- [Code review](code-review.md): how every feature is reviewed before it is done.
- [Accessibility](accessibility.md): how the site is kept at WCAG 2.2 AA: the axe check in the tests and the manual checklist.
- [Design](../../DESIGN.md): the design "Loungen": tokens, shared components, rules and how to change them.
- [Date picker](date-picker.md): the date fields Utresa and Hemresa, the calendar, and the date rules in `lib/dates.ts`.
- [Search results](search-results.md): the Sök button, the results page `/flyg`, choosing flights, and the routes, departures and prices behind it.
- [Aircraft and classes](aircraft-and-classes.md): the page `/flyg/plan`, choosing an aircraft and the travellers per class for each flight, and the price and time factors.
- [Booking](booking.md): the steps Resenärer and Betala, the summary, how the booking is checked and saved, and the booking tables.

## Data

- [Flight timetables](data-flights.md): the course's sample timetables to and from ARN and CPH, in `data/flights.json`.
- [Charter data](data-charter.md): the course data in the database: airports, destinations, pages, photo credits and timetables.

## API endpoints

- [GET /api/airports](api-airports.md): airport search for the search form (flight booking).
- [GET /api/destinations](api-destinations.md): all destinations from the course data (charter).

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

[Wiki](../index.md)

---
type: Index
title: System documentation
description: How Gurras Flyg is built: architecture, data, API endpoints and features.
timestamp: 2026-10-22
---

# System documentation

How the site works, for developers. Start with the architecture.

## Overview

- [Architecture](architecture.md): the parts of the site, the database, environments and deploys.
- [Code review](code-review.md): how every feature is reviewed before it is done.
- [Design](../../DESIGN.md): the design "Loungen": tokens, shared components, rules and how to change them.

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

[Wiki](../index.md)

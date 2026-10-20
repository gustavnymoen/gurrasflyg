---
type: Index
title: System documentation
description: How Gurras Flyg is built: architecture, data, API endpoints and features.
timestamp: 2026-10-20
---

# System documentation

How the site works, for developers. Start with the architecture.

## Overview

- [Architecture](architecture.md): the parts of the site, the database, environments and deploys.

## Data

- [Flight timetables](data-flights.md): the course's sample timetables to and from ARN and CPH, in `data/flights.json`.

## API endpoints

- [GET /api/airports](api-airports.md): airport search for the search form (flight booking).
- [GET /api/destinations](api-destinations.md): all destinations from the course data (charter).

## Features

Each feature's requirements and how they were verified are in `specs/done/<feature>/`:

| Feature | Area | Spec |
|---|---|---|
| TRIP-001 Flight search form | Flight booking | `specs/done/TRIP-001-flight-search-form/` |
| TRIP-002 Admin sign-in | Administration | `specs/done/TRIP-002-admin-sign-in/` |
| TRIP-003 Admin: cabin classes and add-ons | Flight booking | `specs/done/TRIP-003-admin-classes-and-addons/` |
| TRIP-004 Admin: aircraft | Flight booking | `specs/done/TRIP-004-admin-aircraft/` |
| TRIP-005 Routes, departures and aircraft assignment | Flight booking | `specs/done/TRIP-005-routes-and-aircraft-assignment/` |
| TRIP-006 Reviews | Shared | `specs/done/TRIP-006-reviews/` |

[Wiki](../index.md)

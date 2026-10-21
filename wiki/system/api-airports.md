---
type: API endpoint
title: GET /api/airports
description: Searches the airline's airports by name or IATA code, for the autocomplete in the search form.
resource: app/api/airports/route.ts
feature: TRIP-001
tags: [airports, search, flight-booking]
timestamp: 2026-10-20
---

# Request

`GET /api/airports?q=<text>`

| Parameter | Meaning |
|---|---|
| `q` | Text to search for. Leading and trailing spaces are ignored. |

# Response

Status 200 with a JSON array of at most 5 airports from the table `airports` whose name or IATA code contains `q`, regardless of case. Airports whose name starts with `q` come first, then the rest alphabetically by name. An empty or missing `q` gives `[]`.

| Field | Meaning |
|---|---|
| `id` | The airport's id in the database. |
| `name` | Name, for example "Stockholm Arlanda". |
| `iata` | Three-letter IATA code. |
| `country` | Country, in Swedish. |
| `timezone` | IANA time zone, for example `Europe/Stockholm`. |

```json
[
  { "id": 10, "name": "London Heathrow", "iata": "LHR", "country": "Storbritannien", "timezone": "Europe/London" }
]
```

`%` and `_` in `q` are matched literally, not as SQL wildcards.

# Related

- Code: `app/api/airports/route.ts`, `searchAirports` in `lib/db.ts`
- Used by: `app/components/SearchForm.tsx` through `app/components/Autocomplete.tsx`
- Spec: `specs/TRIP-001-flight-search-form/spec.md` (TRIP-001-R2, R10)
- Tests: `tests/TRIP-001-flight-search-form.spec.ts`

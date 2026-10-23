---
type: API endpoint
title: GET /api/destinations
description: Returns all destinations with their location, category, access, airports and photo.
resource: app/api/destinations/route.ts
tags: [destinations, data]
timestamp: 2026-10-21
---

# Request

`GET /api/destinations`

No parameters.

# Response

Status 200 with a JSON array of all destinations, sorted by `id`. The destinations are read from the database ([Charter data](data-charter.md)), which is imported from the course data; the response is the same as `data/destinations.json`. Each item has its fields:

| Field | Meaning |
|---|---|
| `id` | Stable identifier of the destination, also the name of its page. |
| `title`, `aliases` | Name of the destination and other names it is known by. |
| `description` | One-sentence summary. |
| `continent`, `country`, `country_name`, `region`, `locality` | Where it is. `country` is an ISO 3166 code. |
| `category`, `access` | Kind of place and whether it can be visited. The allowed values are listed in `knowledge/index.md`. |
| `nearest_airport` | Nearest airport with scheduled flights: `iata`, `name` and `distance_km` (`null` when the only route is a long sea voyage). |
| `gateway_airport` | Main international airport, when different from the nearest airport; otherwise `null`. |
| `transport` | Ways of getting there from the airport. |
| `tags` | Free keywords. |
| `status_checked` | Date the access status was last checked, or `null`. |
| `image` | Photo of the destination: `src` (its address on the site, under `/images/`), `author`, `license`, `license_url` (`null` for public domain) and `source` (the photo's page on Wikimedia Commons). `null` if the destination has no photo. Most of the licences require the author and licence to be shown with the photo. |
| `path` | The destination's page, for example `knowledge/europe/germany/teufelsberg.md`. |

Example item, shortened:

```json
{
  "id": "denniston",
  "title": "Denniston",
  "continent": "Oceania",
  "country": "NZ",
  "country_name": "New Zealand",
  "category": "Ghost town or village",
  "access": "Open",
  "nearest_airport": { "iata": "WSZ", "name": "Westport Airport", "distance_km": 25 },
  "gateway_airport": { "iata": "CHC", "name": "Christchurch International Airport" },
  "image": {
    "src": "/images/denniston.jpg",
    "author": "Mike Dickison",
    "license": "CC BY 4.0",
    "license_url": "https://creativecommons.org/licenses/by/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Denniston_MRD_04.jpg"
  },
  "path": "knowledge/oceania/new-zealand/denniston.md"
}
```

# Related

- Code: `app/api/destinations/route.ts`, `lib/travel.ts`
- Data: the [charter tables](data-charter.md), imported from `data/destinations.json` and the [destination pages](../../knowledge/index.md)
- Flights to the destinations' airports: [Flight timetables](data-flights.md)
- Photos: `public/images/`
- Tests: the smoke test `TECH-014-R2 @smoke the charter data answers with destinations` in `tests/TECH-014-smoke-tests.spec.ts` checks that the endpoint responds; `tests/TRIP-007-import-course-data.spec.ts` (TRIP-007-R9) that the response equals the course data, locally and on the live site

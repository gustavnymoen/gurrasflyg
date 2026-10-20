---
type: Index
title: "Destinations"
description: "Urban exploration destinations around the world: abandoned towns, industrial sites, Cold War relics and more."
timestamp: 2026-10-13
---

# Destinations

Pages about urban exploration destinations: places that were abandoned, emptied or left to decay, and that can still be visited, seen from outside, or were visitable until recently.

This is sample content. Descriptions are written from general knowledge, and travel details such as airports, distances and travel times are approximate. Do not rely on it for real travel planning.

## How the pages are organised

- One page per destination, in a folder for its continent and country: `<continent>/<country>/<destination-id>.md`.
- Every folder has an `index.md` listing what it contains.
- Each page starts with fields (frontmatter) and continues with three sections: **Overview**, **Getting there** (from the nearest airport) and **Visiting**.

## Fields on a destination page

| Field | Meaning |
|---|---|
| `id` | Stable identifier, also the file name. Use it for links and references. |
| `title`, `aliases` | Name of the destination and other names it is known by. |
| `description` | One-sentence summary. |
| `continent`, `country`, `country_name`, `region`, `locality` | Where it is. `country` is an ISO 3166 code. |
| `category` | One of the categories below. |
| `access` | One of the access values below. |
| `nearest_airport` | Nearest airport with scheduled flights: IATA code, name and approximate distance in km by the usual route (`null` when the only route is a long sea voyage). |
| `gateway_airport` | Main international airport, when different from the nearest airport; otherwise `null`. |
| `transport` | Ways of getting there from the airport. |
| `tags` | Free keywords. |
| `status_checked`, `status_source` | Date and source of the last check of the access status; `null` if not checked. |
| `image` | Photo of the destination: `src` (its address on the site; the file is in `public/images/`), `author`, `license`, `license_url` (`null` for public domain) and `source` (the photo's page on Wikimedia Commons). `null` if there is no photo. |

## Categories

- Ghost town or village
- Industrial site
- Military or Cold War site
- Prison
- Hospital or sanatorium
- Abandoned resort or hotel
- Amusement park or Olympic site
- Monument or memorial
- Underground
- Wreck or film set
- Disused railway
- Castle or mansion
- Abandoned public building

## Access values

- **Open:** open to the public, sometimes with an entry fee.
- **Open on set days:** open only on certain days or in certain seasons.
- **Guided tour:** can only be visited on a guided tour.
- **Exterior only:** can be seen from outside or from public ground, but not entered.
- **Closed:** cannot currently be visited.

## Transport values

`plane`, `train`, `metro`, `tram`, `bus`, `car`, `taxi`, `walk`, `ferry`, `boat tour`, `cruise`, `4x4 tour`, `cable car`, `snowmobile`

## Conventions

- Continents follow common travel usage: Cyprus and Georgia are listed under Europe, Türkiye under Asia, Central America and the Caribbean under North America, and the sub-Antarctic islands under Antarctica.
- Overseas territories are listed as their own country, with their ISO code, for example Svalbard (SJ), Martinique (MQ) and South Georgia (GS).
- For destinations reached only by sea, `nearest_airport` is the airport for the usual port of departure.

## Continents

- [Europe](europe/index.md): 47 destinations
- [Asia](asia/index.md): 15 destinations
- [Africa](africa/index.md): 3 destinations
- [North America](north-america/index.md): 22 destinations
- [South America](south-america/index.md): 5 destinations
- [Oceania](oceania/index.md): 2 destinations
- [Antarctica](antarctica/index.md): 2 destinations

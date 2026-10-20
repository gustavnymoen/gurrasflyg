---
type: Data file
title: Flight timetables
description: Sample flight timetables between Stockholm Arlanda or Copenhagen and the airports used by the destinations, in both directions, November 2026 to April 2027.
resource: data/flights.json
tags: [search, data, flights]
timestamp: 2026-10-19
---

# Flight timetables

`data/flights.json` lists the trips that can be booked from Stockholm Arlanda (ARN) and Copenhagen (CPH), and back, between 1 November 2026 and 30 April 2027. `data/airports.json` gives the name and location of every airport code used.

This is sample data. The airlines and the direct routes are real, but departure times, flight numbers and prices are invented. Do not use it for real travel planning. The content is stable, so acceptance criteria and tests can refer to trips by ID.

# One record per timetable

Each record is the timetable for one trip, direct or with changes, that runs on certain weekdays during a period. A trip that runs twice a week for six months is one record, not about 50 single flights.

Every outbound timetable has a return timetable on the same route in reverse, with its own times. A return flight usually has the outbound flight number plus one, for example `LH1570` out and `LH1571` back.

A direct flight on weekdays:

```json
{
  "id": "ARN-BER-EW488",
  "airline": "Eurowings",
  "flights": ["EW488"],
  "from": "ARN",
  "to": "BER",
  "via": [],
  "valid_from": "2026-11-01",
  "valid_to": "2027-04-30",
  "days": ["Mon", "Tue", "Wed", "Thu", "Fri"],
  "departs": "07:00",
  "arrives": "08:40",
  "arrival_day": 0,
  "duration_min": 100,
  "price_eur": 129
}
```

A trip with a change in Frankfurt, four days a week:

```json
{
  "id": "ARN-WDH-LH1570",
  "airline": "Lufthansa",
  "flights": ["LH1570", "4Y653"],
  "from": "ARN",
  "to": "WDH",
  "via": ["FRA"],
  "valid_from": "2026-11-01",
  "valid_to": "2027-04-30",
  "days": ["Mon", "Wed", "Fri", "Sun"],
  "departs": "06:25",
  "arrives": "21:25",
  "arrival_day": 0,
  "duration_min": 840,
  "price_eur": 629
}
```

# Fields

| Field | Meaning |
|---|---|
| `id` | Stable ID of the timetable: departure airport, arrival airport and first flight number. |
| `airline` | The airline that sells the trip. Some legs are flown by partner airlines. |
| `flights` | Flight number of each leg, in order. The same flight number can appear in several timetables, for example as the first leg of different connections. |
| `from` | Departure airport. |
| `to` | Arrival airport. |
| `via` | Airports where the traveller changes planes, in order. Empty for a direct flight. |
| `valid_from`, `valid_to` | First and last date the timetable runs, both included, as `YYYY-MM-DD`. |
| `days` | Weekdays the trip departs: `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, `Sun`. |
| `departs` | Departure time as `HH:MM`, local time at the departure airport. |
| `arrives` | Arrival time as `HH:MM`, local time at the arrival airport. |
| `arrival_day` | Days from the departure date to the arrival date: 0 is the same day, 1 the next day. |
| `duration_min` | Total travel time in minutes, including changes. Use it instead of subtracting the times, which are in different time zones. |
| `price_eur` | One-way price per person in euros. The same on every date. |

# When a trip runs

A timetable matches a search from one airport to another on a date when:

1. `from` and `to` are the searched airports,
2. the date is between `valid_from` and `valid_to`, both included, and
3. the weekday of the date is one of `days`.

The date and its weekday are those of the departure, at the departure airport. The arrival date is the departure date plus `arrival_day`.

One trip on one date is identified by the timetable `id` plus the date, for example `ARN-BER-EW488` on 2027-01-11.

# Examples from the data

| Search | Trips |
|---|---|
| ARN to BER, Monday 2027-01-11 | `ARN-BER-SK1122`, `ARN-BER-EW488`, `ARN-BER-SK2291`, `ARN-BER-DY6077` |
| ARN to BER, Saturday 2027-01-16 | `ARN-BER-SK1122`, `ARN-BER-SK2291`, `ARN-BER-DY6077` (`ARN-BER-EW488` runs on weekdays only) |
| ARN to WDH, Wednesday 2027-01-13 | `ARN-WDH-LH1570` |
| ARN to WDH, Tuesday 2027-01-12 | None: the trip runs on Mondays, Wednesdays, Fridays and Sundays |
| CPH to HER, Wednesday 2027-01-13 | `CPH-HER-A3596`, with a change in Athens |
| CPH to HER, Sunday 2027-04-18 | `CPH-HER-A3596`, and the direct summer route `CPH-HER-SK1642`, which starts on 15 April |
| CPH to PSP, Tuesday 2026-12-01 | None: the route runs from 17 December to 24 April |
| BER to ARN, Friday 2027-01-15 | `BER-ARN-SK1123`, `BER-ARN-EW489`, `BER-ARN-SK2292`, `BER-ARN-DY6078` |
| BER to ARN, Saturday 2027-01-16 | `BER-ARN-SK1123`, `BER-ARN-SK2292`, `BER-ARN-DY6078` (`BER-ARN-EW489` runs on weekdays only) |
| WDH to ARN, Wednesday 2027-01-20 | `WDH-ARN-4Y654`, with a change in Frankfurt |

# Things to know

- Some routes are seasonal. Several summer routes start on 28 March or in mid-April, and a few run only in winter. A search outside their period finds nothing.
- One end of every trip is ARN or CPH. The other end is always the `nearest_airport` or `gateway_airport` of at least one destination.
- Every destination can be reached from both ARN and CPH, and back, through its nearest or main international airport, except Chernobyl: Ukrainian airspace is closed, so there are no flights to Kyiv (KBP).
- When a destination's nearest airport has no flights, use its main international airport (`gateway_airport`). For example, Kolmanskop's nearest airport is Lüderitz (LUD), but the flights go to Windhoek (WDH).

# Airports

`data/airports.json` has one record for every airport code used in `data/flights.json` or by the destinations:

```json
{
  "iata": "WDH",
  "name": "Hosea Kutako International Airport",
  "city": "Windhoek",
  "country": "NA",
  "country_name": "Namibia",
  "latitude": -22.48,
  "longitude": 17.47,
  "timezone": "Africa/Windhoek"
}
```

`country` is an ISO 3166 code and `timezone` an IANA time zone name.

# Related

- Destinations and their airports: `data/destinations.json`, generated from the [destination pages](../../knowledge/index.md)

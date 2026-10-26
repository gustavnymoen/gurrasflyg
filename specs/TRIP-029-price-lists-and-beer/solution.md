---
id: TRIP-029
title: Price lists per area and beer from 18
card: "#93"
depends_on: [TRIP-012, TRIP-014, TRIP-027]
---

# TRIP-029 Price lists per area and beer from 18: solution

How it is built. What is built and why is in the card: `gh issue view 93`. How it works is in [wiki/system/booking.md](../../wiki/system/booking.md) and [wiki/system/charter-booking.md](../../wiki/system/charter-booking.md).

## Data

None. The price lists are calculated, and the rule for beer reads the add-on's name.

## Interface

- **`priceList(total, area)`** in `lib/booking-rules.ts`: the shares per area, `"flight"` (Bränsle 40, Mutor 20, Diverse ospecificerade avgifter 20, Stänga luftrummet vid avgång och ankomst 10, Försäkring 10, Skatt 0) or `"charter"` (Bränsle 40, Mutor 30, Diverse ospecificerade avgifter 20, Försäkring 10, Skatt 0) (R1, R2). The remainder still goes to Bränsle.
- **`PriceList`** and **`PayCard`** take `area`: `"flight"` on `/flyg/boka/betala` and `/flyg/bokad`, `"charter"` on charter's Betala and summary.
- **`isBeer()`, `isAdult()`, `ADULT_AGE`, `withoutBeerUnder18()`** in `lib/booking-rules.ts` (R3, R4). `ADULT_AGE` moved there from `lib/charter-rules.ts`, which now imports it, so charter's Dryckespaket XXXL and the beer use one limit.
- **`travellerProblems()`** adds "Öl går bara att köpa från 18 år." on the passenger's age for beer under 18. The form never gets there (it removes the beer), but the server checks the booking with the same function, so it refuses one (R3).
- **`TravellersForm`**: the beer row says "Från 18 år" and its + is disabled for a passenger without an age or under 18; changing the age to under 18 removes the beer on every flight and shows "Ölen togs bort eftersom passageraren är under 18 år." in the card (`role="status"`, always on the page so screen readers read it when it appears; visually hidden while empty) (R3, R4).

## Decisions

- **The rule is for the add-on named Öl**, chosen by the user over an age limit per add-on in admin: simpler, but renaming the add-on in admin turns the rule off. Case and surrounding spaces don't matter.
- **No age counts as under 18** for beer: + waits until an age of 18 or more is chosen, so a booking can never reach Betala with beer for someone unknown.
- **The text stays until the age is 18 or more again,** so it isn't gone before it has been read; it is a status, read out when it appears.
- **Charter's Betala used the flights' `PayCard`,** so the area is passed to it rather than charter getting its own copy.

---
id: TECH-029
title: Audit cleanups
card: "#113"
depends_on: [TECH-028]
---

# TECH-029 Audit cleanups: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 113`.

## Data

None. No migration; the queries read the same tables.

## Interface

None. Visitors see no change; the texts and errors are the same.

## Decisions

- **One destination (R1).** `getDestinations()` became `readDestinations(id?)` in `lib/travel.ts`; with an id every query (the destination, aliases, tags, transport, photo) gets a `WHERE`, without it they read everything as before. `getDestinations()` is `readDestinations()`, so the list and the single read use the same mapping and cannot drift apart. `getFares()` still reads all airports, as decided in the card.
- **Shared booking code (R2).** `lib/booking-common.ts` holds `BookingError`, `INVALID`, `randomBookingCode()`, `newBookingNumber(tx, table, prefix)`, `findBookingByRequestId(tx, table, requestId)` and `bookingFailure(e)`. The table is typed as `"bookings" | "charter_bookings"`, so it can only come from the code, and the queries carry the same `nosemgrep` note as `listQuery`.
- **`CharterBookingError extends BookingError`.** Nothing needs to tell them apart any more, since the actions use `bookingFailure()`, but the card keeps the subclass and the charter code still throws it. `lib/bookings.ts` re-exports `BookingError` because `lib/bookings.test.ts` imports it from there and may not change.
- **`CHANGED` stays per flow.** The two texts differ (they send the visitor back to different steps), so only `INVALID`, which is the same, moved.
- **Tests.** `lib/booking-common.test.ts` mocks `randomInt` to get a taken number and a free one without waiting for chance. `lib/reviews.test.ts` marks its reviews with the title "unit" and deletes them afterwards, since the table has sample reviews.

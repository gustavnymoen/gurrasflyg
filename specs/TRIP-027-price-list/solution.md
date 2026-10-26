---
id: TRIP-027
title: Detailed price list
card: "#73"
depends_on: [TRIP-012]
---

# TRIP-027 Detailed price list: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 73`.

## Data

None. The rows are calculated from the total, which is already saved (`bookings.total`), so there is no migration.

## Interface

- **`priceList(total)`** in `lib/booking-rules.ts` (R1) splits a total into the rows of `PRICE_LIST_SHARES`: Bränsle 40 %, Mutor 20 %, Alla möjliga avgifter 20 %, Stänga luftrummet vid avgång och ankomst 10 %, Försäkring 10 %, Skatt 0 %. Each row is rounded down to whole kronor and the remainder goes to Bränsle, so the rows always add up to the total.
- **`PriceList`** (`app/flyg/PriceList.tsx`, R2, R3, R4) is a description list (`<dl>`) of label and sum, shown by `PaymentForm` under "Att betala" and by `BookedSummary` above "Totalt". Only the tax row shows its percent ("Skatt 0 %").

## Decisions

- **Calculated, not stored.** The split is a joke on top of the total, not part of the booking, so nothing is saved and an old booking would show the same list. The summary uses the total from the saved booking.
- **The remainder goes to Bränsle**, the biggest row, so the shares look right and the list still adds up. A total under 5 kr is all fuel; that is fine.
- **Percent only on the tax row**, as the card asks; the other shares live in `PRICE_LIST_SHARES` and are not shown.
- **Shared test helpers.** The functions that fill in the booking page and clean up bookings moved from the TRIP-012 test to `tests/plan.ts`, since the TRIP-027 test needs them too.

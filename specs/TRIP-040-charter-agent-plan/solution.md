---
id: TRIP-040
title: Booking agent: aircraft and classes in charter
card: "#135"
depends_on: [TRIP-030, TRIP-039]
---

# TRIP-040 Booking agent: aircraft and classes in charter: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 135`. The agent mode is described in [wiki/system/charter-chatbot.md](../../wiki/system/charter-chatbot.md), the plan step in [wiki/system/charter-booking.md](../../wiki/system/charter-booking.md).

## Data

None.

## Interface

No new page. Agneta's tools, the page text and the actions know the plan step `/charter/<id>/plan`. Her answers are in her own voice (the rules in `AGENT_RULES`, `lib/agent.ts`).

- **Steps:** results → plan → Resenärer → payment. The shortcut (`show_plan`) opens the plan step with both trips chosen; she goes on with `show_travellers` only when aircraft and classes are set for both trips.
- **Tools** (`lib/agent-tools.ts`): `show_plan` (new; the old `show_travellers` with trip arguments), `list_aircraft`, `set_plan`, `list_addons`, `set_addons`; `show_travellers` now has no arguments and works on the page she is on.
- **Action** `addons` (`lib/agent-rules.ts`): `{ legKeys, passengers }`, every traveller's class and add-ons per trip. `/plan` is an allowed address (`isAgentUrl`, `safeActions`).
- **Page text** (`lib/agent-page.ts`): the plan step is "the plan step", and every trip page tells the chosen aircraft and travellers per class for each trip (no personal data).

## Logic

- **`lib/agent-plan.ts`** has what does not depend on charter: `aircraftText(fleet, price, travellers)` (the aircraft that seat the party, cheapest first, with room and price per person for each class, from `fare()`; no flight time) and `checkPlan(fleet, travellers, aircraftId, classes)` (the aircraft seats the party, each class once and known, none over its room, the numbers add up to the travellers; otherwise a text for the model). Only the departure's price and the fleet go in, so a flight agent (TRIP-036) calls the same.
- **Charter's part** is in `lib/agent-tools.ts`: `chosenPage()` reads the page she is on (`state.url`) with `readPage()` and requires both trips; `setPlan` writes the checked plan into the choice of that page and opens the plan step with `planUrl()`. Because every tool works on `state.url` (which `go()` updates), several calls in one answer chain: `show_plan`, `list_aircraft`, two `set_plan`, `show_travellers`.
- **Add-ons:** `set_addons` builds the form's legs with `fitCharterForm()` from the page's `legs` (classes in the order the plan step gives them) and gives every traveller the wanted count of each add-on that exists in their class on each trip. The chat (`withAddons()` in `app/components/chatAgent.ts`) writes them into the saved form together with the trips' keys, so the form keeps them while trips, aircraft and numbers are the same (TRIP-039-R8). `set_plan` clears a pending `addons` action of the same answer.
- **Price summary:** `summarise` uses `charterTotal()` with the legs, so the seats of the classes and the extras are counted, and the add-ons she set in this answer. Add-ons set in an earlier answer are in the visitor's form, which the server never sees; the text says so, and the page shows the total with them.
- **`canBook()`** requires `legs` (aircraft and classes for both trips), not only both trips.

## Decisions

- **Shared tools, written here.** The card said the tools are those of TRIP-036 "or extended here". TRIP-036 is not built, so the parts that do not depend on charter are in `lib/agent-plan.ts` and the page-bound tools are named without "charter" (`list_aircraft`, `set_plan`, `set_addons`); TRIP-036 adds its page reader and its own address to them.
- **No time factor.** `readCharter()` already sets every aircraft's `timePercent` to 100, and `aircraftText()` gives no flight time at all; the rules tell her never to quote one.
- **Beer is not set by her.** The age rule needs the travellers' ages, which she never sees (TRIP-030-R7); the tool refuses it and the visitor chooses beer in the form.
- **Add-ons per traveller, on both trips.** One answer from the visitor ("two meals") becomes the same count for everybody where it exists; anything finer is done on the page.
- **Known bug on the plan step, not here.** Every card shows "Snabbast" because the flight times are equal: card TRIP-042.

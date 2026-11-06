---
id: TRIP-038
title: The agent takes the visitor to the payment step
card: "#133"
depends_on: [TRIP-030, TRIP-040, TRIP-041]
---

# TRIP-038 The agent takes the visitor to the payment step: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 133`.

## Data

None.

## Interface

- **New tool `show_payment`** (`lib/agent-tools.ts`). Opens the payment page with `paymentUrl()` and the same search and choice as `show_travellers`. Refused (error text to the model) until aircraft and classes are set for both trips, and until the traveller form is valid (`state.valid`, from the page context): the payment page itself shows "Fyll i resenärerna först." for an invalid form, so opening it earlier would only send the visitor to a dead end.
- **`AGENT_RULES`** (`lib/agent.ts`): on Resenärer she asks about add-ons and extras once and does not ask about payment; with a valid form she opens the payment page, asks there, sets the choice with `set_payment`, sums up with `summarise`, asks the visitor to check it, and only then ends with the marker `[[BOOK]]`.
- **`canBook()`** (`lib/agent.ts`) and **`bookNow()`** (`app/components/chatAgent.ts`): the button is offered, and works, on the payment page only (`/charter/<id>/boka/betala`). Before, Resenärer counted too.
- **The fake agent** (`lib/chat-mock.ts`): `TILLAGG` sets extras only; new `BETALSIDAN` (`show_payment`) and `BETALSATT` (`set_payment` cash).

No new action type: the payment method is still the `payment` action, written to the form in the tab, which the payment page reads (`useStored`) and shows.

## Decisions

- **A tool for the page, not a rule in `show_travellers`.** The card says she "opens the payment page"; a separate tool keeps each tool one step of the booking, like `show_plan` and `show_travellers`, and lets the check on the form sit in one place.
- **The check on the server and in the browser.** `canBook()` decides if the answer may carry the button; `bookNow()` checks the page again when the button is pressed, so a visitor who moved to Resenärer meanwhile cannot book from there.
- **Changed page (R1, third criterion).** Unchanged from TRIP-030-R4: the answer's actions are dropped if the page or the choices changed since the question. Nothing new was needed.
- **Tried by hand with the real model:** not done in this session, see `verification.md`.

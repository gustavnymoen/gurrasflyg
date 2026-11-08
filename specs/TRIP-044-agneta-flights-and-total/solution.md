---
id: TRIP-044
title: Agneta and ordinary flights, and the total in her summary
card: "#153"
depends_on: [TRIP-030, TRIP-036, TRIP-037, TRIP-040]
---

# TRIP-044 Agneta and ordinary flights, and the total in her summary: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 153`.

## Data

None. No table or migration.

## Interface

- **The plain chat's instructions** (`INSTRUCTIONS` in `lib/chat-prompt.ts`), three places: the intro no longer says "and nothing else" but that she can search and book ordinary flights with the tools of the button; the decline rule says ordinary flights are *not* declined (she does not know departures, times and prices off the top of her head, never guesses them, can search and book, ends with `[[HELP]]`; the tab Flyg is at most an alternative); the "no tools" rule says she can neither search nor book a flight there and never invents what a search would give.
- **`POST /api/chat`**: the agent context gets two optional fields, `choice` (`{ legKeys, passengers }`, the shape of the `addons` action) and `nerves` (an integer 0 to 10). `parseAgentContext` checks `choice` with `isAddonsAction` (the check `safeActions` uses), keeps only `classId` and `addons` of each traveller's trip, and refuses a wrong shape with a 400 like any wrongly shaped context. Nothing of it is logged.
- **The chat** (`app/components/chatAgent.ts`): `formState()` adds `choice` from the saved flight or charter form once trips are fixed (`legKeys` not empty) and `nerves` (flights only: the number of travellers with `passenger.nerves`). Names, ages and contact details are not in it.
- **`summarise`** (`summary()` in `lib/agent-tools.ts`): the total is `seatsTotal()` + `nerves × number of flights × NERVES_PRICE` (flights) + the extras (charter), as the payment page counts it. The add-ons come from `state.actions.addons` (set in the same answer) or else `state.choice`; `fitPassengerLegs()` ignores a traveller's choice whose `legKeys` do not match the page's trips and plan.
- **Fake agent** (`lib/chat-mock.ts`): `SAMMANFATTA` calls `summarise` and repeats its total line.

## Decisions

- **One calculation.** She uses the page's functions (`seatsTotal`, `NERVES_PRICE`, `extraRows`), not a copy; a unit test and a browser test per kind of booking compare the totals. Alternative dropped: leaving the total out of the answer when add-ons are unknown, since the context now carries them.
- **The browser says what, the server prices.** The context has class ids and counts only; every price comes from the database via the booking read from the address. A wrong count can at most change the total she says, never the booking (the button books from the page's own form, and `bookAction` computes its own total).
- **Nerves capped** at the number of travellers (`Math.min`), so a forged count cannot give a total the page cannot show.
- **Context changes drop her actions.** `choice` is part of the context compared by `sameContext()`, so choosing an add-on while she thinks makes the chat drop her actions and say "Du hann ändra något …", as for any other change.

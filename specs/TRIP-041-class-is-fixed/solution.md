---
id: TRIP-041
title: The class is chosen once, in the plan step
card: "#136"
depends_on: [TRIP-012, TRIP-039, TRIP-040]
---

# TRIP-041 The class is chosen once, in the plan step: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 136`.

## Data

None.

## Interface

- **Resenärer (`/flyg/boka`).** `TravellersForm` has no "Klass" select. Each traveller's flight group shows "Klass: Business, 4 560 kr" and the add-ons of that class. `LegFields` and `ClassesNote` are in `app/flyg/boka/FormParts.tsx` and are the same components charter's Resenärer uses (they were copies before). `ClassesNote` says "Klasserna är valda i steget Plan och klass och går inte att ändra här.", has the link **Ändra plan och klasser** (`planUrl()`), and a status that lists removed add-ons: "Dessa tillägg togs bort eftersom klasserna ändrats: Passagerare 1, utresan: Måltid (2 st)".
- **Removed add-ons (R2).** `useBookingForm()` now returns `{ form, removed }`; `removed` comes from `removedAddons()` (moved from `lib/charter-rules.ts` to `lib/booking-rules.ts`, since both areas use it). The names come from `readAddonNames()` by id, passed by `BookingStep` as `addonNames`. The list stays on the page until the form is first changed (`kept`), as in charter.
- **The server (R3).** `fitsTrip()` checks that each traveller's class is the one `firstClasses()` gives for that place, as charter's `fitsCharterForm()` does. The old per-field check `classProblem()` (the message "Byt klass för någon passagerare" and the field id `klasser-N`) is removed: the form can no longer produce a wrong number per class, and a form from elsewhere gets "Bokningen gick inte att spara…".
- **Agneta (R4).** `AGENT_RULES` in `lib/agent.ts` and the page text for Resenärer in `lib/agent-page.ts` say that the class is decided in the plan step only. `set_plan` already opens the plan step from any page of the trip, so a visitor who wants another class is sent back with it. The fake agent (`lib/chat-mock.ts`) answers `ANNANKLASS`. The flight booking has no agent yet (TRIP-036), so only charter's exists to update.

## Decisions

- **Same rule as charter for what a changed plan removes.** When a flight's key (route, date, departure, aircraft, numbers per class) changes, the whole flight's add-ons are removed and listed, as in TRIP-039-R8, rather than keeping those that also exist in the new class. R2 says the page tells which add-ons were removed and keeps the rest of the form (names, ages, contact details); one rule for flights and charter keeps `fitPassengerLegs()` shared. If keeping add-ons that still exist in the new class is wanted, it is a change in that one function for both.
- **No `klasser-N` field id and no class message.** Instead of keeping a message the page can no longer show, the check moved to the shape check on the server (R3), where charter already has it.
- **Shared components instead of a flight copy.** `LegFields`, `ClassesNote` and `removedAddons()` were written for charter in TRIP-039; flight booking now uses the same ones (R5: no duplicated code).
- **A form saved before this change.** A tab that saved swapped classes keeps them while the flight's key is unchanged; the server now refuses such a form and the page has no class field to fix it. The error text sends the visitor back, and it is rare, so nothing more is done.

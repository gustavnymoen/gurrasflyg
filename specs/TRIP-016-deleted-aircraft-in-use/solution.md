---
id: TRIP-016
title: Deleted aircraft still looks in use
card: "#21"
depends_on: [TRIP-003, TRIP-004]
---

# TRIP-016 Deleted aircraft still looks in use: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 21`.

## Data

None.

## Interface

- **`DeleteButton`** (`app/admin/admin-ui.tsx`) no longer takes `inUse` and `inUseReason`. The trash always opens "Är du säker?"; **Ja** runs the server action, and if the server says the row is in use, the dialog "Du kan ej ta bort" shows the server's reason (`deleteClass`, `deleteAddon` and `deleteAircraft` in `lib/admin.ts` already checked this in the database).
- `listClasses`, `listAddons` and `listAircraft` no longer compute `inUse`, and the `inUse` field is gone from `CabinClass`, `Addon` and `Aircraft`. `CLASS_IN_USE` and `ADDON_IN_USE` remain, used only by the delete functions.
- Texts: the reason is now the server's ("Du kan ej ta bort klassen, den används av ett plan eller en flight."), not the page's old "Business används av ett eller flera plan.".

## Decisions

- **The cause** is that the page decided from a flag read with the page. After `refresh()` the flag is replaced, but a trash pressed in between used the old one. A flag can always be old, so the page no longer holds one; the check that counts is the one in the delete transaction. This also removes a query column per row.
- **Cost:** a row that is in use asks "Är du säker?" before it says no, one click more than before. Accepted: it is the only way the button never disagrees with the database.
- **Could not be reproduced as a timing failure in a test** (the window is a few hundred milliseconds), so the tests check the behaviour that the fix guarantees: the unit tests that the database check frees and blocks as it should, and the browser test that the delete works straight after the aircraft is deleted without waiting for the page.

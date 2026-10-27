---
id: TRIP-003
title: "Admin: cabin classes and add-ons"
area: Flight booking
status: done
created: 2026-10-20
updated: 2026-10-21
depends_on: [TRIP-002]
---

# TRIP-003 Admin: cabin classes and add-ons

## Goal

The administrator can create, rename and delete the airline's cabin classes and add-ons, which aircraft are then built from (TRIP-004). Something in use can't be deleted, and the administrator is told why.

## Background

Built before specification-driven development was introduced and specified afterwards. A new database starts with the classes Ekonomi, Business and Första klass (`db/seed.sql`) and no add-ons.

## Users

Administrator.

## Scope

**In scope**

- The card "Klasser & addons" on `/admin`, with the tables Klasser and Addons side by side.

**Out of scope**

- Which classes and add-ons an aircraft has (TRIP-004).
- Prices per class on flights (later feature).

## Requirements

### TRIP-003-R1 Card with classes and add-ons

The admin page shall show a card "Klasser & addons" that can be folded up and out. It holds the table Klasser (name) and the table Addons (name with description, and "Pris (SEK)"), each with its number of rows in the heading. Classes are listed in the order they were created, add-ons alphabetically. Empty tables say "Inga klasser än." or "Inga addons än.".

Acceptance criteria:

- **Given** a signed-in administrator, **then** the card shows both tables, with the classes from the database.
- **When** the card heading is clicked, **then** the tables are hidden; a second click shows them again.

### TRIP-003-R2 Add a cabin class

"Lägg till" under Klasser shall open a row with a name field and the buttons Spara and Avbryt. Spara adds the class; Avbryt closes the row without saving.

Acceptance criteria:

- **When** the administrator adds the class "Premium", **then** it is shown in the table.
- **When** the administrator presses Avbryt, **then** nothing is added.

### TRIP-003-R3 Class names are required and unique

A class shall have a name, and two classes can't have the same name, regardless of case. Leading and trailing spaces are removed.

Acceptance criteria:

- **When** the name is empty, **then** "Klassen måste ha ett namn." is shown.
- **Given** the class "Business", **when** the administrator adds "business", **then** `Klassen "business" finns redan.` is shown.

### TRIP-003-R4 Rename a cabin class

The pencil on a class shall turn the row into a name field with Spara and Avbryt, using the same rules as R3.

Acceptance criteria:

- **When** the administrator renames a class and presses Spara, **then** the new name is shown.

### TRIP-003-R5 Delete a cabin class

The trash can on a class shall ask "Är du säker?" with Ja and Nej. Ja deletes the class, Nej keeps it. A class used by an aircraft, a flight price or a booking can't be deleted: the dialog says "Du kan ej ta bort" and why, with an OK button.

Acceptance criteria:

- **When** the administrator presses the trash can and Nej, **then** the class remains.
- **When** the administrator presses the trash can and Ja, **then** the class is removed.
- **Given** a class used by an aircraft, **when** the trash can is pressed, **then** "Du kan ej ta bort" and "<name> används av ett eller flera plan." are shown, and OK closes the dialog without deleting.

### TRIP-003-R6 Add an add-on

"Lägg till" under Addons shall open a row with name, price in kronor and description, and Spara and Avbryt. The price is stored and shown in the table as whole kronor.

Acceptance criteria:

- **When** the administrator adds "Extra bagage", price 249 and a description, **then** the table shows the name, the description and "249".

### TRIP-003-R7 Add-on fields are required

An add-on shall have a name, a description and a price of 0 kronor or more, in whole kronor. Names are unique regardless of case.

Acceptance criteria:

- **When** the price is empty, **then** "Ange ett pris." is shown.
- **When** the description is empty, **then** "Addon måste ha en beskrivning." is shown.
- **When** the name is empty, **then** "Addon måste ha ett namn." is shown.
- **Given** an add-on with the same name, **then** `Addon "<name>" finns redan.` is shown.
- **When** the price isn't whole kronor (for example 12,50), **then** "Ange priset i hela kronor." is shown (TECH-005-R4).

### TRIP-003-R8 Change an add-on

The pencil on an add-on shall open its fields filled in with the current values, using the same rules as R7.

Acceptance criteria:

- **When** the administrator changes the price and presses Spara, **then** the new price is shown.

### TRIP-003-R9 Delete an add-on

Deleting an add-on works as in R5. An add-on used by an aircraft or a booking can't be deleted, and the dialog says "<name> används av ett eller flera plan.".

Acceptance criteria:

- **When** the administrator deletes an unused add-on and answers Ja, **then** it is removed.
- **Given** an add-on used by an aircraft, **when** the trash can is pressed, **then** "Du kan ej ta bort" is shown.

## Data

Tables `classes` (name unique, case-insensitive) and `addons` (name unique case-insensitive, description, price in whole kronor). No changes.

## Interface

- `app/admin/ClassTable.tsx`, `app/admin/AddonTable.tsx`, shared parts in `app/admin/admin-ui.tsx`.
- Server actions in `app/admin/actions.ts`, logic and messages in `lib/admin.ts`.

## Non-functional requirements

- Whether something is in use is checked again in the database when deleting, in the same transaction, in case someone else has just started using it.

## History

- 2026-10-21, TECH-005: prices are whole kronor instead of öre (R6, R7, Data). Before, an add-on price could have öre.

How it works today: [Administration](../../wiki/system/admin.md).

---
id: TRIP-004
title: "Admin: aircraft"
area: Flight booking
status: done
created: 2026-10-20
updated: 2026-10-20
depends_on: [TRIP-002, TRIP-003]
---

# TRIP-004 Admin: aircraft

## Goal

The administrator can build the airline's fleet: each aircraft has a name, one or more cabin classes with a number of seats, and the add-ons that can be bought in each class. Which add-ons are allowed is later used when a traveller books.

## Background

Built before specification-driven development was introduced and specified afterwards. Add-ons are chosen per class, so a meal can be included in Business but sold in Ekonomi.

## Users

Administrator.

## Scope

**In scope**

- The card "Plan" on `/admin`: the table of aircraft and the form for creating and changing an aircraft.

**Out of scope**

- Creating cabin classes and add-ons (TRIP-003).
- Assigning aircraft to routes (TRIP-005).
- Flights and prices per class (later features).

## Requirements

### TRIP-004-R1 Table of aircraft

The admin page shall show a card "Plan" with the number of aircraft, which can be folded up and out. The table has the columns Namn, Klasser (number of classes), Platser (total seats) and Rutter (number of routes flown with the aircraft), sorted by name. Without aircraft it says "Inga plan än.".

Acceptance criteria:

- **Given** an aircraft with Ekonomi 100 seats and Business 20 seats, **then** its row shows 2 classes and 120 seats.

### TRIP-004-R2 Expand an aircraft

The arrow on an aircraft shall show its classes with the number of seats and the number of add-ons ("1 addon", "2 addons"). The arrow on a class shall show its add-ons with name and price, for example "Måltid · 95 kr", or "Inga addons i den här klassen.".

Acceptance criteria:

- **When** the administrator expands the aircraft and then the class with an add-on, **then** the add-on's name and price in kronor are shown.
- **When** the administrator expands a class without add-ons, **then** "Inga addons i den här klassen." is shown.

### TRIP-004-R3 Form for a new aircraft

"Lägg till plan" shall open the form "Nytt plan" with a name field and the sections Klasser and Addons. Nothing is saved until Spara is pressed, and then the whole aircraft is saved at once. Avbryt closes the form without saving.

Acceptance criteria:

- **When** the administrator fills in the form and presses Avbryt, **then** no aircraft is added.

### TRIP-004-R4 Add a class to the aircraft

"+ Lägg till klass" shall show a dropdown with the classes the aircraft doesn't have yet, a field for the number of seats, a + button and a ✕ to cancel. The + button is enabled only when a class is chosen and the number of seats is a whole number greater than 0. Added classes are listed with "<n> platser", in the same order as the class table. When the aircraft has every class, "+ Lägg till klass" is disabled.

Acceptance criteria:

- **When** the number of seats is 0 or not a number, **then** the + button is disabled.
- **Given** the aircraft has Ekonomi, **then** Ekonomi isn't offered again.
- **Given** Business is added before Ekonomi, **then** Ekonomi is listed first.

### TRIP-004-R5 Change or remove a class in the form

The pencil on a listed class shall turn its seats into a field with ✓ and ✕; ✓ is disabled for an invalid number. The trash can removes the class from the form without asking, together with its add-ons.

Acceptance criteria:

- **When** the administrator changes the seats from 100 to 150 and presses ✓, **then** "150 platser" is shown.
- **Given** a class with an add-on, **when** the class is removed, **then** the add-on is removed from the form too.

### TRIP-004-R6 Add-ons per class

"+ Lägg till addon" shall be enabled when the aircraft has at least one class and at least one add-on exists. It shows two dropdowns, Addon and Klass (only the aircraft's classes), both required, a + button and a ✕. The same add-on can't be added twice to the same class: "Den addonen finns redan i den klassen.". Added add-ons are listed with their class, sorted by class and then name, and can be changed with the pencil (✓ and ✕) or removed with the trash can.

Acceptance criteria:

- **Given** a form without classes, **then** "+ Lägg till addon" is disabled.
- **When** only Addon is chosen, **then** the + button is disabled.
- **When** the same add-on is added twice to the same class, **then** "Den addonen finns redan i den klassen." is shown.

### TRIP-004-R7 Rules when saving

An aircraft shall have a name ("Planet måste ha ett namn."), at least one class ("Planet måste ha minst en klass.") and a name no other aircraft has, regardless of case (`Det finns redan ett plan som heter "<name>".`).

Acceptance criteria:

- **When** the name is empty, **then** "Planet måste ha ett namn." is shown.
- **When** the aircraft has no class, **then** "Planet måste ha minst en klass." is shown.
- **Given** an aircraft with the same name in other letter case, **then** the duplicate message is shown and nothing is saved.

### TRIP-004-R8 Change an aircraft

The pencil on an aircraft shall open the form "Ändra <name>" filled in with its name, classes and add-ons, with the same rules as R3–R7. A class can't be removed if the aircraft's flights use it, and the seats can't be fewer than already booked on a flight.

Acceptance criteria:

- **When** the administrator renames the aircraft and adds a class, **then** the table shows the new name and number of classes.
- **Given** flights and bookings on the aircraft, **then** the limits above apply. (Checked in code review: there is no way to create flights yet.)

### TRIP-004-R9 Delete an aircraft

The trash can on an aircraft shall ask "Är du säker?". Ja deletes the aircraft with its classes and add-ons, and the routes it flew are left without an aircraft. An aircraft with flights can't be deleted: "<name> används av en eller flera flighter.".

Acceptance criteria:

- **When** the administrator deletes an aircraft and answers Ja, **then** it is removed from the table.
- **Given** an aircraft assigned to routes, **when** it is deleted, **then** those routes have no aircraft (tested in TRIP-005).
- **Given** an aircraft with flights, **then** it can't be deleted. (Checked in code review.)

### TRIP-004-R10 All or nothing

Saving or deleting an aircraft shall happen in one transaction: if anything fails, nothing is changed.

Acceptance criteria:

- Checked in code review: `createAircraft`, `updateAircraft` and `deleteAircraft` in `lib/admin.ts` use `withTransaction`.

## Data

Tables `aircraft`, `aircraft_capacity` (seats per class) and `aircraft_class_addons` (allowed add-ons per aircraft and class, which must be one of the aircraft's classes). No changes.

## Interface

- `app/admin/AircraftTable.tsx` and `app/admin/AircraftForm.tsx`.
- Server actions in `app/admin/actions.ts`, logic and messages in `lib/admin.ts`.

## Non-functional requirements

- Enter in a seats field confirms that row; it doesn't save the whole aircraft.

How it works today: [Administration](../../wiki/system/admin.md).

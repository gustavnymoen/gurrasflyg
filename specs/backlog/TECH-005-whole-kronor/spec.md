---
id: TECH-005
title: All prices in whole kronor
area: Shared
status: backlog
created: 2026-10-20
updated: 2026-10-20
depends_on: []
---

# TECH-005 All prices in whole kronor

## Goal

Every price on the site is stored, handled and shown as whole kronor, instead of being stored in öre and divided by 100. A price in the database or the code then reads as what the visitor sees (`1290` is "1 290 kr"), which makes the code and data easier to read and removes a whole class of mistakes (a price shown 100 times too high or too low).

## Background

Today all prices are stored as whole öre (`specs/overview.md`, "Rules for all features", and `CLAUDE.md`), in four columns:

| Table | Column | Rows (local database, 2026-10-20) |
|---|---|---|
| `addons` | `price` | 5, all whole kronor |
| `flight_prices` | `price` | 0 |
| `booking_flights` | `price` | 0 |
| `booking_flight_addons` | `price` | 0 |

The conversion happens in three places: `lib/format.ts` (`formatPrice` and `formatAmount` divide by 100, and show öre when the price isn't whole kronor), `lib/admin.ts` (`validateAddon` multiplies the entered kronor by 100) and `app/admin/AddonTable.tsx` (divides by 100 to fill in the edit form). TRIP-003 allows add-on prices with öre ("kan ha ören" in the manual).

The product owner decided on 2026-10-20 that all prices shall be whole kronor, including add-ons, and that an add-on price with öre is an error. The charter import (TRIP-007) stores its prices in whole kronor, so this task comes first.

## Users

Developers. The administrator can no longer enter öre in an add-on price. Visitors see no difference.

## Scope

**In scope**

- A migration that converts the existing prices to whole kronor.
- The code reads and writes whole kronor.
- Add-on prices must be whole kronor.
- The rule in `CLAUDE.md`, `specs/overview.md` and `wiki/`, and the TRIP-003 spec.

**Out of scope**

- Prices for things that don't exist yet (flight prices per class, charter prices): they follow the new rule when they are built.
- Other currencies, or showing prices with öre.

## Requirements

### TECH-005-R1 The site behaves as before

Apart from R4, the site shall work and show prices exactly as before.

Acceptance criteria:

- **Then** `npm run lint`, `npm run typecheck` and `npm run build` pass without errors or warnings.
- **Then** the existing tests pass, both `npm run test:local` and, after deploy, `npm test` against the live site (with the TRIP-003 tests updated for R4).
- **Given** an add-on that cost 249 kr before the change, **then** it is shown as "249" in the admin table, and as "249 kr" next to the aircraft that has it.

### TECH-005-R2 Existing prices are converted

A new migration shall convert every price in `addons`, `flight_prices`, `booking_flights` and `booking_flight_addons` from öre to whole kronor: the price divided by 100, rounded to the nearest krona (an exact half rounds up). It runs once per database, locally and on Turso, and keeps all other data.

Acceptance criteria:

- **Given** an add-on stored as 24 900 öre, **when** the migration has run, **then** it is stored as 249.
- **Given** a price of 1 250 öre (12,50 kr), **then** it becomes 13; 1 249 öre becomes 12.
- **When** `npm run dev` runs on a copy of the local database, **then** the five add-ons have the same prices in kronor as before, and all other tables have the same rows.

### TECH-005-R3 The code uses whole kronor

The code shall store, read and format prices as whole kronor, with no conversion between öre and kronor anywhere. `formatPrice` and `formatAmount` in `lib/format.ts` take kronor and never show decimals. The comments in `db/schema.sql` and `db/seed.sql` say kronor.

Acceptance criteria:

- **Then** no code multiplies or divides a price by 100.
- **Then** `formatPrice(1290)` gives "1 290 kr" and `formatAmount(1290)` gives "1 290".
- **Then** `db/seed.sql` has no prices (a price there would be converted once more by the migration in R2 when a new database is built).

### TECH-005-R4 Add-on prices are whole kronor

An add-on's price shall be a whole number of kronor, 0 or more. A price with öre is rejected with the message "Ange priset i hela kronor." and nothing is saved. The check is made on the server (`lib/admin.ts`), and the price field only steps in whole kronor. The message is shown in the same way as the other add-on errors.

Acceptance criteria:

- **When** the administrator adds an add-on with the price 249, **then** it is saved and shown as "249".
- **When** the administrator enters 12,50 (or 12.50) and presses Spara, **then** "Ange priset i hela kronor." is shown, and the add-on isn't saved or changed.
- **When** the price is 0, **then** it is saved; **when** it is negative, **then** "Priset måste vara 0 kr eller mer." is shown, as before.

### TECH-005-R5 The rule is documented

The rule shall say whole kronor everywhere it is written: `CLAUDE.md` (Rules), `specs/overview.md` (Rules for all features: "Prices: stored and shown as whole kronor, for example "1 290 kr""), `wiki/system/architecture.md`, `wiki/manual/admin-klasser-och-addons.md` (no longer "kan ha ören", and the new message), and `specs/done/TRIP-003-admin-classes-and-addons/spec.md` (R6, R7 and Data), with a line in its history that TECH-005 changed it.

Acceptance criteria:

- **Then** the word "öre" occurs in specs, wiki and `CLAUDE.md` only where it describes the change (this spec, TRIP-003's history and `wiki/log.md`).

## Data

`db/migrations/004_whole_kronor.sql`: `UPDATE … SET price = (price + 50) / 100` (SQLite divides integers as integers, so adding 50 first rounds to the nearest krona, a half up) for the four tables. No tables or columns change; `CHECK (price >= 0)` stays.

## Interface

- `lib/format.ts`: `formatPrice` and `formatAmount` take kronor.
- `lib/admin.ts`: `validateAddon` checks whole kronor, and stores the price without converting it.
- `app/admin/AddonTable.tsx`: the edit form is filled in with the price as it is; the price field has `step={1}`.
- New text for the administrator: "Ange priset i hela kronor."

## Non-functional requirements

- `npm run copy-to-prod` copies prices as they are stored, so it shall only be run when both the local database and Turso have run the migration (they do once the change is deployed and `npm run dev` has been started).

## Open questions

None.

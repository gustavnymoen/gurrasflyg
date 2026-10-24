---
id: TRIP-011
title: Choose aircraft and classes
---

# Code review of TRIP-011

**Result:** Passed
**Date:** 2026-10-23, review run 1
**Summary:** TRIP-011 does what the card asks for. The factors are stored as whole-number percent by a new migration, the rules are pure functions in `lib/fare-rules.ts` and `lib/trip.ts` with unit tests named after the requirements, and `/flyg/plan` keeps every choice in the address and checks it against the database. Nothing blocked the feature. There was one duplicated admin field, and R2's wording didn't match how an aircraft that can't be chosen was shown.
**Security:** Passed. The four changed server actions (create and update for classes and aircraft) go through `run()`, which checks `isAdmin()`. The factors arrive as text and are checked on the server (`requireFactor`: a string, the same reading as the form, the limits), backed by `CHECK` constraints in the database. All new SQL uses `?` parameters. The address holds only times, ids and numbers, which `parseLegs`, `checkChoice` and `validSeating` check; prices and times come from the database. Error messages say what to do and show no internals. No secrets, cookies or personal data are involved. `/security-review`: run (admin server actions, validation of admin input, database queries, a public page that reads the address). It found no vulnerabilities: authorisation, parameterised SQL, the address only reaching validated parsers and never SQL, URLs built with `URLSearchParams` on a fixed internal path (no open redirect), no `dangerouslySetInnerHTML` or `eval`, and only public pricing data sent to the browser.

How the review works: `wiki/system/code-review.md`.

## Must fix

None.

## Should fix

- `app/admin/ClassTable.tsx:136` The Prisfaktor input was a copy of `FactorField` in `app/admin/AircraftForm.tsx`. **Done:** `FactorField` moved to `app/admin/admin-ui.tsx` next to `LabeledField`, and both forms use it.
- `app/flyg/plan/AircraftList.tsx:107` R2 says every aircraft shows its price per person, flight time and arrival, but an aircraft with too few seats showed only "För få platser: …". **Done:** such an aircraft now shows its time, arrival and price too, with "För få platser" under the time, and is not compared with the others.

## Suggestions

- `app/flyg/plan/AircraftList.tsx:135` `Comparison` and `Arrival` were exported from the aircraft list and imported by `ClassList.tsx` and `TripBuilder.tsx`. **Done:** moved to `app/flyg/plan/Comparison.tsx` and `app/flyg/plan/Arrival.tsx`, like `FlightLine.tsx` and `Steps.tsx`.
- `app/flyg/page.tsx:41` `listFleet()` was awaited before the flights, one more database round trip in a row. **Done:** the fleet is read at the same time as the search's airports, on `/flyg` and on `/flyg/plan`.
- `lib/fare-rules.ts:94` With no aircraft to choose, `Math.min()` of nothing is `Infinity`, so the differences became `-Infinity`; harmless only because the page hid them. **Done:** an aircraft that can't be chosen gets the differences 0, with a comment and a unit test.

## Outside the change

- `lib/bookings.ts` still has the overbooking rule that assumes shared aircraft. Not added: the card already says it changes in TRIP-012.
- Admin lists aircraft without classes, while `listFleet()` leaves them out of the traveller's page. Not added: the aircraft form refuses an aircraft without a class (`validateAircraft`: "Planet måste ha minst en klass."), so admin can't create one.

## After the review

With the user, every factor got a cap of 10,00 (R6 and R8 updated in the card): `parsePriceFactor`, `parseTimeFactor`, the messages and the migration's `CHECK`s, with unit and browser tests. Lint, the type check and the affected tests were run again.

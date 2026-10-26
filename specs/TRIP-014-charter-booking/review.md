---
id: TRIP-014
title: Search and book charter trips
---

# Code review of TRIP-014

**Result:** Passed
**Date:** 2026-10-26, review run 1
**Summary:** TRIP-014 does what the card asks. It reuses the flight booking's parts, takes every price from the database and the code, and has a test named after each of R1–R11. No must-fix findings; the three small should-fix findings were fixed in this change.
**Security:** The security points of the review: passed (details below). `/security-review`: run on the branch, no findings of high confidence.

How the review works: `wiki/system/code-review.md`.

## Must fix

None.

## Should fix

- `specs/TRIP-014-charter-booking/verification.md` was still the template. **Done:** filled in at the Verify step.
- `app/charter/CharterSearchForm.tsx:21` repeated the `Schedules` type of `lib/charter.ts`. **Done:** now `import type { Schedules }` (erased at build time, so `server-only` doesn't reach the browser).
- `app/charter/CharterPaymentForm.tsx:25` imported `CharterStepProps` from another form component. **Done:** the type is in `app/charter/steps.ts`.

## Suggestions

- `lib/charter-bookings.ts:42`: on a repeated request id the saved booking's number is returned, but `actions.ts` builds the summary from the form of the second request. For a double press the forms are identical, and nothing saved or priced can change. **Done:** left as it is (the flight booking does the same); building the summary from the saved row would remove the gap if it ever matters.
- `tests/TRIP-014-charter-booking.spec.ts:13`: the browser tests pick dates from today, so they need today to be before about 23 April 2027, when the timetables end (the card names this limit). **Done:** recorded in `verification.md` Notes.
- `lib/booking-rules.ts:296`: `collectProblems(add)` with `passengerProblems` and `contactProblems` shares the checks without copying them, so the two bookings can't drift apart on messages. Worth keeping as the pattern for the next booking type.

## Outside the change

- The cards on `/charter` could be clickable as a whole, and the start cards Plats and Aktivitet are redundant now that every filter choice is shown (TRIP-013). **Done:** proposed to the user as a card.
- `sortTrips` and the flight booking's `sortFlights` do the same job with different types; a generic helper could replace both later. Not added.

## Security points

- **Sign-in:** not applicable; there are no admin pages and booking is open to visitors.
- **Input validated on the server:** the address (`lib/charter-rules.ts`: airport from a list, real dates, 1–10 travellers, `ut` and `hem` only matched against the trips found); `createCharterBooking` re-reads the trips in the write transaction, applies the date limits, `fitsCharterForm` (shape, traveller count, text types, request id pattern, payment value), `extrasProblem` (unknown, duplicate, drinks with a minor) and the same field checks as the browser. A null or garbage form is refused before any field is read.
- **Prices:** never from the browser. The action takes only the destination id, the query and the form, and the form has no price fields; trip prices come from the database inside the transaction and the extras' from `EXTRAS`. Unit tests: a sent `total` and `price` are ignored, and a changed price in the database is the price saved.
- **Queries:** all values are parameters; the only interpolated text (`ofRoute` in `lib/charter.ts`) is a constant string. The `nosemgrep` comments are justified.
- **Migration:** `011_charter_bookings.sql` is new and edits no applied migration; `CHECK`, `UNIQUE` and foreign keys with `ON DELETE CASCADE`; a unit test covers the rules.
- **Secrets, errors, personal data:** none in the code; `console.error` goes to the server log and the visitor gets a fixed Swedish text; personal data is never in the address, only in the tab's `sessionStorage`; `/charter/bokad` reads only the tab's own storage; the tests clean up after themselves.

## `/security-review`

Run on the branch (server action, personal data, queries, migration). Result: no vulnerabilities of confidence 8 or more. Checked: SQL injection, the server action's validation and prices, the address input, XSS (no `dangerouslySetInnerHTML`; the summary is rendered as React text), personal data in the address and logs, and the redirect target of Avbryt (a fixed set of paths).

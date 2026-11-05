---
id: TRIP-039
title: Choose aircraft and classes in charter
---

# Code review of TRIP-039

**Result:** Passed
**Date:** 2026-11-05, review run 1
**Summary:** R1 to R8 are met. The server recomputes every price from the database and rejects a wrong aircraft, classes or add-ons; the migration only adds. No must-fix findings.
**Security:** The security points of the review: passed. `/security-review`: run on the change, no vulnerability found (the booking action's new input, the plan and numbers per class in the address and each traveller's classes and add-ons in the form, is checked on the server by `readCharter`/`checkChoice`, `fitsCharterForm` and `fitsLeg` before any price is taken from the database; SQL uses parameters; add-on ids from the browser are matched against the class's real add-ons, so keys such as `__proto__` are refused).

## Must fix

None.

## Should fix

- `specs/TRIP-039-charter-aircraft/verification.md` and `review.md` were the template. **Done:** filled in.
- `lib/charter-rules.ts` `fitsCharterForm`: the server does not use `legKeys`. **Done:** a comment says it is only the browser's memory.

## Suggestions

- `lib/charter.ts` `readCharter`: `timePercent: 100` implements R2 without touching `fare-rules`; tested by `TRIP-039-R2`. Left as it is.
- `lib/booking-rules.ts`: `fitPassengerLegs` and `seatCost` are shared with flights instead of copied. Left as it is.
- `tests/TRIP-039-charter-aircraft.spec.ts`: the test that books is `runsLocally` only, as it writes data. Left as it is.

## Outside the change

- `app/components/chatAgent.ts` and `lib/agent-tools.ts`: Agneta's price summary ignores aircraft and classes, and her page text does not know the plan step. TRIP-040 (card #135) covers it. Her booking button works when the visitor came through the plan step and has edited the form (checked by TRIP-030-R7 R8 with the new step), so the reviewer's note that it "always fails" does not hold; not added to the board.

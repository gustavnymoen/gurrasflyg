---
id: TRIP-023
title: Manage my booking
---

# Code review of TRIP-023

**Result:** Passed
**Date:** 2026-10-26, review run 1
**Summary:** The change meets the card's requirements and review points: no personal data in the address, one answer for a wrong number and a wrong last name, the browser sends only credentials, a request id and part ids (never an amount or an outcome), and the migration only adds. The server checks everything again inside one write transaction.
**Security:** Passed on all points of the guide. `/security-review`: run on the uncommitted change; no vulnerability with enough confidence to report (SQL is parameterised with constant table names, every part id is checked against the booking, React escapes all output, nothing is logged, the limit key is namespaced).

How the review works: `wiki/system/code-review.md`.

## Must fix

None.

## Should fix

- `lib/my-booking.ts` (`checkCredentials`) A right lookup clears the address's count, as R3 says. Someone with a valid booking of their own could interleave a right lookup every fourth guess and so never reach the limit. **Done:** left as the card specifies, because guessing a number (about 10⁹ values) and the last name still takes far too long to be practical; if it should change, R3 changes first. Recorded in `solution.md`.
- `lib/my-booking.ts` (`cancelParts`) The check for an existing cancellation looks at `request_id` and the booking, but `request_id` is unique across all bookings, so the same id used on another booking would throw an unhandled UNIQUE error. **Done:** the error is caught (`constraintKind`) and answered with the plain "Det du valde går inte att avboka …" message.
- `specs/TRIP-023-my-booking/verification.md` was still the template. **Done:** filled in.

## Suggestions

- `lib/my-booking.ts` (`findBooking`) A number of the wrong shape returns without a database query, so its response time differs a little. **Done:** left as it is; the limit and the equal answers are what R2 asks for.
- `app/min-bokning/CancelPanel.tsx` The request id made when the question opens is a good pattern for double confirmation. **Done:** kept.

## Outside the change

- `login_attempts` is now used by two features with only a key prefix to tell them apart; a third use would be a reason to rename it by purpose (for example `rate_limits`). Not added to the board.

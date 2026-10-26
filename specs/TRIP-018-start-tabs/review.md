---
id: TRIP-018
title: Switch between flight booking and charter
---

# Code review of TRIP-018

**Result:** Passed
**Date:** 2026-10-26, review run 1
**Summary:** The change does what R1 to R4 say; the tabs, the shared Dialog (moved from the admin, not copied), the Avbryt flow, `isInFlow` and the tests are clean. One small gap in R2 was found and fixed.
**Security:** The security points of the review: passed (no sign-in, API route, server action, database query, cookie or personal data; only `sessionStorage` is cleared). `/security-review`: not needed, as the card says.

How the review works: `wiki/system/code-review.md`.

## Must fix

None.

## Should fix

- `app/flyg/Problem.tsx:21` The link "Till sökningen" on an incomplete address went to `/` without asking, against R2. **Done:** `Problem` uses `StartLink` for the start page, with a test (`TRIP-018-R2 the link out of an incomplete address asks…`).
- `app/components/Dialog.tsx:5-11` The header comment wrapped oddly after the move. **Done:** re-flowed.

## Suggestions

- `app/components/AbortFlow.tsx` `AbortButton` and `StartLink` each keep their own `asking` state. **Done:** left as it is; only one is open at a time and a shared hook would be more code than the three lines it saves.
- `/flyg/boka/betala` is not opened by any test. **Done:** recorded in `verification.md`; it uses the same header component.
- `Dialog.tsx` Tab trap only looks for buttons. **Done:** left as it is; the dialogs only have buttons.

## Outside the change

None.

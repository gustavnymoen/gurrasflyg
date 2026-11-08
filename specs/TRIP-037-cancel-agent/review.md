---
id: TRIP-037
title: Booking agent for finding and cancelling a booking
---

# Code review of TRIP-037

**Result:** Passed
**Date:** 2026-11-08, review run 1
**Summary:** No code path lets the model look up or cancel a booking, the extract carries nothing personal, and everything from the browser is checked again on the server and on the page. R1 to R6 each have a unit test and/or a browser test.
**Security:** The security points of the review: passed. `/security-review`: run on the working tree, no finding. It checked that no tool reaches `lookUpAction` or `cancelAction`, that a tampered extract can only change the visitor's own prompt and the page keeps ticks to `tickableIds()`, that nothing personal is logged, and that nothing is rendered as HTML.

How the review works: `wiki/system/code-review.md`.

## Must fix

None.

## Should fix

- `lib/agent-tools.ts` (`tickCancellation`): when every part asked for is refused, no action is sent and the visitor's earlier ticks stay, but the answer said "No box is ticked". **Done:** it now says "Nothing was ticked and the boxes the visitor had ticked are unchanged." (unit and browser test updated).
- `specs/TRIP-037-cancel-agent/verification.md` was still the template. **Done:** filled in (checks not done are written as not checked).

## Suggestions

- `lib/agent-rules.ts`: the limit 40 on a tick action repeated `MAX_GROUPS * MAX_TRAVELLERS`. **Done:** one constant, `MAX_TICKS`, in `lib/cancel-extract.ts`.
- `BookingView.tsx`: the status note is not read again if she ticks exactly the same set twice, since the text does not change. **Done:** left as it is; nothing changed for the visitor then, and the manual ticking clears the note.
- `lib/agent.test.ts`: the "no lookup tool" test matches tool names by regex. **Done:** left as it is; the test of the request lists every tool name exactly, so a new tool fails it and forces a look.

## Outside the change

- None.

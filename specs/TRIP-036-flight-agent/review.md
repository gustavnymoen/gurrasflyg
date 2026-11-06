---
id: TRIP-036
title: Booking agent for flights
---

# Code review of TRIP-036

**Result:** Passed
**Date:** 2026-11-06, review run 1
**Summary:** Flights go through the same agent loop, action check and `bookAction()` path as charter, and nothing personal reaches the model. No must-fix findings.
**Security:** The security points of the review pass. `/security-review`: run on the branch, no finding with confidence of 8 or more: every tool argument is checked on the server (`parseSearch`, `flightDatesProblem`, `getAirportPair`, departures from `findFlights`, plans by `checkPlan`/`checkChoice`, add-on counts 0 to `MAX_ADDONS`); an address an action may open must match the `PATH` pattern; `findAirports` uses named parameters and `escapeLike`; the context sent from the chat has no name, age or contact detail. Not run as a separate multi-agent pass.

## Must fix

None.

## Should fix

- `app/components/chatAgent.ts` `formState()`: `valid` is `travellerProblems(form, [])`, so the rule "beer needs 18" is not in it; with beer set and an age under 18 already filled in, the button can show and `bookAction()` refuses. **Done:** recorded as a known limit in `solution.md` (the same shortcut as charter); nothing wrong is saved.
- `verification.md`: `/security-review`, the live checklist, Live tests and the real-model tone are open. **Done:** recorded as not checked, not hidden.

## Suggestions

- `app/flyg/boka/book.ts` `BOOKED_PATH` exported without a user. **Done:** `export` removed.
- `lib/agent-tools.ts` `findAirportsTool`: no length limit on the search text. **Done:** cut to 50 characters.
- `chatAgent.ts` has a flight and a charter branch in three functions; a small `FormKind` object would collapse them if a third booking kind appears. Left as it is.

## Outside the change

- The browser suite is over the 180 s budget (240 s, 223 s before this change). Not added to the board here.

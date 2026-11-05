---
id: TRIP-040
title: Booking agent: aircraft and classes in charter
---

# Code review of TRIP-040

**Result:** Passed
**Date:** 2026-11-05, review run 1
**Summary:** R1 to R4 are met. The plan and class checks are written once in `lib/agent-plan.ts` and the tools work on whichever page she is on; nothing from the model is trusted.
**Security:** Passed (the review's security points). `/security-review`: run, nothing found: the new `addons` action is checked in shape and size by `safeActions` and again by the server at booking, new addresses go through `isAgentUrl` and `URLSearchParams`, no new queries, no personal data in the page text.

How the review works: `wiki/system/code-review.md`.

## Must fix

None.

## Should fix

- `specs/TRIP-040-charter-agent-plan/verification.md` and `review.md` were unfilled templates. **Done:** filled in.
- `lib/agent-rules.ts` `safeActions` does not check that the number of travellers in `addons` matches the page; `withAddons` resizes the form to it. **Done:** left as it is: the server builds the action from the page's own `legs`, and the form is fitted to the page again when it opens, so a wrong number cannot reach a booking (the server checks the form).

## Suggestions

- `lib/chat-mock.ts` `planCalls` filtered the lines once per trip. **Done:** computed once.
- `lib/agent-tools.ts` `setAddons` matched beer by the name "öl". **Done:** uses `isBeer` on the matched add-on, so the age rule stays in one place.

## Outside the change

- TRIP-042 (the "Snabbast" label on every charter plan card) is on the board. `set_addons` assigns classes by order (`fitCharterForm`) and needs a re-check when TRIP-041 makes the class fixed.

---
id: TRIP-030
title: Booking agent
---

# Code review of TRIP-030

**Result:** Passed (0 must fix)
**Date:** 2026-11-05, review run 1
**Summary:** No other path to a booking than the button was found, and everything the model returns is checked on the server and again in the browser. Two should-fix points were fixed.
**Security:** Passed on all points of the review. `/security-review`: run, no findings (booking only through `bookCharter()` from Betala and the button; actions limited to the `isAgentUrl` whitelist and rebuilt on the server; no personal data in the request, the prompt or the log; queries parameterised).

How the review works: `wiki/system/code-review.md`.

## Must fix

None.

## Should fix

- `app/components/ChatBody.tsx` When the visitor changed the page while a question was pending, the actions were dropped but the answer was saved with the button "Boka och betala" under a summary of a page that no longer exists. **Done:** `help` and `book` are dropped from the entry when the context changed; the existing browser test of the late answer passes.
- `lib/agent-page.ts` The free search text in a list address went to the model uncut (a crafted link could carry text to it). Booking is safe, since only the button books. **Done:** cut to 80 characters in `pageText`; unit test `TRIP-030-R4 a long search text …`.

## Suggestions

- `app/components/chatAgent.ts` `searchOf()` and `parseChoice(...)` repeat parsing of the address in `readContext` and `bookNow`. **Done:** left as it is; each is a one-line use of the page's own parsers.
- `lib/chat.ts` `export { mockClient }` is a re-export. **Done:** kept, `lib/chat.test.ts` imports it from `./chat`.
- `lib/agent.ts` A question can make up to 7 model calls for one unit of the 10-per-5-minutes limit. **Done:** as the card decided (R9); to be watched in the log on the preview.

## Outside the change

- Not read by the reviewer: the unit test files and the bodies of the browser tests.
- The real-model check, the live accessibility checklist and the live smoke tests are still to do (see `verification.md`).

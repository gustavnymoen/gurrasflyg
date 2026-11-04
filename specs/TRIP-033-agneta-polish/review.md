---
id: TRIP-033
title: Agneta polish
---

# Code review of TRIP-033

**Result:** Passed
**Date:** 2026-11-04, review run 1
**Summary:** No must-fix findings. The cut answer is detected in one place (`stop_reason === "max_tokens"` in `askAgneta`, then `cutToWhole`); four should-fix points and three suggestions, mostly documentation and where a pattern lives.
**Security:** Passed. The only link pattern is still `/charter/[a-z0-9-]+`; `HALF_LINK` only deletes text; the route, rate limit, key and database queries are unchanged except `MAX_ANSWER_LENGTH` 6 000, still checked by `parseMessages`. The prompt has nothing per page or per visitor. `/security-review` not needed, as the card says.

How the review works: `wiki/system/code-review.md`. Done by reading; the tests were run by the author.

## Must fix

None.

## Should fix

- `specs/TRIP-017-charter-chatbot/solution.md:41` still said 4 000 characters. **Done:** "(6 000 since TRIP-033)".
- `wiki/system/charter-chatbot.md` had a doubled sentence about the usage log. **Done:** merged.
- `lib/chat-rules.ts` / `lib/markdown.ts`: the reader imported a pattern from the chat rules and stripped `[…` endings in every text, across lines. **Done:** `HALF_LINK` now lives in `lib/markdown.ts`, the chat rules import it, and it stops at a line end.
- `lib/chat-rules.test.ts`: a comment named a case no test covered. **Done:** the comment now says what is tested and that a whole last sub-bullet counts as cut.

## Suggestions

- `cutToWhole`: a cut inside `**bold**` in the one-line fallback would show `**`. **Done:** left; handle it if the preview log shows it.
- `cutToWhole` relies on one line per bullet and a two-space sub-bullet. **Done:** left, stated in `solution.md`; the preview run is where a wrapped bullet would show.
- `.nth(2)` in the browser test is brittle. **Done:** left; add a helper if more tests need it.

## Outside the change

- `specs/TRIP-032-karen-improvements/verification.md` records the old width. **Done:** a note points to TRIP-033.

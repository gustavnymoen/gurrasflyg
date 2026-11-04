---
id: TRIP-032
title: Agneta improvements
---

# Code review of TRIP-032

**Result:** Passed
**Date:** 2026-11-04, review run 2
**Summary:** No must-fix findings in either run. Run 2 (after the close question and the panel width variable were added) found one real edge case, an answer to a question sent before Stäng landing in the new chat, which is fixed and tested.
**Security:** Passed in both runs. No raw HTML anywhere (React text nodes only); the only link target is `/charter/[a-z0-9-]+` by regex, rendered through `next/link`, so `javascript:`, external URLs and `//host` stay plain text; saved data is checked by `parseSaved` (roles, string content, known fields only) and falls back to an empty chat; the greeting is dropped by `lastMessages` and `parseMessages`, so nothing new reaches the server. No change to the route, sign-in or database, so `/security-review` is not needed, as the card says.

How the review works: `wiki/system/code-review.md`. Run 2 was done by reading the code; the tests were run by the author.

## Review run 2

### Must fix

None.

### Should fix

- `app/components/ChatBody.tsx` (the `notice`/answer writes) and `Chat.tsx` An answer to a question sent before Stäng, arriving after the new greeting, ended up in the new chat; a failure notice removed the new greeting; `waiting` stayed true after the clear. **Done:** `clearChat()` in `useSavedChat.ts` bumps `chatEpoch`; `ChatBody` writes an answer, a notice or the end of the waiting only in the epoch the question was sent in; `Chat` resets `waiting` on clear. Test `TRIP-032-R4 an answer that arrives after Stäng and Ja does not land in the new chat`.
- The test plan had nothing for the "Är du säker?" dialog on a phone, above the modal chat dialog. **Done:** added to the phone test (Nej goes back to the dialog, Ja clears it, focus on the button).
- `wiki/system/charter-chatbot.md` said Escape closes the dialog. **Done:** it says Escape minimises both, as the code and R6 do.
- `.claude/launch.json` is an untracked dev-tool file. **Done:** not part of the commit.

### Suggestions

- `app/components/Chat.tsx` The `returnFocus` ref and effect next to `Dialog`'s own return of focus. **Done:** a comment says why both are needed (the button the dialog came from is gone after Stäng).

## Review run 1

### Must fix

None.

### Should fix

- `verification.md` was still the template. **Done:** filled in.
- `.claude/launch.json` untracked. **Done:** not part of the commit.
- `app/components/Chat.tsx` and `app/globals.css` repeated the panel width. **Done:** one variable, `--agneta-panel-width`, in `app/globals.css` (in `@theme static` so that it is emitted), used by the panel's class and the page margin.

### Suggestions

- `app/components/useSavedChat.ts` The in-memory fallback has a limit. **Done:** marked with a `shortcut:` comment.
- `data-agneta-panel` is set in an effect, so after a reload with the panel open the page shifts once after hydration. **Left as it is:** minor, written down here.
- `ChatBody.tsx` `notice` assumes the asked question is the last entry (`slice(0, -1)`), which holds with one tab. **Left as it is:** several tabs on one session are not a supported case.

### Outside the change

- `waiting` lives in `Chat`, which is mounted separately on the start page and under `/charter`, so the "tänker" bubble is lost if the visitor changes page while an answer is pending (the answer is still saved). Not added to the board: it is cosmetic.

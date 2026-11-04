---
id: TRIP-017
title: Charter chatbot Agneta
---

# Code review of TRIP-017

**Result:** Passed
**Date:** 2026-11-04, review run 1
**Summary:** R1–R9 are met as far as the code shows. The key is read in one server-only place and never logged, the prompt holds nothing visitor-specific, and the history is validated on the server. No must-fix findings.
**Security:** Security points passed (public route by design; input validated on the server before the model call; parameterised SQL; `LLM_API_KEY` only in `lib/chat.ts`, never logged or in an error text; rate limit per IP address after validation). `/security-review` has not been run yet (to be run before the pull request and its result added here).

How the review works: `wiki/system/code-review.md`.

## Must fix

None.

## Should fix

- `verification.md` was the unfilled template. **Done:** filled in.
- `.claude/launch.json` is an untracked tool file. **Done:** left out of the commit.
- `app/components/Chat.tsx` The scrolling log was not reachable by keyboard (WCAG 2.1.1). **Done:** `tabIndex={0}` on the log, and `Dialog`'s Tab loop includes `[tabindex='0']`.
- `app/components/Chat.tsx` `waiting` was local to the dialog, so closing and reopening while a request was pending allowed two requests at once and a wrong entry marked as failed. **Done:** `waiting` lives in `Chat`.

## Suggestions

- `lib/chat-rules.ts` The 4 000-character limit for history answers is a loose bound. **Done:** the comment says so.
- `lib/chat.ts` With no `LLM_API_KEY` the failure is a 502 and a log line with the class name only. **Left as it is:** the manual check on the preview shows a missing key at once.
- The booking text agrees with `wiki/manual/boka-charter.md`; the comment in `lib/chat-prompt.ts` points at it.

## Outside the change

- `wiki/manual/boka-charter.md` still says a booking cannot be opened again on the site, but Min bokning can (TRIP-023). A small cleanup for a technical task; not added to the board yet.

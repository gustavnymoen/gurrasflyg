---
id: TRIP-035
title: UX upgrades for Agneta
---

# Code review of TRIP-035

**Result:** Passed (the one must-fix finding was fixed; the fixes were checked by the author and by the affected tests, the reviewer was not run a second time)
**Date:** 2026-11-08, review run 1
**Summary:** The fold, the `[[ALL]]` marker and the Escape handling each live in one place and are well covered by tests. One finding blocked, the card disagreeing with the code on R1, and it was fixed together with three should-fix points.
**Security:** Passed. The only new data is a boolean `all`; `takeMarkers` removes the marker on the server, `parseSaved` accepts only `all === true`, nothing is rendered as HTML. No new input, route or query. `/security-review`: not needed, as the card says.

How the review works: `wiki/system/code-review.md`.

## Must fix

- Card #127, R1: the acceptance criterion said "the page's bar is not in the seam", the opposite of the code and the card's title. **Done:** settled with the user (bar in the seam) and the card was corrected.

## Should fix

- `app/globals.css`, `app/components/Chat.tsx`: the page jumped to the top when the panel opened or closed, since scrolling moves between the window and `body`. **Done:** `Chat.tsx` carries the position over both ways; browser test `TRIP-035-R1 the page keeps its place …`.
- `app/components/ChatBody.tsx` `Bubble`: `max-w-full self-start` made short answers only as wide as their text, while R2 says the bubble spans the panel. **Done:** `w-full`; the garbled comment was fixed.
- `app/components/Answer.tsx` `List`: the button condition was hard to read. **Done:** reordered and a comment says why `open` is needed.

## Suggestions

- `lib/agent-rules.ts` `takeMarkers`: a `MARKERS` loop would be shorter with a fourth marker. **Done:** left as it is, three markers.
- R3 test: while the mouse stays over the picture, hover keeps it large after a second click. **Done:** the test only asserts `aria-expanded`, noted for later size assertions.

## Outside the change

- The `Spydenius` surname remains in the older `specs/TRIP-032` and `TRIP-033` folders: history, left as it is.

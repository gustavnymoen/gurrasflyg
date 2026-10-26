---
id: TRIP-013
title: "Charter: Destination pages and search"
---

# Code review of TRIP-013

**Result:** Passed (the one must-fix finding of run 1 is fixed)
**Date:** 2026-10-26, review run 1
**Summary:** The search and address handling is safe (matched in memory, shown as React text, no SQL or HTML path), the shared `Autocomplete` change leaves the airport fields as they were apart from the announcement, and the Swedish names are defined once. One requirement was not met and is fixed: the Wikipedia credit was missing on a destination page without a photo.
**Security:** The security points of the review: passed. `/security-review`: run on the branch, no findings of high confidence (search text never reaches SQL; the two fare queries use `?` parameters; texts are React text; the status source is a link only for http(s); address values are checked against known values).

How the review works: `wiki/system/code-review.md`.

## Must fix

- `app/charter/[id]/page.tsx` R7 says every page credits Wikipedia as the source of the text, but the credit sat inside the photo's caption, so a destination without a photo (Project Riese – Osówka) had none. **Done:** the credit is its own line after the photo, shown for every destination; the R7 browser test checks the Osówka page.

## Should fix

- `app/api/destination-search/route.ts` `q` had no length limit on a public route. **Done:** cut at 100 characters (`MAX_QUERY_LENGTH`).
- `verification.md`: the browser suite is over the 180 s budget. **Done:** page loads saved by merging tests (27 → 20); the rest is recorded in `verification.md`, and a technical task to speed up the suite is proposed to the user rather than added to the board unasked.

## Suggestions

- `lib/destinations.ts` `choicesWithCounts` was exported but used only in the file. **Done:** no longer exported.
- `DestinationBrowser` (why a chosen suggestion keeps the filters) and `tripTo` (why `Pick<…>`) had no comment. **Done:** comments added.

## Outside the change

- The 404 for an unknown id has status 200 because of streaming under Cache Components (documented in `solution.md`). A pre-stream check could be a backlog item; not added.
- `getDestinations()` reads all destinations for each list and page; a short cache could be a performance task; not added.

---
id: TRIP-020
title: "Visual design: start page"
---

# Code review of TRIP-020

**Result:** Passed
**Date:** 2026-10-22, review run 1
**Summary:** Built as the card and `solution.md` describe: the wordmark header, the photo with its credit, the smaller carousel, the global reduced-motion rule and the phone grid match the requirements, and every requirement has a test or a recorded manual check. One weak test, no errors.

How the review works: `wiki/system/code-review.md`. A later run is added at the top as "Review run 2".

## Must fix

None.

## Should fix

- `tests/TRIP-020-start-page-design.spec.ts:154` "TRIP-020-R5 the carousel changes card without sliding" never changed card; it only read `transition-property`. **Done:** the test now clicks "Nästa omdöme", checks that another review is in focus, and then that the card has no `transform` transition.

## Suggestions

- `app/globals.css:67` The hop lasts 0.9 s, while R5 and `DESIGN.md` say at most 300 ms for controls. **Done:** `DESIGN.md` says the wordmark's take-off and hop are decoration, not a control's response, so the limit doesn't apply.
- `app/page.tsx:47` R3's "loaded with priority" had no test. **Done:** the R3 photo test checks `fetchpriority="high"`.
- `app/components/Wordmark.tsx:34` Removing the take-off class on `onAnimationEnd` lets the page reach "no running animations", and is recorded in `solution.md`. **Done:** nothing to change.

## Outside the change

None.

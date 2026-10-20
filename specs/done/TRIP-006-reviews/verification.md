---
id: TRIP-006
title: "Reviews"
---

# Verification of TRIP-006

Specified after the feature was built. Checked with the tests in `tests/TRIP-006-reviews.spec.ts`, locally against a fresh test database (`npm run test:local`) and against the live site (`npm test`).

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-006-R1 | Test `TRIP-006-R1 the card in focus shows stars, title, text and name` | local, live | Pass | 2026-10-20 |
| TRIP-006-R2 | Test `TRIP-006-R2 arrows, keys and clicks move the cards round`, including a swipe with the pointer | local, live | Pass | 2026-10-20 |
| TRIP-006-R3 | Test `TRIP-006-R3 form has name, stars, title and text with a counter` | local, live | Pass | 2026-10-20 |
| TRIP-006-R4 | Test `TRIP-006-R4 every field is required` | local, live | Pass | 2026-10-20 |
| TRIP-006-R5 | Test `TRIP-006-R5 and R6 a saved review is listed and shown first, and can be deleted` | local, live | Pass | 2026-10-20 |
| TRIP-006-R6 | Test `TRIP-006-R5 and R6 a saved review is listed and shown first, and can be deleted` | local, live | Pass | 2026-10-20 |

## Checks before done

- [x] `npm run lint` and `npx tsc --noEmit` without errors
- [x] `npm run build` succeeds
- [x] `npm run test:local` passes
- [x] `npm test` passes against the live site
- [x] Wiki updated (system and manual) and a line added to `wiki/log.md`

## Notes

- The first run against the live site failed because the test read the admin list before it was refreshed (the live site is slower than local). The test now waits for the list. The run left two "E2E" reviews in production, which were deleted; `tests/global-teardown.ts` now cleans up automatically.
- The swipe in R2 is tested as a pointer drag in a desktop browser; a real touch swipe on a phone has not been checked.
- That the carousel is hidden without reviews and respects "reduce motion" is checked in code review of `ReviewCarousel.tsx`.

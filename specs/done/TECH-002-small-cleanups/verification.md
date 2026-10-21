---
id: TECH-002
title: Small cleanups
---

# Verification of TECH-002

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-002-R1 | `npm run lint`, `npm run typecheck` and `npm run build`: no errors or warnings | local | Pass | 2026-10-21 |
| TECH-002-R1 | The existing suite, `npm run test:local`: 49 passed | local | Pass | 2026-10-21 |
| TECH-002-R1 | `npm test` against the live site after deploy | live | Not checked yet | |
| TECH-002-R2 | `git rm` of the five files; search of the project (outside `node_modules/`, `.next/`, `specs/`) finds no reference to them; `git status public/images` shows no change | local | Pass | 2026-10-21 |
| TECH-002-R3 | Search: `getAirports` and `textareaClass` occur nowhere in the code; TRIP-001 tests (airport suggestions) pass | local | Pass | 2026-10-21 |
| TECH-002-R4 | Search: 150 for the review text occurs once, in `lib/review-rules.ts`; TRIP-006-R3 test (counter "0/150", keeps 150 characters) passes | local | Pass | 2026-10-21 |
| TECH-002-R4 | Code review: `createReview` in `lib/reviews.ts` still rejects longer texts with "Texten får vara max ${MAX_REVIEW_LENGTH} tecken.", now imported from `lib/review-rules.ts`. Not testable in the browser, since the form's `maxLength` stops longer texts | code | Pass | 2026-10-21 |

## Definition of Done

- [x] Tests: the existing suite is the test; `npm run test:local` passes
- [ ] Deployed, and `npm test` passes against the live site
- [x] Accessibility: not applicable, visitors see no change
- [x] Spec matches what was built, no open questions
- [x] Manual not affected (no change for visitors); system docs (`architecture.md`) and `wiki/log.md` updated
- [x] No leftovers
- [x] Clean code; lint, type check and build pass
- [x] No new technical tasks

## Notes

- The comment explaining `await connection()` sat on the deleted `getAirports`; it was moved to `searchAirports` in `lib/db.ts`, the next function that calls it.
- The comment on the limit no longer repeats the number, so 150 occurs once.

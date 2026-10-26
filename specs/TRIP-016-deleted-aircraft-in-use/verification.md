---
id: TRIP-016
title: Deleted aircraft still looks in use
---

# Verification of TRIP-016

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-016-R1 | Unit tests `TRIP-016-R1 …` in `lib/admin.test.ts` (the only aircraft deleted frees the class and add-on; one shared with another aircraft stays in use); browser tests `TRIP-016-R1 …` in `tests/TRIP-016-deleted-aircraft-in-use.spec.ts` (deleted straight after the aircraft, with no waiting; the shared class still says "Du kan ej ta bort") | local | Pass | 2026-10-26 |
| TRIP-016-R2 | Browser test `TRIP-016-R1 R2 …`: the trash is pressed and confirmed right after the aircraft is deleted, and the server deletes the row. The page holds no flag any more (code review) | local | Pass | 2026-10-26 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `lib/admin.test.ts` against the unit test database | local | Pass | 2026-10-26 |
| Browser tests | `tests/TRIP-016-deleted-aircraft-in-use.spec.ts`; TRIP-003-R5 and R9 changed to confirm first, then read the server's reason | local | Pass | 2026-10-26 |
| Smoke test | Not applicable: admin, writes | | | |
| Accessibility | axe after the deletions and on the "Du kan ej ta bort" dialog; the delete dialogs on the live site per the checklist: not checked yet | local | Pass (local) | 2026-10-26 |
| Security | Not applicable: no new input or route | | | |
| Code review | [review.md](review.md) | local | Passed | 2026-10-26 |

Live tests after the deploy: not checked yet.

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 100 unit + 181 browser | 140.3 s | 2.8 s |
| After | 102 unit + 183 browser | 142.7 s | 2.8 s |

(The "before" run overlapped with the first edits, which touched no tests that were left to run.)

## Definition of Done

- [x] Tests (Live tests after the deploy: not checked yet)
- [x] Test suite within budgets
- [ ] Accessibility: axe passes locally; the live checklist is not checked yet
- [x] Requirements match what was built; no open questions
- [x] Manual, system docs and `wiki/log.md` updated
- [x] No leftovers: `inUse` is removed from the types, queries and props
- [x] Clean code: lint, typecheck and build pass
- [x] Code review: done, no must-fix findings; see [review.md](review.md)
- [x] Improvements: none found

## Requirements as built

### TRIP-016-R1 No stale "in use"

After an aircraft is deleted, the classes and add-ons that no other aircraft or booking uses are not shown as in use, and deleting them works at once. A class used by another aircraft is still in use.

### TRIP-016-R2 The server decides

Deleting a class, add-on or aircraft is decided by the server's check in the database, never by a flag in the page. The trash always asks "Är du säker?" first; the server's reason is shown if the row is in use.

## Notes

- The race itself (a few hundred milliseconds) was not reproduced on the old code; the cause was found by reading it, and the fix removes the flag altogether.
- The card said a trash pressed with an old flag says "Du kan ej ta bort". Now an in-use row asks for confirmation first and then says it, one click more.

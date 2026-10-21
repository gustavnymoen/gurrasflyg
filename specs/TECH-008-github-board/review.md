---
id: TECH-008
title: GitHub board for the backlog
---

# Code review of TECH-008

## Review run 2

**Result:** Passed
**Date:** 2026-10-21, review run 2
**Summary:** TECH-008 does what card #9 asks for (R1–R7), and the must-fix from run 1 is fixed. One verification row didn't match the repository.

### Must fix

None.

### Should fix

- `specs/TECH-008-github-board/verification.md:17` The R7 row said "one hit", but the copied requirements quote the old paths, so the search finds three more in this file. **Done:** the row names them and why they are excluded.

### Suggestions

- `specs/TECH-008-github-board/verification.md:39` A copy of the requirements in the repo can trip repo-wide searches; name such copies as excluded, or search for a pattern they don't contain. **Done:** noted in the R7 row.

### Outside the change

- `specs/overview.md:82` "Specified afterwards" didn't fit TECH-001 to TECH-007. **Done:** one clarifying sentence.
- `wiki/system/index.md` lists only TRIP-001 to TRIP-006 (as in run 1). Not added.

## Review run 1

**Result:** Stopped (1 must fix), fixed
**Date:** 2026-10-21, review run 1
**Summary:** The move to the board is careful: cards #11–#14 hold the requirements, each `solution.md` is a faithful copy of the old Data and Interface, the board matches, and the R7 search holds. It stopped because TECH-008 had no `verification.md` yet.

How the review works: `wiki/system/code-review.md`. A later run is added at the top as "Review run 2".

### Must fix

- `specs/TECH-008-github-board/` No `verification.md`, so R1–R7 had no recorded check, no requirements as built and no Definition of Done. **Done:** added from the new template.

### Should fix

- `specs/TRIP-009-return-trip-datepicker/verification.md:34` The Definition of Done still followed the old template ("Spec updated", "backlog", no review item, no "Requirements as built"). **Done:** brought in line with `specs/_template/verification.md`.
- `specs/TRIP-007-import-course-data/solution.md:18` "the spec is updated if so" was copied over; there is no spec any more. **Done:** now "this file is updated if so".
- `.github/ISSUE_TEMPLATE/config.yml:1` `blank_issues_enabled: true` is GitHub's default and changes nothing. **Done:** removed.

### Suggestions

- `specs/TECH-008-github-board/solution.md:30` Copying the requirements into `verification.md` is a deliberate copy, made so the repo stays a true record, and only works if it happens every time; hence the checklist item. **Done:** left as it is.
- `wiki/system/index.md:28` The column "Spec" fits only the old features. **Done:** renamed "Folder".

### Outside the change

- `specs/TECH-007-pipeline-and-cleanups/verification.md:41` and `specs/TECH-006-code-review/review.md:47` mention moves to `done/` and `ongoing/`: historical records, kept. Not added.
- `wiki/system/index.md` lists only TRIP-001 to TRIP-006 under Features, not the finished TECH tasks. Not added: `specs/overview.md` lists them all.

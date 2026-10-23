---
id: TECH-010
title: Delete the old OneDrive folder
---

# Code review of TECH-010

How the review works: `wiki/system/code-review.md`. A later run is added at the top as "Review run 2".

## Review run 2

**Result:** Passed
**Date:** 2026-10-23, review run 2
**Summary:** All findings from run 1 are fixed: the card's reworded R1.1, R1.2 and R1.7 match the records, `flow.mmd` and `solution.md` describe the deletion through OneDrive, and the test times agree. Two small mismatches remained between the wording of R1.2/R1.7 and the files to be committed.

### Must fix

None.

### Should fix

- `verification.md:18` R1.7's search finds nothing only because this folder was untracked; once committed, the old path is named in this card's own docs. **Done:** noted in the record.
- `verification.md:13` R1.2 allows only this card's documentation in `git status`, but TECH-011's `verification.md` is changed too. **Done:** the record says it is this branch's related cleanup, committed with it.

### Suggestions

- `verification.md:16` Say that `npm run test:time` runs `npm run test:local`. **Done.**

### Outside the change

- TECH-010 missing from the list in `specs/overview.md`. **Done:** added.
- Merged local branches (`backlog-specs`, `TECH-002-small-cleanups` and others) can be deleted; `TECH-007-pipeline-and-cleanups` has 2 commits not in `main`. Mentioned to the user.

## Review run 1

**Result:** Stopped (1 must fix)
**Date:** 2026-10-23, review run 1
**Summary:** The recorded results that can still be checked from the repo (branch states, CI run IDs, the scripts) hold up, and the content-hash method for R1.1 checks more than the card asked for. One finding blocked: R1.1 in the card still asked for a `diff -rq` result the work didn't get, yet the check was marked Pass. A few places in the docs contradicted each other.

### Must fix

- `specs/TECH-010-delete-onedrive-folder/verification.md:12` R1.1 in the card asked that `diff -rq` show no differences except generated files; the record says `diff -rq` lists many files and marks R1.1 Pass on a different method. **Done:** R1.1 in card #32 reworded with the user to the content check that was done (`git hash-object` and `git cat-file -e`, `cmp`, line comparison for uncommitted files), and copied again into `verification.md`.

### Should fix

- `flow.mmd:13` said "Folder to the bin through Finder", the plan that failed. **Done:** the step says the user deletes the folder through OneDrive.
- `solution.md:22` said the Node archive and `travel-workshop` are left as they are. **Done:** the decision says they were moved to the bin at the user's request, and the picture is kept.
- `verification.md:20` and `:29` gave different test times (63.5 s and 63.9 s). **Done:** R1.5 names its run (63.9 s, before the deletion) and the table shows both.
- `verification.md:13` R1.2 asked for a clean `git status`, the record said it shows this branch's changes. **Done:** R1.2 in the card reworded with the user ("shows nothing but this card's own documentation"); the record names the files.
- `verification.md:18` R1.7 also asked about the editor. **Done:** the user uses no editor; R1.7 in the card says so, and the record too.
- `verification.md:35` "Deployed" was unchecked without a reason. **Done:** marked not applicable, the site doesn't change.

### Suggestions

- `solution.md:23` Hashing every old file and looking it up in the new repo's object store answers "is this content anywhere in the history?" when two trees have drifted apart; worth having as the requirement itself. **Done:** R1.1 now describes the method.

### Outside the change

- Local branches already merged or pushed (`TECH-002-small-cleanups`, `backlog-specs` and others) could be deleted; `TECH-007-pipeline-and-cleanups` has 2 commits not in `main` to look at first. Not added to the board: a local tidy-up, mentioned to the user.
- Claude Code's history for the old path in `~/.claude/projects/` can be removed separately (out of the card's scope). Mentioned to the user.

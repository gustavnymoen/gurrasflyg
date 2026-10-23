---
id: TECH-010
title: Delete the old OneDrive folder
---

# Verification of TECH-010

How each requirement was checked. The old repo was at `~/Library/CloudStorage/OneDrive-AQCSwedenAB/AI projekt/gurrasflyg/gurrasflyg/` ("old"), the new one is `~/Documents/AI Projekt/gurrasflyg/` ("new").

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-010-R1.1 No work only in the old folder | `diff -rq` (the card's exclusions) lists many files, since new has moved on (TRIP-008 to TECH-011), and nothing only in old. Every old file was hashed with `git hash-object` and looked up in new's Git objects. Not found: `.env.local`, `.env.turso` (see R1.4); `.impeccable/`, `db/gurrasflyg.db` and every file in `db/backups/` (ignored by Git), identical to new by `cmp`; `next-env.d.ts` identical; `tsconfig.tsbuildinfo` (generated); and `wiki/log.md`, `wiki/system/architecture.md`, `specs/TRIP-008-visual-design/verification.md`, the uncommitted TRIP-008 work at the move. Compared line by line with TRIP-008's commit (26e13e0): `verification.md` has no line only in old; the other two only have the earlier wording that TRIP-008 rewrote on purpose (the OneDrive sentences, the shorter TRIP-008 log line) | local | Pass | 2026-10-23 |
| TECH-010-R1.2 All Git work is on GitHub | In new: `git status` shows only this card's own documentation and TECH-011's `verification.md`, a related cleanup recorded below; both are this branch's own work, committed with it, `git stash list` is empty, and every local branch has `git rev-list origin/<branch>..<branch>` empty or is merged into `origin/main` (`TECH-002-small-cleanups`, `backlog-specs` and this branch are merged and not ahead). TRIP-008 is merged (PR #33) | local | Pass | 2026-10-23 |
| TECH-010-R1.3 The old repo has nothing extra | All 59 commits of `git log --all` in old exist in new (`git cat-file -e`); `git stash list` in old is empty | local | Pass | 2026-10-23 |
| TECH-010-R1.4 Secrets are in place | `cmp` of `.env.local` and `.env.turso`: identical (not printed) | local | Pass | 2026-10-23 |
| TECH-010-R1.5 The new folder works | `npm run lint`, `npm run typecheck`, `npm run build` without errors or warnings; `npm run test:time` (which runs `npm run test:local`) 108 passed, 63.9 s; `npm run dev` ready in 147 ms, `/` and `/admin/login` answered 200, and it said "Databas oförändrad: ~/Ai Projekt/gurrasflyg-data/gurrasflyg.db" | local | Pass | 2026-10-23 |
| TECH-010-R1.6 The database is safe | `lib/local-db.mjs` puts the database in `~/Ai Projekt/gurrasflyg-data/`, outside both folders; `db/backups/` in new has the latest backups (newest `gurrasflyg-2026-10-23T08-21-22.db`, taken by `npm run dev`). No cloud copy, by the user's choice (2026-10-22) | local | Pass | 2026-10-23 |
| TECH-010-R1.7 Nothing points at the old path | `git grep -i "CloudStorage\|OneDrive-AQCSwedenAB"`, before this folder was committed: nothing. Once it is committed, the old path is named only in this card's own documentation, which records what was deleted. "OneDrive" remains only in history (`wiki/log.md`, TRIP-008's `verification.md`). The terminal and Claude Code work in new; the user uses no editor | local | Pass | 2026-10-23 |
| TECH-010-R1.8 The user confirms | The user confirmed in the chat, and also asked to delete `travel-workshop`, the Node folder and its archive next to it | local | Pass | 2026-10-23 |
| TECH-010-R2 The old folder is deleted | Finder couldn't move the folder to the bin, because some of its files were only in the cloud ("objektet måste hämtas", -8013). The user deleted it through OneDrive, and it is gone both in OneDrive and on the Mac: `…/AI projekt/` now holds only `Pipeline Gurras Flyg.png` (kept on purpose) and a `.DS_Store`. Afterwards `npm run test:time`: 108 passed, 63.5 s | local | Pass | 2026-10-23 |

## Test suite

`npm run test:time`. No test is added or changed.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 108 | 62.6 s (TECH-011) | 2.5 s |
| After | 108 | 63.9 s before the deletion (R1.5), 63.5 s after it (R2) | 2.5 s (`TRIP-006-R2 arrows, keys and clicks move the cards round`) |

## Definition of Done

- [x] Tests: the requirements are checked by hand (they concern folders on this computer, not the site); `npm run test:local` passes (2026-10-23)
- [x] Test suite: within the time budgets; no test added or changed
- [x] Deployed: not applicable, the site doesn't change (only docs are merged); Live tests still run after the merge
- [x] Accessibility: not applicable, visitors see no change
- [x] Requirements in the card match what was done (R1.1, R1.2 and R1.7 reworded on 2026-10-23; R2: deleted by the user through OneDrive, as the card says), no open questions left; copied below as built; `solution.md` describes how it was done
- [x] Manual: not applicable; system docs need no change (no reference to the old path), `wiki/log.md` updated
- [x] No leftovers: the old folder is the leftover, and the work is to remove it
- [x] Clean code: no code changed; `npm run lint`, `npm run typecheck` and `npm run build` pass
- [ ] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements: none needed
- [x] Small related cleanups: TECH-011's `verification.md` records its pull request's and Live tests' times and results; `travel-workshop` (the course's untouched starter, its `data/`, `knowledge/` and `public/images/` identical to this repo's), the Node folder and its archive (not used: Node is `/usr/local/bin/node`) were moved to the bin, at the user's request

## Requirements as built

Copied from card #32 on 2026-10-23 (R1.1, R1.2 and R1.7 reworded with the user that day).

### TECH-010-R1 Everything is verified before deleting

Before the folder is deleted, each of these is checked and recorded in `verification.md` with the date:

1. **No work only in the old folder.** Every file in the old folder (with the exclusions above) has its content somewhere in the new repo's Git history (`git hash-object`, looked up with `git cat-file -e`), or is identical to the new folder's file (`cmp`), or is generated. For a file changed but not committed at the move, no line is missing from the new repo's committed version. (`diff -rq` is not enough: the new folder has moved on since the move.)
2. **All Git work is on GitHub.** In the new repo, `git status` shows nothing but this card's own documentation, `git stash list` is empty, and every local branch is either pushed (`git rev-list origin/<branch>..<branch>` is empty) or merged into `main`. In particular the TRIP-008 work, which on 2026-10-22 was uncommitted, is committed and pushed.
3. **The old repo has nothing extra.** In the old folder, `git log --all` has no commits missing from the new repo, and `git stash list` is empty.
4. **Secrets are in place.** `.env.local` and `.env.turso` exist in the new folder and are identical to the old ones (compared with `cmp`, never printed).
5. **The new folder works.** `npm run lint`, `npm run typecheck`, `npm run build` and `npm run test:local` pass, and `npm run dev` starts and uses `~/Ai Projekt/gurrasflyg-data/gurrasflyg.db`.
6. **The database is safe.** `~/Ai Projekt/gurrasflyg-data/` is outside the old folder, and `db/backups/` in the new folder has the latest backups. Nothing is kept in a cloud: the code is in Git, and the user accepts that uncommitted work and the local database are lost if the computer is.
7. **Nothing points at the old path.** A search for `CloudStorage` and `OneDrive-AQCSwedenAB` in the repo finds nothing, and the terminal and other tools open the new folder (no editor is used).
8. **The user confirms** the deletion.

### TECH-010-R2 The old folder is deleted

The folder `~/Library/CloudStorage/OneDrive-AQCSwedenAB/AI projekt/gurrasflyg/` is deleted through OneDrive (so it lands in the OneDrive recycle bin and can be restored for a while).

Acceptance criteria:

- **Then** the folder no longer exists, and `npm run test:local` still passes in the new folder.

## Notes

- Moving the four items to the bin in one Finder call timed out (AppleEvent, 2 minutes); one at a time worked for the archive, `travel-workshop` and the Node folder.
- `Pipeline Gurras Flyg.png` in `…/AI projekt/` is kept: the user wants to present the pipeline to the course leader later, with an updated picture.

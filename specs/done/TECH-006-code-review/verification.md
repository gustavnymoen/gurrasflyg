---
id: TECH-006
title: Code review
---

# Verification of TECH-006

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-006-R1 | Code review: `wiki/system/code-review.md` covers why, what is reviewed, what to look for, the three levels and what is not commented on; `wiki/system/index.md` links to it | docs | Pass | 2026-10-21 |
| TECH-006-R2 | Code review: `.claude/agents/code-reviewer.md` has the tools Read, Grep, Glob and Bash (no edit tools), tells it to use Bash only to read, and points to the guide instead of repeating it | docs | Pass | 2026-10-21 |
| TECH-006-R2 | `git status` after each of the three review runs showed no file changed by the reviewer | local | Pass | 2026-10-21 |
| TECH-006-R2 | The agent loaded as its own agent type (`code-reviewer`) in a new Claude Code session | local | Pass: a new session (`claude -p`) lists `code-reviewer` among its agent types | 2026-10-21 |
| TECH-006-R3 | Code review: `CLAUDE.md` has step 7 "Review" and Definition of Done point 7; `specs/_template/verification.md` has the checklist point | docs | Pass | 2026-10-21 |
| TECH-006-R4 | `specs/_template/review.md` exists; this task's and TECH-002's `review.md` follow it, summary first; both `verification.md` link to them. Run 1 stopped the task and the user was told in a few lines | local | Pass | 2026-10-21 |
| TECH-006-R5 | Code review: the "Merge" step in `CLAUDE.md` says to post `review.md` with `gh pr comment` | docs | Pass | 2026-10-21 |
| TECH-006-R5 | Both reports posted with `gh pr comment` on pull request #5 (TECH-002 and TECH-006 were merged in one pull request) | GitHub | Pass | 2026-10-21 |
| TECH-006-R6 | Trial run on TECH-002: report in the R4 format, passed with two suggestions; see `specs/done/TECH-002-small-cleanups/review.md` | local | Pass | 2026-10-21 |
| TECH-006-R1 | Strictness, from the trial and this task's own runs: a correct small change passed without blocking findings; real gaps in this task (untracked files, read-only promise) were stopped; design findings stayed at should fix. As intended, so the guide was not changed | local | Pass | 2026-10-21 |
| All | `npm run lint` and `npm run typecheck` pass; no site code changed, so build and tests are as for TECH-002 | local | Pass | 2026-10-21 |

## Definition of Done

- [x] Tests: no site behaviour changed; requirements checked by code review and the trial run
- [x] Deployed, and `npm test` passes against the live site (after the merge of pull request #5: 43 passed, 6 skipped)
- [x] Accessibility: not applicable, visitors see no change
- [x] Spec matches what was built, no open questions
- [x] Manual not affected; system docs (`code-review.md`, `index.md`), README and `wiki/log.md` updated
- [x] No leftovers
- [x] Clean code; lint and type check pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] No new technical tasks

## Notes

- The review reviewed itself: run 1 stopped this task with two must-fix findings, which is how the gaps in the agent's instructions were found.
- R2 was changed with the user during the work: the agent keeps Bash and is read-only by instruction, not by tool restriction.

---
id: TECH-006
title: Code review
---

# Code review of TECH-006

How the review works: `wiki/system/code-review.md`. The agent file was created during the session and Claude Code only loads agents when a session starts, so both runs used a general agent told to follow `.claude/agents/code-reviewer.md` exactly.

## Review run 2

**Result:** Passed
**Date:** 2026-10-21
**Summary:** TECH-006 adds what R1 to R5 ask for, and the trial report for TECH-002 (R6). The spec said less than the guide in two places, and one old requirement number was left after the renumbering.

### Must fix

None.

### Should fix

- `specs/TECH-002-small-cleanups/review.md:9` Called the trial run TECH-006-R5; after the renumbering it is R6. **Done:** fixed.
- `spec.md` R1, R2 and `flow.mmd` said "diff against `main`", while the guide and agent also cover a given base commit, uncommitted changes and new files. **Done:** spec and flow now describe the change as the guide does.
- `spec.md` R1 must-fix said "a requirement not met"; the guide also counts a requirement without a real test. **Done:** added to R1.

### Suggestions

- `.claude/agents/code-reviewer.md:4` A trade-off worth remembering: limit an agent's tools where you can, and where you can't, use a written rule plus a check afterwards (here `git status`). **Done:** nothing to change.

### Outside the change

- `README.md` didn't list the `feature` frontmatter field that nine wiki pages use. **Done:** added to the list (small, so fixed here).

## Review run 1

**Result:** Stopped (2 must fix)
**Date:** 2026-10-21
**Summary:** Everything in the spec was there, but the agent would not have seen new, untracked files, and R2 promised a read-only agent that Bash makes only read-only by instruction.

### Must fix

- `.claude/agents/code-reviewer.md:13` The instructions for getting the change missed untracked files, and with a base commit also dropped `git diff HEAD`. The review runs before the commit, so new files are usually untracked. **Done:** the agent and the guide now list commits, `git diff HEAD` and `git status --short`; run 2 found the new files on its own.
- `.claude/agents/code-reviewer.md:4` R2 said the agent can't edit files, but with Bash it can. **Done:** settled with the user: the agent keeps Bash (it needs Git), and R2 now says it has no edit tools and is told to use Bash only to read.

### Should fix

- `spec.md:5` Still `status: backlog` after the move to `ongoing/`. **Done:** fixed.

### Suggestions

- `CLAUDE.md:21` Fixing findings after the Verify step changes checked code. **Done:** step 7 now says to run lint, the type check and the affected tests again.
- `spec.md:91` R6 came before R5. **Done:** renumbered: R5 is the pull request comment, R6 the trial run.

### Outside the change

- TECH-002's `verification.md` didn't link its new `review.md`. **Done:** linked.

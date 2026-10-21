---
type: Guide
title: Code review
description: Why and how every feature and technical task is reviewed before it is done, what the reviewer looks for and how strict the review is.
resource: .claude/agents/code-reviewer.md
feature: TECH-006
tags: [workflow, code-review, quality]
timestamp: 2026-10-21
---

# Code review

Every feature and technical task is reviewed before it is done (the "Review" step in `CLAUDE.md`). The review is done by the reviewer agent in `.claude/agents/code-reviewer.md`, which starts without the context of the one who wrote the code and follows this guide. This page is the one place the review rules live.

## Why

- **Find errors before they reach the site,** while they are cheap to fix.
- **Keep the code easy to follow:** no duplicated code, no leftovers, code in the right place.
- **Learn from each change:** a finding says why, not only what.

The review is light. It is there to try out code review as part of the workflow, not to make every change perfect. Lint, the type check and the tests already catch a lot; the review looks for what they can't.

## What is reviewed

- **The change:** the feature's own commits (`git diff main...HEAD`), its uncommitted changes (`git diff HEAD`) and its new files not yet added to Git (`git status --short`). The review runs before the commit, so much of the change is usually uncommitted. When the branch sits on other unmerged work, the one asking for the review gives the base commit to use instead of `main`.
- **Against:** the requirements in the feature's card on the board (what it shall do, and why; read with `gh issue view <card>`), its `solution.md` (how it was meant to be built) and the rules in `CLAUDE.md`.
- Code around the change is read when it is needed to judge the change (for example to see if a helper already exists), but is not itself reviewed.

## What to look for

1. **General errors:** wrong behaviour, missed edge cases (empty values, limits, dates and time zones), missing or wrong error handling, data that can be left half-written.
2. **Requirements:** code that doesn't do what a requirement says, or does more than the requirements ask for. A requirement without a test, or a test that doesn't really check its requirement.
3. **Bad design:** unclear responsibilities, code in the wrong place (for example database logic in a component), needless complexity, names that don't say what something is.
4. **Duplicated code:** something an existing component or helper in `app/components/`, `app/admin/admin-ui.tsx`, `lib/` or `tests/helpers.ts` already does, or the same logic in two places in the change.
5. **Unnecessary code:** leftovers, unused exports, files, styles or scripts the change made unused, commented-out code, debug output.
6. **Project rules:** database changes only through new migrations, course data (`data/`, `knowledge/`, `public/images/`) read-only, no secrets in the code, Swedish for visitors and code comments, English for specs and system docs.

## Levels

Each finding is one of three levels.

| Level | What | Effect |
|---|---|---|
| **Must fix** | An error, a requirement not met or not tested, or a broken project rule. | Blocks: the feature is not done until it is fixed and the review is run again. |
| **Should fix** | Bad design, duplicated or unnecessary code. | Doesn't block. Fixed in the same change when small, otherwise added to the board as a technical task. |
| **Suggestion** | Something worth learning: a pattern, a simpler way, a trade-off. At most three. | Doesn't block. Fixed or left as it is. |

When in doubt between two levels, choose the lower one.

## Not commented on

- What lint and the type check already catch (formatting, unused variables, types).
- Matters of taste where the code already reads like the surrounding code.
- Code outside the change. Problems found there are mentioned in one line as candidates for the backlog, not as findings.

## The report

The reviewer returns its findings; Claude saves them as `review.md` in the feature's folder, from `specs/_template/review.md`, with what was done with each finding. The summary comes first, so the report can be read in a minute. When a review stops the feature, Claude tells the user in a few lines; otherwise it only mentions that the review passed. When the pull request is opened, the report is posted on it as a comment (`gh pr comment`), and a later review run is posted as a new comment.

[System documentation](index.md)

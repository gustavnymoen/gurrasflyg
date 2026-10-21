---
id: TECH-006
title: Code review
area: Shared
status: backlog
created: 2026-10-21
updated: 2026-10-21
depends_on: []
---

# TECH-006 Code review

## Goal

Every feature and technical task is reviewed by someone other than the one who wrote it before it is done, so that errors, bad design and duplicated or unnecessary code are found while they are cheap to fix. The review is light: its purpose is to try out code review as part of the workflow, not to make every change perfect.

## Background

Today Claude both writes and checks the code. The checks (lint, type check, tests, the Definition of Done) catch a lot, but not design problems, and Claude reviewing its own code reads what it meant rather than what it wrote. A reviewer that starts without that context, and only sees the spec, the change and a written guide, works like a colleague reading a pull request.

The review does not change what the site does. Like TECH-001 it changes how the site is built.

## Users

Developers: Claude, which builds and fixes, and the user, who can read the review report but doesn't have to.

## Scope

**In scope**

- A review guide that says why we review, what is checked and how strict the review is.
- A reviewer agent for Claude Code that follows the guide.
- A review step in the workflow and in the Definition of Done, and a short review report per feature.
- The report posted as a comment on the feature's pull request.

**Out of scope**

- A GitHub Action that reviews every pull request automatically. It needs an API key as a repository secret and costs for every push, and would review twice alongside the local review. Can replace the local run later if the practice proves useful.
- Comments on single lines in the pull request. One comment with the report is enough for a light review.
- Reviewing code that was built before this task.
- Stricter levels, for example blocking on design findings. Revisit after a few features.

## Requirements

### TECH-006-R1 A review guide

`wiki/system/code-review.md` shall describe the review, in English:

- **Why:** find errors before they reach the site, keep the code easy to follow, and learn from each change.
- **What is reviewed:** the change on the branch compared with `main`, against the feature's `spec.md` and the rules in `CLAUDE.md`.
- **What to look for:** general errors (wrong behaviour, missed edge cases, error handling), code that doesn't do what the spec says, bad design (unclear responsibilities, the wrong place for code, needless complexity), duplicated code where an existing component or helper could be reused, and unnecessary code (leftovers, unused exports, code the spec doesn't ask for).
- **Levels:** each finding is one of
  - **Must fix:** an error, a requirement not met, or a broken project rule (for example a changed migration, edited course data, a secret in the code). Blocks the feature from being done.
  - **Should fix:** bad design, duplicated or unnecessary code. Fixed in the same change when small, otherwise added to the backlog as a technical task. Does not block.
  - **Suggestion:** at most three, only when there is something worth learning. Does not block.
- **Not commented on:** what lint and the type check already catch, matters of taste, and code outside the change (that goes to the backlog).

Acceptance criteria:

- **Then** the guide covers why, what is reviewed, what to look for, the three levels and what is not commented on.
- **Then** `wiki/system/index.md` links to it.

### TECH-006-R2 A reviewer agent

`.claude/agents/code-reviewer.md` shall define a reviewer agent that reads the guide, the feature's `spec.md` and the diff against `main`, and reports its findings by level, each with file, line and a short reason.

Acceptance criteria:

- **Then** the agent can only read files and run read-only commands (such as `git diff`); it can't edit files.
- **Then** its instructions point to `wiki/system/code-review.md` instead of repeating the guide, so the guide is the one place the rules live.

### TECH-006-R3 Review is a step in the workflow

`CLAUDE.md` shall have a review step between "Document" and "Done": Claude runs the reviewer agent, fixes the must-fix findings, handles the should-fix findings (fixed now or added to the backlog), and runs the review again until no must-fix findings remain.

Acceptance criteria:

- **Then** the workflow in `CLAUDE.md` has the step, and the Definition of Done has a point "Code review done, no must-fix findings left".
- **Then** `specs/_template/verification.md` has the same point in its checklist.

### TECH-006-R4 A short review report

Each review shall be saved as `review.md` in the feature's folder: a short summary at the top (passed, or what stopped it), then the findings by level and what was done with each. A template is in `specs/_template/review.md`.

Acceptance criteria:

- **Then** the report can be read in a minute: the summary first, one line per finding.
- **Given** a review with must-fix findings, **then** Claude tells the user in a few lines what stopped the feature and how it was fixed. Otherwise Claude only mentions that the review passed.
- **Then** `verification.md` links to `review.md`.

### TECH-006-R6 The report is posted on the pull request

When Claude opens the pull request for a feature (step "Merge" in `CLAUDE.md`), it shall post the content of `review.md` as a comment on it, with `gh pr comment`. If the review is run again after the pull request is opened, the new report is posted as a new comment.

Acceptance criteria:

- **Given** a feature with a `review.md`, **when** its pull request is opened, **then** the pull request has a comment with the summary and the findings.
- **Then** the "Merge" step in `CLAUDE.md` says so.

### TECH-006-R5 The review is tried out

The reviewer agent shall be run once on an already finished change, TECH-002, to check that it works and is as strict as intended.

Acceptance criteria:

- **Then** the trial run gives a report in the format of R4, posted on TECH-002's pull request (R6), and the result is recorded in this task's `verification.md`. If it is too strict or too loose, the guide is adjusted.

## Data

None.

## Interface

No visible change on the site.

- `wiki/system/code-review.md` (new): the review guide.
- `.claude/agents/code-reviewer.md` (new): the reviewer agent.
- `specs/_template/review.md` (new): the report template.
- `CLAUDE.md`, `specs/_template/verification.md`, `wiki/system/index.md`: the review step, posting the report on the pull request, and links.

## Non-functional requirements

None beyond `specs/overview.md`.

## Open questions

None.

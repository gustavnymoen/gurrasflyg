---
id: TECH-008
title: GitHub board for the backlog
---

# Verification of TECH-008

How each requirement was checked. The task changes the way of working, not the site, so the checks are code reviews of the files and of the board (with `gh`); no requirement can be tested from the browser.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-008-R1 | `gh api graphql`: the project "Gurras Flyg" is linked to `gustavnymoen/gurrasflyg`; `gh project field-list`: Status has Backlog, Specified, Ongoing, Review, Done; Work type has Feature, Fix, Tech; Area has Flight booking, Charter, Administration, Shared | GitHub | Pass | 2026-10-21 |
| TECH-008-R2 | `gh project item-list`: the 14 items of the old backlog are cards #11–#24 in the same order, each with an ID in its title (TRIP-010–TRIP-018 new); `specs/overview.md` keeps the finished features, links to the board, and has no backlog table | GitHub, docs | Pass | 2026-10-21 |
| TECH-008-R3 | Code review: `.github/ISSUE_TEMPLATE/card.md` has the explanation, Goal, Scope, requirements and open questions; `specs/_template/` has `solution.md`, `flow.mmd`, `verification.md`, `review.md` and no `spec.md`; `specs/` is flat | docs | Pass | 2026-10-21 |
| TECH-008-R4 | The bodies of cards #11–#14 compared with `diff` against the old `spec.md` from Goal on, without Data and Interface: identical apart from a trailing blank line. Their Data and Interface are in `solution.md`; the old `spec.md` removed. The finished features moved with `git mv` (shown as renames) and keep `spec.md`; links in `wiki/system/index.md`, `wiki/system/api-airports.md`, `wiki/log.md` and TECH-006's records updated | docs | Pass | 2026-10-21 |
| TECH-008-R5 | Code review: `CLAUDE.md` (the board, workflow steps 1, 2, 7, 8, 9, Definition of Done 3 and 8, technical tasks), `README.md`, `wiki/system/code-review.md` and `.claude/agents/code-reviewer.md` describe the new way. The reviewer agent found card #9 by its ID and read the requirements with `gh issue view` in review run 1 | docs, local | Pass | 2026-10-21 |
| TECH-008-R6 | `gh api graphql`: the board's workflows "Item closed" and "Pull request merged" are enabled. That the merge of this task's pull request ("Closes #9") moves card #9 to Done | GitHub | Pass; the move not checked yet | 2026-10-21 |
| TECH-008-R7 | The acceptance search `grep -rnE 'specs/(backlog\|ongoing\|done)'` outside `node_modules/`: one hit in `specs/TECH-005-whole-kronor/spec.md` (history, excluded), and three in this file's "Requirements as built", which quotes R4 and R7 (excluded as a copy of the card). The folders, `specs/_template/spec.md` and the backlog table are gone; the memory files describe the board | local | Pass | 2026-10-21 |
| All | `npm run lint`, `npm run typecheck`, `npm run build`: no errors or warnings; `npm run test:local`: 56 passed | local | Pass | 2026-10-21 |

## Definition of Done

- [x] Tests: every requirement has a recorded check; `npm run test:local` passes
- [ ] Deployed, and `npm test` passes against the live site
- [x] Accessibility: not applicable, visitors see no change
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual: not applicable (the site doesn't change); system docs (`wiki/system/code-review.md`, `wiki/system/index.md`) and `wiki/log.md` updated
- [x] No leftovers: the old folders, `specs/_template/spec.md`, the backlog table and the old texts are deleted
- [x] Clean code: `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements noticed along the way added to the board: none needed

## Requirements as built

Copied from card #9 on 2026-10-21.

### TECH-008-R1 The board
The project "Gurras Flyg" is linked to the repository, with the columns Backlog, Specified, Ongoing, Review and Done, and the fields Work type (Feature, Fix, Tech) and Area (Flight booking, Charter, Administration, Shared). The order of the cards in Backlog is the priority: the top card is next.

### TECH-008-R2 The backlog is on the board
Every item of the backlog in `specs/overview.md` is a card, in the same order, with an ID in its title (`TRIP-010 …`). Items without an ID got the next free one. `specs/overview.md` keeps the list of finished features and links to the board instead of holding the backlog.

### TECH-008-R3 Requirements in the card, solution in the repo
A card's body has a short explanation, then (once specified) Goal, Scope, the requirements (`<ID>-R1 …`) with acceptance criteria, and open questions. Its folder `specs/<ID>-<name>/` (flat, no `backlog/`, `ongoing/` or `done/`) is created when the work starts and holds `solution.md` (how it is built: data, interface, decisions and why), `flow.mmd`, `verification.md` and `review.md`. A template for new cards is in `.github/ISSUE_TEMPLATE/`, and `specs/_template/` has `solution.md` instead of `spec.md`.

### TECH-008-R4 Existing specs are moved
- The requirements of TRIP-007, TRIP-008, TECH-003 and TRIP-009 are in their cards; their `spec.md` is removed, and its Data and Interface sections become `solution.md`.
- The finished features move from `specs/done/` to `specs/<ID>-<name>/` and keep their `spec.md` as history.
- Links to the old paths (wiki, README, specs) are updated.

### TECH-008-R5 The rules describe the new way of working
`CLAUDE.md` (workflow, Definition of Done, technical tasks), `README.md`, `wiki/system/code-review.md` and the reviewer agent describe it: pick the top card; move it to Specified when its requirements and questions are settled, to Ongoing when the branch is created, to Review when the pull request is opened; the reviewer reads the requirements with `gh issue view`. When a feature is done, its `verification.md` records the requirements as built, so the repo shows what was built even if the card changes later.

### TECH-008-R6 A merge moves the card to Done
A pull request with "Closes #<card>" moves the card to Done when it is merged (the board's built-in workflows).

### TECH-008-R7 No leftovers from the old backlog
What the move made unused is deleted:
- the folders `specs/backlog/`, `specs/ongoing/` and `specs/done/`, once everything in them has moved;
- `specs/_template/spec.md` (replaced by `solution.md` and the card template);
- the backlog table in `specs/overview.md`, and every text that describes the old way (a backlog in `overview.md`, IDs given when a spec is written, folders moving between `backlog/`, `ongoing/` and `done/`), in `CLAUDE.md`, `README.md`, `wiki/` and the memory files;
- links to the old paths.

Acceptance criteria:
- **Then** a search of the repository (outside `node_modules/` and the finished features' history in their `spec.md`) finds no `specs/backlog`, `specs/ongoing` or `specs/done`.

## Notes

- The cards #11–#14 had already been given the requirements when the board was set up, so R4 only needed the comparison and the move of Data and Interface.
- Small cleanups from the review: the TRIP-009 verification checklist follows the new template, and the "Spec" column in `wiki/system/index.md` is now "Folder".

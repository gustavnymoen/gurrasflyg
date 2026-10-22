---
id: TECH-008
title: GitHub board for the backlog
card: "#9"
depends_on: []
---

# TECH-008 GitHub board for the backlog: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 9`.

## Data

None.

## Interface

No visible change on the site.

- The board "Gurras Flyg" (GitHub project 2, linked to the repository): columns in the field Status, the fields Work type and Area, and the built-in workflows "Item closed" and "Pull request merged", which set Status to Done.
- `specs/`: one flat folder per feature, `specs/<ID>-<name>/`. The four specified features (TRIP-007, TRIP-008, TECH-003, TRIP-009) have `solution.md` with the Data and Interface sections of their old `spec.md`; their other sections are in their cards (#11–#14). The finished features keep `spec.md` as history.
- `specs/_template/`: `solution.md` instead of `spec.md`; `verification.md` has a section "Requirements as built".
- `.github/ISSUE_TEMPLATE/card.md` (new): the template for new cards, with the sections a card gets once it is specified.
- `CLAUDE.md`, `README.md`, `specs/overview.md`, `wiki/system/code-review.md`, `.claude/agents/code-reviewer.md`: the new way of working.

## Decisions

- **Requirements in the card, solution in the repo.** The user wants a visual board both of us can edit, and the requirements are what is discussed on it. How it is built stays next to the code, where it is reviewed and versioned with it.
- **Requirements copied into `verification.md` at done.** A card can be edited after the work is merged; the copy keeps the repo a true record of what was built.
- **Finished features keep `spec.md`.** Moving their requirements into cards would rewrite history for no gain; they are only moved to the flat structure.
- **The reviewer finds the card by its ID** (`gh issue list --search "<ID> in:title"`), so it needs only the feature ID, as before.

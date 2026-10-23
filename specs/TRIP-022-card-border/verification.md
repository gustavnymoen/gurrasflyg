---
id: TRIP-022
title: One border colour for cards and buttons, toned-down primary buttons
---

# Verification of TRIP-022

How each requirement was checked. Tests are in `tests/TRIP-022-card-border.spec.ts` unless named otherwise.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-022-R1 | Tests `TRIP-022-R1 the search form and the sign-in form have the fields' border colour` (the search card has the same colour as the Från field) and `TRIP-022-R1 and R4 the admin cards, the aircraft form and its Spara and Avbryt have the fields' border colour` (also axe with the aircraft form open) | local | Pass | 2026-10-23 |
| TRIP-022-R2 | Test `TRIP-022-R2 every review card has the fields' border colour, also the one in focus`. That the review in focus is still larger and more visible: the TRIP-006 and TRIP-020 carousel tests, unchanged apart from the border check removed from `TRIP-020-R4 …` | local | Pass | 2026-10-23 |
| TRIP-022-R3 | Test `TRIP-022-R3 the airport suggestions keep their fainter border`. The focused field and the focus ring: `TRIP-008-R6 … a focused field has the accent border` (since TECH-016 `TRIP-008-R4 and R6 a focused field has the accent border and ring`) and `TRIP-008-R9 keyboard focus shows a visible ring`, unchanged. Dialogs: `TRIP-019-R3 a dialog floats with the floating shadow`, which now also checks the border (added after the review) | local | Pass | 2026-10-23 |
| TRIP-022-R4 | Tests `TRIP-022-R4 the primary button is toned down, and buttons get a wine red border on hover` (Logga in: background, border, text colour, text contrast 4.5:1 against the button laid over the card, wine red border on hover) and `TRIP-022-R1 and R4 …` (Spara in the aircraft form, compact, and Avbryt without fill, with the fields' border, wine red on hover; it is the same shared `SaveCancel` in `app/admin/admin-ui.tsx` as in the add-on form the criterion names, and the aircraft form is already open in that test). That changing the accent still changes the buttons: `TRIP-008-R1 changing the accent …`, now comparing before and after. Looked at in the browser on `/admin/login` | local | Pass | 2026-10-23 |
| All | `npm run lint`, `npm run typecheck`, `npm run build` without errors or warnings; `npm run test:time` 144 passed. Against the live site after the deploy: Live tests run 39958375790 on `main`, 131 passed, 13 skipped (`runsLocally`) | local, live | Pass | 2026-10-23 |
| Accessibility | `expectNoA11yViolations` on the admin page with the aircraft form open (R1); the start page and the admin page by the existing axe tests (TRIP-020, TRIP-021), unchanged. The checklist on the live site: items 2 and 6, below | local, live | Pass | 2026-10-23 |

## The checklist

The items of `wiki/system/accessibility.md` that the change concerns, gone through on <https://gurrasflyg.vercel.app> on 2026-10-23 in the browser, with the colours measured by a throw-away script. Recorded on TECH-016's branch, the next one after the merge.

| Item | Result |
|---|---|
| 2 Focus visible | On `/admin/login`, Tab from Lösenord to Logga in gives the button a 2 px `#c83560` outline (`:focus-visible`), clearly visible against the toned-down button and the new card border. The focused field keeps its accent border and ring (`TRIP-008-R4 and R6 a focused field has the accent border and ring`). Pass |
| 6 Contrast | Measured on `/admin/login`: the text on Logga in against the button laid over the card 12.18:1 (at least 4.5:1); the button's border against the card 3.30:1; the field's border against the card 3.30:1 and against the field 3.32:1 (at least 3:1). The card's border against the page 3.31:1, though it is decorative and has no requirement. Pass |

## Test suite

`npm run test:time` before and after the change.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 139 | 86.0 s | 2.8 s (`TRIP-009-R12 axe finds no violations with the calendar open, a range chosen and a message`) |
| After | 144 | 88.2 s (+3 %) | 2.8 s (the same) |

Five new tests; the border checks in `TRIP-008-R5 …`, `TRIP-019-R3 …` and `TRIP-020-R4 …` and the buttons' colours in `TRIP-008-R4 …`, `TRIP-008-R8 …` and `TRIP-019-R5 …` moved to them, so nothing is tested twice. `TRIP-008-R4 the primary button has the accent and a focused field the accent border` is renamed `TRIP-008-R4 a focused field has the accent border`.

## Definition of Done

- [x] Tests: every requirement is tested or has a recorded manual check; `npm run test:local` passes
- [x] Test suite: within the time budgets, total time grown by at most 25 % (or the cause handled), and the new tests follow the quality rules in `CLAUDE.md`
- [x] Deployed, and `npm test` passes against the live site
- [x] Accessibility: changed pages and states pass `expectNoA11yViolations`, and the relevant items of `wiki/system/accessibility.md` are checked on the live site (items 2 and 6, 2026-10-23)
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/`), system docs (`wiki/system/`) and `wiki/log.md` updated (the manual and `wiki/system/` describe no border colours, so only `DESIGN.md` and the log changed)
- [x] No leftovers: everything the change made unused is deleted, no commented-out code or debug output
- [x] Clean code: reuses existing components and helpers; `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements noticed along the way added to the board (none found)

## Requirements as built

Copied from the card (#43) on 2026-10-23, as built.

### TRIP-022-R1 Cards have the fields' border colour

Every card on the site has the same border colour as the input fields (`--color-line-strong`).

Acceptance criteria:

- **Given** the start page, **when** it is shown, **then** the search form's card has the same border colour as its input fields.
- **Given** a signed-in administrator on `/admin`, **when** the page is shown, **then** the admin cards and the aircraft form have the same border colour as the input fields.

### TRIP-022-R2 Review cards have the fields' border colour

Every review card in the carousel, the one in focus and the side cards, has the same border colour as the input fields. The review in focus is marked only by its size and full visibility, as today.

Acceptance criteria:

- **Given** the start page with reviews, **when** the carousel is shown, **then** the review in focus and the side cards have the same border colour as the input fields, and the review in focus has no accent border.
- **Given** the carousel, **when** it is shown, **then** the review in focus is still larger and more visible than the side cards (TRIP-020).

### TRIP-022-R3 Focus and floating things unchanged

Focus rings, the accent border of the field that has focus, and the border of floating things (dialogs and the suggestion list) look as before.

Acceptance criteria:

- **Given** any field, **when** it has focus, **then** it has the accent border and focus ring as before.
- **Given** a dialog in admin or the airport suggestion list, **when** it is open, **then** its border is `--color-line` as before.

### TRIP-022-R4 Toned-down buttons

Primary buttons have a faint wine red tone (`--color-accent` at 30 % over the card), the fields' border colour (`--color-line-strong`) and light text (`--color-ink`). Secondary buttons have no fill and the fields' border colour. On hover the border of both turns wine red (`--color-accent-strong`), like the round buttons. Focus and a disabled button look as before. The text has a contrast of at least 4.5:1 against the button.

Acceptance criteria:

- **Given** the sign-in page, **when** it is shown, **then** Logga in has the toned-down background, the fields' border colour and light text.
- **Given** a primary button, **when** the pointer is over it, **then** its border is wine red.
- **Given** the admin form for a new add-on, **when** it is open, **then** Spara has the same look in the compact size, Avbryt has no fill and the fields' border colour, and its border turns wine red on hover.
- **Given** a primary button, **when** its contrast is measured, **then** the text is at least 4.5:1 against the button over the card.

## Notes

- Also on this branch: TRIP-009's live results (Live tests and the accessibility checklist, 2026-10-23) are recorded in its `verification.md`, since TRIP-009 was merged before they were done.

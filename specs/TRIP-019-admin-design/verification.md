---
id: TRIP-019
title: "Visual design: admin page"
---

# Verification of TRIP-019

How each requirement was checked.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-019-R1 | Code review: every text button on `/admin` is a `<Button size="compact">`, cards are `Card` (via `CollapsibleCard`), fields use `fieldClass("compact", …)` / `textAreaClass("compact")`, messages `Message`; the remaining `<button>`s are `IconButton`, the collapsible card's heading and the star picker, all on tokens. `grep -rn "buttonClass\|cardClass\|compactCardClass" app` finds nothing: `buttonClass` is removed, `cardClass` and `compactCardClass` are no longer exported, nor `ButtonVariant`, `ButtonSize` and `FieldSize` | local | Pass | 2026-10-22 |
| TRIP-019-R2 | Code review: `grep -rnE '#[0-9a-fA-F]{3,8}\b\|rgba?\(\|(bg\|text\|border\|ring\|…)-(neutral\|red\|emerald\|…)\b\|-\[#' app` finds nothing outside `app/globals.css` | local | Pass | 2026-10-22 |
| TRIP-019-R3 | Tests `TRIP-019-R3 the admin cards have the card border and the card shadow` and `TRIP-019-R3 a dialog floats with the floating shadow` in `tests/TRIP-019-admin-design.spec.ts` | local | Pass | 2026-10-22 |
| TRIP-019-R4 | Tests `TRIP-019-R4 a saved review gives green text without a box` and `TRIP-019-R4 an add-on without a name gives red text without a box` | local | Pass | 2026-10-22 |
| TRIP-019-R5 | Test `TRIP-019-R5 Spara and Avbryt are compact pill buttons of the same shape` | local | Pass | 2026-10-22 |
| TRIP-019-R6 | `npm run lint`, `npm run typecheck`, `npm run build` without errors or warnings; `npm run test:local` 91 passed. The admin tests TRIP-002 to TRIP-006 are unchanged, except that `reviewForm` and `writeReview` moved from the TRIP-006 test file to `tests/helpers.ts` unchanged | local | Pass | 2026-10-22 |
| TRIP-019-R7 | Code review: `DESIGN.md` has the section "Admin pieces" with `CollapsibleCard`, `Dialog`, `IconButton`, `EditButton`/`RemoveButton`/`DeleteButton`, `SaveCancel` and the table helpers | local | Pass | 2026-10-22 |
| Accessibility | Tests `TRIP-019 accessibility: axe finds no violations on the admin page, also with the aircraft form open`, and axe in the dialog and add-on error tests | local | Pass | 2026-10-22 |
| All | `npm test` against the live site | live | Not checked yet (after deploy) | |

## Definition of Done

- [x] Tests: every requirement is tested or has a recorded code review; `npm run test:local` passes (91 passed, 2026-10-22)
- [ ] Deployed, and `npm test` passes against the live site
- [ ] Accessibility: `/admin`, the open aircraft form, a dialog and an error message pass `expectNoA11yViolations` (locally). The manual checklist `wiki/system/accessibility.md` doesn't exist yet: it comes with TRIP-021. Not checked here.
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual: `wiki/manual/admin-*.md` still describe the admin page correctly (it works as before), so they are unchanged; system docs (`DESIGN.md`, `wiki/system/architecture.md`) and `wiki/log.md` updated
- [x] No leftovers: `buttonClass` and the exports `cardClass`, `compactCardClass`, `ButtonVariant`, `ButtonSize`, `FieldSize` and the admin's own `ExpandButton` style are gone; no commented-out code or debug output
- [x] Clean code: reuses the shared components; test helpers shared through `tests/helpers.ts` instead of copied; `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements: none needed
- [x] Small related cleanups: the suggestion list uses `floatClass`; TRIP-008's `verification.md` now records its live test run

## Requirements as built

Copied from card #28 on 2026-10-22.


### TRIP-019-R1 The admin page uses the shared components

Every button, field, text area, checkbox, card and message on `/admin` shall get its look from the shared components of TRIP-008, in compact size. The admin's own pieces (collapsible card, dialog, icon buttons, save/cancel, table head and rows, subheadings) are built on those components and the tokens.

Acceptance criteria:

- **Then** every `<button>`, `<input>`, `<textarea>` and card on `/admin` gets its look from the shared components. (Code review.)
- **Then** class helpers in `admin-ui.tsx` and `app/components/` that are no longer used are deleted. (Code review.)

### TRIP-019-R2 No raw colours left

No file under `app/` other than `app/globals.css` shall contain a raw colour value, a Tailwind palette colour class or an arbitrary colour value. TRIP-008-R1 already made this true for the whole site; it has to stay true when the admin page is rebuilt.

Acceptance criteria:

- **Then** no file under `app/` other than `globals.css` contains a hex colour, `rgb(`/`rgba(` or a Tailwind palette colour class (`neutral-*`, `red-*`, `emerald-*` and so on). (Code review, with a search.)

### TRIP-019-R3 Cards and dialogs

The admin cards (classes, add-ons, aircraft, reviews) shall have the card border and the card shadow of TRIP-008-R5; dialogs float above with the floating shadow.

Acceptance criteria:

- **Then** the admin cards have the card border and the card shadow. (Test: computed `box-shadow` and `border`.)
- **When** a dialog is open (for example "delete aircraft"), **then** it has the floating shadow.

### TRIP-019-R4 Messages as coloured text

Error and success messages in the admin forms shall use the `Message` component: coloured text without a box, border or background, errors with `role="alert"` and confirmations with `role="status"`. The texts don't change. TRIP-008 already switched them to `Message`; this card adds the tests.

Acceptance criteria:

- **When** the administrator saves a review, **then** "Omdömet sparades." is shown as green text without a background or border.
- **When** an add-on is saved without a name, **then** "Addon måste ha ett namn." is shown as red text without a background or border.

### TRIP-019-R5 Compact buttons

The admin buttons shall be the pill buttons of TRIP-008-R8 in compact size.

Acceptance criteria:

- **Then** Spara and Avbryt are compact primary and secondary buttons with the same shape.

### TRIP-019-R6 The admin page behaves as before

Apart from its look, the admin page shall work exactly as before.

Acceptance criteria:

- **Then** `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:local` and, after deploy, `npm test` pass, with the admin tests (TRIP-002 to TRIP-006) unchanged.

### TRIP-019-R7 Documented

`DESIGN.md` shall list the admin's shared pieces (collapsible card, dialog, icon buttons, table) and when to use them.

Acceptance criteria:

- **Then** `DESIGN.md` lists them. (Code review.)


## Notes

- axe found that the stars in "Nytt omdöme" were smaller than 24 px (WCAG 2.5.8, target size). They were like that before; each star now has a 28 × 28 px click area. This falls under the card's non-functional requirement (WCAG 2.2 AA).
- While running the tests, one `npx playwright test` was started by mistake without `BASE_URL`, that is against the live site. It stopped at once; a check of the live admin page afterwards found no "E2E" data.

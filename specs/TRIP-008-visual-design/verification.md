---
id: TRIP-008
title: "Visual design: foundation"
---

# Verification of TRIP-008

How each requirement was checked.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-008-R1 | Tests `TRIP-008-R1 changing --font-display changes every heading` and `TRIP-008-R1 changing the accent changes buttons, focus ring, switch and suggestions` in `tests/TRIP-008-visual-design.spec.ts`. Code review: `grep -rnE '#[0-9a-fA-F]{3,8}\b\|rgba?\(\|(bg\|text\|border\|…)-(neutral\|red\|emerald\|…)' app` finds nothing outside `globals.css`; `--color-*: initial` removes the palette | local | Pass | 2026-10-22 |
| TRIP-008-R2 | Code review: every button, input and card in the search form and on the sign-in page uses `Button`, `RoundButton`, `Field`/`fieldInputClass`, `Checkbox` or `Card`; `ui.tsx` deleted, admin imports the class helpers from the component files | local | Pass | 2026-10-22 |
| TRIP-008-R3 | Tests `TRIP-008-R3 headings and text are set in Bricolage Grotesque in the right sizes` and `TRIP-008-R3 the page no longer loads Geist` | local | Pass | 2026-10-22 |
| TRIP-008-R4 | Tests `TRIP-008-R4 the primary button has the accent and a focused field the accent border` (renamed `… a focused field has the accent border` by TRIP-022, which checks the primary button), `TRIP-008-R4 text and placeholders have a contrast of at least 4.5:1` and `TRIP-008-R4 field borders and the focus ring have a contrast of at least 3:1` | local | Pass | 2026-10-22 |
| TRIP-008-R5 | Test `TRIP-008-R5 the search form and the sign-in form are cards that stand out` | local | Pass | 2026-10-22 |
| TRIP-008-R6 | Tests `TRIP-008-R6 each field shows its label and placeholder and keeps its accessible name`, `… a focused field has the accent border`, `… an invalid date gives a red border and red text under the field`, `… the checkbox is drawn with the accent when chosen`; TRIP-001 tests unchanged apart from the placeholders | local | Pass | 2026-10-22 |
| TRIP-008-R7 | Tests `TRIP-008-R7 a date error is red text without a box` and `TRIP-008-R7 a wrong password is red text without a box` | local | Pass | 2026-10-22 |
| TRIP-008-R8 | Test `TRIP-008-R8 buttons are pills, and a disabled button is faded` | local | Pass | 2026-10-22 |
| TRIP-008-R9 | Test `TRIP-008-R9 keyboard focus shows a visible ring`. Code review: `::selection` uses the accent, tables have `tabular-nums` (`app/globals.css`) | local | Pass | 2026-10-22 |
| TRIP-008-R10 | `npm run lint`, `npm run typecheck`, `npm run build` without errors or warnings; `npm run test:local` 85 passed. Changed tests: only the placeholders in `TRIP-001-R1` | local | Pass | 2026-10-22 |
| TRIP-008-R11 | Code review: `DESIGN.md` lists every token in `globals.css` and every shared component; linked from `wiki/system/index.md` and `architecture.md` | local | Pass | 2026-10-22 |
| TRIP-008-R12 | Tests `TRIP-008-R12 axe finds no WCAG A or AA violations on the start page`, `… with a date error shown`, `… on the sign-in page with a wrong password` | local | Pass | 2026-10-22 |
| All | `npm test` against the live site, by the "Live tests" workflow after the merge: 72 passed, 13 skipped (local only) | live | Pass | 2026-10-22 |

## Definition of Done

- [x] Tests: every requirement is tested or has a recorded code review; `npm run test:local` passes (85 passed, 2026-10-22)
- [x] Deployed, and `npm test` passes against the live site ("Live tests", 2026-10-22)
- [ ] Accessibility: the changed pages and states pass `expectNoA11yViolations` (R12, locally). The manual checklist `wiki/system/accessibility.md` doesn't exist yet: it comes with TRIP-021, which goes through it on every page. Not checked here.
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/soka-flyg.md`), system docs (`DESIGN.md`, `wiki/system/index.md`, `architecture.md`) and `wiki/log.md` updated
- [x] No leftovers: `ui.tsx`, `Alert`, Geist, the gradient headings and the unused `Card` props are deleted; no commented-out code or debug output
- [x] Clean code: reuses the shared components; `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Small related cleanup: the text saying OneDrive syncs `db/backups/` is removed from `CLAUDE.md`, `README.md`, `wiki/system/architecture.md`, `lib/local-db.mjs` and `scripts/db-setup.mjs`, since the project moved out of OneDrive
- [x] Technical tasks for larger improvements: none needed; the admin dialog's look is already in TRIP-019-R3

## Requirements as built

Copied from card #12 on 2026-10-22.

### TRIP-008-R1 Design tokens in one place

All colours, fonts, corner radii, shadows and motion curves shall be defined once, as CSS custom properties in `app/globals.css`, and exposed to Tailwind through `@theme`. Components use only these (for example `bg-surface`, `text-ink-muted`, `rounded-card`, `shadow-card`), never raw colour values, Tailwind's own palette (`neutral-*`, `red-*`, `emerald-*`) or arbitrary values like `bg-[#1f1f23]`.

The tokens are those of the design board: ground, surface, sunken surface (fields), floating surface (menus), ink, muted ink, faint ink (placeholders), line (dividers), strong line (borders of fields and checkboxes), accent and strong accent (wine red `#8b1e3f` and `#c83560`), brass (`#c9a46a`), danger, success; radii for fields, cards (default and compact), suggestion rows and pills; the card shadow and the floating shadow; the display and body font.

Three values differ from the design board so that the contrast requirements are met (settled with the product owner on 2026-10-22): faint ink is `#958d83` (the board's `#776f66` gives 3.5:1), the strong accent is `#c83560` (the board's `#b0284f` gives 2.9:1 against the ground), and the strong line (40 % ink) is new, since the board's line (14 %) gives 1.5:1.

Acceptance criteria:

- **Then** no file under `app/` other than `globals.css` contains a hex colour, `rgb(`/`rgba(` or a Tailwind palette colour class, and Tailwind's own palette is removed from the theme. (Code review, with a search.)
- **When** the value of `--font-display` is changed, **then** every heading changes font, and nothing else needs editing. (Test: the token is changed in the browser.)
- **When** the accent tokens (accent and strong accent) are changed, **then** every primary button, focus ring, selected checkbox and selected suggestion changes colour. (Test: the token is changed in the browser.)

### TRIP-008-R2 One shared component per kind of element

Each kind of element shall have one shared component (or class helper) in `app/components/`: `Button` (variants primary, secondary and quiet; sizes default and compact), `RoundButton` (+, −, arrows), text field and text area (sizes large, small and compact; error state), `Checkbox`, `Card` (default and compact), `Message` (error and success) and `Stars`. The search form and the sign-in page use them, and define no button, field, card or message style of their own.

Acceptance criteria:

- **Then** every `<button>`, `<input>` and card in the search form and on the sign-in page gets its look from these components. (Code review.)
- **Then** `ui.tsx` is replaced by the component files; the class helpers the admin page uses (`fieldClass`, `textAreaClass`, `buttonClass`, `cardClass`, `compactCardClass`) are part of them. (Code review.)

### TRIP-008-R3 Typography

The site shall use one font family, Bricolage Grotesque, loaded with `next/font` and exposed as the tokens `--font-display` and `--font-body`. Geist and Geist Mono are removed. Headings: page heading 76 px on wide screens and 42 px on a phone, section heading 26 px, body 16–17 px, small text 13 px. Headings have tracking of at most −0.035em and are balanced (`text-wrap: balance`).

Acceptance criteria:

- **Then** the start page heading, the section headings and the body text are set in Bricolage Grotesque in those sizes. (Test: computed font family and size.)
- **Then** the page no longer loads Geist.

### TRIP-008-R4 Colour use

*Changed by TRIP-022-R4 (2026-10-23): primary buttons are no longer filled with the accent but have a faint tone of it (`--color-accent-soft`), the fields' border and light text; on hover the border turns `accent-strong`. Checked by `TRIP-022-R4 …`.*

The ground shall be dark (`color-scheme: dark`). Wine red is reserved for what the visitor does: primary buttons, the focus ring, the selected state (checkbox, suggestion, review in focus). Brass is for details: the stars and the name on a review. Text and placeholders have a contrast of at least 4.5:1 against their background; field borders, checkbox borders and the focus ring at least 3:1 (WCAG 1.4.11).

Acceptance criteria:

- **Then** "Logga in" has the accent background, and a focused field has the accent border and ring.
- **Then** body text, muted text and placeholder text have a contrast of at least 4.5:1. (Test: computed colours.)
- **Then** field borders and the focus ring have a contrast of at least 3:1 against the surface around them. (Test: computed colours.)

### TRIP-008-R5 Cards that stand out

*Changed by TRIP-022 (2026-10-23): cards have the fields' border colour (`--color-line-strong`) instead of the brass-tinted edge, which is removed. The border is checked by `TRIP-022-R1 …`; this test checks the shadows.*

Cards shall have a thin brass-tinted border and a deep shadow with a faint wine red glow, so that they stand out from the background, as on the design board. Menus and pop-ups (airport suggestions) float above with their own shadow.

Acceptance criteria:

- **Then** the search form and the sign-in form have the card border and the card shadow. (Test: computed `box-shadow` and `border`.)
- **Then** the airport suggestions have the floating shadow.

### TRIP-008-R6 Fields, counter and checkbox

Fields shall look as on the design board: a sunken surface, a field label shown small inside the field above the value, the placeholder in faint ink, the accent border and ring on focus, and a red border on error. The traveller counter has round − and + buttons; a disabled button is faded. The checkbox is drawn in the design (accent fill and check when chosen). The behaviour in TRIP-001 (suggestions, dates, counter, return trip) is unchanged.

The visible labels and placeholders are: Från, "Varifrån?"; Till, "Vart vill du?"; Datum, "Välj datum"; Resenärer.

Acceptance criteria:

- **Given** a visitor opens `/`, **then** each field shows its label and placeholder, and the fields keep their accessible names (Från, Till, Datum, Antal resenärer).
- **When** a field has focus, **then** it has the accent border.
- **Given** an invalid date, **then** the field has a red border and the message under it is red text.

### TRIP-008-R7 Messages as coloured text

Error and success messages shall be coloured text without a box, border or background: errors in the danger colour (with `role="alert"`), confirmations in the success colour (with `role="status"`). The `Message` component is used under fields, on the sign-in page and in the admin forms. The texts themselves don't change.

Acceptance criteria:

- **Given** an invalid date, **then** the message under the field is red text without a background or border.
- **When** the administrator signs in with a wrong password, **then** the message is red text without a background or border.

### TRIP-008-R8 Buttons

*Changed by TRIP-022-R4 (2026-10-23): primary buttons are no longer filled with the accent but have a faint tone of it (`--color-accent-soft`), the fields' border and light text; on hover the border turns `accent-strong`. Checked by `TRIP-022-R4 …`.*

Buttons shall have one shape, a rounded pill, and three variants: primary (filled with the accent), secondary (accent border) and quiet (text only), in a default and a compact size. A button pressed down shrinks slightly (`scale(0.97)`, 160 ms); a disabled button is faded and doesn't react.

Acceptance criteria:

- **Then** "Logga in" is a primary button. (The search form has no search button yet; "Sök flyg" is added by TRIP-010 with the `Button` component.)
- **Then** a disabled button has `cursor: not-allowed` and reduced opacity.

### TRIP-008-R9 Browser details

Text selection shall use the accent colour, keyboard focus a visible ring in the strong accent (`:focus-visible`), and numbers in tables tabular figures.

Acceptance criteria:

- **When** the visitor tabs to a button or field, **then** a visible focus ring is shown. (Test: computed outline.)

### TRIP-008-R10 The site behaves as before

Apart from the texts and looks named above, the site shall work exactly as before.

Acceptance criteria:

- **Then** `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:local` and, after deploy, `npm test` pass. Tests are only changed where this card changes a text (the field labels and placeholders in R6).

### TRIP-008-R11 The design system is documented

`DESIGN.md` (project root) shall describe the design: the tokens and what each is for, the components and their variants, the rules (accent only for actions and selection, one font, pill buttons, messages as text, card look), and how to change a font, a colour or a component. `wiki/system/` links to it. TRIP-019 and TRIP-020 add their components to it.

Acceptance criteria:

- **Then** `DESIGN.md` exists and lists every token in `globals.css` and every shared component. (Code review.)

### TRIP-008-R12 Automated accessibility check

The tests shall be able to check a page with axe, using the package `@axe-core/playwright` (new dev dependency), limited to the WCAG 2.x A and AA rules. A helper `expectNoA11yViolations(page)` in `tests/helpers.ts` runs it, so each design card, and every later feature, adds one line per page or state. Moved here from TRIP-021 on 2026-10-22, so that each design card catches its own problems; TRIP-021 adds the remaining states, the manual checklist and the check on the live site.

Acceptance criteria:

- **Then** axe finds no violations on `/`, on `/` with a date error shown, and on `/admin/login` with a wrong password message. (Test.)

The review carousel's side cards are left out of the check: they are faded on purpose (TRIP-006-R1), hidden from screen readers, and the same review is shown at full contrast in focus, so they count as decoration under the exception in WCAG 1.4.3.

## Notes

- The card was split on 2026-10-22 into TRIP-008 (this), TRIP-019 (#28, admin), TRIP-020 (#29, start page) and TRIP-021 (#30, WCAG). The axe helper (R12) was moved here from TRIP-021.
- Three colours differ from the design board to meet contrast: faint ink `#958d83`, strong accent `#c83560`, and the new strong line (40 % ink). Settled with the product owner.
- The criteria about "Sök flyg" were changed to "Logga in": the search form has no search button yet (TRIP-010 adds it).
- Done here although planned for TRIP-019, because removing Tailwind's palette would otherwise have broken the admin page: admin colours mapped to tokens, `Alert` replaced by `Message`.
- Found by the tests while building: an invalid date gave no red border, because two border colour classes were stacked and the CSS order decided. Fixed in `Field.tsx`.
- axe leaves out the review carousel's faded side cards (see `solution.md`).
- Small cleanup in the same change: the arrows in the carousel now use `RoundButton` instead of their own button style.
- Changed by TRIP-009 (2026-10-23): the checkbox "Boka returresa" and `Checkbox` are replaced by the switch "Tur och retur" (`Switch`), and the date field by Utresa and Hemresa with the placeholder "dd/mm". The R1, R4 and R6 tests check the switch instead of the checkbox, R6 the new labels, and the date error is typed in Utresa.

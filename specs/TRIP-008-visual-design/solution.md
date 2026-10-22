---
id: TRIP-008
title: "Visual design: foundation"
card: "#12"
depends_on: [TRIP-001, TRIP-002, TRIP-003, TRIP-004, TRIP-005, TRIP-006]
---

# TRIP-008 Visual design: foundation: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 12`.

The redesign "Loungen" is split into four cards (settled 2026-10-22): this foundation, the admin page (TRIP-019, #28), the start page (TRIP-020, #29) and WCAG 2.2 AA (TRIP-021, #30). The design board in `design-board/` is the visual reference for all four.

## Data

None.

## Interface

- `app/globals.css`: every token in `@theme static`, so Tailwind makes classes of them (`bg-surface`, `rounded-card`, `shadow-card`, `text-section`) and every variable exists in the CSS. `--color-*: initial` and `--font-*: initial` remove Tailwind's palette and fonts (R1, R4). Base styles (`body`, headings, `::selection`, `:focus-visible`, tables) are in `@layer base` (R3, R9).
- `app/layout.tsx`: Bricolage Grotesque with `next/font/google` (with the `opsz` axis), as `--font-bricolage`, used by `--font-display` and `--font-body`; Geist removed (R3). The footer uses the tokens.
- `app/components/` (R2), replacing `ui.tsx`:
  - `Button.tsx`: `Button` and `buttonClass(variant, size)`, variants primary, secondary and quiet, sizes default and compact (R8).
  - `RoundButton.tsx`: + and −, and the carousel's arrows.
  - `Field.tsx`: `Field` (label inside the box, error message under it), `fieldInputClass` for the input inside, and `fieldClass(size, width, error)` and `textAreaClass(size, error)` for fields without a label inside (R6).
  - `Checkbox.tsx`: a real `<input type="checkbox">` with `appearance-none`, and the check mark as an SVG over it (R6).
  - `Card.tsx`: `Card`, `cardClass`, `compactCardClass` (R5).
  - `Message.tsx`: coloured text, `role="alert"` or `role="status"` (R7).
  - `Stars.tsx`: brass stars.
- `app/components/SearchForm.tsx`, `Autocomplete.tsx`: the fields in `Field`, the new labels and placeholders, the counter as a group named "Antal resenärer", `Checkbox` (R6). The suggestion list floats under the field's box (R5).
- `app/page.tsx`, `ReviewCarousel.tsx`: tokens only; the heading has the title size (R3). Their new layout is TRIP-020.
- `app/admin/login/LoginForm.tsx`: `Card`, `Field`, `Button` (R5, R7, R8).
- `app/admin/*`: colours mapped to tokens, `Alert` replaced by `Message`, the class helpers imported from the component files.
- `tests/helpers.ts`: `expectNoA11yViolations(page)` with `@axe-core/playwright` (new dev dependency), WCAG 2.0–2.2 A and AA rules (R12).
- `DESIGN.md` (new, project root) (R11).

New and changed texts for visitors:

| Where | Text |
|---|---|
| Field labels | Från · Till · Datum · Resenärer |
| Placeholders | Varifrån? · Vart vill du? · Välj datum |

## Decisions

- **Tokens in `@theme static`, not in `:root` plus `@theme inline`.** The token is the Tailwind variable itself, so each value is written once. `static` makes Tailwind keep every variable, also those only used in `var()`.
- **Tailwind's palette is removed.** With `--color-*: initial` a class like `text-neutral-500` simply doesn't exist, so R1 holds by construction and not only by review. This broke the admin page's old classes (for example the dialog's backdrop `bg-black/70`), so its colours were mapped to tokens now, instead of a half-broken admin page until TRIP-019. TRIP-019 keeps its component work.
- **Three colours differ from the design board** (settled 2026-10-22): faint ink `#958d83` (the board's gives 3.5:1), strong accent `#c83560` (2.9:1 against the ground), and a new strong line at 40 % ink for borders that show a control (the board's line gives 1.5:1). The board's line stays for dividers.
- **Base styles in `@layer base`.** Unlayered CSS beats Tailwind's classes, so a global `:focus-visible` outline would have drawn a second ring around the input inside a `Field`.
- **The field's border colour is chosen, not stacked.** Two border colour classes in one `className` are decided by their order in the generated CSS, not in the string; the first version showed no red border on error. `Field.tsx` picks one whole class string per state, since Tailwind only finds complete class names.
- **The label sits inside the field**, as on the board, and is a real `<label>`: the fields are named as before, and every field now has a visible label (WCAG 3.3.2), which the old hidden labels didn't give.
- **The traveller counter** is a `role="group"` named "Antal resenärer" with the visible label "Resenärer", which the name contains (WCAG 2.5.3).
- **The checkbox stays a real input** (`appearance-none`), so clicking, the keyboard, screen readers and Playwright work as before; only the check mark is drawn on top.
- **Messages:** `Alert` is replaced by `Message` everywhere, admin included, instead of keeping two versions.
- **No "Sök flyg" button yet.** The search form has no search button; adding one that does nothing would change behaviour. TRIP-010 adds it with `Button`.
- **axe leaves out the carousel's side cards** (`article[aria-hidden="true"]`): they are faded on purpose (TRIP-006-R1) and hidden from screen readers, and the same review is shown at full contrast in focus (WCAG 1.4.3 exception for decoration).

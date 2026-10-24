# Design: Loungen

How Gurras Flyg looks, and how to change it. The site is dark and calm, like an airline lounge in the evening: wine red for what the visitor does, brass for details, and humour in the words (`PRODUCT.md`). The visual reference is the design board in `specs/TRIP-008-visual-design/design-board/index.html`.

Everything is built from **tokens** (named values) and **shared components**. A colour, a font or a button style is changed in one place, and every page follows.

## Tokens

All tokens are defined once, in `@theme static` in `app/globals.css`. Tailwind turns each one into classes: `--color-surface` gives `bg-surface`, `text-surface` and `border-surface`, `--radius-card` gives `rounded-card`, and so on. `--color-*: initial` and `--font-*: initial` remove Tailwind's own palette and fonts, so `text-neutral-500` or `bg-red-400` don't exist and can't creep back in. No file outside `globals.css` writes a colour value (hex, `rgb()`) or an arbitrary colour (`bg-[#…]`).

### Colours

| Token | Class example | Used for |
|---|---|---|
| `--color-ground` | `bg-ground` | The page background. |
| `--color-surface` | `bg-surface` | Cards. |
| `--color-surface-sunk` | `bg-surface-sunk` | Fields inside cards. |
| `--color-surface-float` | `bg-surface-float` | What floats above: suggestion lists, dialogs. |
| `--color-ink` | `text-ink` | Text. |
| `--color-ink-muted` | `text-ink-muted` | Secondary text and field labels (6.8:1 on a card). |
| `--color-ink-faint` | `placeholder:text-ink-faint` | Placeholders (5.3:1 on a card). |
| `--color-line` | `border-line` | Dividers and table rows. Decorative, so no contrast requirement. |
| `--color-line-strong` | `border-line-strong` | Borders of fields, checkboxes, buttons and cards (also the review cards); empty stars. At least 3:1 (WCAG 1.4.11). |
| `--color-accent` | `bg-accent` | A chosen day, the switch turned on, a chosen suggestion. |
| `--color-accent-soft` | `bg-accent-soft` | Primary buttons: the accent at 30 %, with the fields' border and light text. |
| `--color-accent-strong` | `border-accent-strong` | Hover on buttons (the border turns wine red), the focus ring, a focused field. At least 3:1 against the ground. |
| `--color-accent-glow` | `ring-accent-glow` | The glow around a focused field and in the card shadow. |
| `--color-on-accent` | `text-on-accent` | Text on the accent. |
| `--color-brass` | `text-brass` | Details: stars, the plane, the name on a review. |
| `--color-danger` | `text-danger` | Errors. |
| `--color-success` | `text-success` | Confirmations. |

Faint ink, the strong accent and the strong line differ from the design board, which didn't meet the contrast requirements (TRIP-008-R1).

### Type, shape, shadow and motion

| Token | Class | Value |
|---|---|---|
| `--font-display` | `font-display` | Bricolage Grotesque: headings (`h1`–`h3` get it automatically). |
| `--font-body` | `font-body` | Bricolage Grotesque: everything else (set on `body`). |
| `--text-title` | `text-title` | Page heading on wide screens, 76 px, tight tracking. |
| `--text-title-phone` | `text-title-phone` | Page heading on a phone, 42 px. |
| `--text-section` | `text-section` | Section heading, 26 px. |
| `--text-small` | `text-small` | Small text and messages, 13 px. Body text is Tailwind's `text-base`, 16 px. |
| `--radius-field` | `rounded-field` | Fields, 12 px. |
| `--radius-card` | `rounded-card` | Cards, 18 px. |
| `--radius-card-compact` | `rounded-card-compact` | Compact cards and suggestion lists, 14 px. |
| `--radius-option` | `rounded-option` | A row in a suggestion list, 10 px. |
| `--radius-pill` | `rounded-pill` | Buttons. |
| `--shadow-card` | `shadow-card` | Cards: deep shadow with a faint wine red glow. |
| `--shadow-float` | `shadow-float` | What floats above: suggestion lists, dialogs. |
| `--ease-out` | `ease-out` | All motion. |
| `--animate-float-in` | `animate-float-in` | What floats in when it opens (the calendar): faded and 4 px higher to start with, 160 ms. |
| `--animate-takeoff`, `--animate-trail`, `--animate-hop` | `motion-safe:animate-takeoff` … | The wordmark's take-off with its contrail when the page loads (1.4 s, once), and its hop on hover. Keyframes in `@theme`. |

Tailwind's own small radii (`rounded-md`, `rounded-lg`, `rounded-full`) are kept for small details such as the switch and icon buttons.

The font is loaded with `next/font` in `app/layout.tsx` as `--font-bricolage`, which the two font tokens use.

## Components

All in `app/components/`. Pages use these instead of styling their own buttons, fields, cards or messages.

| Component | File | Variants | Use |
|---|---|---|---|
| `Button` | `Button.tsx` | `primary`, `secondary`, `quiet`; sizes `default`, `compact` (admin) | Every button with text. Shrinks slightly when pressed; faded and `not-allowed` when disabled. |
| `buttonClass()` | `Button.tsx` | the same variants and sizes | A link that looks like a button, because it goes to another page: **Fortsätt** from the search results, the links back on `/flyg/plan`. |
| `RoundButton` | `RoundButton.tsx` | default, `compact` | + and −, the carousel's arrows. Needs a `label` (read aloud and shown on hover). |
| `Field` | `Field.tsx` | error state | A field with its label small inside the box, above the value, and the error message under it. The input inside uses `fieldInputClass`. |
| `FieldBox` | `Field.tsx` | `invalid`, `active` | Only the box of a `Field`, for fields whose message is shown elsewhere (the date group). `active` gives it the focus look while focus is somewhere else, in the calendar. |
| `fieldClass()`, `textAreaClass()` | `Field.tsx` | sizes `large`, `small`, `compact`; error state | A field without a label inside, for example in admin tables. |
| `Switch` | `Switch.tsx` | | An on/off choice ("Tur och retur"): a `button` with `role="switch"`, the track filled with the accent when on. |
| `Card` | `Card.tsx` | sizes `default`, `compact` (admin), `flush` (no padding, for a card filled by a button or a label) | Cards. |
| `floatClass`, `floatingCardClass` | `Card.tsx` | | What floats above the page (floating surface and shadow): suggestion lists, and dialogs with a card's shape (`floatingCardClass`). |
| `Message` | `Message.tsx` | `error`, `success` | Errors (`role="alert"`) and confirmations (`role="status"`) as coloured text, without a box. |
| `Stars` | `Stars.tsx` | | A rating, 1–5 stars in brass. |
| `DatePicker`, `Calendar` | `DatePicker.tsx`, `Calendar.tsx` | | The date group Utresa/Hemresa and the calendar that floats under it (TRIP-009, see [the date picker](wiki/system/date-picker.md)). Chosen days in the strong accent, the days between as a band with accent lines, today with a brass ring. |
| `Wordmark` | `Wordmark.tsx` | | The plane in a brass ring and "Gurras Flyg", linking to the start page, in the header of every page (`app/layout.tsx`). The plane takes off into the ring once when the page loads and hops on hover; the take-off is removed when it has played, so the page stands still afterwards. |

### Admin pieces

The admin page's own pieces are in `app/admin/admin-ui.tsx`, built on the components above in compact size.

| Piece | Built on | Use |
|---|---|---|
| `CollapsibleCard` | `Card` (compact) | Each part of the admin page (Klasser & addons, Plan, Omdömen), with a heading that folds it in and out. |
| `Dialog` | `floatingCardClass` | A question over the page ("Är du säker?", "Du kan ej ta bort"), with compact `Button`s. The browser's `<dialog>` with `showModal()`: Tab stays in it, Escape closes it, and focus goes back to the button that opened it. The button to focus first has `data-autofocus`. |
| `LabeledField` | tokens | A visible label above an admin field (`label` with `htmlFor`, WCAG 3.3.2). The width goes on `LabeledField`, the field inside fills it. |
| `IconButton` | tokens | A small button with only an icon: pencil, trash can, check, cross, the arrow that unfolds a row. Needs a `label` (read aloud and shown on hover). |
| `EditButton`, `RemoveButton`, `DeleteButton` | `IconButton`, `Dialog` | Pencil; trash can without a question (rows in an unsaved form); trash can with "Är du säker?". |
| `SaveCancel` | `Button` (compact) | Spara and Avbryt under a form. |
| `thClass`, `rowClass`, `subheadingClass` | tokens | Table heads, table rows with a divider, and headings inside a card. |

In forms, admin fields are `fieldClass("compact", …)` and `textAreaClass("compact")`, each in a `LabeledField`; placeholders give only an example ("t.ex. Premium"). A table too wide for a phone scrolls sideways inside a `relative overflow-x-auto` wrapper, not the page.

## The start page photo

The start page has an evening photo behind the header, heading and search form: `public/brand/skymning.jpg` ("Boeing 757 climbing after the sunset" by Bill Abbott, CC BY-SA 2.0), 1600 px wide and at most 300 kB, loaded with `fetchPriority="high"`. It is decoration (`alt=""`). Two utilities in `globals.css` darken it so that text over it keeps 4.5:1: `photo-shade` evenly on phones and tablets, `lg:photo-shade-wide` towards the text on the left on wide screens; both fade it into the ground towards the reviews. The licence requires the credit, which `PhotoCredit` shows in the footer of the start page only.

The site's own images are in `public/brand/`; `public/images/` is the course's sample data and is never edited.

## Rules

- **The accent is for what the visitor does:** focus, hover and chosen states. Buttons have the fields' light border, which turns wine red on hover; primary buttons also have a faint tone of the accent (`accent-soft`), since a strong filled wine red looked like a warning. Headings and text are never wine red.
- **Brass is for details:** stars, the plane, a reviewer's name. Never for text one has to read.
- **One font**, Bricolage Grotesque, for headings and text.
- **Buttons are pills**, in three variants. A page's most important action is `primary`.
- **Messages are coloured text**, never boxes.
- **Cards** have the same border as the fields and the card shadow; menus and dialogs float with the fainter `--color-line` border and the floating shadow. The review in focus is told apart by its size and full visibility, not by its border.
- **Contrast:** text and placeholders at least 4.5:1, borders that show a control and the focus ring at least 3:1. Check a new colour with the tests in `tests/TRIP-008-visual-design.spec.ts`.
- **Motion** is short (at most 300 ms for controls), uses `ease-out`, and animates only `transform`, `opacity` and colours. Motion has a purpose: a button responds to a press, the carousel slides, the calendar floats in, the wordmark takes off once. The wordmark's take-off (1.4 s) and hop (0.9 s) are decoration, not a control's response, so the 300 ms limit doesn't apply to them.
- **Reduced motion:** when the visitor prefers reduced motion, a rule in `globals.css` turns off every animation and limits transitions to colours and opacity, so nothing moves. New motion needs nothing extra; animations that should only run otherwise are also written `motion-safe:`.
- **Tailwind only finds whole class names.** Write `focus:ring-3`, never `` `${state}:ring-3` ``. To vary a class, choose between whole strings (see `borders` in `Field.tsx`).

## How to change

- **A colour:** change its value in `app/globals.css`. Run `npm run test:local -- tests/TRIP-008-visual-design.spec.ts`; the contrast tests fail if it gets too faint.
- **The font:** change the import in `app/layout.tsx` (`next/font/google`), keeping the variable `--font-bricolage`, or point `--font-display` and `--font-body` at another variable.
- **A component:** change its file in `app/components/`. Every page that uses it follows.
- **A new token:** add it to `@theme static` in `globals.css` and to the tables above.

---
id: TRIP-008
title: Visual design
area: Shared
status: backlog
created: 2026-10-20
updated: 2026-10-21
depends_on: [TRIP-001, TRIP-002, TRIP-003, TRIP-004, TRIP-005, TRIP-006]
---

# TRIP-008 Visual design

## Goal

The whole site gets one consistent design, "Loungen": dark and calm like an airline lounge in the evening, with wine red for what the visitor does and brass for details, and humour in the words. The design is built from tokens and shared components, so that a font, a colour or a button style can be changed in one place as the site grows.

## Background

Today the look is spread over the pages: colours such as `text-neutral-500`, `border-wine/30` and hex values like `#1f1f23` are written directly in each component, the start page heading uses a colour gradient, messages are boxes, and buttons and fields are classes in `app/components/ui.tsx` that some components use and others copy.

The design was chosen with the product owner on 2026-10-20 with the design skills (impeccable, design-taste-frontend, emil-design-eng): four directions were sketched, then three safer ones, and "Loungen" was chosen. Its design board, with the start page and every component, is in [`design-board/index.html`](design-board/index.html) and is the visual reference for this feature. Decisions taken on the board: wine red accent (not petrol), photo background (not drawn), the heading "Vi ordnar det ingen annan kan", messages as coloured text without boxes, and the review carousel working as before but smaller.

The product's voice and constraints are in `PRODUCT.md`.

## Users

Travellers and the administrator: every page changes look. What the site does stays the same.

## Scope

**In scope**

- Design tokens and a Tailwind theme built on them.
- Shared components for every kind of element.
- New look for the start page (header, heading, background photo, search form, review carousel, footer), the admin sign-in page and the admin page.
- Animated wordmark.
- `DESIGN.md` describing the system.
- Meeting WCAG 2.2 level AA on every page, with automated and manual checks that later features reuse.

**Out of scope**

- How the visitor switches between flight booking and charter (to be discussed with the product owner when charter is specified).
- A custom date picker (settled 2026-10-20): the date field keeps the browser's own date picker, in the new field style. A designed calendar belongs to "Add return trip datepicker", where the solution is to be rethought; the calendar on the design board is only a starting point.
- Navigation links to pages that don't exist yet (Charter, Min bokning).
- Changes to what the site does: searching, admin, reviews and sign-in work as before.

## Requirements

### TRIP-008-R1 Design tokens in one place

All colours, fonts, corner radii, shadows and motion curves shall be defined once, as CSS custom properties in `app/globals.css`, and exposed to Tailwind through `@theme`. Components use only these (for example `bg-surface`, `text-ink-muted`, `rounded-card`, `shadow-card`), never raw colour values, Tailwind's own palette (`neutral-*`, `red-*`, `emerald-*`) or arbitrary values like `bg-[#1f1f23]`.

The tokens are those of the design board: ground, surface, sunken surface (fields), floating surface (menus), ink, muted ink, faint ink (placeholders), line, accent and strong accent (wine red `#8b1e3f` and `#b0284f`), brass (`#c9a46a`), danger, success; radii for fields, cards and pills; the card shadow and the floating shadow; the display and body font.

Acceptance criteria:

- **Then** no file under `app/` other than `globals.css` contains a hex colour, `rgb(`/`rgba(` or a Tailwind palette colour class. (Code review, with a search.)
- **When** the value of `--font-display` is changed, **then** every heading and the wordmark change font, and nothing else needs editing. (Manual check.)
- **When** the accent value is changed, **then** every primary button, focus ring, selected checkbox and selected suggestion changes colour. (Manual check.)

### TRIP-008-R2 One shared component per kind of element

Each kind of element shall have one shared component (or class helper) in `app/components/`, used by every page: `Button` (variants primary, secondary and quiet; sizes default and compact), `RoundButton` (+, −, arrows), text field and text area (sizes large, small and compact; error state), `Checkbox`, `Card` (default and compact), `Message` (error and success), `Wordmark` and `Stars`. Existing helpers in `ui.tsx` are replaced by these, and no page defines its own button, field, card or message style.

Acceptance criteria:

- **Then** every `<button>`, `<input>`, `<textarea>` and card on the start page, the sign-in page and the admin page gets its look from these components. (Code review.)
- **Then** helpers that are no longer used are deleted. (Code review.)

### TRIP-008-R3 Typography

The site shall use one font family, Bricolage Grotesque, loaded with `next/font` and exposed as the tokens `--font-display` and `--font-body`. Geist and Geist Mono are removed. Headings: page heading 76 px on wide screens and 42 px on a phone, section heading 26 px, body 16–17 px, small text 13 px. Headings have tracking of at most −0.035em and are balanced (`text-wrap: balance`).

Acceptance criteria:

- **Then** the start page heading, the section headings and the body text are set in Bricolage Grotesque in those sizes. (Test: computed font family and size.)
- **Then** the page no longer loads Geist.

### TRIP-008-R4 Colour use

The ground shall be dark (`color-scheme: dark`). Wine red is reserved for what the visitor does: primary buttons, the focus ring, the selected state (checkbox, suggestion, review in focus). Brass is for details: the wordmark's ring, the stars and the name on a review. Text and placeholders have a contrast of at least 4.5:1 against their background.

Acceptance criteria:

- **Then** "Sök flyg" has the accent background, and a focused field has the accent border and ring.
- **Then** body text, muted text and placeholder text have a contrast of at least 4.5:1. (Test: computed colours.)

### TRIP-008-R5 Cards that stand out

Cards shall have a thin brass-tinted border and a deep shadow with a faint wine red glow, so that they stand out from the background, as on the design board. Menus and pop-ups (airport suggestions, dialogs) float above with their own shadow.

Acceptance criteria:

- **Then** the search form, the review in focus and the admin cards have the card border and the card shadow. (Test: computed `box-shadow` and `border`.)

### TRIP-008-R6 Header with an animated wordmark

Every page shall have a header with the wordmark: the plane in a round brass ring, followed by "Gurras Flyg", linking to the start page. When the page loads, the plane takes off into the ring with a short contrail (about 1.4 s, once); when the pointer is over the wordmark, the plane makes a small hop. Visitors who prefer reduced motion see the wordmark without animation.

Acceptance criteria:

- **Then** the header with the wordmark is shown on `/`, `/admin/login` and `/admin`, and the wordmark links to `/`.
- **Given** reduced motion (`prefers-reduced-motion: reduce`), **then** the wordmark has no animation. (Test with Playwright's `reducedMotion`.)

### TRIP-008-R7 Start page

The start page shall show, in this order: the header, the heading "Vi ordnar det ingen annan kan" (the page's `h1`), the text "Ditt livs flygresa, till städer och till platser andra flygbolag glömt bort.", the search form in a card, and the review carousel under the heading "Vad våra resenärer säger". TRIP-001-R1 is updated: the heading is no longer "Gurras Flyg" (the name is in the wordmark), and the slogan is part of the text under the heading.

Acceptance criteria:

- **Given** a visitor opens `/`, **then** the `h1` is "Vi ordnar det ingen annan kan", followed by the text, the search form and the reviews.

### TRIP-008-R8 Background photo with credit

The start page shall have the photo "Boeing 757 climbing after the sunset" by Bill Abbott (CC BY-SA 2.0, Wikimedia Commons) as its background behind the header, heading and search form, darkened towards the text so that the text stays readable, and fading into the ground towards the reviews. The photo is stored in `public/brand/` (not in `public/images/`, which is the course's), is at most 300 kB, and is loaded with priority. The footer of the start page shows the credit "Foto: Bill Abbott, CC BY-SA 2.0, via Wikimedia Commons", with links to the licence and the photo's page.

Acceptance criteria:

- **Given** a visitor opens `/`, **then** the photo is shown behind the heading, and the credit with both links is in the footer.
- **Then** the heading and the text over the photo have a contrast of at least 4.5:1. (Manual check with the screenshots.)

### TRIP-008-R9 Fields, counter and checkbox

Fields shall look as on the design board: a sunken surface, a field label shown small inside the field above the value, the placeholder in faint ink, the accent border and ring on focus, and a red border on error. The traveller counter has round − and + buttons; a disabled button is faded. The checkbox is drawn in the design (accent fill and check when chosen). The behaviour in TRIP-001 (suggestions, dates, counter, return trip) is unchanged.

The visible labels and placeholders are: Från, "Varifrån?"; Till, "Vart vill du?"; Datum, "Välj datum"; Resenärer.

Acceptance criteria:

- **Given** a visitor opens `/`, **then** each field shows its label and placeholder, and the fields keep their accessible names (Från, Till, Datum, Antal resenärer).
- **When** a field has focus, **then** it has the accent border.
- **Given** an invalid date, **then** the field has a red border and the message under it is red text.

### TRIP-008-R10 Messages as coloured text

Error and success messages shall be coloured text without a box, border or background: errors in the danger colour (with `role="alert"`), confirmations in the success colour (with `role="status"`). This applies under fields, in the admin forms and on the sign-in page. The texts themselves don't change.

Acceptance criteria:

- **When** the administrator saves a review, **then** "Omdömet sparades." is shown as green text without a background or border.
- **When** an add-on is saved without a name, **then** "Addon måste ha ett namn." is shown as red text without a background or border.

### TRIP-008-R11 A smaller review carousel

The review carousel shall work exactly as in TRIP-006-R1 and R2 (one card in focus in the middle with the cards next to it smaller, fainter and behind it, arrows on the edges of the card in focus, going round, arrow keys, click on a side card, swipe on a phone), but smaller so that it doesn't take too much attention: the card in focus is at most 15 rem wide and 12 rem high (today 16 × 14 rem). The cards use the card look of R5; the name is in brass.

Acceptance criteria:

- **Then** the card in focus is at most 15 rem wide and 12 rem high.
- **Then** the TRIP-006 tests pass unchanged.

### TRIP-008-R12 Buttons

Buttons shall have one shape, a rounded pill, and three variants: primary (filled with the accent), secondary (accent border) and quiet (text only), in a default and a compact size (admin). A button pressed down shrinks slightly (`scale(0.97)`, 160 ms); a disabled button is faded and doesn't react.

Acceptance criteria:

- **Then** "Sök flyg" is a primary button, and Spara and Avbryt in admin are compact primary and secondary buttons with the same shape.
- **Then** a disabled button has `cursor: not-allowed` and reduced opacity.

### TRIP-008-R13 Motion

Motion shall be short and purposeful: buttons respond to a press (R12), the carousel slides (TRIP-006-R2), and the wordmark animates once on load (R6). Only `transform`, `opacity` and colours are animated, with an ease-out curve, and at most 300 ms for controls. With reduced motion, movement is turned off and only colour changes remain.

Acceptance criteria:

- **Given** reduced motion, **then** the carousel changes card without sliding and the wordmark doesn't move. (Test with `reducedMotion`.)

### TRIP-008-R14 Browser details

Text selection shall use the accent colour, keyboard focus a visible ring in the strong accent (`:focus-visible`), and numbers in tables tabular figures.

Acceptance criteria:

- **When** the visitor tabs to a button or field, **then** a visible focus ring is shown. (Test: computed outline.)

### TRIP-008-R15 Works on a phone

At 390 px width, no page shall scroll sideways. On the start page the header shows only the wordmark, the heading is 42 px, the search form's fields are stacked (Från and Till full width, Datum and Resenärer side by side, "Sök flyg" full width), and the carousel can be swiped.

Acceptance criteria:

- **Given** a 390 px wide window, **then** `/`, `/admin/login` and `/admin` have no horizontal scroll.

### TRIP-008-R16 The site behaves as before

Apart from the texts and looks named above, the site shall work exactly as before.

Acceptance criteria:

- **Then** `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:local` and, after deploy, `npm test` pass. Tests are only changed where this spec changes a text (TRIP-001-R1 heading and subtitle, placeholders).

### TRIP-008-R17 The design system is documented

`DESIGN.md` (project root) shall describe the design: the tokens and what each is for, the components and their variants, the rules (accent only for actions and selection, one font, pill buttons, messages as text, card look), and how to change a font, a colour or a component. `wiki/system/` links to it.

Acceptance criteria:

- **Then** `DESIGN.md` exists and lists every token in `globals.css` and every shared component. (Code review.)

### TRIP-008-R18 WCAG 2.2 level AA

Every page (`/`, `/admin/login`, `/admin`) shall meet WCAG 2.2 level AA. Few visitors with impaired sight or motor control are expected, but the product owner wants to learn the standard and how meeting it is checked, and the redesign touches every page anyway. Settled with the product owner on 2026-10-21.

It is checked in two ways, since automated tools find only some of the problems (roughly a third):

- **Automated:** axe, with the package `@axe-core/playwright` (new dev dependency), limited to the WCAG 2.x A and AA rules. A helper `expectNoA11yViolations(page)` in `tests/helpers.ts` runs it, so a later feature adds one line per page or state.
- **Manual:** a checklist in `wiki/system/accessibility.md`. Each item names its WCAG success criteria and how to check it:

| Check | WCAG |
|---|---|
| Everything works with the keyboard only, in a logical order, without getting stuck | 2.1.1, 2.1.2, 2.4.3 |
| Keyboard focus is always visible and not hidden behind other content | 2.4.7, 2.4.11 |
| A screen reader (VoiceOver) reads headings, landmarks, field names, states and messages | 1.3.1, 2.4.6, 4.1.2, 4.1.3 |
| The page works at 200 % zoom, and at 320 px width without sideways scrolling | 1.4.4, 1.4.10 |
| Text still fits with larger line, letter and word spacing | 1.4.12 |
| Text has a contrast of at least 4.5:1; field borders, the focus ring and icons at least 3:1 | 1.4.3, 1.4.11 |
| Buttons and other targets are at least 24 × 24 px | 2.5.8 |
| Content shown on hover or focus (suggestion list, calendar) can be closed with Escape and stays while the pointer is over it | 1.4.13 |
| Errors are shown in text, say how to fix them, and every field has a visible label | 3.3.1, 3.3.2, 3.3.3 |
| Each page has a title and the language Swedish; images have alt text or are marked decorative | 2.4.2, 3.1.1, 1.1.1 |
| Motion stops with reduced motion (R13; WCAG 2.3.3 is AAA, done anyway) | 2.3.3 |

Acceptance criteria:

- **Then** axe finds no violations on `/`, on `/` with the airport suggestions open and with a date error shown, on `/admin/login` with a wrong password message, and on `/admin` with a card open. (Test.)
- **Then** `wiki/system/accessibility.md` has the checklist above, and says when a feature must go through it. (Code review.)
- **Then** the checklist has been gone through on the live site and each item is recorded in `verification.md`. (Manual check.)

## Data

None.

## Interface

- `app/globals.css`: tokens and `@theme` (R1).
- `app/layout.tsx`: font (R3), header with the wordmark (R6), footer with the photo credit on the start page (R8).
- `app/components/`: `Button`, `RoundButton`, fields, `Checkbox`, `Card`, `Message`, `Wordmark`, `Stars` (R2); `ui.tsx` is replaced or reduced to these.
- `app/page.tsx`, `app/components/SearchForm.tsx`, `app/components/Autocomplete.tsx`, `app/components/ReviewCarousel.tsx`: the start page (R7–R11).
- `app/admin/*`, `app/admin/login/*`: the same components in compact size (R2, R10, R12).
- `public/brand/skymning.jpg` (new): the background photo (R8).
- `DESIGN.md` (new) (R17).

New and changed texts for visitors:

| Where | Text |
|---|---|
| Start page heading | Vi ordnar det ingen annan kan |
| Under the heading | Ditt livs flygresa, till städer och till platser andra flygbolag glömt bort. |
| Placeholders | Varifrån? · Vart vill du? · Välj datum |
| Field labels | Från · Till · Datum · Resenärer |
| Footer on the start page | Foto: Bill Abbott, CC BY-SA 2.0, via Wikimedia Commons |

## Non-functional requirements

- The start page's background photo doesn't delay the search form: it is at most 300 kB and the page's largest content is shown within 2.5 s on the live site.
- Accessibility: WCAG 2.2 level AA (R18, `specs/overview.md`), including contrast (R4) and visible keyboard focus (R14).

## Open questions

None.

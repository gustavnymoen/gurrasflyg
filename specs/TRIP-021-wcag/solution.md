---
id: TRIP-021
title: "Accessibility: WCAG 2.2 AA"
card: "#30"
depends_on: [TRIP-008, TRIP-019, TRIP-020]
---

# TRIP-021 Accessibility: WCAG 2.2 AA: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 30`.

## Data

No migration. The review limits are checked in the code (`lib/review-rules.ts`): name at most 20 characters, title at most 25, text at most 145. The database still allows 255, and older reviews longer than the limits stay as they are.

## Interface

**axe (R1):** `tests/TRIP-021-wcag.spec.ts` checks the two states no other feature's test checked: the start page with the airport suggestions open, and the admin page with an aircraft and its class unfolded. Every state the card lists is now checked; `wiki/system/accessibility.md` has the table of which test checks which state.

**Checklist (R2):** `wiki/system/accessibility.md`, with the eleven items, how to check each, and when a feature goes through it.

**Fixes from going through the checklist (R3):**

- *Review carousel, focus (2.4.7):* the carousel takes focus with Tab (for the arrow keys) but had `outline-none`. Removed, so it gets the site's focus ring (`:focus-visible` in `globals.css`), with rounded corners.
- *Aircraft table at 320 px (1.4.10):* the table is wrapped in `relative overflow-x-auto`, so it scrolls sideways inside its card instead of the page. `relative` matters: the column header "Åtgärder" is `sr-only` (absolutely positioned) and otherwise ended up outside the wrapper and widened the page.
- *Dialogs (2.1.2, 2.4.3):* `Dialog` in `admin-ui.tsx` is now the browser's `<dialog>` opened with `showModal()`. Tab no longer reaches the page behind it, Escape closes it (the `cancel` event), a click outside the box closes it, and the button that opened it gets focus back. The button to focus first ("Nej", "OK") has `data-autofocus`.
- *Visible labels in the admin forms (3.3.2):* the admin fields had only `aria-label` and a placeholder, which disappears when typing. `LabeledField` in `admin-ui.tsx` puts a small label above the field, with the same text as the old `aria-label`, so the accessible names are unchanged. The star rating's name "Betyg" is visible too. Placeholders now only give an example ("t.ex. Premium").

**Reviews fit their card (R4):** the form's fields have `maxLength` 20, 25 and 145, and `createReview` checks the same limits on the server (it already trimmed the values). In `ReviewCarousel` the cards are stacked in one grid cell instead of being absolutely positioned, so the carousel grows with its tallest card; the card has `min-h-48` instead of `h-48`, `line-clamp` is removed, and the padding is `py-3.5` instead of `p-4`.

New messages: "Namnet får vara max 20 tecken." and "Rubriken får vara max 25 tecken." (only reachable without the form's `maxLength`).

## Decisions

- **Only missing axe states are added.** The card's list of states was mostly covered by TRIP-008, TRIP-019 and TRIP-020; checking them again would break the rule against duplicate tests. "The admin page with a card open" is covered by TRIP-019 (the cards are open from the start), so the untested state there was an unfolded aircraft row.
- **Limits instead of a growing card, and a growing card only for WCAG.** The user preferred shorter reviews to a card that changes size. Measured on the live site: with normal spacing a one-line title (25 characters), a 20-character name and 156 characters of text fit; the limits leave a margin. With the text spacing of WCAG 1.4.12 only about 25 characters fit in 12 rem, so limits alone can't meet 1.4.12: the card grows when, and only when, the text needs it.
- **`py-3.5`.** The longest text (the "lada" review, 144 characters) takes five lines. In production it already ran 2.6 px into the card's bottom padding, which nobody could see, but meant the text was clipped. With 14 px instead of 16 px padding at top and bottom, five lines fit inside 12 rem and the card's size is unchanged.
- **`htmlFor`, not a wrapping `<label>`.** A `<label>` around a `<select>` puts the selected option into the field's name ("Klass Välj klass"). `LabeledField` gives the field an id with `useId` and links the label to it.
- **Focus is given back by the component.** The browser gives focus back when a `<dialog>` closes, but React runs the effect's cleanup after the dialog is removed from the page, so `Dialog` remembers the focused element when it opens and focuses it again when it closes.
- **VoiceOver was not used (checklist item 3).** By the user's choice, item 3 was checked with Playwright's accessibility tree (`ariaSnapshot`), which is what VoiceOver reads, not by listening to VoiceOver. Recorded as such in `verification.md`.
- **Two `<main>` in the DOM on `/admin` is not a problem.** After signing in, Next.js keeps the sign-in page hidden (`display: none`) for the back button; screen readers see one `main`.
- **`npx prettier` must not be used here.** The project has no Prettier; running it reformatted files to 80 columns, which was undone.

---
id: TRIP-021
title: "Accessibility: WCAG 2.2 AA"
---

# Verification of TRIP-021

How each requirement was checked. Tests are in `tests/TRIP-021-wcag.spec.ts` unless named otherwise.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-021-R1 | Tests `TRIP-021-R1 axe finds no violations with the airport suggestions open` and `… on the admin page with an aircraft and its class unfolded`. The other states the card lists were already checked: `/` and `/` with a date error and `/admin/login` with a wrong password by `TRIP-008-R12`, `/` with the photo and on a phone by TRIP-020, `/admin` with its cards open (and the aircraft form, a dialog, an error) by TRIP-019 | local | Pass | 2026-10-23 |
| TRIP-021-R2 | Code review: `wiki/system/accessibility.md` has the eleven checklist items with their WCAG criteria and how to check them, the table of axe-checked states, and when a feature goes through the list; linked from `wiki/system/index.md` | local | Pass | 2026-10-23 |
| TRIP-021-R3 | Checklist gone through on the live site before the fixes, per page below; the four failures found are fixed and tested (`TRIP-021-R3 …` tests), and the fixed items were checked again locally. Again on the live site after the deploy: not checked yet | live, local | Pass locally; live after deploy not checked yet | 2026-10-23 |
| TRIP-021-R4 | Tests `TRIP-021-R4 the review form takes at most 20 characters of name and 25 of title`, `… spaces before and after the name, title and text are not saved`, `… a review of the longest allowed length fits the card, also with larger text spacing` (12 rem with 20/25/145 characters and the whole text; nothing clipped with WCAG 1.4.12 spacing), and `TRIP-006-R3 form has name, stars, title and text with a counter` (text at most 145, "0/145") | local | Pass | 2026-10-23 |
| All | `npm run lint`, `npm run typecheck`, `npm run build` without errors or warnings; `npm run test:time` 117 passed (also after both review runs' fixes) | local | Pass | 2026-10-23 |
| Accessibility | The tests above with `expectNoA11yViolations`, and the checklist below | local, live | Pass (live after deploy not checked yet) | 2026-10-23 |

## The checklist, per page (R3)

Gone through on <https://gurrasflyg.vercel.app> on 2026-10-23 before the fixes, with Playwright scripts (tab order and focus, 640 px and 320 px viewports, text spacing, target sizes, title, language, images), screenshots read by hand, contrast computed from the tokens, and the accessibility tree. "Fixed" items were checked again on the local production build after the fix, and have a test.

| # | Check | `/` | `/admin/login` | `/admin` |
|---|---|---|---|---|
| 1 | Keyboard only, logical order, not stuck | Pass: 16 stops in page order (wordmark, Från, Till, the date's three parts and calendar, travellers, return trip, carousel, its arrows, footer links); arrow keys in the suggestions (TRIP-001-R4) and the carousel (TRIP-006-R2) | Pass: wordmark, Lösenord, Logga in, footer | Pass: 53 stops in page order. **Failed:** in a dialog, Tab went on to the page behind it, where Escape no longer closed it. **Fixed:** native `<dialog>` (test `TRIP-021-R3 a dialog keeps focus inside, closes with Escape and gives focus back`) |
| 2 | Focus visible, not hidden | **Failed:** the carousel took focus without a ring (`outline-none`). **Fixed** (test `TRIP-021-R3 the review carousel shows the focus ring …`). Fields show focus with the accent border and glow, the date field too (screenshot); nothing covered | Pass | Pass: every stop has the ring or the field's focus border; nothing covered. After closing a dialog focus went to the page's start: **fixed**, it goes back to the button that opened it (same test) |
| 3 | Screen reader reads headings, landmarks, names, states, messages | Pass, **by the accessibility tree, not VoiceOver** (user's choice): banner, main, contentinfo, navigation; h1, h2, review h3; every field named; "expanded", "disabled", "selected"; the carousel region "Omdömen" with only the card in focus exposed | Pass (tree): the wrong password gives an `alert` "Fel lösenord." and the field `invalid` | Pass (tree): headings, tables with column headers, buttons named after their row ("Ta bort Ekonomi"), fold-outs `expanded`, errors as `alert`, the dialog "Är du säker?". The labels from the fix give "Klass att lägga till", not "Klass Välj klass" |
| 4 | 200 % zoom; 320 px without sideways scroll | Pass (640 and 320 px wide: no sideways scroll) | Pass | 200 %: pass. 320 px: **failed**, the aircraft table made the page 27 px wider. **Fixed:** it scrolls inside its card (test `TRIP-021-R3 at 320 px the admin page doesn't scroll sideways …`) |
| 5 | Text spacing | **Failed:** the review card showed only about two lines of text with WCAG spacing. **Fixed** by R4 (test `TRIP-021-R4 a review of the longest allowed length fits the card, also with larger text spacing`) | Pass: nothing clipped | Pass: nothing clipped (only the `sr-only` texts, which are meant to be 1 px) |
| 6 | Contrast: text 4.5:1, borders, focus ring, icons 3:1 | Pass: text by axe; over the photo measured in TRIP-020 (at least 4.8:1); focus ring `--color-accent-strong` 3.1–3.7:1 against every background, field borders `--color-line-strong` 3.3:1, icons `--color-ink-muted` 6.2–7.4:1 | Pass (same tokens) | Pass (same tokens; empty stars `--color-line-strong` 3.3:1) |
| 7 | Targets at least 24 × 24 px | Pass: the checkbox (20 px) is enlarged by its label; the photo credit links are inline in a sentence (exception); "Start" and "Admin" in the footer are 20 px high but 24 px apart with nothing above or below (spacing exception) | Pass (footer as on `/`) | Pass: icon buttons 28 px, stars 28 px (TRIP-019) |
| 8 | Hover/focus content: Escape closes, stays under the pointer | Pass: the suggestion list stays while the pointer is over it, Escape closes it and focus stays in the field. The calendar is the browser's own | Not affected: nothing shown on hover | Not affected: nothing shown on hover |
| 9 | Errors in text, how to fix, visible labels | Pass: errors are text under the field ("Inga flygplatser matchar", the date messages, same airport); labels inside the fields stay while typing | Pass: "Fel lösenord.", the label stays | **Failed:** the fields had only a placeholder, which disappears when typing. **Fixed:** visible labels (test `TRIP-021-R3 every field in the admin forms has a visible label`). The messages say what to do ("Ange ett pris.", "Planet måste ha minst en klass.") |
| 10 | Title, Swedish, images | Pass: "Gurras Flyg", `lang="sv"`, the photo `alt=""` (decoration), the wordmark's plane hidden | Pass: "Logga in – Gurras Flyg" | Pass: "Admin – Gurras Flyg" |
| 11 | Motion stops with reduced motion | Pass: tests `TRIP-020-R1 and R5 …` and `TRIP-020-R5 the carousel changes card without sliding` | Pass: only the wordmark moves, covered by the same test | Pass: no animation besides the wordmark and button presses (colour transitions remain) |

## Test suite

`npm run test:time` before and after the change.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 108 | 63.5 s (TECH-010) | 2.5 s |
| After | 117 | 75.7 s (+19 %) | 2.5 s (`TRIP-006-R5 and R6 a saved review is listed and shown first, and can be deleted`) |

## Definition of Done

- [x] Tests: every requirement is tested or has a recorded manual check; `npm run test:local` passes (2026-10-23)
- [x] Test suite: within the time budgets, 19 % slower (nine new tests), the new tests follow the quality rules
- [ ] Deployed, and `npm test` passes against the live site
- [ ] Accessibility: the changed pages and states pass `expectNoA11yViolations`; the checklist is recorded above, again on the live site after the deploy: not checked yet
- [x] Requirements in the card match what was built (R4 added on 2026-10-23), no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/admin-omdomen.md`, `omdomen.md`), system docs (`wiki/system/accessibility.md`, `DESIGN.md`) and `wiki/log.md` updated
- [x] No leftovers: `line-clamp`, `outline-none` on the carousel, the old overlay `div` of `Dialog` and the admin fields' `aria-label`s are gone; no debug output
- [x] Clean code: reuses `Card`, the tokens and the test helpers; `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements: none needed
- [x] Small related cleanups: the TRIP-006 and TRIP-019 tests use a shorter `uniqueName` prefix for reviewers (names are at most 20 characters); `Dialog` and the star rating use `useId` instead of fixed ids; TRIP-020's `solution.md` and `verification.md` note the change from R4

## Requirements as built

Copied from card #30 on 2026-10-23 (R4 added with the user that day).

### TRIP-021-R1 Automated check with axe

The tests shall check every page and its important states with axe, with the helper `expectNoA11yViolations(page)` in `tests/helpers.ts` (WCAG 2.x A and AA rules). The helper and the first checks were added in TRIP-008-R12 (moved there on 2026-10-22); this card adds the states that are still missing.

Automated tools find only some of the problems (roughly a third), so R2 and R3 cover the rest.

Acceptance criteria:

- **Then** axe finds no violations on `/`, on `/` with the airport suggestions open and with a date error shown, on `/admin/login` with a wrong password message, and on `/admin` with a card open. (Test.)

### TRIP-021-R2 Manual checklist

`wiki/system/accessibility.md` shall have a checklist of what has to be checked by hand, each item with its WCAG success criteria and how to check it, and say when a feature must go through it:

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
| Motion stops with reduced motion (TRIP-020-R5; WCAG 2.3.3 is AAA, done anyway) | 2.3.3 |

Acceptance criteria:

- **Then** `wiki/system/accessibility.md` has the checklist above, and says when a feature must go through it. (Code review.)

### TRIP-021-R3 Checked on the live site

The checklist shall be gone through on `/`, `/admin/login` and `/admin` on the live site, and everything it finds that fails level AA is fixed.

Acceptance criteria:

- **Then** each checklist item is recorded in `verification.md` per page, with the result and the date. (Manual check.)
- **Then** no item fails level AA.

### TRIP-021-R4 Reviews fit their card

Found while going through the checklist (R3): with larger text spacing (WCAG 1.4.12) the review card cut the text off, and `line-clamp` showed a stray "…" in longer reviews. A review shall always be shown in full. So that the card still looks as it does today, a new review has a name of at most 20 characters, a title of at most 25 (one line) and a text of at most 145, all trimmed of spaces before and after. The card is 12 rem high as before, and grows only when the text needs more room, for example when the visitor has set larger text spacing, or for older reviews longer than the limits. This changes TRIP-006-R3 (text at most 150 characters, no limit on name and title) and TRIP-020-R4 (at most 12 rem high).

Acceptance criteria:

- **Given** the form "Nytt omdöme", **then** the name, title and text fields accept at most 20, 25 and 145 characters, and the counter shows "0/145". (Test.)
- **When** a review is saved with spaces before and after the name, title and text, **then** they are saved without them. (Test.)
- **Given** a review with a 20-character name, a 25-character title and a 145-character text, **then** the card in focus is 12 rem high and shows the whole text without "…". (Test.)
- **Given** larger text spacing (line height 1.5, paragraph spacing 2, letter spacing 0.12 and word spacing 0.16 times the font size), **then** no text in the card in focus is cut off. (Test.)

## Notes

- The card's R4 was added on 2026-10-23 with the user, after the checklist found that review texts were clipped. It changes TRIP-006-R3 (noted in `specs/TRIP-006-reviews/spec.md`) and TRIP-020-R4 (noted in card #29).
- The user deleted the review "Bokade spaningskorgen på Hindenburg" (title 35 characters) in production; it wasn't in the local database.
- The audit scripts' first tab-order run started in the middle of `/admin/login` and `/admin` because of the password field's autofocus, and stopped early on elements with equal markup; both were script errors, fixed before the results above.

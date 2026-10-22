---
id: TRIP-020
title: "Visual design: start page"
---

# Verification of TRIP-020

How each requirement was checked. Tests are in `tests/TRIP-020-start-page-design.spec.ts` unless named otherwise.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-020-R1 | Tests `TRIP-020-R1 the header with the wordmark is on the start page and the sign-in page`, `… is on the admin page`, `TRIP-020-R1 the plane takes off into the ring when the page loads` (take-off, contrail and hop start), `TRIP-020-R1 the wordmark follows --font-display`, `TRIP-020-R1 and R5 the wordmark doesn't move` (reduced motion) | local | Pass | 2026-10-22 |
| TRIP-020-R2 | Tests `TRIP-020-R2 the start page shows the heading, the text, the search form and the reviews in that order` and `TRIP-001-R1 start page shows the search form` (updated heading and text) | local | Pass | 2026-10-22 |
| TRIP-020-R3 | Tests `TRIP-020-R3 the photo is behind the heading, and the credit with both links is in the footer`, `… the credit is only on the start page`, `… the photo file is at most 300 kB and in public/brand` (254 kB). Manual: contrast measured on screenshots of the dev server, with the text made transparent, against the lightest pixel behind it: heading 8.6–10.5:1, text under it 4.8–5.3:1, wordmark 11.4–14.4:1 at 390, 768, 1024, 1440 and 1920 px | local | Pass | 2026-10-22 |
| TRIP-020-R4 | Test `TRIP-020-R4 the card in focus is at most 15 × 12 rem, with the card shadow, the accent border and the name in brass`; the TRIP-006 tests pass unchanged | local | Pass | 2026-10-22 |
| TRIP-020-R5 | Tests `TRIP-020-R5 without reduced motion the carousel slides`, `TRIP-020-R5 the carousel changes card without sliding` and `TRIP-020-R1 and R5 the wordmark doesn't move` (both with reduced motion). Code review: the only animations are the wordmark's (`transform`, `opacity`, `ease-out`); buttons 160 ms | local | Pass | 2026-10-22 |
| TRIP-020-R6 | Tests `TRIP-020-R6 the start page and the sign-in page don't scroll sideways`, `… the admin page doesn't scroll sideways`, `… Från and Till are full width, Datum and Resenärer side by side` (390 × 844); the heading size on a phone by `TRIP-008-R3` | local | Pass | 2026-10-22 |
| TRIP-020-R7 | `npm run lint`, `npm run typecheck`, `npm run build` without errors or warnings; `npm run test:local` 108 passed. Changed tests: `TRIP-001-R1` (heading and text) and `TRIP-008-R9` (tabs past the wordmark first) | local | Pass | 2026-10-22 |
| Accessibility | Tests `TRIP-020 accessibility: axe finds no violations on the start page with the photo` and `… on the start page on a phone` | local | Pass | 2026-10-22 |
| Performance | The photo is 254 kB (test above). Largest Contentful Paint measured with Playwright's `PerformanceObserver` on https://gurrasflyg.vercel.app, five runs each at 1440 × 900 and 390 × 844, new browser and empty cache each run; the largest content is the photo. Unthrottled: 112–428 ms wide, 92–116 ms phone. With simulated 4G (9 Mbit/s, 150 ms latency) and 4× slower CPU: 740–808 ms wide, 528–532 ms phone | live | Pass (under 2.5 s) | 2026-10-22 |
| All | `npm test` against the live site ("Live tests", run 39794780384, after a redeploy without build cache, see Notes): 95 passed, 13 skipped | live | Pass | 2026-10-22 |

## Definition of Done

- [x] Tests: every requirement is tested or has a recorded manual check; `npm run test:local` passes (2026-10-22)
- [x] Deployed, and `npm test` passes against the live site (2026-10-22, after a redeploy without build cache)
- [ ] Accessibility: the start page (wide and phone), the sign-in page and the admin page pass `expectNoA11yViolations` in their tests (locally); contrast over the photo measured by hand. The manual checklist `wiki/system/accessibility.md` doesn't exist yet: it comes with TRIP-021. Not checked here.
- [x] Requirements in the card match what was built (R1, R3 and R7 updated on 2026-10-22), no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/soka-flyg.md`, `omdomen.md`), system docs (`DESIGN.md`, `wiki/system/architecture.md`) and `wiki/log.md` updated
- [x] No leftovers: the old heading with `PlaneIcon`, the gradient and `motion-reduce:transition-none` in the carousel are gone; no commented-out code or debug output
- [x] Clean code: reuses `Card`, the tokens and the test helpers; `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements: none needed
- [x] Small related cleanups: TRIP-019's `verification.md` now records its live test run

## Requirements as built

Copied from card #29 on 2026-10-22.


### TRIP-020-R1 Header with an animated wordmark

Every page shall have a header with the wordmark: the plane in a round brass ring, followed by "Gurras Flyg", linking to the start page. When the page loads, the plane takes off into the ring with a short contrail (about 1.4 s, once); when the pointer is over the wordmark, the plane makes a small hop. Visitors who prefer reduced motion see the wordmark without animation. The wordmark is a shared component, `Wordmark`, using the display font and the tokens.

Acceptance criteria:

- **Then** the header with the wordmark is shown on `/`, `/admin/login` and `/admin`, and the wordmark links to `/`.
- **Given** reduced motion (`prefers-reduced-motion: reduce`), **then** the wordmark has no animation. (Test with Playwright's `reducedMotion`.)
- **When** the value of `--font-display` is changed, **then** the wordmark changes font too. (Test: the token is changed in the browser.)

### TRIP-020-R2 Start page

The start page shall show, in this order: the header, the heading "Vi ordnar det ingen annan kan" (the page's `h1`, 76 px on wide screens and 42 px on a phone, per TRIP-008-R3), the text "Ditt livs flygresa, till städer och till platser andra flygbolag glömt bort.", the search form in a card, and the review carousel under the heading "Vad våra resenärer säger". TRIP-001-R1 is updated: the heading is no longer "Gurras Flyg" (the name is in the wordmark), and the slogan is part of the text under the heading. The heading has no colour gradient.

Acceptance criteria:

- **Given** a visitor opens `/`, **then** the `h1` is "Vi ordnar det ingen annan kan", followed by the text, the search form and the reviews.

### TRIP-020-R3 Background photo with credit

The start page shall have the photo "Boeing 757 climbing after the sunset" by Bill Abbott (CC BY-SA 2.0, Wikimedia Commons) as its background behind the header, heading and search form, darkened so that the text stays readable (evenly on phones and tablets, towards the text on the left from 1024 px), and fading into the ground towards the reviews. The photo is stored in `public/brand/` (not in `public/images/`, which is the course's), is at most 300 kB, and is loaded with priority. The footer of the start page shows the credit "Foto: Bill Abbott, CC BY-SA 2.0, via Wikimedia Commons", with links to the licence and the photo's page.

Acceptance criteria:

- **Given** a visitor opens `/`, **then** the photo is shown behind the heading, and the credit with both links is in the footer.
- **Then** the heading and the text over the photo have a contrast of at least 4.5:1, against the lightest pixel behind them, at 390, 768, 1024, 1440 and 1920 px. (Manual check: measured on screenshots.)

### TRIP-020-R4 A smaller review carousel

The review carousel shall work exactly as in TRIP-006-R1 and R2 (one card in focus in the middle with the cards next to it smaller, fainter and behind it, arrows on the edges of the card in focus, going round, arrow keys, click on a side card, swipe on a phone), but smaller so that it doesn't take too much attention: the card in focus is at most 15 rem wide and 12 rem high (today 16 × 14 rem). The cards use the card look of TRIP-008-R5, the review in focus is marked with the accent, and the name is in brass.

Acceptance criteria:

- **Then** the card in focus is at most 15 rem wide and 12 rem high, with the card border and the card shadow.
- **Then** the TRIP-006 tests pass unchanged.

### TRIP-020-R5 Motion

Motion shall be short and purposeful: buttons respond to a press (TRIP-008-R8), the carousel slides (TRIP-006-R2), and the wordmark animates once on load (R1). Only `transform`, `opacity` and colours are animated, with an ease-out curve, and at most 300 ms for controls. With reduced motion, movement is turned off and only colour changes remain.

Acceptance criteria:

- **Given** reduced motion, **then** the carousel changes card without sliding and the wordmark doesn't move. (Test with `reducedMotion`.)

### TRIP-020-R6 Works on a phone

At 390 px width, no page shall scroll sideways. On the start page the header shows only the wordmark, the heading is 42 px, the search form's fields are stacked (Från and Till full width, Datum and Resenärer side by side, and "Sök flyg" full width once TRIP-010 has added it), and the carousel can be swiped.

Acceptance criteria:

- **Given** a 390 px wide window, **then** `/`, `/admin/login` and `/admin` have no horizontal scroll.

### TRIP-020-R7 The site behaves as before

Apart from the texts and looks named above, the site shall work exactly as before.

Acceptance criteria:

- **Then** `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:local` and, after deploy, `npm test` pass. Tests are only changed where this card changes a text (the TRIP-001-R1 heading and subtitle) or adds the header (TRIP-008-R9's keyboard test now tabs past the wordmark first, and checks its focus ring).


## Notes

- The search form has no "Sök flyg" button yet; R6's layout for it comes with TRIP-010.
- The photo is darker than on the design board: the shade had to be stronger, and even over the whole width below 1024 px, for the text under the heading to reach 4.5:1 against the lightest pixel behind it.
- While checking the contrast, the dev server stopped picking up changes to `app/globals.css` after a `npm run build` and a restart with `.next/dev` deleted; a second restart fixed it.
- The first run of "Preview tests" failed on `TRIP-020-R6 Från and Till are full width, Datum and Resenärer side by side`: on the preview the date field is streamed in, and for a moment both the placeholder field and the real one have the label "Datum". The test now waits for the real date field and uses only visible labels. A wrong test, not a bug in the site.
- The first "Live tests" run after the merge (39791920930) failed on `TRIP-020-R1 the plane takes off into the ring when the page loads` and `TRIP-020-R5 the carousel changes card without sliding`. The live site served the new HTML with TRIP-019's stylesheet: no `@keyframes takeoff`, no `photo-shade`, and the removed `motion-reduce:transition-none` still there. A local build gave the right CSS, so Vercel's build cache most likely made Turbopack reuse the old CSS. Redeploying the production deployment in Vercel without the build cache fixed it, and the next run passed. A bug in the deploy, not in the site or the tests.

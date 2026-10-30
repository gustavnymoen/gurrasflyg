---
id: TECH-023
title: Browser tests back inside the time budget
card: "#94"
depends_on: [TECH-021]
---

# TECH-023 Browser tests back inside the time budget: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 94`.

## Data

None. Only tests, test helpers and the Playwright configuration change.

## Interface

No page changes. No test was combined or removed (178 before, 178 after); the time came out of how the tests wait.

## Where the time went

Measured with a small reporter that adds up the duration of every Playwright step (action or `expect`), 178 tests, 177 s:

- **Playwright waits in steps.** A click retries after 0, 20, 100, 100 and 500 ms; an `expect` after 100, 250, 500 and 1000 ms. An element that appears 300 ms after the page opens is therefore found after about 720 ms (click) or 850 ms (`expect`). About 125 steps took 0,3–0,8 s; most of them ended at 0,79–0,84 s, which is the retry steps and not the site.
- **The admin page** shows its cards about 300 ms after the heading (the page is rendered on the server and the soft navigation after sign-in takes that long). Every admin test clicked in a card first and so waited about 830 ms.
- **The flight cards fill in** (TRIP-025) with a CSS animation, and Playwright waits for a card that is moving before it clicks it: about 385 ms for each of the ~35 clicks on a card in the plan, booking and price-list tests.
- **A trace was recorded for every test** (`retain-on-failure` records all and keeps the failed): 9 % of the run time on three files (42,3 s with, 38,6 s without).
- What is left is spread out: about 1 s per test, mostly page loads and server actions (a click on Spara takes about 0,4 s), and axe (0,3–0,5 s per run).

## Decisions

- **Reduced motion is the default in the tests** (`reducedMotion: "reduce"` in `playwright.config.ts`). The site honours `prefers-reduced-motion` (no animations, TRIP-025-R4, TRIP-020-R5), so the cards are in place at once and Playwright does not wait for them. The tests of the motion itself ask for `no-preference` explicitly: all of `TRIP-025-departures-fill-in` (R4 keeps `reduce`) and the plane/carousel test in `TECH-018-design.spec.ts`. They have to: with reduced motion TRIP-025-R3 ("the sorting does not start the animation again") would pass without testing anything. Every other test checks behaviour or computed values that do not depend on the animations; the whole suite passes with it.
- **`appears()` in `tests/helpers.ts`** waits for something that shows up a few hundred ms after the page opens, checking every 25 ms (`expect.poll` with `intervals: [25]`), and `signIn` ends with it for the admin page's cards. That turns about 830 ms into about 310 ms for each of the ~25 tests that sign in. It is a wait for the same thing the test clicks next, so no check changes.
- **No trace unless asked for** (`TRACE=1 npm run test:local` records one for failing tests). Settled with the user, since the file is outside `tests/`: the card's R1 was widened to include `playwright.config.ts`. The trace stays off against a deployed site as before (TECH-013).
- **Combining tests was left for later.** The numbers showed that a test's fixed cost is small (a new page 30 ms, a page load 40 ms), and combining the 20 tests of TRIP-009, which all start on the same page, would save under 3 s. The target was reached without it and without touching assertions.
- **Remaining ~800 ms waits** after `page.goto` of a results or charter page (about a dozen, in TRIP-014 and TRIP-013) could use `appears()` as well; that is worth about 5 s and is left until the budget needs it.

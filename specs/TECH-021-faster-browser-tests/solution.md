---
id: TECH-021
title: Faster browser tests
card: "#84"
depends_on: [TECH-011, TECH-015, TECH-018]
---

# TECH-021 Faster browser tests: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 84`.

## Data

None. Only tests change.

## Interface

No page changes. 201 browser tests became 148, in twelve files:

| File | Before | After | What was combined |
|---|---|---|---|
| `TRIP-003-admin-classes-and-addons` | 9 | 3 | one class through add, cancel, rules, rename and delete; one add-on through add, rules, change and delete |
| `TRIP-004-admin-aircraft` | 9 | 2 | one aircraft through the table, expanding, rules, change and delete; one open form through cancel, classes, seats and add-ons |
| `TRIP-006-reviews` | 5 | 3 | the carousel (R1 and R2) and the review form (R3 and R4) |
| `TRIP-010-search-results` | 20 | 12 | the form's two error tests; the one-way results page (R2, R4, R5, R7); a card and the one-way ending (R6, R9); the return trip, a new date and 320 px (R2, R6, R8, R9) |
| `TRIP-011-aircraft-and-classes` | 13 | 8 | the från price with the aircraft comparison; the 320 px checks with the class test and the factor test; the prices and what a change clears |
| `TRIP-012-book-a-flight` | 8 | 4 | the booking page journey (R1, R4, R5, R6, R10); the passengers and add-ons (R2, R3) |
| `TRIP-013-destinations` | 17 | 13 | the "no match" and Rensa tests; Plats and Aktivitet; the axe checks moved into the tests that load the same states |
| `TRIP-018-start-tabs` | 20 | 14 | the four tab tests on the start page; the plan page's link, dialog and abort tests; the dialog's axe check |
| `TRIP-019-admin-design` | 6 | 3 | the admin page's shadows, buttons, red text and axe |
| `TRIP-021-wcag` | 9 | 5 | the start page's axe and carousel focus; the aircraft axe and 320 px; the three review-form tests |
| `TRIP-024-summary-and-classes` | 5 | 3 | R2, R3 and R5 on one open aircraft |
| `TRIP-026-one-choice-at-a-time` | 6 | 4 | R2 with R3; R4 with R5 |

The combined tests are listed requirement by requirement in `verification.md`.

## Decisions

- **Combine by journey and state, not by feature.** The time was spread evenly (about 0.9 s per test, no test over 3.5 s); a page load is about 20 ms and signing in about 0.1 s, so what a test costs is the data it creates (a class, an aircraft, a search and a plan) and the steps it takes to get to the page it checks. A test that goes on from the state the last one left saves all of that. The tests that were not combined load a different page, need a different viewport at load time, or create data of their own that the others must not see.
- **A combined test is named after every requirement it checks** (`TRIP-004-R1 R2 R7 R8 R9 …`), as in TECH-018, so a search for a requirement ID still finds its test, and each part has a comment with its requirement.
- **No check was changed or weakened.** Each assertion is moved as it was. Where a check depended on the state the old test started in, the order in the combined test keeps it: for example the review form's text is emptied before its "required" checks, the add-ons are taken off again before the classes are swapped, and the 320 px checks resize the window mid-test (`setViewportSize`) instead of starting at 320 px. Three small differences, all noted in `verification.md`: the aircraft that is changed in TRIP-004-R8 is the one with two classes and an add-on, and the change removes Business and adds it again; the booking journey of TRIP-012 is a return trip where the outbound flight is in the 2,00 class; and the return trip of TRIP-010-R8 searches for a later outbound date first (R2).
- **Axe checks stay, on the same states.** They move into the test that reaches the state anyway (the `/charter` states, the destination pages), so the page is loaded once.
- **Two checkouts can't run `npm run test:local` at the same time.** They share `~/Ai Projekt/gurrasflyg-data/test.db`, and each run deletes it (`scripts/test-server.mjs`). This was found when another session's run broke this one's. Running with another `HOME` (`HOME=<empty folder> PLAYWRIGHT_BROWSERS_PATH=~/Library/Caches/ms-playwright npm run test:time`) gives a run a database of its own; it is noted in `wiki/system/testing.md`. A permanent fix (a database per checkout) is a larger change and is left for a technical task.

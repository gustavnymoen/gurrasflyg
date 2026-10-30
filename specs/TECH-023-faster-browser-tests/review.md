---
id: TECH-023
title: Browser tests back inside the time budget
---

# Code review of TECH-023

**Result:** Passed
**Date:** 2026-10-30, review run 1
**Summary:** Only tests, helpers, `playwright.config.ts`, wiki and specs changed, and no check is weakened. Reduced motion as the default does not make any other test pass without testing anything; the two motion tests ask for `no-preference`.
**Security:** Passed. No sign-in, admin, API, action, query or personal-data code changed; the trace stays off against a deployed site. `/security-review` not needed.

How the review works: `wiki/system/code-review.md`.

## Must fix

None.

## Should fix

- `wiki/system/testing.md:42`, `playwright.config.ts`, `solution.md`, the card: the trace cost was given as a tenth, a fifth, 9 % and 18 %. **Done:** all say about a tenth (9 % measured on three files).

## Suggestions

- `tests/helpers.ts`: the `appears()` comment mentioned server actions, but it is only used in `signIn`, and it waits for the element to exist, not to be visible. **Done:** comment corrected. Using it in the ~12 post-`goto` waits is left (about 5 s, noted in `solution.md`).
- `tests/TECH-018-design.spec.ts`: the "with reduced motion" describe is now the default. **Done:** a comment says it is kept to show what the test is about.
- Motion check: nothing else tests motion. TRIP-006 `cardsAtRest` and `animationsDone` are trivially met under reduced motion without weakening what is asserted; `toHaveCSS` checks read colours, sizes and outlines.

## Outside the change

- The remaining ~0.8 s waits after `page.goto` in TRIP-013 and TRIP-014: a backlog candidate only if the budget needs it; not added.

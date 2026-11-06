---
id: TECH-032
title: Stabilise the flaky browser tests
card: "#149"
depends_on: []
---

# TECH-032 Stabilise the flaky browser tests: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 149`.

## Data

None.

## Interface

None for visitors. Test helpers in `tests/helpers.ts`:

- `hydrated(locator)`: polls every 25 ms until React has attached its props to the element (a `__reactProps$…` key), which happens when the page has hydrated.
- `expectNoA11yViolations` waits for every finite running animation and transition (`document.getAnimations()`) before axe measures. It used to wait only for `fill-in`.

## Decisions

**Not reproduced.** The three failed runs of PR #148 were replaced by their reruns. Locally the tests passed 80 of 80 before this work, and again under stress: 45 runs with 10 busy processes, 90 runs with 40, 60 runs with the browser's CPU slowed 6 times (Chrome DevTools protocol, `Emulation.setCPUThrottlingRate`), and 40 runs of the two TRIP-009 tests slowed 25 times. None failed, so the causes below are the likely ones, worked out from the code. The throttling code was temporary and is not kept.

**TRIP-009-R12 "the keyboard moves …".** The test pressed Arrow down once on the field and then expected focus in the calendar. The key handler is attached only when the page has hydrated, so on a slow runner a press before that is lost and `toBeFocused` never gets its target. R2 had worked around this by pressing again and again with a 500 ms wait each time; R12 and the other tests that start with that key press (R11 and the month buttons) had nothing. Now all five use `arrowDownIntoCalendar()`, which waits for `hydrated()` and presses once.

**TRIP-023-R2 R4 R5 and the `color-contrast` failure on `.gap-2`.** With reduced motion the animations are off, but `app/globals.css` keeps transitions of colour, background and opacity. A colour still in a transition when axe measures is between two values and reads as low contrast. `expectNoA11yViolations` waited only for the `fill-in` animation, which is a CSS animation, not a transition. It now waits for all of them, so TRIP-040's earlier one-off axe failure in the same test has the same fix. We did not find a real contrast problem; if one exists it would show as a failure that stays after the wait.

**Why `hydrated()` and not `networkidle`.** A few tests wait for `networkidle` ("hydrated, so the panel opens when clicked"). That waits for the network, not for React, and can pass before the handlers exist. `hydrated()` checks the thing the test depends on. The other `networkidle` waits were left alone: they are not in the three failing tests, and changing them without a failure to guide us would be guessing.

**Other focus checks.** The remaining key presses after a `fill` (TRIP-001, TRIP-013 Arrow down in the airport and destination search) happen after the field has been typed into, so the page has hydrated. Not changed.

---
id: TRIP-015
title: Enter before new airport suggestions
card: "#20"
depends_on: [TRIP-001, TRIP-010]
---

# TRIP-015 Enter before new airport suggestions: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 20`.

## Data

None.

## Interface

No change to the site. `app/components/Autocomplete.tsx` is not touched: since TRIP-010 it remembers which text the list answers (`answered`) and Enter and Tab choose only when it equals the text in the field.

## Decisions

- The behaviour is tested in the existing combined test "TRIP-001-R4 …" in `tests/TRIP-001-flight-search-form.spec.ts`, not in a new test, so the suite does not grow (it is at 160 browser tests).
- The answer for "arlanda" is held back with `page.route` and a promise that the test resolves, instead of a fixed `waitForTimeout`. Pressing Enter is then always before the answer, however fast the machine is.
- Checked that the test can fail: with `answered === text.trim()` temporarily replaced by `true`, the test fails (the field shows "London Heathrow (LHR)" instead of "arlanda"). The change was reverted.

---
id: TECH-018
title: Fewer, combined design tests
card: "#61"
depends_on: [TECH-011, TECH-016]
---

# TECH-018 Fewer, combined design tests: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 61`.

## Data

None. Only tests change.

## Interface

No page changes. The 39 design tests of `tests/TRIP-008-visual-design.spec.ts` (18), `tests/TRIP-020-start-page-design.spec.ts` (16) and `tests/TRIP-022-card-border.spec.ts` (5) are replaced by 12 tests in `tests/TECH-018-design.spec.ts`, one per page and state:

| Test | Page and state | Checks that were separate tests |
|---|---|---|
| Header, text, order, contrast and fields | `/` loaded | typography, no Geist, order, text contrast, labels and placeholders, the header |
| Cards, photo and credit | `/` loaded | card shadow and border, border contrast, photo, credit, review card, review borders, axe |
| Focused field and suggestions | `/` with "lon" typed | accent border and ring, suggestions' shadow and border |
| The switch | `/` with the calendar open | on with the accent, off with a visible border |
| Invalid date | `/` with a date error | red text without a box, axe, red border |
| Keyboard focus | `/` tabbed through | wordmark, field and button rings, ring contrast, disabled button |
| Tokens | `/admin/login` and `/` with tokens changed | font, accent: headings, wordmark, button, suggestion, switch, focus ring |
| Sign-in page | `/admin/login` | header, credit absent, card, pill and toned-down button, wrong password, axe |
| Motion | `/` | take-off, hop, the carousel slides |
| Reduced motion | `/` | the wordmark and the carousel don't move |
| Admin page | `/admin` | header, card borders, aircraft form and buttons, axe, no sideways scroll on a phone |
| Phone | `/` and `/admin/login` on 390 px | heading size, no sideways scroll, Från and Till stacked, axe |

## Decisions

- **Combine by page and state, not by feature.** A page load costs far more than a check, so every check that can run on the same loaded page does. The three files are one file because their tests now answer "what does this page look like", not "which feature asked".
- **A combined test is named after every requirement it checks** (`TRIP-008-R4, R5 and R12 and TRIP-020-R3 …`), so a search for a requirement ID still finds its test.
- **No check was changed or weakened.** Each assertion is copied as it was. Where a check depended on a fresh page (axe with a date error shown, the red border after a blur), the order inside the test keeps the state it had. Three small differences: the focus-ring contrast is read on the keyboard-focused button instead of one focused with `focus()`; the focused-field check focuses the field by typing "lon" instead of `focus()`; and the 42 px heading is checked at 844 px height instead of 800 (only the width matters). The admin page's sideways-scroll check on a phone resizes the window after the desktop checks (the aircraft form closed again) instead of loading `/admin` at 390 px; it still catches overflow, but not a layout that depends on the width at load time.

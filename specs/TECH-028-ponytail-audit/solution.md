---
id: TECH-028
title: Ponytail audit of the solution
card: "#108"
depends_on: []
---

# TECH-028 Ponytail audit of the solution: solution

How it is done. What and why (goal, scope, requirements) is in the card: `gh issue view 108`.

## Data

None.

## Interface

None. Visitors see no change.

## Decisions

- **The audit report is [audit.md](audit.md)**, made with `ponytail:ponytail-audit` (plugin version 5.3.3, level full) over the scope of the card. Every finding F1–F11 has a mark and a reason there.
- **Only one must-fix finding (F1):** the admin session cookie had no unit test. The code itself was correct, so the fix is `lib/session.test.ts`, with tests named `TECH-028-R2 F1 …`. They check expiry with a valid signature, a changed expiry, another secret, malformed values, a missing secret, and the password comparison.
- **Two suspected findings were checked and dropped** (F7: foreign keys after a transaction; F8: the length of `requestId`), by an experiment on a copy and by reading `fitsForm`. They stay in the report as "not needed", so the next audit does not raise them again.
- **Larger should-fix findings (F2–F5)** are not fixed here: they are to go on the board as one grouped technical task (not created yet). F6 (an old database file in the project folder) is the user's to decide.

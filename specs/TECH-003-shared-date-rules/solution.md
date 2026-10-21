---
id: TECH-003
title: Shared date rules
card: "#13"
depends_on: [TRIP-001]
---

# TECH-003 Shared date rules: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 13`.

## Data

None.

## Interface

No visible change.

- `lib/dates.ts` (new).
- `app/components/SearchForm.tsx`: uses `lib/dates.ts`.
- `tests/TECH-003-shared-date-rules.spec.ts` (new).

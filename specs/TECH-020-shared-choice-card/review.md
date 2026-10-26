---
id: TECH-020
title: Shared choice card and traveller plural
---

# Review of TECH-020

**Result:** Passed (2026-10-26, reviewer agent following `wiki/system/code-review.md`)

**Security:** Passed. The change touches no sign-in, admin, API routes, server actions, database queries or personal data; `/security-review` not needed (card).

## Must fix

None.

## Should fix (fixed)

- `.claude/launch.json` is not part of the change: left out of the commit.
- `ChoiceCard` was missing in `DESIGN.md`: row added.
- `verification.md` still the template: filled in.
- Import order in `TripOverview.tsx`: sorted.

## Suggestions

- `summaryClassName`/`chevronClassName` are free class strings; with a third card, consider a `layout` variant.
- `"plats"/"platser"` in `AircraftList.tsx` is still written inline; a helper if the pattern recurs.

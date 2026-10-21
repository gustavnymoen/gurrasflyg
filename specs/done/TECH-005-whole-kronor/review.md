---
id: TECH-005
title: All prices in whole kronor
---

# Code review of TECH-005

**Result:** Passed
**Date:** 2026-10-21, review run 1 (the `code-reviewer` agent)
**Summary:** The change does what TECH-005 asks: the migration rounds correctly, the öre conversions are gone, add-on prices are checked on the server, and every requirement has a test or a recorded check. Only small suggestions.

How the review works: `wiki/system/code-review.md`.

## Must fix

None.

## Should fix

None.

## Suggestions

- `lib/admin.ts:357` `parseKronor` accepts any number of digits, so "99999999999999999999" is saved as a number too large to be exact. **Done:** left as it is; only an administrator types prices, and the case is theoretical.
- `lib/admin.ts:359` The minus check comes before the format check, so "-12,50" gets "Priset måste vara 0 kr eller mer." rather than "Ange priset i hela kronor.". Shows how the order of checks decides the message. **Done:** left as it is; both messages are right for that input.
- `tests/TECH-005-whole-kronor.spec.ts:20` The R2 test only has rows in `addons`; a wrong formula in the other three, identical, UPDATE lines would not be caught. **Done:** left as it is; the four lines are the same, and the other tables are empty in every database today.

## Outside the change

- `app/admin/AircraftForm.tsx:195` `parseCapacity` (client, `Number`) and `parseKronor` (server, regex) check whole numbers in two ways; one shared parser in `lib/` could serve both. Not added to the backlog on its own: noted as a candidate for the next group of small cleanups.

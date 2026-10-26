---
id: TECH-021
title: Faster browser tests
---

# Code review of TECH-021

**Result:** Passed
**Date:** 2026-10-26, review run 1
**Summary:** 201 browser tests became 148; no requirement lost its check, and every combined test is named after all its requirements.
**Security:** Passed. Tests and docs only; `/security-review` not needed.

## Must fix

None.

## Should fix

- `tests/TRIP-019-admin-design.spec.ts` The plain admin page lost its axe check. **Done:** added right after the shadow loop.
- `tests/TRIP-013-destinations.spec.ts` A stray blank line. **Done:** removed.
- TRIP-013 no-match axe state differs slightly (`&varldsdel=Europe`). **Done:** noted in `verification.md`.

## Suggestions

- Combined tests clean up their data only at the end, so a failure midway leaves more "E2E …" rows. **Done:** left as it is; the global teardown removes them.
- 320 px checks resize mid-test instead of loading at 320 px. **Done:** left as it is, documented in `solution.md`.

## Outside the change

- A test database per checkout (`test.db` is shared and deleted on every `test:local`). Not added to the board yet.

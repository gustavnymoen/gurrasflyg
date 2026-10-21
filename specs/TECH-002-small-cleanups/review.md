---
id: TECH-002
title: Small cleanups
---

# Code review of TECH-002

**Result:** Passed
**Date:** 2026-10-21, review run 1 (the trial run of TECH-006-R6, made after TECH-002 was done)
**Summary:** TECH-002 does what its spec asks and nothing more. The template images, `getAirports` and `textareaClass` are gone with no references left, and the review text limit is defined once, in `lib/review-rules.ts`, imported by both the server and the admin form.

How the review works: `wiki/system/code-review.md`.

## Must fix

None.

## Should fix

None.

## Suggestions

- `lib/review-rules.ts:1` A reusable pattern: when a client component needs a value from a `server-only` module, move just that value to a small module without `server-only` and let the server module import it. Better than copying the value or dropping `server-only`; useful for later rules shared by form and server (rating range, title length). **Done:** nothing to change; noted as a pattern.
- `lib/db.ts:104` Moving the `connection()` comment to `searchAirports` was right. Other functions call `await connection()` without a comment, and that is fine: the reason is explained once here and in `wiki/system/architecture.md`. **Done:** left as it is.

## Outside the change

None.

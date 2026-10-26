---
id: TECH-004
title: Remove copy-to-prod
---

# Code review of TECH-004

**Result:** Passed
**Date:** 2026-10-26, review run 1
**Summary:** The script, the `package.json` entry, the README row and the architecture paragraph are removed and a log line added, as the card says. Nothing else was made unused.
**Security:** Passed. The change only removes code; the deleted script's risk (a write transaction on Turso without naming the target) is gone. `/security-review`: not needed, as the card says.

How the review works: `wiki/system/code-review.md`. A later run is added at the top as "Review run 2".

## Must fix

None.

## Should fix

- `verification.md:12` The R3 row said the grep finds nothing, but it finds the required line in `wiki/log.md`. **Done:** reworded to "except the line about the removal in `wiki/log.md`".

## Suggestions

- `verification.md` The Code review row had a placeholder. **Done:** filled in.

## Outside the change

- `specs/TECH-005-whole-kronor/spec.md` and `specs/TECH-013-security/solution.md` still mention the script; kept as history on purpose, as the card says. Not added to the board.

---
id: TECH-004
title: Remove copy-to-prod
---

# Verification of TECH-004

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-004-R1 | `npm run lint`, `npm run typecheck`, `npm run build` and `npm run test:time` (the existing suite) | local | Pass | 2026-10-26 |
| TECH-004-R2 | Manual (a test of a missing file would only be noise): `npm run copy-to-prod` reports "Missing script"; `scripts/copy-to-prod.mjs` is not in the repository | local | Pass | 2026-10-26 |
| TECH-004-R3 | Manual: `grep -r copy-to-prod` outside `specs/`, `node_modules`, `.next` and `.git` finds nothing except the line about the removal in `wiki/log.md` | local | Pass | 2026-10-26 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | Not applicable: no logic. The existing ones pass in `npm run test:time` | local | Pass | 2026-10-26 |
| Browser tests | None new; the existing suite shows the site behaves as before | local | Pass | 2026-10-26 |
| Smoke test | Not applicable: no page or flow changed | - | - | - |
| Accessibility | Not applicable: nothing visible changes | - | - | - |
| Security | Security points in the review; `/security-review` not needed, since the change only removes code | local | Pass | 2026-10-26 |
| Code review | [review.md](review.md) | local | Passed | 2026-10-26 |

## Test suite

`npm run test:time` before and after the change.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 160 | 145.4 s (TECH-021 on main, other run) | 3.7 s |
| After | 160 | 153.9 s (budget 180 s) | 3.6 s (`TRIP-012-R1 R4 R5 R6 R10 …`) |

A first run had one failure, `TRIP-013-R1 R9 …`: the test read the result count before the list was filtered (a race in the test, unrelated to this change). It passed in three runs on its own and in the second full run, which is the one above. Not changed here; no card added for one failure seen once.

## Definition of Done

- [x] Tests: every check in the card's test plan is done; every requirement is tested or has a recorded manual check; `npm run test:unit` and `npm run test:local` pass
- [x] Test suite: within the time budgets, total time grown by at most 25 % (or the cause handled); no new tests
- [ ] Deployed, and the smoke tests pass against production (Live tests): not checked yet, after the merge
- [x] Accessibility: not applicable, visitors see no change
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/`), system docs (`wiki/system/`) and `wiki/log.md` updated (the manual never mentioned the script)
- [x] No leftovers: everything the change made unused is deleted, no commented-out code or debug output
- [x] Clean code: `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements noticed along the way added to the board: none noticed

## Requirements as built

### TECH-004-R1 The site behaves as before

The tests pass as before; the site does not use the script. **Given** the change, **when** `npm run lint`, `npm run typecheck`, `npm run build` and `npm run test:time` run, **then** they pass as before.

### TECH-004-R2 The script and command are gone

`scripts/copy-to-prod.mjs` and `npm run copy-to-prod` shall not exist. **Given** the change, **when** `npm run copy-to-prod` is run, **then** npm reports a missing script, and the file is not in the repository.

### TECH-004-R3 No description of it is left

`README.md`, `wiki/system/` and `wiki/manual/` shall not describe or mention `copy-to-prod`. **Given** the change, **when** `grep -r copy-to-prod` is run on the repository outside `specs/` (history) and `node_modules`, **then** nothing is found, and `wiki/log.md` has a line about the removal.

## Notes

None.

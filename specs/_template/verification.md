---
id: TRIP-000
title: Short name of the feature
---

# Verification of TRIP-000

How each requirement was checked. Create this file when work starts and fill it in before the feature moves to `done/`.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-000-R1 | Test `TRIP-000-R1 …` in `tests/TRIP-000-<name>.spec.ts` | local, live | Pass | YYYY-MM-DD |
| TRIP-000-R2 | Manual: … (why it can't be automated) | live | Pass | YYYY-MM-DD |

## Definition of Done

- [ ] Tests: every requirement is tested or has a recorded manual check; `npm run test:local` passes
- [ ] Deployed, and `npm test` passes against the live site
- [ ] Spec updated to match what was built, no open questions left
- [ ] Manual (`wiki/manual/`), system docs (`wiki/system/`) and `wiki/log.md` updated
- [ ] No leftovers: everything the change made unused is deleted, no commented-out code or debug output
- [ ] Clean code: reuses existing components and helpers; `npm run lint`, `npx tsc --noEmit` and `npm run build` pass
- [ ] Technical tasks for larger improvements noticed along the way added to the backlog

## Notes

Deviations from the spec, and anything found during verification.

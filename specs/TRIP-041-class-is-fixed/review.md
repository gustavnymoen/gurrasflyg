---
id: TRIP-041
title: The class is chosen once, in the plan step
---

# Code review of TRIP-041

**Result:** Passed
**Date:** 2026-11-06, review run 1
**Summary:** The change does what R1 to R5 ask. The class select, `changeClass`, `classProblem`, `klasser-N` and "Byt klass" are gone; `fitsTrip()` still protects the server and is stricter; charter behaves as before.
**Security:** Passed. No new route, action or query. `fitsTrip()` now also requires each traveller's class to be the one `firstClasses()` gives. `/security-review` not needed, as the card says.

## Must fix

None.

## Should fix

- `lib/agent.ts` (`AGENT_RULES`) The line said add-ons are removed "where the new class does not have them", but all of the flight's add-ons are removed. **Done:** reworded to "the add-ons they chose on that trip are removed".
- Card #136 R2 says add-ons are removed "because they are not in the traveller's new class"; the built behaviour removes all of the flight's add-ons and lists them (as charter). **Done:** recorded in `solution.md` and `verification.md`; the card's wording is left for the owner to update.

## Suggestions

- `.claude/launch.json` is untracked and unrelated. **Done:** left out of the commit.
- `ClassesNote`: the status region mounts already filled when arriving from the plan step, so screen readers may not announce it (same as charter before). **Done:** left as it is; the text is visible and reachable.
- A form saved before this change with swapped classes is refused by the server and the page has no class field. **Done:** noted in `solution.md`.

## Outside the change

- When TRIP-036 (flight agent) is built it needs its own check of the same rule.

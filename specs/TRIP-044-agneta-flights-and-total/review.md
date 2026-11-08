---
id: TRIP-044
title: Agneta and ordinary flights, and the total in her summary
---

# Code review of TRIP-044

**Result:** Passed
**Date:** 2026-11-08, review run 1
**Summary:** Her total comes from the page's own functions (`seatsTotal`, `NERVES_PRICE`, `extraRows`), the new context fields are checked on the server and carry nothing personal, and the prompt texts allow R1 while still forbidding invented departures, times and prices. No must-fix findings.
**Security:** Passed. `/security-review` run on the working tree: no finding (the fields are checked with the same check as `safeActions`, personal fields are dropped, a forged count can only change the number she says, never a booking).

## Must fix

None.

## Should fix

- `specs/TRIP-044-agneta-flights-and-total/`: `verification.md` was missing. **Done:** written.
- `lib/agent-rules.ts:68` the check of `choice` was needlessly roundabout. **Done:** simplified.

## Suggestions

- `lib/agent-rules.ts:85` the keys of `addons` are not bounded in number. **Done:** left as it is: the body is limited elsewhere and unknown ids are ignored.
- `lib/agent-tools.ts` a comment on why nerves ignore `state.actions.addons`. **Done:** added.

## Outside the change

- `specs/TRIP-036-flight-agent/verification.md` listed the total as a known limit. **Done:** marked as solved by TRIP-044.

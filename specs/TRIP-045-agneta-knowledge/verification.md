---
id: TRIP-045
title: Agneta knows continents, aircraft, classes and add-ons
---

# Verification of TRIP-045

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-045-R1 | Unit test `TRIP-045-R1 every destination has its continent` in `lib/chat-prompt.test.ts` | local | Pass | 2026-11-12 |
| TRIP-045-R2 R3 R4 | Unit tests `TRIP-045-R2 R3 R4 an aircraft is in the text …` and `TRIP-045-R4 the extras for a charter trip …` (a test aircraft with two classes and one add-on; factors, seats, price, the "none" case, the rules text) | local | Pass | 2026-11-12 |
| TRIP-045-R5 | Unit test `TRIP-045-R5 the text follows a changed factor …` and `TRIP-017-R1 building the prompt twice gives the same text` | local | Pass | 2026-11-12 |
| TRIP-045-R6 | Unit test `TRIP-045-R6 the instructions say …` (the rule is in the text). How the real model follows it: not checked | local | Pass (text); model not checked | 2026-11-12 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `npm run test:unit`: 371 pass, the six new ones in `lib/chat-prompt.test.ts` | local | Pass | 2026-11-12 |
| Browser tests | None new; all 262 existing ones pass with `npm run test:local` (they use the mock client) | local | Pass | 2026-11-12 |
| Manual check with the real model (ten questions) | Not checked: needs `LLM_API_KEY` and a call to the shared API; to be done after the merge on the preview or live | live | Not checked | |
| Smoke test | Not applicable: no main page or flow changed | | | |
| Accessibility | Not applicable: no change to what visitors see | | | |
| Security | Security points in the review; `/security-review` not needed | local | Pass | 2026-11-12 |
| Code review | [review.md](review.md) | local | Passed | 2026-11-12 |
| Prompt size | Not measured with real data: the new section is one entry per aircraft and class, a few hundred tokens with the four aircraft of the site; the cache hit (`cache_read_input_tokens`) is not checked | | Not checked | |

## Test suite

`npm run test:time`:

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before (TRIP-044, TECH-030) | 365 unit + 262 browser | browser 72–82 s | 4.5 s |
| After | 371 unit + 262 browser | unit 12.7 s, browser 79.2 s | 4.5 s |

## Definition of Done

- [x] Tests: every requirement has a unit test; `npm run test:unit` and `npm run test:local` pass
- [x] Test suite: within the time budgets, no browser test added
- [ ] Deployed, and the smoke tests pass against production (Live tests): after the merge
- [x] Accessibility: not applicable
- [x] Requirements in the card match what was built (R3 amended: classes are listed per aircraft), no open questions left; copied below; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/fraga-agneta.md`), system docs (`wiki/system/charter-chatbot.md`) and `wiki/log.md` updated
- [x] No leftovers
- [x] Clean code: `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks: none found

## Requirements as built

### TRIP-045-R1 Continent of a destination

Every destination in the system text states its continent from `destinations.continent`, and the instructions say she gives a destination's continent, and lists the destinations of a continent, from it and not from her own knowledge.

### TRIP-045-R2 Aircraft and factors

The system text lists every aircraft with its price and time factor as admin shows them and what they mean, relative to a factor of 1,00; in charter the time factor is not used.

### TRIP-045-R3 Classes

For each aircraft the text lists its classes with price factor and seats. A class that no aircraft has is not listed.

### TRIP-045-R4 Add-ons, extras and their rules

The add-ons with description and price per unit, which aircraft and class offer them, and the rules: up to 10 of each per traveller and flight (per trip in charter), no beer under 18, Dåliga nerver at 1 000 kr per traveller and flight on flights only, and the charter extras (in the booking text) with the drinks package for adults only.

### TRIP-045-R5 Read from the database, one text for every call

The new parts are read from the database at every build, in a fixed order, with no date, time or visitor data.

### TRIP-045-R6 Never invented

The instructions say to use only this data, that what is not in it does not exist for us, and never to price or time a route from the factors.

## Notes

- The "test plan" aircraft that was in the user's local database (and not in production) was deleted at the user's request, after a backup (`db/backups/gurrasflyg-2026-11-12T13-03-23.db`); no booking used it.
- Not committed: waiting for the user.

---
id: TRIP-011
title: Choose aircraft and classes
---

# Verification of TRIP-011

How each requirement was checked. Unit tests in `lib/fare-rules.test.ts`, `lib/trip.test.ts`, `lib/numbers.test.ts`, `lib/format.test.ts` and `db/migrations/008_factors.test.ts`; browser tests in `tests/TRIP-011-aircraft-and-classes.spec.ts`.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-011-R1 | Browser: `TRIP-011-R1 Fortsätt opens the chosen flights …`, `… an address without a chosen flight says what to do`; unit: `TRIP-011-R1` in `lib/trip.test.ts` | local | Pass | 2026-10-23 |
| TRIP-011-R2 | Browser: `TRIP-011-R2 each aircraft shows its price, time, arrival …`; unit: `TRIP-011-R2` in `lib/fare-rules.test.ts` and `lib/trip.test.ts`. Different aircraft per flight kept: the R10 browser tests | local | Pass | 2026-10-23 |
| TRIP-011-R3 | Browser: `TRIP-011-R3 the classes start with everyone in the cheapest …`, `… at 320 px …`; unit: `TRIP-011-R3` in `lib/fare-rules.test.ts`. "Fortsätt cannot be used": step Klasser has no Fortsätt until TRIP-012 (R5) | local | Pass | 2026-10-23 |
| TRIP-011-R4 | Browser: `TRIP-011-R4 the prices per class, per flight and for the trip …`; unit: `TRIP-011-R4` (1 000 × 1,20 × 1,50; 2 × 1 800 + 1 200 = 4 800) | local | Pass | 2026-10-23 |
| TRIP-011-R5 | Code review: the page ends with the prices; the button is checked in TRIP-012 | local | Pass (as far as it goes now) | 2026-10-23 |
| TRIP-011-R6 | Browser: `TRIP-011-R6 a class's price factor is shown, checked and used in the prices`; unit: `TRIP-011-R6` (reading, 1–10, migration data, `CHECK`) | local | Pass | 2026-10-23 |
| TRIP-011-R7 | Browser: the R2 and R8 tests (time and arrival per aircraft); unit: `TRIP-011-R7` (140 × 4,00 = 9 h 20 min, "+1" over midnight, time zones, summer time) | local | Pass | 2026-10-23 |
| TRIP-011-R8 | Browser: `TRIP-011-R8 an aircraft's factors are shown, checked and used in the times`; unit: `TRIP-011-R8` (reading, limits, migration data) | local | Pass | 2026-10-23 |
| TRIP-011-R9 | Browser: `TRIP-011-R9 the från price in the results is the cheapest aircraft with room for everyone`; unit: `TRIP-011-R9` | local | Pass | 2026-10-23 |
| TRIP-011-R10 | Browser: two `TRIP-011-R10` tests (another aircraft, back and on, another flight); unit: `TRIP-011-R10` in `lib/trip.test.ts` | local | Pass | 2026-10-23 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | As above; 69 unit tests in all | local | Pass | 2026-10-23 |
| Browser tests | 12 in `tests/TRIP-011-aircraft-and-classes.spec.ts`, with their own classes and aircraft (worker fixture); TRIP-004's cell positions updated | local | Pass | 2026-10-23 |
| Smoke test | `TRIP-011-R1 @smoke the page for a chosen flight loads and lists aircraft` | local, live | Pass locally; Live tests after the merge of #63 (run 40072108148): 7 smoke tests passed in 9.2 s, this one included. Preview not recorded | 2026-10-23, 2026-10-24 |
| Accessibility | axe: step Plan with an aircraft chosen, step Klasser with a message, step Plan with a message, the admin class and aircraft forms with errors; 320 px without sideways scrolling. The checklist on the live site: see [the checklist](#the-accessibility-checklist-on-the-live-site) | local, live | Pass (axe); checklist: the aircraft form at 320 px failed and is fixed (test below); focus lost in step Klasser moved to TRIP-024 with the user; VoiceOver not checked | 2026-10-23, 2026-10-24 |
| Security | Security points in the review, and `/security-review`: no findings | local | Pass | 2026-10-23 |
| Code review | [review.md](review.md) | local | Passed | 2026-10-23 |

## The accessibility checklist on the live site

Gone through on https://gurrasflyg.vercel.app on 2026-10-24, in the built-in browser of the Claude desktop app (Chromium): `/flyg/plan?fran=ARN&till=LHR&utresa=2026-10-25&resenarer=2&ut=08:20` (steps Plan and Klasser), and `/admin` signed in by the user (the class form for Ekonomi, the aircraft form for Apache). In admin, nothing was saved: the forms were only opened, given an invalid factor ("abc"), which was refused, and cancelled. The keyboard was used through real key presses; names, states and sizes were read from the page.

| # | Check | `/flyg/plan` | Admin forms |
|---|---|---|---|
| 1 | Keyboard | **Failed.** Step Plan: Tab reaches the steps, the aircraft list (one stop; Arrow down chooses the next aircraft) and Fortsätt; Enter on Fortsätt opens Klasser with focus on its heading. Step Klasser: Färre and Fler work with Enter and Space and keep focus, but when the last traveller is placed, the focused Fler button turns disabled and focus is lost to the page (`body`). Not fixed here: with the user, a requirement of TRIP-024 (#62), which rebuilds step Klasser | Pass, with an older fault. Enter on Ändra opens the form with focus in the name field; Tab goes name, Prisfaktor, (Tidsfaktor), the class and addon controls, Spara, Avbryt; Enter submits. After Avbryt, focus is lost to the page; this is older than TRIP-011 (the edit forms are TRIP-019's) |
| 2 | Visible focus | Pass. Every control shows the 2 px ring in `accent-strong`, the aircraft radio buttons included (their card also gets a soft glow) | Pass. The fields' border turns `accent-strong` |
| 3 | Screen reader | Not checked with VoiceOver (needs the user). Read from the page instead: one `h1`, `h2`s "Din resa", "Plan för utresan", "Klasser på utresan"; the steps mark the current one with `aria-current="step"`; the aircraft list is a fieldset of radio buttons named after the aircraft and described by time and price; the count in each class is a polite live region ("1 i Ekonomi"); the message "1 resenär har ingen klass…" is an alert | Not checked with VoiceOver. Read from the page: every field has its label, an invalid factor sets `aria-invalid="true"` and `aria-describedby` to the message, which is an alert |
| 4 | Zoom and 320 px | Pass. At 320 px and at 640 px both steps are exactly as wide as the window | **Failed at 320 px.** The aircraft table is 412 px wide in a 254 px box that scrolls sideways (allowed for a table), but the aircraft form opens as a row inside it, so the form is as wide as the table: Prisfaktor and the right end of the name field and the lists are outside the box until it is scrolled. The two factor columns added by TRIP-011 made the table this wide. At 640 px (200 %) and 1280 px it fits. Also seen: the column headings had no space between them, so at about 800 px they touched ("PRISFAKTORTIDSFAKTOR"). **Fixed** on branch `TRIP-011-live-checks`: the form in a row is as wide as the visible box (`@container` on the box, `sticky left-0 w-[100cqw]` around the form), and the number columns' headings have `pl-4`. Test `TRIP-011-R8 at 320 px the aircraft form and its factor fields fit in view` (failed at 389 px without the fix, passes with it); `TRIP-004-*` and `TRIP-019-*` pass |
| 5 | Text spacing | Pass. Nothing cut off or overlapping in step Plan | Pass with the aircraft form open |
| 6 | Contrast | Text: axe. The radio buttons are the browser's own; the badges' borders are `line-strong` (3:1) | Text: axe. Field borders `line-strong`, focus `accent-strong` |
| 7 | Target size | Pass. Aircraft cards full width; Färre and Fler 34 × 34 px | Pass. Icon buttons 28 × 28 px, the rest larger |
| 8 | Content on hover or focus | Not affected: nothing is shown on hover or focus | Not affected |
| 9 | Errors and labels | Pass. The class message is in text under the classes and says what to do | Pass. The class form's factor message is right under the fields; in the aircraft form the one message for the whole form stands above Spara, below the class and addon lists, and the field is marked and focused |
| 10 | Title, language, images | Pass. "Välj plan och klass – Gurras Flyg", `lang="sv"`, no images | Pass. "Admin – Gurras Flyg"; no new images |
| 11 | Reduced motion | Pass by code review: only colours change (`transition-colors`) | Not affected |

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before (TRIP-010's verification) | 39 unit, 139 browser | about 99 s | under 5 s |
| After | 69 unit, 153 browser | 111.0 s (budget 180 s) | 2.8 s |

Growth about 12 %, within the 25 % rule. The new browser tests take 0.3–2.7 s each.

## Definition of Done

- [x] Tests: every check in the test plan is done except those after the deploy; every requirement is tested; `npm run test:unit` and `npm run test:local` pass
- [x] Test suite: within the budgets, growth about 12 %, the new tests follow the quality rules
- [x] Deployed, and the smoke tests pass against production (Live tests): run 40072108148 after the merge of #63, 7 passed in 9.2 s
- [x] Accessibility: axe passes on every new state; the checklist on the live site on 2026-10-24 found two failures: the aircraft form at 320 px, fixed on branch `TRIP-011-live-checks` (not yet checked on a deploy), and focus lost in step Klasser, which the user moved to TRIP-024 (#62) as a requirement; VoiceOver not checked
- [x] Requirements in the card match what was built (R6 and R8 got the cap of 10,00 with the user), no open questions; `solution.md` describes how it was built
- [x] Manual, system docs and `wiki/log.md` updated
- [x] No leftovers
- [x] Clean code: `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings; see [review.md](review.md)
- [x] Technical tasks: none needed (see "Outside the change" in review.md)

## Requirements as built

The card's requirements as of 2026-10-23 (`gh issue view 16`), built as written, with R6 and R8 including the cap: every factor is at most 10,00 (price factors 1,00–10,00, time factor more than 0 and at most 10,00). An aircraft that can't be chosen shows its time, arrival and price but isn't compared.

## Notes

- The smoke test needs at least one aircraft in the database. Production has some; whether Preview's Turso database has any is not checked.
- Also recorded on this branch: TRIP-010's Live tests after its merge, in its `verification.md`.
- When TRIP-011 was done, the user asked for a change to its flow: the aircraft chosen together with the departure and shown in the summary, and the classes starting at 0 with no going on until everyone is placed. Added as TRIP-024 (#62), at the top of Backlog.

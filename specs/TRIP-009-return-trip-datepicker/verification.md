---
id: TRIP-009
title: Return trip date picker
---

# Verification of TRIP-009

How each requirement was checked. Tests are in `tests/TRIP-009-return-trip-datepicker.spec.ts` unless named otherwise; the browser's clock is fixed at Wednesday 21 October 2026.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-009-R1 | Tests `TRIP-009-R1 the group Datum has the fields Utresa and Hemresa, and the calendar is closed` and `… Utresa and Hemresa are side by side at the full width of the form` (390 px: full width, side by side, Resenärer below, no sideways scroll) | local | Pass | 2026-10-23 |
| TRIP-009-R2 | Tests `TRIP-009-R2 clicking Utresa opens the calendar and keeps focus in the field` and `… Arrow down moves focus to today in the calendar` | local | Pass | 2026-10-23 |
| TRIP-009-R3 | Tests `TRIP-009-R3 and R4 two months from this month, only today to the last bookable day can be chosen` (October and November, Föregående disabled, Nästa disabled with April 2027 last) `TRIP-009-R3 the calendar shows one month` (390 px), and one month with "Tur och retur" off in `TRIP-009-R5 turning Tur och retur off …` | local | Pass | 2026-10-23 |
| TRIP-009-R4 | Test `TRIP-009-R3 and R4 …`: 20 October disabled, 21 October (today) and 21 April 2027 can be chosen, 22 April disabled | local | Pass | 2026-10-23 |
| TRIP-009-R5 | Tests `TRIP-009-R5 Tur och retur is on from the start, and the checkbox is gone` and `… turning Tur och retur off hides Hemresa and keeps the outbound date` (and on again: Hemresa empty) | local | Pass | 2026-10-23 |
| TRIP-009-R6 | Tests `TRIP-009-R6 choosing the outbound and return day, and changing the return day` (also the chosen days marked `aria-selected`) and `… with Tur och retur off, choosing a day closes the calendar`; the range's look by screenshots at 390, 800, 1024 and 1280 px | local | Pass | 2026-10-23 |
| TRIP-009-R7 | Tests `TRIP-009-R7 the return day is from the outbound day up to two months after it` (12 Nov disabled, 13 Nov and 13 Jan can be chosen, 14 Jan disabled, a day trip) and `… a return day that no longer fits the new outbound day is removed` | local | Pass | 2026-10-23 |
| TRIP-009-R8 | Test `TRIP-009-R8 a typed date is read on Enter and when leaving the field` ("13/11" + Enter, "5/1" + Tab gives Tuesday 5 January 2027, "2026-11-13", and Enter on an unchanged date moves on to Hemresa); the other formats by `TRIP-009-R13 parseDate …` | local | Pass | 2026-10-23 |
| TRIP-009-R9 | Test `TRIP-009-R9 a typed date that can't be used gives a message under the group` ("31/2", "2026-10-20", "12/11" and "14/1" in Hemresa, then a valid date removes the message). "Du kan boka max 6 månader framåt." by `TECH-003-R3 bookableRange and dateError …`, which `readDate` uses | local | Pass | 2026-10-23 |
| TRIP-009-R10 | Test `TRIP-009-R10 the summary shows the days with weekday and the number of nights` ("… · 7 nätter", "… · Dagstur"); no summary for one-way in `TRIP-009-R5 turning Tur och retur off …` | local | Pass | 2026-10-23 |
| TRIP-009-R11 | Tests `TRIP-009-R11 Escape closes the calendar and gives focus to the active field` and `… a click outside closes the calendar and keeps the choice` | local | Pass | 2026-10-23 |
| TRIP-009-R12 | Tests `TRIP-009-R12 the keyboard moves between days and months and chooses a day` (Page Down into a month not shown, Home, End, Arrow up stops at today, Arrow right + Enter), `… the month buttons work with the keyboard, and focus stays in the calendar` and `TRIP-009-R12 axe finds no violations with the calendar open, a range chosen and a message`; every test finds days by their full names. Tab order (fields, month buttons, switch, days, out) checked with a temporary script. The checklist on the live site: see below (screen reader checked by the accessibility tree, not VoiceOver) | local, live | Pass | 2026-10-23 |
| TRIP-009-R13 | Tests `TRIP-009-R13 returnRange …` and `TRIP-009-R13 parseDate …`, without a browser; the messages come only from `dateError`/`readDate` in `lib/dates.ts` (code review) | local | Pass | 2026-10-23 |
| TRIP-009-R14 | Code review: `SearchForm.tsx` has no `type="date"` and no checkbox, `Checkbox.tsx` is deleted; TRIP-001 R6, R7 and R9 are marked replaced in its spec and verification, and their tests are removed | local | Pass | 2026-10-23 |
| All | `npm run lint`, `npm run typecheck`, `npm run build` without errors or warnings; `npm run test:time` 139 passed (also after the review's fixes and the product owner's changes to R3 and R10). Against the live site after the deploy: Live tests run 39944177663 on `main`, 126 passed, 13 skipped (`runsLocally`) | local, live | Pass | 2026-10-23 |
| Accessibility | `expectNoA11yViolations` with the calendar open, a range chosen and a message (R12); the checklist on the live site, below | local, live | Pass | 2026-10-23 |

## The checklist (R12)

The items of `wiki/system/accessibility.md` that concern the date fields and the calendar, gone through on <https://gurrasflyg.vercel.app> on 2026-10-23 with a throw-away Playwright script and the browser's clock fixed at 21 October 2026. The screen reader item was checked by the accessibility tree, not with VoiceOver (the user's choice, as in TRIP-021). Recorded on TRIP-022's branch, the next one after the merge.

| Item | Result |
|---|---|
| 1 Keyboard | Tab from Till goes to Utresa, Hemresa, Nästa månad (Föregående disabled), Tur och retur, a day, and out to Fler resenärer, where the calendar closes. Pass |
| 2 Focus visible | Fields by the accent border and ring; buttons, the switch and days by a 2 px outline `#c83560`. Pass |
| 3 Screen reader (accessibility tree) | Group "Datum"; comboboxes Utresa and Hemresa with `expanded`; dialog "Välj datum"; switch `checked`; grid named by the month; days named like "fredag 13 november 2026", unavailable days `disabled`; the message is an alert, and the field has `aria-invalid` and `aria-describedby` to it. Pass |
| 4 320 px | No sideways scroll. Pass |
| 5 Text spacing | Nothing visible clipped (only the visually hidden weekday names). Pass |
| 6 Contrast | Chosen day against the calendar 3.13:1, white on it 5.08:1, the range's lines 3.13:1. Pass |
| 7 Targets | Smallest 34 × 24 px (the switch). Pass |
| 8 Pointer and Escape | The calendar stays open on hover; Escape closes it and gives focus to Utresa. Pass |
| 9 Errors and labels | Messages in text, saying what to do; labels visible. Pass |
| 10 Images, title, language | Not affected (no new images, title or language). |
| 11 Reduced motion | `animation: none`. Pass |

## Test suite

`npm run test:time` before and after the change.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 120 | 76.3 s (TECH-003) | 2.5 s |
| After | 139 | 85.7 s (+12 %) | 2.9 s (`TRIP-009-R12 axe finds no violations with the calendar open, a range chosen and a message`) |

22 new tests (two without a browser), three removed (TRIP-001 R6, R7 and R9); TRIP-020-R6's layout test now checks only Från and Till. A first version waited for every animation on the page before each axe check and took the suite to 101 s (+33 %), because the wordmark's take-off (1.7 s) was waited for every time; `animationsDone` now waits only for the element measured.

## Definition of Done

- [x] Tests: every requirement is tested or has a recorded check; `npm run test:local` passes (2026-10-23)
- [x] Test suite: within the time budgets, 12 % slower, the new tests follow the quality rules (no fixed waits; the clock is fixed so the days are the same on any date)
- [x] Deployed, and `npm test` passes against the live site
- [x] Accessibility: the changed states pass `expectNoA11yViolations`; the checklist on the live site passes (recorded 2026-10-23)
- [x] Requirements in the card match what was built (R3 and R8 clarified on 2026-10-23, and R3 and R10 again after the product owner tried it: one month and no summary for one-way), no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/soka-flyg.md`), system docs (`wiki/system/date-picker.md`, `architecture.md`, `accessibility.md`, `index.md`, `DESIGN.md`) and `wiki/log.md` updated
- [x] No leftovers: `DateInput`, `Checkbox.tsx`, the `Suspense`/`io()` around the date field, `bookableDates()` in the test helpers and the replaced TRIP-001 tests are gone
- [x] Clean code: reuses `Field` (via `FieldBox`), `RoundButton`, `Message`, `floatClass` and the tokens; `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done (passed on the first run; two should-fix findings fixed), no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements: none needed
- [x] Small related fixes: the review carousel's z-index no longer reaches outside it (`isolate`), which put its arrows above the calendar; `wiki/system/index.md` lists TRIP-019 to TRIP-021, which were missing

## Requirements as built

Copied from card #14.

### TRIP-009-R1 The date fields

The search form shall have a date field group named Datum with two text fields side by side: **Utresa** and **Hemresa**, each with its label shown small inside the field (as in TRIP-008-R9) and the placeholder "dd/mm". A chosen date is shown as day/month without leading zeros, for example "13/11".

When "Tur och retur" is off (R5), Hemresa is hidden and Utresa takes the whole width of the group. On a phone (below the `md` breakpoint) the group takes the full width of the form, and Resenärer goes on the row below it.

Acceptance criteria:

- **Given** a visitor opens `/`, **then** the group Datum has the fields Utresa and Hemresa, both showing "dd/mm", and the calendar is closed.
- **Given** a 390 px wide window, **then** Utresa and Hemresa are side by side at the full width of the form, and the page doesn't scroll sideways.

### TRIP-009-R2 The fields open the calendar

Clicking a date field, or moving focus to it, shall open the calendar under the group. Focus stays in the field so the traveller can type. The field the calendar is choosing for (the active field) has the accent border. Arrow down in a field moves focus into the calendar, to the field's date, or to today if it has none.

Acceptance criteria:

- **When** the traveller clicks Utresa, **then** the calendar (a dialog named "Välj datum") opens, Utresa has focus and the instruction is "Välj utresa".
- **When** the traveller presses Arrow down in Utresa, **then** today has focus in the calendar.

### TRIP-009-R3 What the calendar looks like

The calendar shall look like the one on the TRIP-008 design board: a floating surface with a header (the previous month button, the instruction, the next month button, and the switch), the months, and, for a return trip, a summary at the bottom. From 1024 px wide (Tailwind's `lg`) it shows two months side by side; narrower, and when "Tur och retur" is off, it shows one month, on a phone at the full width of the form. Weeks start on Monday, and month and weekday names are in Swedish ("november 2026"; "må ti on to fr lö sö"). Today has a brass ring.

The instruction is "Välj utresa" or "Välj hemresa" after the active field, and "Välj datum" when "Tur och retur" is off. The calendar opens on the month of the active field's date, or on the current month. The previous month button is disabled when the current month is shown first, and the next month button is disabled when the month of the last bookable day is shown last.

Acceptance criteria:

- **Given** the calendar is open on a wide screen and no date is chosen, **then** this month and next month are shown, and "Föregående månad" is disabled.
- **When** the traveller presses "Nästa månad" until it is disabled, **then** the last month shown contains the last bookable day.
- **Given** a 390 px wide window, **then** one month is shown.
- **Given** "Tur och retur" is off, **then** one month is shown also on a wide screen.

### TRIP-009-R4 Bookable days

Only days from today up to the last bookable day (`bookableRange` in `lib/dates.ts`, today + `MAX_MONTHS_AHEAD` months, in the visitor's local time) shall be possible to choose in the calendar. Other days are shown faded and disabled.

Acceptance criteria:

- **Given** the calendar is open, **then** yesterday is disabled and today can be chosen.
- **Given** the month of the last bookable day is shown, **then** that day can be chosen and the day after it is disabled.

### TRIP-009-R5 The switch "Tur och retur"

The calendar shall have a switch "Tur och retur", on when the page opens. The checkbox "Boka returresa" in the form is removed.

- Turning it off hides Hemresa and removes the return date; the outbound date is kept.
- Turning it on shows Hemresa again, empty.

Acceptance criteria:

- **Given** a visitor opens `/` and opens the calendar, **then** "Tur och retur" is on, and the form has no checkbox "Boka returresa".
- **Given** 13/11 and 20/11 are chosen, **when** the traveller turns the switch off, **then** Hemresa is hidden and Utresa shows "13/11".

### TRIP-009-R6 Choosing dates in the calendar

Clicking a bookable day shall set the active field's date:

- **Utresa active, "Tur och retur" on:** the day becomes the outbound date and Hemresa becomes the active field (focus moves to it).
- **Utresa active, "Tur och retur" off:** the day becomes the outbound date and the calendar closes.
- **Hemresa active:** the day becomes the return date and the calendar closes.

The days between the outbound and return date are highlighted as a range, with the outbound and return days in the accent colour.

Acceptance criteria:

- **Given** the switch is on, **when** the traveller clicks Utresa, then 13 November, then 20 November, **then** the calendar closes, Utresa shows "13/11" and Hemresa "20/11".
- **Given** the switch is off, **when** the traveller clicks 13 November, **then** the calendar closes and Utresa shows "13/11".
- **Given** 13/11 and 20/11 are chosen, **when** the traveller clicks Hemresa and then 27 November, **then** Hemresa shows "27/11" and Utresa still "13/11".

### TRIP-009-R7 Limits for the return day

While Hemresa is active, only days from the outbound date up to 2 months after it (`returnRange` in `lib/dates.ts`, `MAX_TRIP_MONTHS = 2`) shall be possible to choose in the calendar, and never after the last bookable day. The outbound day itself can be chosen (a day trip). Other days are disabled. With no outbound date, Hemresa follows the bookable days (R4).

When the outbound date is changed so that the chosen return date no longer fits (before the new outbound date, or more than 2 months after it), the return date is removed.

Acceptance criteria:

- **Given** the outbound date is 13 November 2026 and Hemresa is active, **then** 12 November is disabled, 13 November and 13 January 2027 can be chosen, and 14 January 2027 is disabled.
- **Given** the outbound date is 13 November, **when** the traveller clicks 13 November as the return, **then** Hemresa shows "13/11".
- **Given** 13/11 and 20/11 are chosen, **when** the outbound date is changed to 25/11, **then** Hemresa is empty.

### TRIP-009-R8 Typing a date

The traveller shall be able to type a date in Utresa and Hemresa as:

| Typed | Means |
|---|---|
| `13/11` | 13 November, the next time it occurs from today on (today included) |
| `13/11 2026` or `13/11/2026` | 13 November 2026 |
| `2026-11-13` | 13 November 2026 |

Day and month can have one or two digits. The text is read when the traveller presses Enter or leaves the field. A valid date that can be chosen is set and shown as "13/11", and the calendar shows its month. With Enter it is as if the day had been clicked in the calendar (R6, R7); when leaving the field, the date is set but focus stays where the traveller moved it. While typing, nothing is read and no message is shown.

Acceptance criteria:

- **Given** today is 21 October 2026, **when** the traveller types "13/11" in Utresa and presses Enter, **then** the outbound date is 13 November 2026 and Hemresa is active.
- **Given** today is 21 October 2026, **when** the traveller types "5/1" in Utresa and leaves the field, **then** the outbound date is 5 January 2027.
- **When** the traveller types "2026-11-13" in Utresa and presses Enter, **then** Utresa shows "13/11".

### TRIP-009-R9 Messages for typed dates

A typed date that can't be used shall leave the field's text as typed, show it in red with a message under the date group (as in `specs/overview.md`, Errors), and leave the field's date empty. The message disappears when the field gets a valid date or is emptied.

| Case | Field | Message |
|---|---|---|
| Not a date in a known format, or a date that doesn't exist (31/2) | Utresa or Hemresa | Skriv datumet som 13/11 eller 2026-11-13. |
| Before today | Utresa or Hemresa | Datumet har redan passerat. |
| After the last bookable day | Utresa or Hemresa | Du kan boka max 6 månader framåt. |
| Return before the outbound date | Hemresa | Hemresan kan inte vara före utresan. |
| Return more than 2 months after the outbound date | Hemresa | Hemresan kan vara max 2 månader efter utresan. |

A date without a year is never "before today", since it means the next time it occurs. The numbers in the messages come from `MAX_MONTHS_AHEAD` and `MAX_TRIP_MONTHS`.

Acceptance criteria:

- **When** the traveller types "31/2" in Utresa and presses Enter, **then** "Skriv datumet som 13/11 eller 2026-11-13." is shown and Utresa is red.
- **Given** today is 21 October 2026, **when** the traveller types "2026-10-20" in Utresa and presses Enter, **then** "Datumet har redan passerat." is shown.
- **Given** the outbound date 13/11 2026, **when** the traveller types "12/11" in Hemresa and presses Enter, **then** "Hemresan kan inte vara före utresan." is shown.
- **Given** the outbound date 13/11 2026, **when** the traveller types "14/1" in Hemresa and presses Enter, **then** "Hemresan kan vara max 2 månader efter utresan." is shown.
- **When** the traveller then types a valid date, **then** the message disappears.

### TRIP-009-R10 Summary in the calendar

When "Tur och retur" is on, the bottom of the calendar shall summarise the choice, with the weekday. A one-way trip has no summary: its one date already shows in the field and in the calendar.

| Choice | Summary |
|---|---|
| Nothing chosen | Utresa – |
| Outbound only, return on | Utresa **fre 13 nov** · Hemresa – |
| Both, same day | Utresa **fre 13 nov** · Hemresa **fre 13 nov** · Dagstur |
| Both, 1 night | … · 1 natt |
| Both, more nights | … · 7 nätter |

Acceptance criteria:

- **Given** 13/11 and 20/11 2026 are chosen, **then** the summary is "Utresa fre 13 nov · Hemresa fre 20 nov · 7 nätter".
- **Given** 13/11 and 13/11 are chosen, **then** the summary ends with "Dagstur".
- **Given** "Tur och retur" is off, **then** the calendar has no summary.

### TRIP-009-R11 Closing the calendar

The calendar shall close when a choice is complete (R6), when the traveller presses Escape, and when focus or a click moves outside the date group and the calendar. What has been chosen is kept. After Escape, focus is on the active field. Clicking a date field again opens the calendar again.

Acceptance criteria:

- **When** the traveller presses Escape in the calendar, **then** it closes and the active field has focus.
- **Given** only the outbound date is chosen, **when** the traveller clicks outside the calendar, **then** it closes, Utresa shows the date and Hemresa is empty.

### TRIP-009-R12 Keyboard

Everything in the calendar shall work with the keyboard, following the WAI-ARIA date picker dialog pattern:

| Key | Does |
|---|---|
| Arrow left / right | Previous / next day |
| Arrow up / down | Same weekday the week before / after |
| Home / End | First / last day of the week |
| Page Up / Page Down | Same day the month before / after |
| Enter / Space | Choose the day in focus, if it can be chosen |
| Tab | Moves between the month buttons, the switch and the days |
| Escape | Closes (R11) |

Moving focus to a month that isn't shown shows it. Focus stays within today and the last bookable day. Each day is announced with its full date, for example "fredag 13 november 2026", and as chosen or not available where that applies.

Acceptance criteria:

- **Given** focus on today in the calendar with Utresa active, **when** the traveller presses Arrow right and Enter, **then** tomorrow is the outbound date.
- **When** the traveller presses Page Down, **then** focus is on the same day next month, and that month is shown.
- **Then** `expectNoA11yViolations` (TRIP-008-R18) finds no violations with the calendar open, with a range chosen, and with a message under the date group. (Test.)
- **Then** the items of the checklist in `wiki/system/accessibility.md` that concern the fields and the calendar have been gone through on the live site, with VoiceOver, and recorded in `verification.md`. (Manual check.)

### TRIP-009-R13 The date rules in the shared module

`lib/dates.ts` (TECH-003) shall also export:

- `MAX_TRIP_MONTHS = 2`.
- `returnRange(outbound, range)`: the earliest and latest return day for an outbound day, `{ min, max }`, as `YYYY-MM-DD`: `min` is the outbound day, `max` is the earlier of `addMonths(outbound, MAX_TRIP_MONTHS)` and `range.max`.
- `parseDate(text, today)`: a typed date (R8) as `YYYY-MM-DD`, or `null` if it isn't a date.
- The messages of R9, from one function per field or one with the outbound date as an optional argument, so that the calendar has no date rules or messages of its own.

Acceptance criteria (tests without a browser page, like TECH-003-R3):

- **Given** the range 2026-10-20 to 2027-04-20, **then** `returnRange("2026-11-13")` is 2026-11-13 to 2027-01-13, `returnRange("2026-12-31")` is 2026-12-31 to 2027-02-28, and `returnRange("2027-03-01")` is 2027-03-01 to 2027-04-20.
- **Given** today 2026-10-21, **then** `parseDate` gives 2026-11-13 for "13/11", "13/11 2026", "13/11/2026" and "2026-11-13"; 2027-01-05 for "5/1"; 2026-10-21 for "21/10"; 2027-10-20 for "20/10"; and `null` for "31/2", "13/13", "2026-02-30", "abc" and "".

### TRIP-009-R14 The old date field is gone

The browser's date picker and the checkbox "Boka returresa" shall be removed from the form. TRIP-001-R6 and R9 are replaced by this feature, and TRIP-001-R7 by R9 here: the TRIP-001 spec and its tests are updated to say so.

Acceptance criteria:

- **Then** `app/components/SearchForm.tsx` has no `type="date"` input and no checkbox. (Code review.)
- **Then** the TRIP-001 spec marks R6, R7 and R9 as replaced by TRIP-009, and its tests for them are removed or moved to TRIP-009.

### Non-functional requirements

- WCAG 2.2 level AA as in `specs/overview.md`, plus R12. The criteria that matter most here: keyboard (2.1.1), name, role and state (4.1.2), labels (3.3.2), errors in text that say how to fix them (3.3.1, 3.3.3), messages read out without moving focus (4.1.3), the days at least 24 × 24 px (2.5.8), and the range, today's ring and focus at least 3:1 against the background (1.4.11). The group is a `fieldset` named Datum; each field has its label, `aria-haspopup="dialog"` and `aria-expanded`, and an invalid field has `aria-invalid` and is linked to its message. The calendar has `role="dialog"` and the name "Välj datum"; the days are a grid of buttons; disabled days have `aria-disabled`.
- Today's date is the visitor's, not the server's (as TRIP-001). Tests that depend on today's date set the browser's clock.
- Opening the calendar and moving between months has no noticeable delay; no data is fetched.
- Motion follows the TRIP-008 motion curves and is turned off with `prefers-reduced-motion`.

## Notes

- The old TRIP-001, TRIP-008, TRIP-020 tests that used the date field or the checkbox were changed or removed, and their specs note it (TRIP-001 R6, R7, R9 replaced; TRIP-008's checkbox is the switch; TRIP-020-R6's phone layout).
- After one-way got one month (R3), `TRIP-009-R6 with Tur och retur off, choosing a day closes the calendar` failed: 13 November was no longer shown. A wrong test, not a bug in the site; it now goes on to November first.

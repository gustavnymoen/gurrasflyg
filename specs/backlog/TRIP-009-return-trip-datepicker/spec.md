---
id: TRIP-009
title: Return trip date picker
area: Flight booking
status: backlog
created: 2026-10-21
updated: 2026-10-21
depends_on: [TRIP-001, TECH-003, TRIP-008]
---

# TRIP-009 Return trip date picker

## Goal

A traveller chooses the outbound date, and the return date if they want one, either by typing them or in a calendar designed for the site, instead of the browser's own date picker. Days that can't be chosen are disabled in the calendar, and a typed date that isn't allowed gets a message that says what to do.

## Background

Today the search form (TRIP-001) has a single date field that uses the browser's date picker, and a separate checkbox, "Boka returresa", that has no effect yet. Dates are checked against the rule "today up to six months ahead" (TRIP-001-R6, R7). TECH-003 moves that rule and its messages to `lib/dates.ts`. TRIP-008 gives the field its new look but keeps the browser's date picker. It also draws a calendar on its design board (two months, outbound and return as a range, today with a brass ring, a summary at the bottom), which this feature uses as a starting point.

Settled with the product owner on 2026-10-21:

- The date field in the form is split in two halves, Utresa and Hemresa, that can be typed in. Clicking or focusing them opens the calendar.
- Dates can be typed as "13/11" (day/month, with or without year) or "2026-11-13".
- One-way or return is chosen with a switch inside the calendar, "Tur och retur", on by default since most travellers want to come home.
- The return can be on the same day as the outbound. Whether there are departures that fit is checked in the search results, not here.
- The return can't be before the outbound, and at most 2 months after it.
- The last bookable day is a number of months ahead that is set in one place (`MAX_MONTHS_AHEAD` in `lib/dates.ts`, today 6).
- Typing is also the accessible way in: a screen reader or keyboard user can enter a date without going through the calendar grid (WCAG 2.2 AA, see `specs/overview.md`).
- The calendar is our own component, not a library: the rules and the look are specific to the site, and the keyboard pattern is worth learning.

## Users

Traveller.

## Scope

**In scope**

- The date fields Utresa and Hemresa in the search form on the start page, and a calendar component that opens from them.
- Interpreting and checking typed dates.
- The switch "Tur och retur", replacing the checkbox "Boka returresa".
- The rules for the return date and for reading typed dates, in `lib/dates.ts`.

**Out of scope**

- Checking that there are flights on the chosen dates, and searching (search results feature).
- Prices or availability per day in the calendar.
- Month names in typed dates ("13 nov").
- Charter trips and their timetable periods (charter feature; it can reuse the calendar).
- Keeping the chosen dates after a page reload or in the address (search results feature).

## Requirements

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

The calendar shall look like the one on the TRIP-008 design board: a floating surface with a header (the previous month button, the instruction, the next month button, and the switch), the months, and a summary at the bottom. On wide screens it shows two months side by side; on a phone one month at the full width of the form. Weeks start on Monday, and month and weekday names are in Swedish ("november 2026"; "må ti on to fr lö sö"). Today has a brass ring.

The instruction is "Välj utresa" or "Välj hemresa" after the active field, and "Välj datum" when "Tur och retur" is off. The calendar opens on the month of the active field's date, or on the current month. The previous month button is disabled when the current month is shown first, and the next month button is disabled when the month of the last bookable day is shown last.

Acceptance criteria:

- **Given** the calendar is open on a wide screen and no date is chosen, **then** this month and next month are shown, and "Föregående månad" is disabled.
- **When** the traveller presses "Nästa månad" until it is disabled, **then** the last month shown contains the last bookable day.
- **Given** a 390 px wide window, **then** one month is shown.

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

Day and month can have one or two digits. The text is read when the traveller presses Enter or leaves the field. A valid date that can be chosen is set as if it had been clicked in the calendar (R6, R7), the calendar shows its month, and the field shows it as "13/11". While typing, nothing is read and no message is shown.

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

The bottom of the calendar shall summarise the choice, with the weekday:

| Choice | Summary |
|---|---|
| Nothing chosen | Utresa – |
| One-way | Utresa **fre 13 nov** |
| Outbound only, return on | Utresa **fre 13 nov** · Hemresa – |
| Both, same day | Utresa **fre 13 nov** · Hemresa **fre 13 nov** · Dagstur |
| Both, 1 night | … · 1 natt |
| Both, more nights | … · 7 nätter |

Acceptance criteria:

- **Given** 13/11 and 20/11 2026 are chosen, **then** the summary is "Utresa fre 13 nov · Hemresa fre 20 nov · 7 nätter".
- **Given** 13/11 and 13/11 are chosen, **then** the summary ends with "Dagstur".

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

## Data

None. The chosen dates are kept in the search form's state: the outbound date, the return date (or none) and whether "Tur och retur" is on, as `YYYY-MM-DD`, ready for the search results feature.

## Interface

- `app/components/DatePicker.tsx` (new): the date group with Utresa and Hemresa, and the calendar.
- `app/components/SearchForm.tsx`: uses `DatePicker`; `DateInput` and the checkbox are removed; on a phone Resenärer moves to its own row (changes TRIP-008-R15).
- `lib/dates.ts`: `MAX_TRIP_MONTHS`, `returnRange`, `parseDate`, the return messages, and formatting as "13/11" and "fre 13 nov".
- Design tokens and shared components from TRIP-008 (field style, floating surface, accent, brass, round buttons); no new colours.

Texts (Swedish):

| Where | Text |
|---|---|
| Group name | Datum |
| Field labels / placeholder | Utresa · Hemresa / dd/mm |
| Field, chosen | 13/11 |
| Dialog name | Välj datum |
| Instruction | Välj datum · Välj utresa · Välj hemresa |
| Month buttons | Föregående månad · Nästa månad |
| Switch | Tur och retur |
| Summary | Utresa · Hemresa · Dagstur · 1 natt · N nätter |
| Messages | See R9 |

## Non-functional requirements

- WCAG 2.2 level AA as in `specs/overview.md`, plus R12. The criteria that matter most here: keyboard (2.1.1), name, role and state (4.1.2), labels (3.3.2), errors in text that say how to fix them (3.3.1, 3.3.3), messages read out without moving focus (4.1.3), the days at least 24 × 24 px (2.5.8), and the range, today's ring and focus at least 3:1 against the background (1.4.11). The group is a `fieldset` named Datum; each field has its label, `aria-haspopup="dialog"` and `aria-expanded`, and an invalid field has `aria-invalid` and is linked to its message. The calendar has `role="dialog"` and the name "Välj datum"; the days are a grid of buttons; disabled days have `aria-disabled`.
- Today's date is the visitor's, not the server's (as TRIP-001). Tests that depend on today's date set the browser's clock.
- Opening the calendar and moving between months has no noticeable delay; no data is fetched.
- Motion follows the TRIP-008 motion curves and is turned off with `prefers-reduced-motion`.

## Open questions

None.

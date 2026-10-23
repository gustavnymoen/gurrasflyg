---
id: TRIP-009
title: Return trip date picker
card: "#14"
depends_on: [TRIP-001, TECH-003, TRIP-008]
---

# TRIP-009 Return trip date picker: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 14`.

## Data

None. The chosen dates are kept in the search form's state: the outbound date, the return date (or none) and whether "Tur och retur" is on, as `YYYY-MM-DD`, ready for the search results feature.

## Interface

How it works in detail, for developers: [`wiki/system/date-picker.md`](../../wiki/system/date-picker.md).

- `app/components/DatePicker.tsx` (new, R1, R2, R5–R9, R11): the date group (`fieldset` named Datum) with Utresa and Hemresa, the messages under it, and the state: active field, typed texts, messages, month shown, day with focus. It works out which days can be chosen and what a choice does.
- `app/components/Calendar.tsx` (new, R3, R4, R10, R12): the dialog "Välj datum": month buttons, instruction, the switch (always on the right), one or two month grids (`table role="grid"`, a `button` per day), the summary for a return trip, and the keyboard pattern.
- `app/components/Switch.tsx` (new, R5): an on/off `button` with `role="switch"`. `Checkbox.tsx` is deleted; the checkbox was its only use.
- `app/components/Field.tsx`: the box is split out as `FieldBox`, with `invalid` (red border without a message under it) and `active` (the focus look while focus is in the calendar). `Field` uses it as before.
- `app/components/SearchForm.tsx` (R1, R14): `DatePicker` instead of `DateInput` and the checkbox; the dates are `TripDates` (`{ outbound, return, roundTrip }`). The form is a column on phones and a row from `md`, so Resenärer is on its own row on a phone.
- `lib/dates.ts` (R13): `MAX_TRIP_MONTHS`, `returnRange`, `parseDate`, `readDate` (text to a date or a message), `dateError` with the outbound date as optional argument for the return messages, `fromDateString`, `addDays`, `nightsBetween`, the Swedish formats (`formatShort` "13/11", `formatDay` "fre 13 nov", `formatLong` "fredag 13 november 2026", `formatMonth` "november 2026") and `WEEK` ("må" … "sö" with full names).
- `app/globals.css`: the token `--animate-float-in` (160 ms fade and 4 px slide when the calendar opens).
- `app/components/ReviewCarousel.tsx`: `isolate` on the carousel, so its cards' and arrows' z-index stay inside it and the calendar floats above them.

Texts (Swedish):

| Where | Text |
|---|---|
| Group name | Datum (for screen readers; the fields show their own labels) |
| Field labels / placeholder | Utresa · Hemresa / dd/mm |
| Field, chosen | 13/11 |
| Dialog name | Välj datum |
| Instruction | Välj datum · Välj utresa · Välj hemresa |
| Month buttons | Föregående månad · Nästa månad |
| Switch | Tur och retur |
| A day (read aloud) | fredag 13 november 2026 |
| Summary | Utresa fre 13 nov · Hemresa fre 20 nov · 7 nätter (Dagstur, 1 natt) |
| Messages | See R9 |

## Decisions

- **Our own calendar, no library** (from the card): the rules and the look are the site's own, and the WAI-ARIA keyboard pattern is worth learning.
- **No `Suspense` or `io()` any more.** The old date field needed today's date when the page was drawn (its `min` and `max`), so it waited for the browser. Now the calendar is only drawn while open and typed text is read in event handlers, so `new Date()` only runs in the browser and the form is drawn at once.
- **The fields are comboboxes.** The card asks for `aria-haspopup="dialog"` and `aria-expanded`; `aria-expanded` is not allowed on a plain text field, so the fields have `role="combobox"`, as in the WAI-ARIA "date picker combobox" example.
- **Two months from 1024 px.** Two months need about 600 px. Below `lg` that doesn't fit under the date fields, so tablets get one month (added to R3 with the product owner). One-way shows one month on every screen, since there is only one date to choose (also R3, after the product owner tried it). For the same reason one-way has no summary (R10).
- **Enter versus leaving the field** (added to R8 with the product owner): Enter acts as a click in the calendar and moves on to Hemresa; leaving the field sets the date but doesn't pull focus back, so a click elsewhere goes where it was meant to.
- **A click in the calendar keeps focus where it is** (`preventDefault` on mouse down), so the traveller can keep typing and the calendar doesn't close from a blur.
- **Focus is moved after the render** (`pendingFocus` and an effect), so a handler run by that focus change sees the new state and the element to focus exists.
- **Contrast of the range** (non-functional requirement 1.4.11): the accent `#8b1e3f` is only 1.7:1 against the calendar, so the chosen days use the strong accent (3.1:1, white text 5.1:1), and the days between have accent lines at top and bottom (3.1:1) besides the faint band of the design board.
- **The design board's "Klar" button** is left out: the card closes the calendar when the choice is complete, on Escape or a click outside.
- **Tests fix the browser's clock** at 21 October 2026, so they give the same days on any date and against the live site. `tests/helpers.ts` lost `bookableDates()`, which only the replaced TRIP-001 tests used, and got `animationsDone`, because axe and contrast checks must wait for the calendar's fade-in.

---
type: Component
title: Date picker
description: The date fields Utresa and Hemresa in the search form, the calendar under them, and the date rules they use.
resource: app/components/DatePicker.tsx
feature: TRIP-009
tags: [dates, calendar, search, flight-booking, accessibility]
timestamp: 2026-10-23
---

# Date picker

The search form's date group has two text fields, **Utresa** and **Hemresa**, and a calendar that opens under them. It is the site's own component, not a library and not the browser's date picker.

## Parts

| Part | File | Does |
|---|---|---|
| `DatePicker` | `app/components/DatePicker.tsx` | The two fields, the messages under the group, and all state: the active field, the typed texts, the messages, the month shown, the day with focus. It decides which days can be chosen and what happens when one is. |
| `Calendar` | `app/components/Calendar.tsx` | The dialog: month buttons, instruction, the switch, one or two month grids and, for a return trip, the summary. It has no date rules of its own; it gets the days that can be chosen from `DatePicker`. It also handles the arrow keys in the grid. |
| Date rules | `lib/dates.ts` | `bookableRange` (today to `MAX_MONTHS_AHEAD` months ahead), `returnRange` (outbound day to `MAX_TRIP_MONTHS` months after it, never after the last bookable day), `parseDate` and `readDate` (typed text to a date or a message), `dateError` (the messages), and the Swedish formats ("13/11", "fre 13 nov", "fredag 13 november 2026", "november 2026"). No `server-only`, so the search results can use the same rules. |

`SearchForm` keeps the chosen dates as `TripDates`: `{ outbound, return, roundTrip }`, dates as `YYYY-MM-DD` or `null`, ready for the search results.

## How it works

- **Today is the visitor's.** The calendar is only drawn while it is open, and the typed text is only read when the visitor does something, so `new Date()` always runs in the browser. That is why the form needs no `Suspense` or `io()`.
- **Opening.** Focus or a click on a field opens the calendar for that field (the active field). The calendar opens on the month of the field's date, or this month. When the code itself moves focus to a field (after a choice, or after Escape), a flag (`quietFocus`) stops that focus from opening the calendar again.
- **Focus stays in the field.** The calendar's `onMouseDown` calls `preventDefault()`, so a click on a day, a month button or the switch leaves focus where it was. The traveller can keep typing, and the calendar doesn't see a blur.
- **Closing.** The calendar closes when a choice is complete, on Escape, and when focus leaves the wrapper around the fields and the calendar (`onBlur` with `relatedTarget` outside it).
- **Moving focus after a render.** Choosing a day may move focus to Hemresa, or Escape back to the field, and the keyboard moves focus between days. The target is noted in a ref (`pendingFocus`) and focused in an effect after React has drawn the change, so the field or day exists and handlers see the new state.
- **Typed dates.** Nothing is read while typing. On Enter the date is set as if its day had been clicked; when leaving the field it is set but focus stays where the traveller moved it. A date that can't be used keeps the text, marks the field invalid and shows the message under the group.
- **A new outbound day** removes the return day if it no longer fits `returnRange`.

## The calendar

- **Months.** Two side by side from 1024 px (`lg`, followed with `matchMedia`) when "Tur och retur" is on, otherwise one; one-way has only one date to choose. The first month shown is kept between this month and the month of the last bookable day (`clampMonth`).
- **Grid.** Each month is a `<table role="grid">` named by its month title. Each day is a `button` with its full date as name ("fredag 13 november 2026"); a day that can't be chosen has `aria-disabled`, and the outbound and return days' cells have `aria-selected`. Only one day has `tabIndex={0}` (roving tabindex): the day with focus, else the active field's date, else today, else the first day shown.
- **Keyboard** (WAI-ARIA date picker dialog): arrows by day and week, Home/End to the week's Monday/Sunday, Page Up/Down by month, Enter/Space chooses, Escape closes. Focus never leaves today to the last bookable day, and the months shown follow it (`monthShowing`). Arrow down in a field goes into the grid.
- **Fields.** Each field is a `combobox` with `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls` (the WAI-ARIA "date picker combobox"), because `aria-expanded` is not allowed on a plain text field.
- **Look.** The outbound and return days in the strong accent (3:1 against the calendar, white text 5:1), the days between as a band with accent lines at top and bottom (3:1), today with a brass ring, days that can't be chosen faded. The active field has the focus look (`FieldBox` with `active`) while focus is in the calendar. The calendar floats in (`animate-float-in`), which reduced motion turns off.
- **Layers.** The review carousel has `isolate`, so its cards' and arrows' z-index stay inside it and the calendar floats above them.

## Tests

`tests/TRIP-009-return-trip-datepicker.spec.ts` fixes the browser's clock (`page.clock.setFixedTime`) at 21 October 2026, so the tests give the same days on any date. The rules in `lib/dates.ts` are tested without a browser. Before measuring colours or running axe with the calendar open, tests wait for its fade-in with `animationsDone` in `tests/helpers.ts`.

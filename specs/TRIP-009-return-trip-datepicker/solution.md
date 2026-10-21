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

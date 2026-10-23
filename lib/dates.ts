// Regler för vilka datum som går att boka, gemensamma för webbläsaren och servern.
// Datumen är kalenderdatum i besökarens lokala tid, som text "YYYY-MM-DD".
// Sådan text går att jämföra med < och > eftersom den sorteras i datumordning.

export const MAX_MONTHS_AHEAD = 6;

// Första och sista dagen som går att välja, båda medräknade
export type DateRange = { min: string; max: string };

// "YYYY-MM-DD" i lokal tid (toISOString() ger UTC och kan bli fel dag)
export function toDateString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Lägger till månader utan att "rinna över", t.ex. 31 aug + 6 mån = 28/29 feb
export function addMonths(date: Date, months: number) {
  const result = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(date.getDate(), lastDay));
  return result;
}

// Idag till och med MAX_MONTHS_AHEAD månader framåt
export function bookableRange(today: Date): DateRange {
  return { min: toDateString(today), max: toDateString(addMonths(today, MAX_MONTHS_AHEAD)) };
}

// Meddelandet för ett datum utanför spannet, eller null om det är tomt eller går att boka
export function dateError(value: string, range: DateRange) {
  if (value === "") return null;
  if (value < range.min) return "Datumet har redan passerat.";
  if (value > range.max) return `Du kan boka max ${MAX_MONTHS_AHEAD} månader framåt.`;
  return null;
}

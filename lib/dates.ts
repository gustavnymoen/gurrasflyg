// Regler för vilka datum som går att boka, gemensamma för webbläsaren och servern.
// Datumen är kalenderdatum i besökarens lokala tid, som text "YYYY-MM-DD".
// Sådan text går att jämföra med < och > eftersom den sorteras i datumordning.

export const MAX_MONTHS_AHEAD = 6;
// Längsta resan: hemresan högst så här många månader efter utresan
export const MAX_TRIP_MONTHS = 2;

const FORMAT_ERROR = "Skriv datumet som 13/11 eller 2026-11-13.";

const MONTHS = [
  "januari",
  "februari",
  "mars",
  "april",
  "maj",
  "juni",
  "juli",
  "augusti",
  "september",
  "oktober",
  "november",
  "december",
];
// Söndag först, som Date.getDay()
const WEEKDAYS = ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"];

// Första och sista dagen som går att välja, båda medräknade
export type DateRange = { min: string; max: string };

// "YYYY-MM-DD" i lokal tid (toISOString() ger UTC och kan bli fel dag)
export function toDateString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Tillbaka från "YYYY-MM-DD" till ett datum, vid midnatt i lokal tid
export function fromDateString(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(value: string, days: number) {
  const date = fromDateString(value);
  date.setDate(date.getDate() + days);
  return toDateString(date);
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

// Dagarna hemresan kan vara på: från utresan (en dagstur går bra) till
// MAX_TRIP_MONTHS månader efter, men aldrig efter sista bokningsbara dagen
export function returnRange(outbound: string, range: DateRange): DateRange {
  const latest = toDateString(addMonths(fromDateString(outbound), MAX_TRIP_MONTHS));
  return { min: outbound, max: latest < range.max ? latest : range.max };
}

// Meddelandet för ett datum utanför spannet, eller null om det är tomt eller går att boka.
// Med utresan som argument gäller också reglerna för hemresan.
export function dateError(value: string, range: DateRange, outbound?: string) {
  if (value === "") return null;
  if (value < range.min) return "Datumet har redan passerat.";
  if (value > range.max) return `Du kan boka max ${MAX_MONTHS_AHEAD} månader framåt.`;
  if (outbound) {
    const allowed = returnRange(outbound, range);
    if (value < allowed.min) return "Hemresan kan inte vara före utresan.";
    if (value > allowed.max) return `Hemresan kan vara max ${MAX_TRIP_MONTHS} månader efter utresan.`;
  }
  return null;
}

// Ett inskrivet datum som "YYYY-MM-DD", eller null om texten inte är ett datum.
// "13/11" (dag/månad) betyder nästa gång dagen infaller, idag medräknad;
// "13/11 2026", "13/11/2026" och "2026-11-13" har året utskrivet.
export function parseDate(text: string, today: Date) {
  const value = text.trim().replace(/\s+/g, " ");
  const iso = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) return validDate(Number(iso[1]), Number(iso[2]), Number(iso[3]));

  const dayMonth = value.match(/^(\d{1,2})\/(\d{1,2})(?:[/ ](\d{4}))?$/);
  if (!dayMonth) return null;
  const [day, month] = [Number(dayMonth[1]), Number(dayMonth[2])];
  if (dayMonth[3]) return validDate(Number(dayMonth[3]), month, day);

  // Utan år: det första året dagen finns och inte har passerat (29/2 kan ligga några år fram)
  const todayString = toDateString(today);
  for (let year = today.getFullYear(); year <= today.getFullYear() + 4; year++) {
    const date = validDate(year, month, day);
    if (date && date >= todayString) return date;
  }
  return null;
}

// Datumet som text, eller null om dagen inte finns (t.ex. 31/2)
function validDate(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day);
  const exists = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return exists ? toDateString(date) : null;
}

// Läser det besökaren skrivit i ett datumfält: datumet om det går att välja,
// annars meddelandet. Tom text ger varken datum eller meddelande.
export function readDate(text: string, today: Date, outbound?: string) {
  if (text.trim() === "") return { date: null, error: null };
  const date = parseDate(text, today);
  if (!date) return { date: null, error: FORMAT_ERROR };
  const error = dateError(date, bookableRange(today), outbound);
  return error ? { date: null, error } : { date, error: null };
}

// "13/11"
export function formatShort(value: string) {
  const date = fromDateString(value);
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

// "fre 13 nov"
export function formatDay(value: string) {
  const date = fromDateString(value);
  return `${WEEKDAYS[date.getDay()].slice(0, 3)} ${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)}`;
}

// "fredag 13 november 2026"
export function formatLong(value: string) {
  const date = fromDateString(value);
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

// "november 2026"
export function formatMonth(value: string) {
  const date = fromDateString(value);
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

// Veckodagarna från måndag: [["må", "måndag"], …]
export const WEEK = [...WEEKDAYS.slice(1), WEEKDAYS[0]].map((name) => [name.slice(0, 2), name]);

// Antal nätter mellan två dagar. Avrundat, eftersom ett dygn med
// sommartidsomställning är 23 eller 25 timmar.
export function nightsBetween(from: string, to: string) {
  return Math.round((fromDateString(to).getTime() - fromDateString(from).getTime()) / 86_400_000);
}

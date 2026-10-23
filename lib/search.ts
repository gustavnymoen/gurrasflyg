// En flygsökning och dess adress, gemensamt för webbläsaren och servern (TRIP-010-R2).
// Adressen är t.ex. /flyg?fran=ARN&till=LHR&utresa=2026-11-13&hemresa=2026-11-20&resenarer=2

export const MIN_TRAVELLERS = 1;
export const MAX_TRAVELLERS = 10;

// Flygplatserna som IATA-koder och datumen som "YYYY-MM-DD". Enkel resa: return är null.
export type Search = { from: string; to: string; outbound: string; return: string | null; travellers: number };

export const RESULTS_PATH = "/flyg";

export function searchUrl(search: Search) {
  const params = new URLSearchParams({ fran: search.from, till: search.to, utresa: search.outbound });
  if (search.return) params.set("hemresa", search.return);
  params.set("resenarer", String(search.travellers));
  return `${RESULTS_PATH}?${params}`;
}

type Params = Record<string, string | string[] | undefined>;

// Sökningen i adressen, eller null om något saknas eller är fel. Att
// flygplatserna finns och datumen går att boka avgör sidan.
export function parseSearch(params: Params): Search | null {
  const text = (name: string) => (typeof params[name] === "string" ? params[name] : undefined);
  const [from, to, outbound, back, travellers] = ["fran", "till", "utresa", "hemresa", "resenarer"].map(text);

  const iata = /^[A-Z]{3}$/;
  if (!from || !to || !iata.test(from) || !iata.test(to) || from === to) return null;
  if (!outbound || !isDate(outbound)) return null;
  if (back !== undefined && (!isDate(back) || back < outbound)) return null;
  const count = Number(travellers);
  if (!travellers || !Number.isInteger(count) || count < MIN_TRAVELLERS || count > MAX_TRAVELLERS) return null;

  return { from, to, outbound, return: back ?? null, travellers: count };
}

// "YYYY-MM-DD" och en dag som finns (inte 2026-02-30)
function isDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

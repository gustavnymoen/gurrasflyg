import { expect, test } from "vitest";
import { parseSearch, searchUrl } from "./search";

const params = { fran: "ARN", till: "LHR", utresa: "2026-11-13", hemresa: "2026-11-20", resenarer: "2" };

test("TRIP-010-R2 the search is written into the address and read back", () => {
  const search = { from: "ARN", to: "LHR", outbound: "2026-11-13", return: "2026-11-20", travellers: 2 };
  const url = searchUrl(search);
  expect(url).toBe("/flyg?fran=ARN&till=LHR&utresa=2026-11-13&hemresa=2026-11-20&resenarer=2");
  expect(parseSearch(Object.fromEntries(new URL(url, "http://x").searchParams))).toEqual(search);
});

test("TRIP-010-R2 a one-way search has no return date", () => {
  const search = { from: "ARN", to: "LHR", outbound: "2026-11-13", return: null, travellers: 1 };
  expect(searchUrl(search)).toBe("/flyg?fran=ARN&till=LHR&utresa=2026-11-13&resenarer=1");
  expect(parseSearch({ ...params, hemresa: undefined, resenarer: "1" })).toEqual(search);
});

test("TRIP-010-R2 an incomplete or invalid search in the address is refused", () => {
  for (const wrong of [
    { fran: undefined },
    { till: "lhr" },
    { till: "ARN" },
    { utresa: "13/11" },
    { utresa: "2026-02-30" },
    { hemresa: "2026-11-12" },
    { resenarer: "0" },
    { resenarer: "11" },
    { resenarer: "2.5" },
    { resenarer: undefined },
    { fran: ["ARN", "GOT"] },
  ]) {
    expect(parseSearch({ ...params, ...wrong }), JSON.stringify(wrong)).toBeNull();
  }
});

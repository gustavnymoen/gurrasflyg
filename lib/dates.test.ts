import { expect, test } from "vitest";
import {
  addMonths,
  bookableRange,
  dateError,
  formatDay,
  formatShort,
  parseDate,
  readDate,
  returnRange,
  toDateString,
} from "./dates";

// The date rules are plain functions. Dates are made with
// new Date(year, monthIndex, day), in local time.

test("TECH-003-R3 addMonths ends on the last day of a shorter month", () => {
  expect(toDateString(addMonths(new Date(2026, 7, 31), 6))).toBe("2027-02-28");
  expect(toDateString(addMonths(new Date(2027, 7, 31), 6))).toBe("2028-02-29");
  expect(toDateString(addMonths(new Date(2027, 0, 15), 6))).toBe("2027-07-15");
});

test("TECH-003-R3 toDateString writes the local date with leading zeros", () => {
  expect(toDateString(new Date(2027, 2, 5))).toBe("2027-03-05");
});

test("TECH-003-R3 bookableRange and dateError allow today up to six months ahead", () => {
  const range = bookableRange(new Date(2026, 9, 20));
  expect(range).toEqual({ min: "2026-10-20", max: "2027-04-20" });

  expect(dateError("2026-10-19", range)).toBe("Datumet har redan passerat.");
  expect(dateError("2026-10-20", range)).toBeNull();
  expect(dateError("2027-04-20", range)).toBeNull();
  expect(dateError("2027-04-21", range)).toBe("Du kan boka max 6 månader framåt.");
  expect(dateError("", range)).toBeNull();
});

test("TRIP-009-R13 returnRange is from the outbound day up to two months after, within the bookable days", () => {
  const range = { min: "2026-10-20", max: "2027-04-20" };
  expect(returnRange("2026-11-13", range)).toEqual({ min: "2026-11-13", max: "2027-01-13" });
  expect(returnRange("2026-12-31", range)).toEqual({ min: "2026-12-31", max: "2027-02-28" });
  expect(returnRange("2027-03-01", range)).toEqual({ min: "2027-03-01", max: "2027-04-20" });
});

test("TRIP-009-R13 parseDate reads day/month with or without a year, and ISO dates", () => {
  const today = new Date(2026, 9, 21);
  for (const text of ["13/11", "13/11 2026", "13/11/2026", "2026-11-13"]) {
    expect(parseDate(text, today), text).toBe("2026-11-13");
  }
  expect(parseDate("5/1", today)).toBe("2027-01-05");
  expect(parseDate("21/10", today)).toBe("2026-10-21");
  expect(parseDate("20/10", today)).toBe("2027-10-20");
  for (const text of ["31/2", "13/13", "2026-02-30", "abc", ""]) {
    expect(parseDate(text, today), text).toBeNull();
  }
});

// The cases below were checked through the page in TRIP-009's browser tests,
// which now keep one or two cases each (TECH-015).

test("TRIP-009-R8 a typed date is shown as day/month, and in the summary with its weekday", () => {
  expect(formatShort("2026-11-13")).toBe("13/12");
  expect(formatShort("2027-01-05")).toBe("5/1");
  expect(formatDay("2026-11-13")).toBe("fre 13 nov");
  expect(formatDay("2027-01-05")).toBe("tis 5 jan");
});

test("TRIP-009-R9 readDate gives the message for a date that can't be used", () => {
  const today = new Date(2026, 9, 21);
  expect(readDate("31/2", today)).toEqual({ date: null, error: "Skriv datumet som 13/11 eller 2026-11-13." });
  expect(readDate("2026-10-20", today)).toEqual({ date: null, error: "Datumet har redan passerat." });
  expect(readDate("2027-04-22", today)).toEqual({ date: null, error: "Du kan boka max 6 månader framåt." });
  expect(readDate("12/11", today, "2026-11-13")).toEqual({ date: null, error: "Hemresan kan inte vara före utresan." });
  expect(readDate("14/1", today, "2026-11-13")).toEqual({
    date: null,
    error: "Hemresan kan vara max 2 månader efter utresan.",
  });
  expect(readDate("20/11", today, "2026-11-13")).toEqual({ date: "2026-11-20", error: null });
  expect(readDate("  ", today)).toEqual({ date: null, error: null });
});

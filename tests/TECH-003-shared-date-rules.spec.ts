import { expect, test } from "@playwright/test";
import { addMonths, bookableRange, dateError, toDateString } from "../lib/dates";

// The rules are plain functions, so they are tested without a browser page.
// Dates are made with new Date(year, monthIndex, day), in local time.

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

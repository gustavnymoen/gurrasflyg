import { expect, test } from "vitest";
import { formatFactor, parseFactor, parsePriceFactor, parseTimeFactor, parseWholeNumber } from "./numbers";

test("TECH-007-R3 whole numbers are read in one way", () => {
  expect(parseWholeNumber("1290")).toBe(1290);
  expect(parseWholeNumber("1 290")).toBe(1290);
  expect(parseWholeNumber(" 0 ")).toBe(0);
  for (const text of ["12,50", "12.50", "1e2", "12.0", "-5", "tolv", "", "  "]) {
    expect(parseWholeNumber(text), text).toBeNull();
  }
});

test("TRIP-011-R6 a factor is read with a decimal comma and at most two decimals", () => {
  expect(parseFactor("1,50")).toBe(150);
  expect(parseFactor("1,5")).toBe(150);
  expect(parseFactor("1")).toBe(100);
  expect(parseFactor(" 0,05 ")).toBe(5);
  expect(parseFactor("12,34")).toBe(1234);
  for (const text of ["1.50", "1,505", "abc", "", ",5", "1,", "-1", "1 000", "123"]) {
    expect(parseFactor(text), text).toBeNull();
  }
});

test("TRIP-011-R6 a factor is shown with a decimal comma and two decimals", () => {
  expect(formatFactor(150)).toBe("1,50");
  expect(formatFactor(100)).toBe("1,00");
  expect(formatFactor(30)).toBe("0,30");
  expect(formatFactor(1205)).toBe("12,05");
});

test("TRIP-011-R6 a price factor is from 1 to 10", () => {
  expect(parsePriceFactor("1,00")).toBe(100);
  expect(parsePriceFactor("8")).toBe(800);
  expect(parsePriceFactor("10,00")).toBe(1000);
  expect(parsePriceFactor("10,01")).toBeNull();
  expect(parsePriceFactor("0,90")).toBeNull();
  expect(parsePriceFactor("abc")).toBeNull();
});

test("TRIP-011-R8 a time factor is more than 0 and at most 10", () => {
  expect(parseTimeFactor("0,01")).toBe(1);
  expect(parseTimeFactor("4,00")).toBe(400);
  expect(parseTimeFactor("10")).toBe(1000);
  expect(parseTimeFactor("11")).toBeNull();
  expect(parseTimeFactor("0")).toBeNull();
  expect(parseTimeFactor("0,00")).toBeNull();
  expect(parseTimeFactor("abc")).toBeNull();
});

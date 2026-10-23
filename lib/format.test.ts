import { expect, test } from "vitest";
import { formatAmount, formatDuration, formatPrice } from "./format";

test("TECH-005-R3 prices are formatted as whole kronor", () => {
  // Intl skriver mellanslag som hårt mellanslag
  expect(formatPrice(1290).replace(/\s/g, " ")).toBe("1 290 kr");
  expect(formatAmount(1290).replace(/\s/g, " ")).toBe("1 290");
  expect(formatPrice(0).replace(/\s/g, " ")).toBe("0 kr");
});

test("TRIP-011-R7 a flight time is shown in hours and minutes", () => {
  expect(formatDuration(560)).toBe("9 h 20 min");
  expect(formatDuration(120)).toBe("2 h");
  expect(formatDuration(45)).toBe("45 min");
  expect(formatDuration(1)).toBe("1 min");
});

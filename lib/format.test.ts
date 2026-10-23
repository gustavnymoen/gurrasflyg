import { expect, test } from "vitest";
import { formatAmount, formatPrice } from "./format";

test("TECH-005-R3 prices are formatted as whole kronor", () => {
  // Intl skriver mellanslag som hårt mellanslag
  expect(formatPrice(1290).replace(/\s/g, " ")).toBe("1 290 kr");
  expect(formatAmount(1290).replace(/\s/g, " ")).toBe("1 290");
  expect(formatPrice(0).replace(/\s/g, " ")).toBe("0 kr");
});

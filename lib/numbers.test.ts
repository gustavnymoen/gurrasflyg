import { expect, test } from "vitest";
import { parseWholeNumber } from "./numbers";

test("TECH-007-R3 whole numbers are read in one way", () => {
  expect(parseWholeNumber("1290")).toBe(1290);
  expect(parseWholeNumber("1 290")).toBe(1290);
  expect(parseWholeNumber(" 0 ")).toBe(0);
  for (const text of ["12,50", "12.50", "1e2", "12.0", "-5", "tolv", "", "  "]) {
    expect(parseWholeNumber(text), text).toBeNull();
  }
});

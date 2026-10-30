import { expect, test } from "vitest";
import { MAX_SEARCH_LENGTH, searchText } from "./search-text";

const params = (q?: string) => new URLSearchParams(q === undefined ? "" : { q });

test("TECH-026-R2 a search text of 1 000 characters is cut to 100", () => {
  expect(MAX_SEARCH_LENGTH).toBe(100);
  expect(searchText(params("a".repeat(1000)))).toBe("a".repeat(100));
});

test("TECH-026-R2 a short search text is trimmed and kept, and a missing one is empty", () => {
  expect(searchText(params("  lon "))).toBe("lon");
  expect(searchText(params())).toBe("");
});

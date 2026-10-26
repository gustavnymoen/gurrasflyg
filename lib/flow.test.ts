import { describe, expect, test } from "vitest";
import { isInFlow } from "./flow";

describe("isInFlow", () => {
  test("TRIP-018-R3 the flight and charter pages are in a flow", () => {
    for (const path of ["/flyg", "/flyg/plan", "/flyg/boka", "/flyg/boka/betala", "/charter"]) {
      expect(isInFlow(path), path).toBe(true);
    }
  });

  test("TRIP-018-R3 the start page, the summary of a made booking and admin are not", () => {
    for (const path of ["/", "/flyg/bokad", "/admin", "/admin/login", "/flygplan", "/charterresor"]) {
      expect(isInFlow(path), path).toBe(false);
    }
  });
});

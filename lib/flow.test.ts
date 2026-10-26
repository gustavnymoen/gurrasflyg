import { describe, expect, test } from "vitest";
import { abortTarget, isInFlow } from "./flow";

describe("isInFlow", () => {
  test("TRIP-018-R3 the flight and charter pages are in a flow", () => {
    for (const path of ["/flyg", "/flyg/plan", "/flyg/boka", "/flyg/boka/betala", "/charter", "/charter/teufelsberg", "/charter/teufelsberg/resor", "/charter/teufelsberg/boka/betala"]) {
      expect(isInFlow(path), path).toBe(true);
    }
  });

  test("TRIP-018-R3 the start page, the summaries of a made booking and admin are not", () => {
    for (const path of ["/", "/flyg/bokad", "/charter/bokad", "/admin", "/admin/login", "/flygplan", "/charterresor"]) {
      expect(isInFlow(path), path).toBe(false);
    }
  });
});

test("TRIP-014-R10 Avbryt goes to the charter page after the search, otherwise to the start page", () => {
  for (const path of ["/charter/teufelsberg/resor", "/charter/teufelsberg/boka", "/charter/teufelsberg/boka/betala"]) {
    expect(abortTarget(path), path).toBe("/charter");
  }
  for (const path of ["/", "/flyg/plan", "/charter", "/charter/teufelsberg", "/charter/bokad"]) {
    expect(abortTarget(path), path).toBe("/");
  }
});

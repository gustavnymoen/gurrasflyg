import { expect, test } from "vitest";
import { isAgentUrl, parseAgentContext, safeActions, takeMarkers } from "./agent-rules";

test("TRIP-030-R3 only the charter pages of the known shapes may be opened", () => {
  for (const url of ["/charter", "/charter?sok=berlin&land=DE", "/charter/teufelsberg", "/charter/teufelsberg/resor?fran=ARN", "/charter/teufelsberg/boka", "/charter/teufelsberg/boka/betala?x=1"]) {
    expect(isAgentUrl(url), url).toBe(true);
  }
  for (const url of [
    "/", "/admin", "/flyg", "/charter/bokad/x", "/charter//evil.com", "//evil.com", "https://evil.com/charter", "/charter/../admin",
    "/charter/Teufelsberg", "/charter/a/b", "/charter/a/boka/betala/x", "/charter#x", "/charter?x=" + "a".repeat(1300), "javascript:alert(1)", 5, null, undefined,
  ]) {
    expect(isAgentUrl(url), String(url)).toBe(false);
  }
});

test("TRIP-030-R4 the page context is checked: unknown extras are dropped, a wrong shape is refused", () => {
  const ok = { url: "/charter/x", extras: ["ultimate", "nonsense", 5], payment: "cash", valid: true };
  expect(parseAgentContext(ok)).toEqual({ url: "/charter/x", extras: ["ultimate"], payment: "cash", valid: true });
  expect(parseAgentContext({ ...ok, payment: undefined })?.payment).toBeNull();
  for (const bad of [null, "x", {}, { ...ok, url: "https://x" }, { ...ok, url: 5 }, { ...ok, extras: "ultimate" }, { ...ok, payment: "bitcoin" }, { ...ok, valid: "yes" }, { ...ok, extras: Array(11).fill("ultimate") }]) {
    expect(parseAgentContext(bad), JSON.stringify(bad)).toBeNull();
  }
});

test("TRIP-030-R3 an action that is not of a known kind with checked values is dropped", () => {
  const actions = [
    { type: "goto", url: "/charter/teufelsberg" },
    { type: "goto", url: "/admin" },
    { type: "goto", url: "https://evil.com" },
    { type: "extras", extras: ["drinks"] },
    { type: "extras", extras: ["nonsense"] },
    { type: "payment", payment: "collect" },
    { type: "payment", payment: "bitcoin" },
    { type: "book" },
    { type: "extras", extras: "drinks" },
    null,
    "goto",
  ];
  expect(safeActions(actions)).toEqual([
    { type: "goto", url: "/charter/teufelsberg" },
    { type: "extras", extras: ["drinks"] },
    { type: "payment", payment: "collect" },
  ]);
  expect(safeActions("goto")).toEqual([]);
});

test("TRIP-030-R1 R8 the markers are taken out of the text and reported", () => {
  expect(takeMarkers("Nej.\n[[HELP]]")).toEqual({ text: "Nej.", help: true, book: false });
  expect(takeMarkers("Tryck.\n[[BOOK]]\n")).toEqual({ text: "Tryck.", help: false, book: true });
  expect(takeMarkers("Bara text")).toEqual({ text: "Bara text", help: false, book: false });
});

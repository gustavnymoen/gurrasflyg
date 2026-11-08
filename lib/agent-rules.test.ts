import { expect, test } from "vitest";
import { isAgentUrl, parseAgentContext, safeActions, takeMarkers } from "./agent-rules";

test("TRIP-030-R3 TRIP-036-R1 only the charter and flight pages of the known shapes may be opened", () => {
  for (const url of ["/charter", "/charter?sok=berlin&land=DE", "/charter/teufelsberg", "/charter/teufelsberg/resor?fran=ARN", "/charter/teufelsberg/plan?fran=ARN&ut-plan=3", "/charter/teufelsberg/boka", "/charter/teufelsberg/boka/betala?x=1", "/flyg", "/flyg?fran=ARN&till=LHR", "/flyg/plan?fran=ARN", "/flyg/boka", "/flyg/boka/betala?x=1"]) {
    expect(isAgentUrl(url), url).toBe(true);
  }
  for (const url of [
    "/", "/admin", "/flyg/bokad", "/flyg/", "/flyg/plan/x", "/flyg/boka/betala/x", "/flygx", "/flyg#x", "//flyg", "/charter/bokad/x", "/charter//evil.com", "//evil.com", "https://evil.com/charter", "/charter/../admin",
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
    { type: "addons", legKeys: ["a", "b"], passengers: [[{ classId: 1, addons: { 5: 2 } }, { classId: 1, addons: {} }]] },
    { type: "addons", legKeys: ["a"], passengers: [[{ classId: 1, addons: { 5: 99 } }]] },
    { type: "addons", legKeys: ["a"], passengers: [[{ classId: 1, addons: {} }, { classId: 1, addons: {} }]] },
    { type: "addons", legKeys: ["a"], passengers: Array(11).fill([{ classId: 1, addons: {} }]) },
    { type: "addons", legKeys: [5], passengers: [] },
    null,
    "goto",
  ];
  expect(safeActions(actions)).toEqual([
    { type: "goto", url: "/charter/teufelsberg" },
    { type: "extras", extras: ["drinks"] },
    { type: "payment", payment: "collect" },
    { type: "addons", legKeys: ["a", "b"], passengers: [[{ classId: 1, addons: { 5: 2 } }, { classId: 1, addons: {} }]] },
  ]);
  expect(safeActions("goto")).toEqual([]);
});

test("TRIP-030-R1 R8 the markers are taken out of the text and reported", () => {
  expect(takeMarkers("Nej.\n[[HELP]]")).toEqual({ text: "Nej.", help: true, book: false });
  expect(takeMarkers("Tryck.\n[[BOOK]]\n")).toEqual({ text: "Tryck.", help: false, book: true });
  expect(takeMarkers("Bara text")).toEqual({ text: "Bara text", help: false, book: false });
});

test("TRIP-037-R1 Min bokning may be opened, with a query but not with anything after it", () => {
  for (const url of ["/min-bokning", "/min-bokning?x=1"]) expect(isAgentUrl(url), url).toBe(true);
  for (const url of ["/min-bokning/", "/min-bokning/x", "/min-bokningx", "/min-bokning#x"]) expect(isAgentUrl(url), url).toBe(false);
});

test("TRIP-037-R4 the extract of a booking is accepted only on Min bokning and only if it has the right form", () => {
  const booking = { kind: "charter", groups: [{ label: "resan", late: false, parts: [{ id: 5, label: "Resenär 1", amount: 100, cancelled: false }] }], ticked: [5] };
  const context = { url: "/min-bokning", extras: [], payment: null, valid: false };
  expect(parseAgentContext({ ...context, booking })?.booking).toEqual(booking);
  expect(parseAgentContext(context)?.booking).toBeUndefined(); // ingen bokning hittad: inget utdrag
  expect(parseAgentContext({ ...context, booking: { ...booking, kind: "x" } })).toBeNull();
  expect(parseAgentContext({ ...context, url: "/charter", booking })).toBeNull();
});

test("TRIP-037-R5 the tick action keeps whole numbers only", () => {
  expect(safeActions([{ type: "tick", ids: [1, 2] }, { type: "tick", ids: ["1"] }, { type: "tick", ids: 5 }, { type: "tick", ids: Array(41).fill(1) }])).toEqual([{ type: "tick", ids: [1, 2] }]);
});

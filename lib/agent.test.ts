import { afterAll, afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { openUnitDb } from "../db/test-db";
import { safeActions } from "./agent-rules";
import { unitTestDbFile } from "./local-db.mjs";

// Agentläget mot enhetstesternas databas (vitest.global-setup.mjs) och en manusstyrd klient: ingen modell anropas.
vi.mock("next/server", () => ({ connection: async () => {} }));
process.env.TURSO_DATABASE_URL = `file:${unitTestDbFile}`;
let askAgent: typeof import("./agent").askAgent;
let readPage: typeof import("./agent-page").readPage;
let buildSystemPrompt: typeof import("./chat-prompt").buildSystemPrompt;

// Testets plan med två klasser och ett tillägg i båda (satta i beforeAll). Priset: avgångens × 150 % × klassens.
const ids = { aircraft: 0, economy: 0, business: 0, meal: 0 };

beforeAll(async () => {
  const db = openUnitDb();
  try {
    const classId = async (name: string) => Number((await db.execute({ sql: "SELECT id FROM classes WHERE name = ?", args: [name] })).rows[0].id);
    ids.economy = await classId("Ekonomi");
    ids.business = await classId("Business");
    ids.aircraft = Number((await db.execute("INSERT INTO aircraft (name, price_percent, time_percent) VALUES ('Unit Agentplan', 150, 200)")).lastInsertRowid);
    for (const [id, capacity] of [[ids.economy, 10], [ids.business, 1]]) {
      await db.execute({ sql: "INSERT INTO aircraft_capacity (aircraft_id, class_id, capacity) VALUES (?, ?, ?)", args: [ids.aircraft, id, capacity] });
    }
    ids.meal = Number((await db.execute("INSERT INTO addons (name, description, price) VALUES ('Unit Måltid', 'Unit', 120)")).lastInsertRowid);
    for (const id of [ids.economy, ids.business]) {
      await db.execute({ sql: "INSERT INTO aircraft_class_addons (aircraft_id, class_id, addon_id) VALUES (?, ?, ?)", args: [ids.aircraft, id, ids.meal] });
    }
  } finally {
    db.close();
  }
  ({ askAgent } = await import("./agent"));
  ({ readPage } = await import("./agent-page"));
  ({ buildSystemPrompt } = await import("./chat-prompt"));
});
afterAll(async () => {
  const db = openUnitDb();
  try {
    await db.execute({ sql: "DELETE FROM aircraft_class_addons WHERE aircraft_id = ?", args: [ids.aircraft] });
    await db.execute({ sql: "DELETE FROM aircraft_capacity WHERE aircraft_id = ?", args: [ids.aircraft] });
    await db.execute({ sql: "DELETE FROM aircraft WHERE id = ?", args: [ids.aircraft] });
    await db.execute("DELETE FROM addons WHERE name LIKE 'Unit %'");
  } finally {
    db.close();
  }
});
beforeEach(() => {
  // Långt före alla datum, så att inget har avgått
  vi.useFakeTimers({ toFake: ["Date"], now: new Date("2026-11-02T10:00:00Z") });
  vi.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const usage = { input_tokens: 5, output_tokens: 7, cache_read_input_tokens: 3, cache_creation_input_tokens: 0 };
const use = (name: string, input: unknown, id = "t1") => ({ type: "tool_use", id, name, input });
const toolUse = use; // under ett annat namn i hjälpare, som lintregeln för hooks tar för en hook
const toolTurn = (...uses: unknown[]) => ({ content: uses, stop_reason: "tool_use", usage });
const textTurn = (text: string) => ({ content: [{ type: "text", text }], stop_reason: "end_turn", usage });

// En klient som ger svaren i tur och ordning (eller det en funktion bestämmer) och skriver ner anropen
function scripted(...turns: unknown[]) {
  const create = vi.fn(async (params: { tool_choice?: unknown }) => (turns.length > 1 ? turns.shift() : turns[0]) ?? params);
  return { client: { messages: { create } } as never, create };
}

const question = [{ role: "user" as const, content: "Hjälp mig" }];
const context = (over = {}) => ({ url: "/charter", extras: [] as string[], payment: null, valid: false, ...over });
const trip = { id: "teufelsberg", from: "ARN", outbound: "2027-01-11", return: "2027-01-16", travellers: 2 };
const tripUrl = (step: string, extra = "") => `/charter/teufelsberg/${step}?fran=ARN&utresa=2027-01-11&hemresa=2027-01-16&resenarer=2${extra}`;
const CHOSEN = "&ut=ARN-BER-SK1122&hem=BER-ARN-SK1123";
// Båda resorna med plan och klasser: en i Business och en i Ekonomi på båda
const planned = () => `${CHOSEN}&ut-plan=${ids.aircraft}&ut-klasser=${encodeURIComponent(`${ids.economy}:1,${ids.business}:1`)}&hem-plan=${ids.aircraft}&hem-klasser=${encodeURIComponent(`${ids.economy}:2`)}`;

// Vad modellen fick som svar på verktygen i det sista anropet
const toolResults = (create: ReturnType<typeof scripted>["create"]) =>
  (create.mock.calls.at(-1)![0] as { messages: { content: unknown }[] }).messages
    .flatMap((m) => (Array.isArray(m.content) ? m.content : []))
    .filter((b: { type?: string }) => b.type === "tool_result") as { content: string; is_error: boolean }[];

test("TRIP-030-R2 R9 the request carries the tools, the agent rules after the system prompt, the page with the question, and cache_control", async () => {
  const { client, create } = scripted(textTurn("Nej."));
  await askAgent(question, context({ url: tripUrl("boka", planned()), extras: ["ultimate"], payment: "cash", valid: true }), client);
  const params = create.mock.calls[0][0] as unknown as { cache_control: unknown; tools: { name: string }[]; system: { text: string }[]; messages: { content: { text: string }[] }[] };
  expect(params.cache_control).toEqual({ type: "ephemeral" });
  expect(params.tools.map((t) => t.name)).toEqual([
    "show_destinations", "show_destination", "find_trips", "show_results", "show_plan", "list_aircraft", "set_plan", "list_addons", "set_addons", "show_travellers", "set_extras", "set_payment", "summarise",
  ]);
  expect(params.system).toHaveLength(2);
  expect(params.system[0].text).toBe(await buildSystemPrompt());
  expect(params.system[1].text).toContain("# Agent mode");
  expect(params.system[1].text).toContain("grumpy");
  // The page is with the last question, never in the system text (which must stay the same to be cached)
  const [page, asked] = params.messages[0].content;
  expect(asked.text).toBe("Hjälp mig");
  expect(page.text).toContain("Chosen outbound trip: ARN-BER-SK1122");
  expect(page.text).toContain("Chosen aircraft and travellers per class, outbound: Unit Agentplan");
  expect(page.text).toContain("Extras chosen: Den ultimata upplevelsen");
  expect(page.text).toContain("Payment method: Cash till piloten");
  expect(page.text).toContain("form is valid");
  expect(JSON.stringify(params.system)).not.toContain("Chosen outbound trip");
});

test("TRIP-041-R4 she knows the class is decided in the plan step, and the Resenärer page says it cannot be changed there", async () => {
  const { client, create } = scripted(textTurn("Nej."));
  await askAgent(question, context({ url: tripUrl("boka", planned()) }), client);
  const params = create.mock.calls[0][0] as unknown as { system: { text: string }[]; messages: { content: { text: string }[] }[] };
  expect(params.system[1].text).toContain("decided in the plan step only");
  expect(params.system[1].text).toContain("never say you change it there");
  expect(params.messages[0].content[0].text).toContain("the classes are shown but cannot be changed here");
});

test("TRIP-030-R2 the usage of every model call is logged", async () => {
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  const { client } = scripted(toolTurn(use("summarise", {})), textTurn("Klart."));
  await askAgent(question, context(), client);
  expect(log.mock.calls.filter(([name]) => name === "chat usage")).toHaveLength(2);
});

test("TRIP-030-R2 the model can call at most 6 tools: the 7th request must answer, and extra calls in one turn are refused", async () => {
  const { client, create } = scripted(toolTurn(use("find_trips", { id: "nej" })), textTurn("never"));
  create.mockImplementation(async (params: { tool_choice?: unknown }) => (params.tool_choice ? textTurn("Nu räcker det.") : toolTurn(use("find_trips", { id: "nej" }))));
  const answer = await askAgent(question, context(), client);
  expect(answer?.reply).toBe("Nu räcker det.");
  expect(create).toHaveBeenCalledTimes(7);
  expect((create.mock.calls[6][0] as { tool_choice?: unknown }).tool_choice).toEqual({ type: "none" });
  expect((create.mock.calls[5][0] as { tool_choice?: unknown }).tool_choice).toBeUndefined();
  expect(toolResults(create)).toHaveLength(6);

  // Eight calls in one turn: six run, two get the limit text, and the next request must answer
  const many = scripted(toolTurn(...Array.from({ length: 8 }, (_, i) => use("summarise", {}, `t${i}`))), textTurn("Klar."));
  await askAgent(question, context(), many.client);
  const results = toolResults(many.create);
  expect(results).toHaveLength(8);
  expect(results.filter((r) => r.content.startsWith("Tool call limit reached"))).toHaveLength(2);
  expect((many.create.mock.calls[1][0] as { tool_choice?: unknown }).tool_choice).toEqual({ type: "none" });
});

test("TRIP-030-R2 a tool call with wrong arguments is answered with an error text and nothing happens", async () => {
  const { client, create } = scripted(
    toolTurn(
      use("show_destination", { id: "../admin" }, "a"),
      use("find_trips", { id: "teufelsberg", from: "XXX", outbound: "2027-01-11", return: "2027-01-16", travellers: 2 }, "b"),
      use("find_trips", { id: "teufelsberg", from: "ARN", outbound: "2027-01-16", return: "2027-01-11", travellers: 2 }, "c"),
      use("set_extras", { extras: ["rocket"] }, "d"),
      use("set_payment", { payment: "bitcoin" }, "e"),
      use("book", {}, "f"),
      use("show_plan", { ...trip, outbound_trip: "ARN-BER-SK1122" }, "g"),
    ),
    textTurn("Nej."),
  );
  const answer = await askAgent(question, context(), client);
  const results = toolResults(create);
  expect(results.map((r) => r.is_error)).toEqual(Array(7).fill(true));
  expect(results[0].content).toContain("No such destination");
  expect(results[5].content).toContain("no tool called book");
  expect(answer).toEqual({ reply: "Nej.", actions: [], book: false });
});

test("TRIP-030-R3 a destination, a filtered list and a unknown filter value: the page opens at the checked address", async () => {
  const one = scripted(toolTurn(use("show_destination", { id: "teufelsberg" })), textTurn("Där."));
  expect((await askAgent(question, context(), one.client))?.actions).toEqual([{ type: "goto", url: "/charter/teufelsberg" }]);

  const list = scripted(toolTurn(use("show_destinations", { category: ["prison", "Nonsense"], continent: ["Europe"], q: " fängelse " })), textTurn("Lista."));
  const answer = await askAgent(question, context(), list.client);
  const url = (answer!.actions[0] as { url: string }).url;
  expect(url).toBe("/charter?sok=f%C3%A4ngelse&varldsdel=Europe&kategori=Prison");
  const [result] = toolResults(list.create);
  expect(result.content).toMatch(/^Opened the list: \d+ destinations match\.\nIgnored values that do not exist: Nonsense/);
});

test("TRIP-030-R5 find_trips tells the same trips and prices as the results page and no others", async () => {
  const { client, create } = scripted(toolTurn(use("find_trips", trip)), textTurn("Där."));
  await askAgent(question, context(), client);
  const [result] = toolResults(create);
  const lines = result.content.split("\n");
  expect(lines.filter((l) => l.startsWith("- ARN-BER-"))).toHaveLength(4); // a Monday: four trips out
  expect(lines.filter((l) => l.startsWith("- BER-ARN-"))).toHaveLength(3); // a Saturday: three back
  expect(result.content).toMatch(/ARN-BER-SK1122: 2027-01-11 06:50 ARN to BER, arrives \d\d:\d\d local time, .*per person/);

  // No trip on a Tuesday for a seasonal route: it says so
  const tuesday = scripted(toolTurn(use("find_trips", { ...trip, id: "windhoek-not-a-destination" })), textTurn("Där."));
  await askAgent(question, context(), tuesday.client);
  expect(toolResults(tuesday.create)[0].is_error).toBe(true);
});

test("TRIP-030-R4 R5 trips both ways on the dates: the page goes straight to the plan step with both trips; no trips: nothing opens", async () => {
  const ok = scripted(toolTurn(use("show_plan", { ...trip, outbound_trip: "ARN-BER-SK1122", return_trip: "BER-ARN-SK1123" })), textTurn("Valde."));
  expect((await askAgent(question, context(), ok.client))?.actions).toEqual([{ type: "goto", url: tripUrl("plan", CHOSEN) }]);

  const none = scripted(toolTurn(use("show_plan", { ...trip, id: "teufelsberg", outbound: "2027-05-10", return: "2027-05-12", outbound_trip: "ARN-BER-SK1122", return_trip: "BER-ARN-SK1123" })), textTurn("Inget."));
  expect((await askAgent(question, context(), none.client))?.actions).toEqual([]);
  expect(toolResults(none.create)[0].content).toMatch(/No trip runs|cannot be booked/);

  // A trip that does not run that day, or a return that leaves before the outbound has landed, is refused
  const wrong = scripted(toolTurn(use("show_plan", { ...trip, outbound_trip: "ARN-BER-EW488-X", return_trip: "BER-ARN-SK1123" })), textTurn("Fel."));
  expect((await askAgent(question, context(), wrong.client))?.actions).toEqual([]);

  const results = scripted(toolTurn(use("show_results", trip)), textTurn("Valj."));
  expect((await askAgent(question, context(), results.client))?.actions).toEqual([{ type: "goto", url: tripUrl("resor") }]);
});

test("TRIP-030-R6 extras and payment become actions in the order extras, payment, page; an unknown extra changes nothing", async () => {
  const { client } = scripted(
    toolTurn(use("show_results", trip, "a"), use("set_payment", { payment: "collect" }, "b"), use("set_extras", { extras: ["grylls", "ultimate"] }, "c")),
    textTurn("Klart."),
  );
  expect((await askAgent(question, context(), client))?.actions).toEqual([
    { type: "extras", extras: ["ultimate", "grylls"] },
    { type: "payment", payment: "collect" },
    { type: "goto", url: tripUrl("resor") },
  ]);
});

test("TRIP-030-R8 the booking button is offered only with a valid form, a payment method, both trips and the page Resenärer or payment", async () => {
  const marked = textTurn("Sammanfattning.\n[[BOOK]]");
  const offered = (ctx: object) => askAgent(question, context(ctx), scripted(marked).client);
  const ready = { url: tripUrl("boka", planned()), payment: "cash", valid: true };
  expect(await offered(ready)).toEqual({ reply: "Sammanfattning.", actions: [], book: true });
  expect((await offered({ ...ready, url: tripUrl("boka/betala", planned()) }))!.book).toBe(true);
  expect((await offered({ ...ready, valid: false }))!.book).toBe(false);
  expect((await offered({ ...ready, payment: null }))!.book).toBe(false);
  expect((await offered({ ...ready, url: tripUrl("resor", planned()) }))!.book).toBe(false);
  expect((await offered({ ...ready, url: tripUrl("plan", planned()) }))!.book).toBe(false);
  expect((await offered({ ...ready, url: tripUrl("boka", CHOSEN) }))!.book).toBe(false); // no aircraft and classes (TRIP-040)
  expect((await offered({ ...ready, url: tripUrl("boka") }))!.book).toBe(false);
  expect((await offered({ ...ready, url: "/charter" }))!.book).toBe(false);
  expect((await offered({ ...ready, url: tripUrl("boka", "&ut=nonsense&hem=nonsense") }))!.book).toBe(false);
  // The marker never stays in the text, and an answer with no marker offers nothing
  expect((await askAgent(question, context(ready), scripted(textTurn("Ingen knapp.")).client))!.book).toBe(false);
  // Moving the page in the same answer: the form there is not known to be valid
  const moves = scripted(toolTurn(use("show_results", trip)), marked);
  expect((await askAgent(question, context(ready), moves.client))!.book).toBe(false);
});

test("TRIP-030-R4 summarise tells the total from the database with the extras now, and whether the form is valid", async () => {
  const { client, create } = scripted(toolTurn(use("set_extras", { extras: ["ultimate"] }, "a"), use("summarise", {}, "b")), textTurn("Klar."));
  await askAgent(question, context({ url: tripUrl("boka", planned()), valid: true }), client);
  const summary = toolResults(create)[1].content;
  expect(summary).toMatch(/Extras: Den ultimata upplevelsen \(2\s000\skr\)/);
  expect(summary).toMatch(/Total price: 9\s733\skr/); // out 1 190 × 150 %: Business 2 678 + Ekonomi 1 785; back 1 090 × 150 % × 2 = 3 270; extras 1 000 × 2
  expect(summary).toContain("The traveller form is valid.");

  const early = scripted(toolTurn(use("summarise", {})), textTurn("Inget."));
  await askAgent(question, context(), early.client);
  expect(toolResults(early.create)[0].is_error).toBe(true);
});

test("TRIP-030-R4 the page is read with the pages' own parsers: an address that does not parse is an unknown page", async () => {
  const now = new Date();
  expect((await readPage("/charter/teufelsberg/resor?fran=ARN", now)).kind).toBe("unknown");
  expect((await readPage("/charter/teufelsberg/resor?fran=XXX&utresa=2027-01-11&hemresa=2027-01-16&resenarer=2", now)).kind).toBe("unknown");
  expect((await readPage("/charter/finns-inte", now)).kind).toBe("unknown");
  expect((await readPage("/admin", now)).kind).toBe("unknown");
  expect((await readPage("/", now)).kind).toBe("start");
  expect((await readPage("/charter/teufelsberg", now)).kind).toBe("destination");
  expect(await readPage("/charter?varldsdel=Europe&varldsdel=Nonsense&hemlig=x", now)).toEqual({ kind: "list", filters: expect.objectContaining({ continent: ["Europe"] }) });
  // The dates are checked against what can be booked
  expect((await readPage(tripUrl("resor").replace("2027-01-11", "2026-01-11"), now)).kind).toBe("unknown");
  expect(await readPage(tripUrl("boka/betala", CHOSEN), now)).toMatchObject({ kind: "trip", step: "payment" });
  // A trip id that does not run is not a chosen trip
  const page = await readPage(tripUrl("boka", "&ut=nonsense&hem=BER-ARN-SK1123"), now);
  expect(page).toMatchObject({ kind: "trip", data: { outbound: undefined, home: undefined } });
});

test("TRIP-030-R2 an answer with nothing gives null, an API failure is thrown to the route", async () => {
  expect(await askAgent(question, context(), scripted(textTurn("  ")).client)).toBeNull();
  const failing = { messages: { create: vi.fn(async () => Promise.reject(new Error("boom"))) } } as never;
  await expect(askAgent(question, context(), failing)).rejects.toThrow("boom");
});

test("TRIP-030-R7 no personal detail is in anything the model gets: the context has no field for one", async () => {
  const { client, create } = scripted(textTurn("Nej."));
  await askAgent(question, { ...context(), name: "Sven Svensson", email: "sven@example.se" } as never, client);
  expect(JSON.stringify(create.mock.calls[0][0])).not.toMatch(/Sven|sven@/);
});

test("TRIP-030-R4 a long search text in the address is cut before it reaches the model", async () => {
  const { client, create } = scripted(textTurn("Nej."));
  await askAgent(question, context({ url: `/charter?sok=${"a".repeat(500)}` }), client);
  const page = (create.mock.calls[0][0] as unknown as { messages: { content: { text: string }[] }[] }).messages[0].content[0].text;
  expect(page).toContain(`sok=${"a".repeat(80)} `.trim());
  expect(page).not.toContain("a".repeat(81));
});

// ---------------------------------------------------------------- TRIP-040: plan och klass

test("TRIP-040-R1 R2 list_aircraft tells the aircraft that seat the party with the prices per class and no flight time; before both trips are chosen it is an error", async () => {
  const { client, create } = scripted(toolTurn(use("list_aircraft", {})), textTurn("Där."));
  await askAgent(question, context({ url: tripUrl("plan", CHOSEN) }), client);
  const [result] = toolResults(create);
  expect(result.is_error).toBe(false);
  expect(result.content).toContain(`Outbound trip ARN-BER-SK1122:`);
  expect(result.content).toMatch(new RegExp(`- aircraft ${ids.aircraft} Unit Agentplan: class ${ids.economy} Ekonomi \\(room for 10\\) 1\\s785\\skr per person; class ${ids.business} Business \\(room for 1\\) 2\\s678\\skr per person`));
  expect(result.content).toMatch(/Return trip BER-ARN-SK1123:[\s\S]*1\s635\skr per person/); // the return departure's price × 150 %
  expect(result.content).not.toMatch(/minutes|arrive|\d h \d/); // the time factor is ignored in charter

  const early = scripted(toolTurn(use("list_aircraft", {})), textTurn("Inget."));
  await askAgent(question, context({ url: tripUrl("resor") }), early.client);
  expect(toolResults(early.create)[0].is_error).toBe(true);
});

test("TRIP-040-R2 set_plan puts the aircraft and the numbers per class in the address; what the step would refuse is refused and says what", async () => {
  const setPlan = (trip: string, classes: unknown, aircraft = ids.aircraft) => toolUse("set_plan", { trip, aircraft_id: aircraft, classes }, trip);
  const both = scripted(
    toolTurn(setPlan("outbound", [{ class_id: ids.business, count: 1 }, { class_id: ids.economy, count: 1 }]), setPlan("return", [{ class_id: ids.economy, count: 2 }])),
    textTurn("Klart."),
  );
  const answer = await askAgent(question, context({ url: tripUrl("plan", CHOSEN) }), both.client);
  expect(answer?.actions).toEqual([{ type: "goto", url: tripUrl("plan", planned()) }]);
  expect(toolResults(both.create).map((r) => r.is_error)).toEqual([false, false]);

  const refused = scripted(
    toolTurn(
      setPlan("outbound", [{ class_id: ids.business, count: 2 }], ids.aircraft), // Business has room for 1
      setPlan("outbound", [{ class_id: ids.economy, count: 1 }]), // one traveller too few
      setPlan("outbound", [{ class_id: 999_999, count: 2 }]), // a class the aircraft does not have
      setPlan("outbound", [{ class_id: ids.economy, count: 2 }], 999_999), // no such aircraft
      setPlan("sideways", [{ class_id: ids.economy, count: 2 }]),
    ),
    textTurn("Nej."),
  );
  const none = await askAgent(question, context({ url: tripUrl("plan", CHOSEN) }), refused.client);
  const results = toolResults(refused.create);
  expect(results.every((r) => r.is_error)).toBe(true);
  expect(results[0].content).toContain("has room for 1, not 2");
  expect(results[1].content).toContain("add up to exactly 2 travellers");
  expect(none?.actions).toEqual([]); // nothing was changed
});

test("TRIP-041-R4 on Resenärer a new class is a set_plan, which sends the visitor back to the plan step", async () => {
  const again = scripted(
    toolTurn(use("set_plan", { trip: "return", aircraft_id: ids.aircraft, classes: [{ class_id: ids.business, count: 1 }, { class_id: ids.economy, count: 1 }] }, "a")),
    textTurn("Tillbaka till planen."),
  );
  const answer = await askAgent(question, context({ url: tripUrl("boka", planned()) }), again.client);
  expect(answer?.actions).toEqual([{ type: "goto", url: expect.stringContaining("/plan?") }]);
  expect(toolResults(again.create)[0].is_error).toBe(false);
});

test("TRIP-040-R3 show_plan opens the plan step; show_travellers is refused until both trips have aircraft and classes, then opens Resenärer", async () => {
  const early = scripted(toolTurn(use("show_travellers", {})), textTurn("Nej."));
  const refused = await askAgent(question, context({ url: tripUrl("plan", CHOSEN) }), early.client);
  expect(toolResults(early.create)[0].content).toContain("list_aircraft and set_plan");
  expect(refused?.actions).toEqual([]);

  const ready = scripted(toolTurn(use("show_travellers", {})), textTurn("Där."));
  expect((await askAgent(question, context({ url: tripUrl("plan", planned()) }), ready.client))?.actions).toEqual([{ type: "goto", url: tripUrl("boka", planned()) }]);
});

test("TRIP-040-R4 set_addons becomes an action with each traveller's class and add-ons per trip; beer and unknown add-ons are refused; a new plan drops it", async () => {
  const url = tripUrl("boka", planned());
  const list = scripted(toolTurn(use("list_addons", {})), textTurn("Där."));
  await askAgent(question, context({ url }), list.client);
  expect(toolResults(list.create)[0].content).toMatch(/Unit Måltid 120\skr per piece/);

  const set = scripted(toolTurn(use("set_addons", { addons: [{ name: "unit måltid", count: 2 }] })), textTurn("Klart."));
  const [action] = (await askAgent(question, context({ url }), set.client))!.actions;
  const meal = (classId: number) => ({ classId, addons: { [ids.meal]: 2 } });
  expect(action).toEqual({
    type: "addons",
    legKeys: [expect.stringContaining("ARN-BER-SK1122"), expect.stringContaining("BER-ARN-SK1123")],
    // the dearest class first: traveller 1 in Business on the outbound trip, 2 in Ekonomi
    passengers: [[meal(ids.business), meal(ids.economy)], [meal(ids.economy), meal(ids.economy)]],
  });
  expect(safeActions([action])).toEqual([action]);

  const bad = scripted(toolTurn(use("set_addons", { addons: [{ name: "Öl", count: 1 }] }, "a"), use("set_addons", { addons: [{ name: "Raketbränsle", count: 1 }] }, "b"), use("set_addons", { addons: [{ name: "Unit Måltid", count: 11 }] }, "c")), textTurn("Nej."));
  expect((await askAgent(question, context({ url }), bad.client))?.actions).toEqual([]);
  expect(toolResults(bad.create).every((r) => r.is_error)).toBe(true);

  const changed = scripted(
    toolTurn(use("set_addons", { addons: [{ name: "Unit Måltid", count: 1 }] }, "a"), use("set_plan", { trip: "return", aircraft_id: ids.aircraft, classes: [{ class_id: ids.economy, count: 2 }] }, "b")),
    textTurn("Ändrat."),
  );
  expect((await askAgent(question, context({ url }), changed.client))!.actions.map((a) => a.type)).toEqual(["goto"]);
});

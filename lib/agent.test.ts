import { afterAll, afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { openUnitDb } from "../db/test-db";
import { safeActions } from "./agent-rules";
import { bookingExtract } from "./cancel-extract";
import { LOTTERY_TEXT } from "./cancel-rules";
import { unitTestDbFile } from "./local-db.mjs";

// Agentläget mot enhetstesternas databas (vitest.global-setup.mjs) och en manusstyrd klient: ingen modell anropas.
vi.mock("next/server", () => ({ connection: async () => {} }));
process.env.TURSO_DATABASE_URL = `file:${unitTestDbFile}`;
let askAgent: typeof import("./agent").askAgent;
let readPage: typeof import("./agent-page").readPage;
let buildSystemPrompt: typeof import("./chat-prompt").buildSystemPrompt;

// Testets plan med två klasser och ett tillägg i båda (satta i beforeAll). Priset: avgångens × 150 % × klassens.
const ids = { aircraft: 0, economy: 0, business: 0, meal: 0, beer: 0 };

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
    // Ölen heter bara Öl (isBeer) och går att köpa i Ekonomi
    ids.beer = Number((await db.execute("INSERT INTO addons (name, description, price) VALUES ('Öl', 'Unit', 60)")).lastInsertRowid);
    await db.execute({ sql: "INSERT INTO aircraft_class_addons (aircraft_id, class_id, addon_id) VALUES (?, ?, ?)", args: [ids.aircraft, ids.economy, ids.beer] });
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
    await db.execute({ sql: "DELETE FROM addons WHERE name LIKE 'Unit %' OR id = ?", args: [ids.beer] });
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
    "show_destinations", "show_destination", "find_trips", "show_results", "show_plan", "find_airports", "find_flights", "show_flights", "show_flight_plan", "list_aircraft", "set_plan", "list_addons", "set_addons", "show_travellers", "show_payment", "set_extras", "set_payment", "show_my_booking", "tick_cancellation", "summarise",
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
  expect(answer).toEqual({ reply: "Nej.", actions: [], book: false, all: false });
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

test("TRIP-030-R8 TRIP-038-R2 the booking button is offered only with a valid form, a payment method, both trips and the payment page", async () => {
  const marked = textTurn("Sammanfattning.\n[[BOOK]]");
  const offered = (ctx: object) => askAgent(question, context(ctx), scripted(marked).client);
  const ready = { url: tripUrl("boka/betala", planned()), payment: "cash", valid: true };
  expect(await offered(ready)).toEqual({ reply: "Sammanfattning.", actions: [], book: true, all: false });
  expect((await offered({ ...ready, url: tripUrl("boka", planned()) }))!.book).toBe(false); // Resenärer: no button (TRIP-038-R2)
  expect((await offered({ ...ready, valid: false }))!.book).toBe(false);
  expect((await offered({ ...ready, payment: null }))!.book).toBe(false);
  expect((await offered({ ...ready, url: tripUrl("resor", planned()) }))!.book).toBe(false);
  expect((await offered({ ...ready, url: tripUrl("plan", planned()) }))!.book).toBe(false);
  expect((await offered({ ...ready, url: tripUrl("boka/betala", CHOSEN) }))!.book).toBe(false); // no aircraft and classes (TRIP-040)
  expect((await offered({ ...ready, url: tripUrl("boka/betala") }))!.book).toBe(false);
  expect((await offered({ ...ready, url: "/charter" }))!.book).toBe(false);
  expect((await offered({ ...ready, url: tripUrl("boka", "&ut=nonsense&hem=nonsense") }))!.book).toBe(false);
  // The marker never stays in the text, and an answer with no marker offers nothing
  expect((await askAgent(question, context(ready), scripted(textTurn("Ingen knapp.")).client))!.book).toBe(false);
  // Moving the page in the same answer: the form there is not known to be valid
  const moves = scripted(toolTurn(use("show_results", trip)), marked);
  expect((await askAgent(question, context(ready), moves.client))!.book).toBe(false);
});

test("TRIP-038-R1 show_payment opens the payment page with the same search and choice, and is refused until the form is valid", async () => {
  const url = tripUrl("boka", planned());
  const open = scripted(toolTurn(use("show_payment", {})), textTurn("Betala."));
  expect((await askAgent(question, context({ url, valid: true }), open.client))?.actions).toEqual([{ type: "goto", url: tripUrl("boka/betala", planned()) }]);

  const early = scripted(toolTurn(use("show_payment", {})), textTurn("Fyll i."));
  expect((await askAgent(question, context({ url }), early.client))?.actions).toEqual([]);
  expect(toolResults(early.create)[0]).toMatchObject({ is_error: true, content: expect.stringContaining("not valid") });

  const unplanned = scripted(toolTurn(use("show_payment", {})), textTurn("Plan."));
  await askAgent(question, context({ url: tripUrl("boka", CHOSEN), valid: true }), unplanned.client);
  expect(toolResults(unplanned.create)[0].is_error).toBe(true);
});

test("TRIP-038-R1 R2 the rules send payment to the payment page and the check before the button", async () => {
  const { client, create } = scripted(textTurn("Nej."));
  await askAgent(question, context(), client);
  const rules = (create.mock.calls[0][0] as unknown as { system: { text: string }[] }).system[1].text;
  expect(rules).toContain("Do not ask about payment there");
  expect(rules).toContain("ask them to check that everything is right");
  expect(rules).toContain("never on Resenärer");
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

// Valet i formuläret som webbläsaren skickar med (choice): samma form som åtgärden addons, tagen ur en sådan
async function choiceFor(url: string, count: number) {
  const set = scripted(toolTurn(toolUse("set_addons", { addons: [{ name: "Unit Måltid", count }] })), textTurn("Klart."));
  const [action] = (await askAgent(question, context({ url }), set.client))!.actions;
  if (action.type !== "addons") throw new Error("no addons action");
  return { legKeys: action.legKeys, passengers: action.passengers };
}
const summaryOf = async (ctx: ReturnType<typeof context>) => {
  const { client, create } = scripted(toolTurn(toolUse("summarise", {})), textTurn("Klar."));
  await askAgent(question, ctx, client);
  return toolResults(create)[0].content as string;
};

test("TRIP-044-R2 the charter total has the add-ons chosen in the form and the extras, as the page's", async () => {
  const url = tripUrl("boka/betala", planned());
  const choice = await choiceFor(url, 2);
  // seats 7 733 (see above) + the meal 120 × 2 × 2 travellers × 2 trips + extras 2 000
  expect(await summaryOf(context({ url, extras: ["ultimate"], valid: true, choice }))).toMatch(/Total price: 10\s693\skr/);
  // a choice for another plan is not counted, only the classes
  expect(await summaryOf(context({ url, extras: ["ultimate"], choice: { ...choice, legKeys: ["x", "y"] } }))).toMatch(/Total price: 9\s733\skr/);
});

test("TRIP-044-R2 the flight total has the add-ons chosen in the form and Dåliga nerver, as the page's, and nerves are capped by the travellers", async () => {
  const url = flightUrl("/flyg/boka/betala", flightPlanned());
  const choice = await choiceFor(url, 1);
  expect(await summaryOf(context({ url, choice }))).toMatch(/Total price: 18\s008\skr/);
  // one passenger with Dåliga nerver: 1 000 kr on each of the two flights
  expect(await summaryOf(context({ url, choice, nerves: 1 }))).toMatch(/Total price: 20\s008\skr/);
  expect(await summaryOf(context({ url, choice, nerves: 2 }))).toMatch(/Total price: 22\s008\skr/);
  expect(await summaryOf(context({ url, choice, nerves: 10 }))).toMatch(/Total price: 22\s008\skr/);
  // the add-ons she sets herself replace the ones in the context
  const set = scripted(toolTurn(toolUse("set_addons", { addons: [{ name: "Unit Måltid", count: 2 }] }, "a"), toolUse("summarise", {}, "b")), textTurn("Klar."));
  await askAgent(question, context({ url, choice }), set.client);
  expect(toolResults(set.create)[1].content).toMatch(/Total price: 18\s488\skr/);
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

// ---------------------------------------------------------------- TRIP-036: flyg

const search = { from: "ARN", to: "LHR", outbound: "2027-01-11", return: "2027-01-16", travellers: 2 };
const flightUrl = (path: string, extra = "") => `${path}?fran=ARN&till=LHR&utresa=2027-01-11&hemresa=2027-01-16&resenarer=2${extra}`;
const FLIGHTS = "&ut=08%3A20&hem=15%3A35";
const flightPlanned = () => `&ut=08%3A20&ut-plan=${ids.aircraft}&ut-klasser=${encodeURIComponent(`${ids.economy}:1,${ids.business}:1`)}&hem=15%3A35&hem-plan=${ids.aircraft}&hem-klasser=${encodeURIComponent(`${ids.economy}:2`)}`;
const goto = (url: string) => [{ type: "goto", url }];

test("TRIP-036-R2 find_airports gives codes for a city, a country or a code, and tells when nothing matches", async () => {
  const { client, create } = scripted(toolTurn(use("find_airports", { q: "london" }, "a"), use("find_airports", { q: "xyzzy" }, "b")), textTurn("Där."));
  await askAgent(question, context(), client);
  const [found, none] = toolResults(create);
  expect(found.content).toContain("- LHR: London Heathrow, London,");
  expect(none).toMatchObject({ is_error: false, content: expect.stringContaining("No airport matches") });
});

test("TRIP-036-R2 find_flights tells the departures and prices of the flights page, both ways, and opens nothing", async () => {
  const { client, create } = scripted(toolTurn(use("find_flights", search)), textTurn("Där."));
  expect((await askAgent(question, context(), client))?.actions).toEqual([]);
  const [{ content }] = toolResults(create);
  expect(content).toMatch(/Outbound flights ARN to LHR on 2027-01-11:\n- 08:20: GF \d+, 2027-01-11 08:20 ARN Stockholm to LHR London, from [\d\s]+kr per person/);
  expect(content.match(/^- \d\d:\d\d: GF/gm)).toHaveLength(10); // five each way
  expect(content).toContain("Return flights LHR to ARN on 2027-01-16:\n- 06:45:");

  const oneWay = scripted(toolTurn(use("find_flights", { ...search, return: undefined })), textTurn("Där."));
  await askAgent(question, context(), oneWay.client);
  expect(toolResults(oneWay.create)[0].content).not.toContain("Return flights");
});

test("TRIP-036-R2 a search the flight form would refuse, or an airport that does not exist, is an error and nothing opens", async () => {
  const wrong = [
    { ...search, from: "XXX" },
    { ...search, to: "ARN" },
    { ...search, outbound: "2026-01-11", return: "2026-01-16" }, // in the past
    { ...search, outbound: "2028-01-11", return: "2028-01-16" }, // too far ahead
    { ...search, return: "2027-01-01" }, // before the outbound
    { ...search, travellers: 11 },
  ];
  const { client, create } = scripted(toolTurn(...wrong.map((input, i) => use("show_flights", input, `w${i}`))), textTurn("Nej."));
  expect((await askAgent(question, context(), client))?.actions).toEqual([]);
  expect(toolResults(create).map((r) => r.is_error)).toEqual(Array(wrong.length).fill(true));
});

test("TRIP-036-R2 show_flights opens the results page with the search, and the departures only when both are given and run", async () => {
  const plain = scripted(toolTurn(use("show_flights", search)), textTurn("Där."));
  expect((await askAgent(question, context(), plain.client))?.actions).toEqual(goto(flightUrl("/flyg")));

  const chosen = scripted(toolTurn(use("show_flights", { ...search, outbound_flight: "08:20", return_flight: "15:35" })), textTurn("Där."));
  expect((await askAgent(question, context(), chosen.client))?.actions).toEqual(goto(flightUrl("/flyg", FLIGHTS)));
  expect(toolResults(chosen.create)[0].content).toContain("with 08:20: GF");

  const oneWay = scripted(toolTurn(use("show_flights", { ...search, return: undefined, outbound_flight: "08:20" })), textTurn("Där."));
  expect((await askAgent(question, context(), oneWay.client))?.actions).toEqual(goto("/flyg?fran=ARN&till=LHR&utresa=2027-01-11&resenarer=2&ut=08%3A20"));

  for (const input of [{ outbound_flight: "08:20" }, { outbound_flight: "03:03", return_flight: "15:35" }, { return_flight: "15:35" }]) {
    const refused = scripted(toolTurn(use("show_flights", { ...search, ...input })), textTurn("Nej."));
    expect((await askAgent(question, context(), refused.client))?.actions, JSON.stringify(input)).toEqual([]);
    expect(toolResults(refused.create)[0].is_error).toBe(true);
  }
});

test("TRIP-036-R2 the shortcut: show_flight_plan opens the plan step with the departures chosen, and needs them", async () => {
  const ok = scripted(toolTurn(use("show_flight_plan", { ...search, outbound_flight: "08:20", return_flight: "15:35" })), textTurn("Valde."));
  expect((await askAgent(question, context(), ok.client))?.actions).toEqual(goto(flightUrl("/flyg/plan", FLIGHTS)));

  const none = scripted(toolTurn(use("show_flight_plan", search)), textTurn("Nej."));
  expect((await askAgent(question, context(), none.client))?.actions).toEqual([]);
  expect(toolResults(none.create)[0].is_error).toBe(true);
});

test("TRIP-036-R2 the page is read: the search, the chosen departures that run, and no choice for one that does not", async () => {
  const now = new Date();
  expect(await readPage(flightUrl("/flyg", FLIGHTS), now)).toMatchObject({ kind: "flight", step: "results", data: { flights: [{ time: "08:20" }, { time: "15:35" }] } });
  expect(await readPage(flightUrl("/flyg/boka/betala", flightPlanned()), now)).toMatchObject({ kind: "flight", step: "payment", data: { legs: [{ key: expect.any(String) }, { key: expect.any(String) }] } });
  expect(await readPage(flightUrl("/flyg/plan", "&ut=03:03&hem=15:35"), now)).toMatchObject({ kind: "flight", data: { flights: [undefined, { time: "15:35" }], legs: null } });
  expect((await readPage("/flyg", now)).kind).toBe("unknown");
  expect((await readPage("/flyg?fran=XXX&till=LHR&utresa=2027-01-11&resenarer=2", now)).kind).toBe("unknown");

  const { client, create } = scripted(textTurn("Nej."));
  await askAgent(question, context({ url: flightUrl("/flyg/plan", flightPlanned()) }), client);
  const page = (create.mock.calls[0][0] as unknown as { messages: { content: { text: string }[] }[] }).messages[0].content[0].text;
  expect(page).toContain("The visitor is on the plan step");
  expect(page).toContain("Search: from ARN to LHR, outbound 2027-01-11, return 2027-01-16, 2 travellers");
  expect(page).toContain("Chosen outbound flight: 08:20: GF");
  expect(page).toContain("Chosen aircraft and travellers per class, return: Unit Agentplan");
});

test("TRIP-036-R3 list_aircraft tells flight time, arrival, price per class and the comparison for each flight; set_plan puts the choice in the address", async () => {
  const url = flightUrl("/flyg/plan", FLIGHTS);
  const { client, create } = scripted(toolTurn(use("list_aircraft", {})), textTurn("Där."));
  await askAgent(question, context({ url }), client);
  const [{ content }] = toolResults(create);
  expect(content).toContain("Outbound flight 08:20:");
  expect(content).toContain("Return flight 15:35:");
  // 140 minutes × 200 % = 4 h 40 min; 08:20 in Stockholm is 12:00 in London; the price 3 890 × 150 % × the class
  expect(content).toMatch(new RegExp(`- aircraft ${ids.aircraft} Unit Agentplan: flight time 4 h 40 min, lands 12:00 local time; class ${ids.economy} Ekonomi \\(room for 10\\) 5\\s835\\skr per person; class ${ids.business} Business \\(room for 1\\) 8\\s753\\skr per person \\(\\+2\\s918\\skr on the cheapest class\\)`));
  expect(content).toMatch(/(cheapest|fastest)/);

  const set = (trip: string, classes: unknown) => toolUse("set_plan", { trip, aircraft_id: ids.aircraft, classes }, trip);
  const both = scripted(toolTurn(set("outbound", [{ class_id: ids.business, count: 1 }, { class_id: ids.economy, count: 1 }]), set("return", [{ class_id: ids.economy, count: 2 }])), textTurn("Klart."));
  expect((await askAgent(question, context({ url }), both.client))?.actions).toEqual(goto(flightUrl("/flyg/plan", flightPlanned())));

  // An aircraft that is too small, numbers that do not fit and a return on a one-way trip are refused, and nothing changes
  const refused = scripted(
    toolTurn(set("outbound", [{ class_id: ids.business, count: 2 }]), set("outbound", [{ class_id: ids.economy, count: 1 }]), use("set_plan", { trip: "outbound", aircraft_id: 999_999, classes: [] }, "x")),
    textTurn("Nej."),
  );
  expect((await askAgent(question, context({ url }), refused.client))?.actions).toEqual([]);
  expect(toolResults(refused.create).every((r) => r.is_error)).toBe(true);

  const oneWay = scripted(toolTurn(set("return", [{ class_id: ids.economy, count: 1 }])), textTurn("Nej."));
  await askAgent(question, context({ url: "/flyg/plan?fran=ARN&till=LHR&utresa=2027-01-11&resenarer=1&ut=08%3A20" }), oneWay.client);
  expect(toolResults(oneWay.create)[0]).toMatchObject({ is_error: true, content: expect.stringContaining("one-way") });
});

test("TRIP-036-R3 the tools that need the flights chosen say so on the flight pages before they are", async () => {
  for (const name of ["list_aircraft", "set_addons", "show_travellers", "summarise"]) {
    const { client, create } = scripted(toolTurn(use(name, { addons: [] })), textTurn("Nej."));
    await askAgent(question, context({ url: flightUrl("/flyg") }), client);
    expect(toolResults(create)[0], name).toMatchObject({ is_error: true });
  }
  const { client, create } = scripted(toolTurn(use("list_aircraft", {})), textTurn("Nej."));
  await askAgent(question, context({ url: flightUrl("/flyg") }), client);
  expect(toolResults(create)[0].content).toContain("show_flight_plan");
});

test("TRIP-036-R4 list_addons gives the add-ons with prices; set_addons sets them for every traveller per flight in the class where they are sold", async () => {
  const url = flightUrl("/flyg/boka", flightPlanned());
  const list = scripted(toolTurn(use("list_addons", {})), textTurn("Där."));
  await askAgent(question, context({ url }), list.client);
  const listed = toolResults(list.create)[0].content;
  expect(listed).toMatch(/utresan \(Unit Agentplan\):\n {2}Ekonomi: .*Unit Måltid 120\skr per piece/);
  expect(listed).toMatch(/Öl 60\skr per piece \(from 18\)/);

  const set = scripted(toolTurn(use("set_addons", { addons: [{ name: "Unit Måltid", count: 2 }] })), textTurn("Klart."));
  const [action] = (await askAgent(question, context({ url }), set.client))!.actions;
  const meal = (classId: number) => ({ classId, addons: { [ids.meal]: 2 } });
  expect(action).toEqual({
    type: "addons",
    legKeys: [expect.stringContaining("ARN-LHR 2027-01-11 08:20"), expect.stringContaining("LHR-ARN 2027-01-16 15:35")],
    passengers: [[meal(ids.business), meal(ids.economy)], [meal(ids.economy), meal(ids.economy)]],
  });
  expect(safeActions([action])).toEqual([action]);

  // Only the add-ons of the traveller's class: beer is sold in Ekonomi only, so the Business traveller gets none
  const beer = scripted(toolTurn(use("set_addons", { addons: [{ name: "öl", count: 1 }] })), textTurn("Öl."));
  const [beerAction] = (await askAgent(question, context({ url }), beer.client))!.actions;
  expect(beerAction).toMatchObject({ passengers: [[{ classId: ids.business, addons: {} }, { classId: ids.economy, addons: { [ids.beer]: 1 } }], [{ addons: { [ids.beer]: 1 } }, { addons: { [ids.beer]: 1 } }]] });
  expect(toolResults(beer.create)[0].content).toContain("for adults only");

  const bad = scripted(toolTurn(use("set_addons", { addons: [{ name: "Raketbränsle", count: 1 }] }, "a"), use("set_addons", { addons: [{ name: "Unit Måltid", count: 11 }] }, "b")), textTurn("Nej."));
  expect((await askAgent(question, context({ url }), bad.client))?.actions).toEqual([]);
  expect(toolResults(bad.create).every((r) => r.is_error)).toBe(true);
});

test("TRIP-036-R4 the extras are for charter only: set_extras is refused on the flight pages", async () => {
  const { client, create } = scripted(toolTurn(use("set_extras", { extras: ["ultimate"] })), textTurn("Nej."));
  expect((await askAgent(question, context({ url: flightUrl("/flyg/boka", flightPlanned()) }), client))?.actions).toEqual([]);
  expect(toolResults(create)[0]).toMatchObject({ is_error: true, content: expect.stringContaining("set_addons") });
});

test("TRIP-036-R5 show_travellers opens Resenärer when the aircraft and classes are set; show_payment waits for a valid form", async () => {
  const open = scripted(toolTurn(use("show_travellers", {})), textTurn("Fyll i."));
  expect((await askAgent(question, context({ url: flightUrl("/flyg/plan", flightPlanned()) }), open.client))?.actions).toEqual(goto(flightUrl("/flyg/boka", flightPlanned())));

  const url = flightUrl("/flyg/boka", flightPlanned());
  const early = scripted(toolTurn(use("show_payment", {})), textTurn("Fyll i."));
  expect((await askAgent(question, context({ url }), early.client))?.actions).toEqual([]);
  expect(toolResults(early.create)[0]).toMatchObject({ is_error: true, content: expect.stringContaining("not valid") });

  const valid = scripted(toolTurn(use("show_payment", {})), textTurn("Betala."));
  expect((await askAgent(question, context({ url, valid: true }), valid.client))?.actions).toEqual(goto(flightUrl("/flyg/boka/betala", flightPlanned())));
});

test("TRIP-036-R6 summarise gives the flights, the aircraft, the add-ons just set and the total from the database", async () => {
  const { client, create } = scripted(toolTurn(use("set_addons", { addons: [{ name: "Unit Måltid", count: 1 }] }, "a"), use("set_payment", { payment: "cash" }, "b"), use("summarise", {}, "c")), textTurn("Klar."));
  await askAgent(question, context({ url: flightUrl("/flyg/boka/betala", flightPlanned()), valid: true }), client);
  const summary = toolResults(create)[2].content;
  expect(summary).toContain("Chosen outbound flight: 08:20: GF");
  expect(summary).toContain("Payment method: Cash till piloten");
  expect(summary).not.toContain("Extras:");
  // out 3 890 × 150 %: Business 8 753 + Ekonomi 5 835; back 980 × 150 % × 2 = 2 940; the meal 120 × 4 = 480
  expect(summary).toMatch(/Total price: 18\s008\skr/);
  expect(summary).toContain("The traveller form is valid.");
});

test("TRIP-036-R6 the booking button is offered on the flight payment page only, with a valid form, a payment method and the flights planned", async () => {
  const marked = textTurn("Sammanfattning.\n[[BOOK]]");
  const offered = (ctx: object) => askAgent(question, context(ctx), scripted(marked).client);
  const ready = { url: flightUrl("/flyg/boka/betala", flightPlanned()), payment: "cash", valid: true };
  expect(await offered(ready)).toEqual({ reply: "Sammanfattning.", actions: [], book: true, all: false });
  for (const over of [
    { url: flightUrl("/flyg/boka", flightPlanned()) },
    { url: flightUrl("/flyg/plan", flightPlanned()) },
    { url: flightUrl("/flyg/boka/betala", FLIGHTS) }, // no aircraft and classes
    { url: flightUrl("/flyg/boka/betala") }, // no flights
    { valid: false },
    { payment: null },
  ]) {
    expect((await offered({ ...ready, ...over }))!.book, JSON.stringify(over)).toBe(false);
  }
});

test("TRIP-036-R2 R6 the rules tell her to be Agneta on the flight pages, to ask about add-ons once, to warn about beer and never to ask for ages", async () => {
  const { client, create } = scripted(textTurn("Nej."));
  await askAgent(question, context({ url: flightUrl("/flyg") }), client);
  const rules = (create.mock.calls[0][0] as unknown as { system: { text: string }[] }).system[1].text;
  expect(rules).toContain("# Ordinary flights");
  expect(rules).toContain("find_airports");
  expect(rules).toContain("funny and negative");
  expect(rules).toContain("ser du någon addon du gillar?");
  expect(rules).toContain("never ask for ages");
});

// Min bokning (TRIP-037): utdraget av en hittad bokning, med namn och kontaktuppgifter som aldrig får nå modellen
const MY = "/min-bokning";
const hidden = ["Hemlig Hemligsson", "Efternamnsson", "hemlig@exempel.se", "070-999 88 77", "Gömdgatan 9", "K7M2QX"];
const seatOf = (id: number, passengerId: number, over = {}) => ({ id, passengerId, className: "Ekonomi", price: 1000, addons: [], cancelled: false, ...over });
const found = (late = false) =>
  bookingExtract(
    {
      kind: "flight",
      bookingNumber: "K7M2QX",
      contact: { firstName: "Cecilia", lastName: "Efternamnsson", email: "hemlig@exempel.se", phone: "070-999 88 77", address: "Gömdgatan 9" },
      payment: "cash",
      total: 4000,
      cancellations: [],
      passengers: [{ id: 11, name: "Hemlig Hemligsson", age: 40 }, { id: 12, name: "Bo Efternamnsson", age: 8 }],
      flights: [
        { id: 1, title: "Utresa", of: "utresan", date: "2030-01-10", time: "07:00", from: { iata: "ARN", city: "Stockholm", timezone: "Europe/Stockholm" }, to: { iata: "LHR", city: "London", timezone: "Europe/London" }, aircraft: "Hemligt plan", minutes: 120, arrival: { time: "08:00", days: 0 }, late, seats: [seatOf(1, 11), seatOf(2, 12)] },
        { id: 2, title: "Hemresa", of: "hemresan", date: "2030-01-17", time: "18:00", from: { iata: "LHR", city: "London", timezone: "Europe/London" }, to: { iata: "ARN", city: "Stockholm", timezone: "Europe/Stockholm" }, aircraft: "Hemligt plan", minutes: 120, arrival: { time: "21:00", days: 0 }, late: false, seats: [seatOf(3, 11, { cancelled: true }), seatOf(4, 12)] },
      ],
    } as never,
    new Set([2]),
  );
const myContext = (over = {}) => context({ url: MY, booking: found(), ...over });
const tick = (...ids: number[]) => toolTurn(toolUse("tick_cancellation", { ids }));

test("TRIP-037-R2 the model has no tool that looks a booking up or cancels one, and none takes a booking number or a name", async () => {
  const { client, create } = scripted(textTurn("Nej."));
  await askAgent(question, myContext(), client);
  const tools = (create.mock.calls[0][0] as unknown as { tools: { name: string; input_schema: { properties?: object } }[] }).tools;
  expect(tools.map((t) => t.name).filter((name) => /look|find_book|cancel_|book_|^cancel/i.test(name))).toEqual([]);
  for (const tool of tools) expect(Object.keys(tool.input_schema.properties ?? {}), tool.name).not.toContain("booking_number");
  expect(JSON.stringify(tools)).not.toMatch(/last_?name|booking_?number|e-?mail/i);
});

test("TRIP-037-R2 R3 the rules say to send the number and the name to the page's fields, and give the page's own lottery text", async () => {
  const { client, create } = scripted(textTurn("Nej."));
  await askAgent(question, myContext(), client);
  const rules = (create.mock.calls[0][0] as unknown as { system: { text: string }[] }).system[1].text;
  expect(rules).toContain("# Min bokning");
  expect(rules).toContain("Never ask for them in the chat");
  expect(rules).toContain("cannot be found without it");
  expect(rules).toContain(LOTTERY_TEXT);
  expect(rules).toContain("24 hours or less");
  expect(rules).toContain("cannot be undone");
  expect(rules).toContain("you never promise a refund");
});

test("TRIP-037-R4 the request has the extract with the ticked boxes and nothing personal, and none before a booking is found", async () => {
  const withBooking = scripted(textTurn("Nej."));
  await askAgent(question, myContext(), withBooking.client);
  const sent = JSON.stringify(withBooking.create.mock.calls[0][0]).replaceAll("\u00a0", " "); // formatPrice skriver ett hårt mellanrum
  expect(sent).toContain("The visitor is on Min bokning");
  expect(sent).toContain("- id 2: Resenär 2, Ekonomi, 1 000");
  expect(sent).toContain("ticked now");
  expect(sent).toContain("already cancelled");
  for (const secret of hidden) expect(sent, secret).not.toContain(secret);

  const without = scripted(textTurn("Nej."));
  await askAgent(question, myContext({ booking: undefined }), without.client);
  const none = JSON.stringify(without.create.mock.calls[0][0]);
  expect(none).toContain("No booking is found on the page yet");
  expect(none).not.toContain("- id ");
});

test("TRIP-037-R4 nothing of the extract or the booking is written to the log", async () => {
  const log = vi.mocked(console.log);
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  await askAgent(question, myContext(), scripted(tick(1), textTurn("Klart.")).client);
  const written = JSON.stringify([...log.mock.calls, ...error.mock.calls]);
  for (const secret of [...hidden, "Resenär", "utresan", "ARN-LHR"]) expect(written, secret).not.toContain(secret);
});

test("TRIP-037-R5 tick_cancellation ticks exactly the parts asked for, says what a win would refund, and nothing is cancelled", async () => {
  const { client, create } = scripted(tick(1, 2), textTurn("Så."));
  const reply = await askAgent(question, myContext(), client);
  expect(reply!.actions).toEqual([{ type: "tick", ids: [1, 2] }]);
  expect(reply!.book).toBe(false);
  const [result] = toolResults(create);
  expect(result.content).toContain("Ticked on the page: Resenär 1, Ekonomi (utresan ARN-LHR 2030-01-10 07:00); Resenär 2, Ekonomi");
  expect(result.content).toMatch(/A win would refund 2\s000\skr, a loss nothing/);
  expect(result.content).toContain("Nothing is cancelled until the visitor presses Avboka and answers Ja, avboka");
});

test("TRIP-037-R5 a part that is already cancelled, too late or does not exist is not ticked, and the answer says why", async () => {
  const { client, create } = scripted(tick(1, 3, 77), textTurn("Så."));
  const reply = await askAgent(question, myContext(), client);
  expect(reply!.actions).toEqual([{ type: "tick", ids: [1] }]);
  const [result] = toolResults(create);
  expect(result.content).toContain("Resenär 1, Ekonomi is not ticked (already cancelled)");
  expect(result.content).toContain("No part has the id 77");

  const late = scripted(tick(1, 2), textTurn("Så."));
  const none = await askAgent(question, myContext({ booking: found(true) }), late.client);
  expect(none!.actions).toEqual([]); // inget kryssades: besökarens kryss rörs inte
  expect(toolResults(late.create)[0].content).toContain("is not ticked (Det är för sent att avboka)");
  expect(toolResults(late.create)[0].content).toContain("Nothing was ticked and the boxes the visitor had ticked are unchanged.");
});

test("TRIP-037-R5 an empty list clears the boxes, and without a booking on the page the tool says so and ticks nothing", async () => {
  const clear = await askAgent(question, myContext(), scripted(tick(), textTurn("Så.")).client);
  expect(clear!.actions).toEqual([{ type: "tick", ids: [] }]);

  const { client, create } = scripted(tick(1), textTurn("Så."));
  const reply = await askAgent(question, myContext({ booking: undefined }), client);
  expect(reply!.actions).toEqual([]);
  expect(toolResults(create)[0]).toMatchObject({ is_error: true });
  expect(toolResults(create)[0].content).toContain("You cannot look it up");

  // Bokningen hör till Min bokning: på en annan sida finns den inte, även om modellen ber om det
  const elsewhere = scripted(tick(1), textTurn("Så."));
  expect((await askAgent(question, context({ url: "/charter" }), elsewhere.client))!.actions).toEqual([]);
});

test("TRIP-037-R1 show_my_booking opens Min bokning, and does nothing when the visitor is already there", async () => {
  const open = await askAgent(question, context({ url: "/charter" }), scripted(toolTurn(toolUse("show_my_booking", {})), textTurn("Där.")).client);
  expect(open!.actions).toEqual([{ type: "goto", url: MY }]);
  const { client, create } = scripted(toolTurn(toolUse("show_my_booking", {})), textTurn("Där."));
  expect((await askAgent(question, myContext({ booking: undefined }), client))!.actions).toEqual([]);
  expect(toolResults(create)[0].content).toContain("already on Min bokning");
});

test("TRIP-037-R5 the booking button is never offered on Min bokning, whatever the model writes", async () => {
  const reply = await askAgent(question, myContext({ payment: "cash", valid: true }), scripted(textTurn("Klart.\n[[BOOK]]")).client);
  expect(reply).toEqual({ reply: "Klart.", actions: [], book: false, all: false });
});

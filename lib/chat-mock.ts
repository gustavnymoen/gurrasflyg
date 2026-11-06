import type Anthropic from "@anthropic-ai/sdk";
import type { ChatClient } from "./chat";

// Låtsasklienten för testerna (LLM_MOCK=1): inget anrop lämnar servern. Den svarar efter vad frågan
// innehåller, som den riktiga modellen inte gör, så att varje läge går att prova (TRIP-017, TRIP-030).
// "FEL" gör att den misslyckas.

const usage = { input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 };
const answer = (content: unknown[], stop_reason: string) => ({ content, stop_reason, usage }) as unknown as Anthropic.Message;
const say = (text: string, stop_reason = "end_turn") => answer([{ type: "text", text }], stop_reason);
const call = (name: string, input: object, id = name) => ({ type: "tool_use", id: `toolu_${id}`, name, input });

export const mockClient: ChatClient = {
  messages: {
    create: async (params) => (params.tools ? agentMock(params) : plainMock(params)),
  },
};

function plainMock(params: Anthropic.MessageCreateParamsNonStreaming) {
  const question = params.messages.at(-1)?.content;
  if (typeof question !== "string") throw new Error("mock needs a question");
  if (question.includes("FEL")) throw new Error("mock failed");
  // "KAPAD" ger ett svar som stannar mitt i en länk, så att kapningen går att prova
  if (question.includes("KAPAD")) {
    return say("- [Teufelsberg](/charter/teufelsberg): Spökstation.\n  - Berlin, från 1 000 kr per person\n- [Beelitz-Heilstätten] (/charter/beelitz", "max_tokens");
  }
  // En fråga om att få något gjort ger knappen Hjälp mig (TRIP-030-R1)
  const help = /hjälp mig|boka åt mig/i.test(question) ? "\n[[HELP]]" : "";
  return say(`Svar från Agneta på: ${question}${help}`);
}

// Frågan i den sista frågan, och vad som har hänt sedan: verktygsanropen och deras svar
function progress(messages: Anthropic.MessageParam[]) {
  const at = messages.findLastIndex((m) => m.role === "user" && Array.isArray(m.content) && m.content.some((b) => b.type === "text"));
  const blocks = messages[at].content as Anthropic.ContentBlockParam[];
  const question = blocks.findLast((b): b is Anthropic.TextBlockParam => b.type === "text")!.text;
  const results = messages.slice(at + 1).flatMap((m) => (Array.isArray(m.content) ? m.content : []));
  const resultTexts = results.flatMap((b) => (b.type === "tool_result" && typeof b.content === "string" ? [b.content] : []));
  return { question, steps: resultTexts.length, last: resultTexts.at(-1) ?? "" };
}

// set_plan för båda resorna ur svaret från list_aircraft: första planet i varje lista, med resenärerna
// utdelade på klasserna i ordning efter vad de rymmer
function planCalls(list: string, travellers: number) {
  const section = list.split("\n").filter((line) => line.startsWith("- aircraft") || /^(Outbound|Return) (trip|flight)/.test(line));
  return ["Outbound", "Return"].flatMap((title, i) => {
    const start = section.findIndex((line) => line.startsWith(title));
    if (start < 0) return []; // en enkel flygresa har bara en utresa
    const row = section.slice(start + 1).find((line) => line.startsWith("- aircraft")) ?? "";
    let left = travellers;
    const classes = [...row.matchAll(/class (\d+) [^(]*\(room for (\d+)\)/g)].map(([, id, room]) => {
      const count = Math.min(left, Number(room));
      left -= count;
      return { class_id: Number(id), count };
    });
    return [call("set_plan", { trip: i === 0 ? "outbound" : "return", aircraft_id: Number(row.match(/aircraft (\d+)/)?.[1]), classes }, `plan${i}`)];
  });
}

// Den manusstyrda agenten: fasta verktygsanrop efter nyckelord i frågan, med värden som "id=teufelsberg"
// i frågan. Den skriver samma in-character-svar som modellen ska.
function agentMock(params: Anthropic.MessageCreateParamsNonStreaming) {
  const { question, steps, last } = progress(params.messages);
  const arg = (name: string) => question.match(new RegExp(`\\b${name}=(\\S+)`))?.[1] ?? "";
  const trip = { id: arg("id"), from: arg("fran") || "ARN", outbound: arg("ut"), return: arg("hem"), travellers: Number(arg("antal") || 1) };
  if (question.includes("FEL")) throw new Error("mock failed");

  // Flygen (TRIP-036): flygplatser med "till=", datum med "ut=" och "hem=" (utan hem= en enkel resa), flyg med "utflyg=" och "hemflyg="
  const flight = { from: trip.from, to: arg("till"), outbound: trip.outbound, return: trip.return || undefined, travellers: trip.travellers };
  if (question.includes("FLYGPLATS") && steps === 0) return answer([call("find_airports", { q: arg("sok") })], "tool_use");
  if (question.includes("FLYGSOK") && steps === 0) return answer([call("find_flights", flight)], "tool_use");
  if (question.includes("FLYGUTVAL") && steps === 0) return answer([call("show_flights", { ...flight, outbound_flight: arg("utflyg") || undefined, return_flight: arg("hemflyg") || undefined })], "tool_use");
  if (question.includes("FLYGVAG")) {
    // Som GENVAG: sök, öppna planen med första flygen, första planet, Resenärer
    const plans = flight.return ? 2 : 1;
    if (steps === 0) return answer([call("find_flights", flight)], "tool_use");
    if (steps === 1) {
      const times = [...last.matchAll(/^- (\d\d:\d\d):/gm)].map((m) => m[1]);
      const backAt = last.split("\nReturn flights")[1]?.match(/^- (\d\d:\d\d):/m)?.[1];
      return answer([call("show_flight_plan", { ...flight, outbound_flight: times[0], return_flight: backAt })], "tool_use");
    }
    if (steps === 2) return answer([call("list_aircraft", {})], "tool_use");
    if (steps === 3) return answer(planCalls(last, trip.travellers), "tool_use");
    if (steps === 3 + plans) return answer([call("show_travellers", {})], "tool_use");
    return say(last.startsWith("Opened the Resen") ? "Jag tog de första och billigaste planen, de är minst dåliga. Fyll i dig själv." : `Det gick inte: ${last}`);
  }

  if (question.includes("SLINGA")) {
    // Ber om verktyg tills taket nås; då tvingas ett svar (tool_choice none)
    return params.tool_choice?.type === "none"
      ? say(`Nu räcker det. Jag fick göra ${steps} anrop.`)
      : answer([call("find_trips", { id: "finns-inte" }, `loop${steps}`)], "tool_use");
  }
  // Före LISTA, som ordet också innehåller
  if (question.includes("TILLAGGSLISTA") && steps === 0) return answer([call("list_addons", {})], "tool_use");
  if (question.includes("LISTA") && steps === 0) {
    const filters = { q: arg("sok"), category: arg("kategori") ? [arg("kategori")] : [], continent: arg("varldsdel") ? [arg("varldsdel")] : [] };
    return answer([call("show_destinations", filters)], "tool_use");
  }
  if (question.includes("OTILLATEN") && steps === 0) return answer([call("show_destination", { id: "../admin" })], "tool_use");
  if (question.includes("GENVAG")) {
    if (steps === 0) return answer([call("find_trips", trip)], "tool_use");
    if (steps === 1) {
      // Första utresan och första hemresan ur svaret, med deras id
      const ids = [...last.matchAll(/^- ((?:ARN|CPH)-[\w-]+|[A-Z]{3}-[\w-]+):/gm)].map((m) => m[1]);
      const [out, back] = [ids.find((id) => id.startsWith(trip.from)), ids.find((id) => !id.startsWith(trip.from))];
      return answer([call("show_plan", { ...trip, outbound_trip: out, return_trip: back })], "tool_use");
    }
    if (steps === 2 && last.startsWith("Opened")) return answer([call("list_aircraft", {})], "tool_use");
    if (steps === 3) return answer(planCalls(last, trip.travellers), "tool_use");
    if (steps === 5) return answer([call("show_travellers", {})], "tool_use");
    return say(last.startsWith("Opened the Resen") ? "Jag tog de första och billigaste planen, de är minst dåliga. Fyll i dig själv." : `Det gick inte: ${last}`);
  }
  if (question.includes("ANNANKLASS")) {
    // Vill besökaren ha en annan klass på Resenärer skickas hen tillbaka till planen (TRIP-041-R4)
    if (steps === 0) return answer([call("list_aircraft", {})], "tool_use");
    if (steps === 1) return answer(planCalls(last, trip.travellers), "tool_use");
    return say("Klassen går inte att byta på Resenärer, bara i planen. Jag skickade dig tillbaka dit.");
  }
  if (question.includes("PLAN") && steps === 0) return answer([call("list_aircraft", {})], "tool_use");
  if (question.includes("PLAN") && steps === 1) return answer(planCalls(last, trip.travellers), "tool_use");
  if (question.includes("OGILTIGT") && steps === 0) return answer([call("set_plan", { trip: "outbound", aircraft_id: 999999, classes: [] })], "tool_use");
  if (question.includes("FORSTORA") && steps === 0) return answer([call("list_aircraft", {})], "tool_use");
  if (question.includes("FORSTORA") && steps === 1) {
    // Fler resenärer i en klass än den rymmer
    const [, aircraft, cls] = last.match(/aircraft (\d+) .*?class (\d+) /) ?? [];
    return answer([call("set_plan", { trip: "outbound", aircraft_id: Number(aircraft), classes: [{ class_id: Number(cls), count: 99 }] })], "tool_use");
  }
  if (question.includes("KLASSTILLAGG") && steps === 0) return answer([call("set_addons", { addons: [{ name: question.match(/namn=(.+?)(?: antal=|$)/)?.[1] ?? "", count: Number(arg("antal") || 1) }] })], "tool_use");
  if (question.includes("RESULTAT") && steps === 0) return answer([call("show_results", { ...trip, outbound_trip: arg("utresa") || undefined })], "tool_use");
  if (question.includes("TILLAGG") && steps === 0) {
    return answer([call("set_extras", { extras: [arg("tillagg") || "ultimate"] })], "tool_use");
  }
  // Från Resenärer till betalsidan (TRIP-038-R1), där betalsättet sätts
  if (question.includes("BETALSIDAN") && steps === 0) return answer([call("show_payment", {})], "tool_use");
  if (question.includes("BETALSATT") && steps === 0) return answer([call("set_payment", { payment: "cash" })], "tool_use");
  if (question.includes("BOKA")) return say("Du är klar. Det blir 12 000 kr. Tryck på knappen, om du måste.\n[[BOOK]]");
  return say(steps > 0 ? `Det blev så här: ${last.split("\n")[0]}` : `Svar från Agneta på: ${question}`);
}

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

// Den manusstyrda agenten: fasta verktygsanrop efter nyckelord i frågan, med värden som "id=teufelsberg"
// i frågan. Den skriver samma in-character-svar som modellen ska.
function agentMock(params: Anthropic.MessageCreateParamsNonStreaming) {
  const { question, steps, last } = progress(params.messages);
  const arg = (name: string) => question.match(new RegExp(`\\b${name}=(\\S+)`))?.[1] ?? "";
  const trip = { id: arg("id"), from: arg("fran") || "ARN", outbound: arg("ut"), return: arg("hem"), travellers: Number(arg("antal") || 1) };
  if (question.includes("FEL")) throw new Error("mock failed");

  if (question.includes("SLINGA")) {
    // Ber om verktyg tills taket nås; då tvingas ett svar (tool_choice none)
    return params.tool_choice?.type === "none"
      ? say(`Nu räcker det. Jag fick göra ${steps} anrop.`)
      : answer([call("find_trips", { id: "finns-inte" }, `loop${steps}`)], "tool_use");
  }
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
      return answer([call("show_travellers", { ...trip, outbound_trip: out, return_trip: back })], "tool_use");
    }
    return say(last.startsWith("Opened") ? "Jag tog de första, de är minst dåliga. Fyll i dig själv." : `Det gick inte: ${last}`);
  }
  if (question.includes("RESULTAT") && steps === 0) return answer([call("show_results", { ...trip, outbound_trip: arg("utresa") || undefined })], "tool_use");
  if (question.includes("TILLAGG") && steps === 0) {
    return answer([call("set_extras", { extras: [arg("tillagg") || "ultimate"] }, "a"), call("set_payment", { payment: "cash" }, "b")], "tool_use");
  }
  if (question.includes("BOKA")) return say("Du är klar. Det blir 12 000 kr. Tryck på knappen, om du måste.\n[[BOOK]]");
  return say(steps > 0 ? `Det blev så här: ${last.split("\n")[0]}` : `Svar från Agneta på: ${question}`);
}

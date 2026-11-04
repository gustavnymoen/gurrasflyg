import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { type ChatMessage, cutToWhole } from "./chat-rules";
import { buildSystemPrompt } from "./chat-prompt";

export const MODEL = "claude-sonnet-5-5";
export const MAX_TOKENS = 1000;

// Det av klienten som används: ett anrop som ger ett svar. Provet byter ut den mot en låtsasklient.
export type ChatClient = {
  messages: {
    create: (params: Anthropic.MessageCreateParamsNonStreaming) => Promise<Anthropic.Message>;
  };
};

// Nyckeln läses här och ingen annanstans, och skickas aldrig till webbläsaren (R6).
// Högst 50 sekunder, så att routens maxDuration (60) hinner svara med Agnetas felmeddelande.
const realClient = (): ChatClient =>
  new Anthropic({ apiKey: process.env.LLM_API_KEY, timeout: 50_000, maxRetries: 1 });

// Låtsasklienten för testerna (LLM_MOCK=1): inget anrop lämnar servern. En fråga med
// "FEL" i gör att den misslyckas, så att felläget går att prova.
export const mockClient: ChatClient = {
  messages: {
    create: async (params) => {
      const question = params.messages.at(-1)?.content;
      if (typeof question === "string" && question.includes("FEL")) throw new Error("mock failed");
      // "KAPAD" ger ett svar som stannar mitt i en länk, så att kapningen går att prova
      const cut = typeof question === "string" && question.includes("KAPAD");
      const text = cut
        ? "- [Teufelsberg](/charter/teufelsberg): Spökstation.\n  - Berlin, från 1 000 kr per person\n- [Beelitz-Heilstätten] (/charter/beelitz"
        : `Svar från Agneta på: ${question}`;
      return {
        content: [{ type: "text", text }],
        stop_reason: cut ? "max_tokens" : "end_turn",
        usage: { input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 },
      } as unknown as Anthropic.Message;
    },
  },
};

// Agnetas svar på samtalet, eller null om API:et vägrar eller svarar med ingenting. Kastar när anropet misslyckas.
export async function askAgneta(
  messages: ChatMessage[],
  client: ChatClient = process.env.LLM_MOCK === "1" ? mockClient : realClient(),
): Promise<string | null> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    // Utan detta tänker modellen först, och det tänkandet räknas mot max_tokens: ett svar på ~60 tokens stoppades vid 1 000 (TRIP-033)
    thinking: { type: "disabled" },
    // Hela systemtexten cachas, så att nästa fråga inom fem minuter läser den billigt
    cache_control: { type: "ephemeral" },
    system: await buildSystemPrompt(),
    messages,
  });
  console.log("chat usage", JSON.stringify(response.usage));
  const cut = response.stop_reason === "max_tokens";
  if (cut) console.log("chat cut at the token limit", JSON.stringify(response.usage));
  const text = response.content
    .flatMap((block) => (block.type === "text" ? [block.text] : []))
    .join("")
    .trim();
  if (response.stop_reason === "refusal" || text === "") return null;
  return cut ? cutToWhole(text) : text;
}

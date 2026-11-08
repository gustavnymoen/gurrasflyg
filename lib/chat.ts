import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { takeMarkers } from "./agent-rules";
import { type ChatMessage, cutToWhole } from "./chat-rules";
import { mockClient } from "./chat-mock";
import { buildSystemPrompt } from "./chat-prompt";

export const MODEL = "claude-sonnet-5-5";
export const MAX_TOKENS = 3000; // modellen tänker först, och tänkandet (~900 tokens i en logg) räknas mot max_tokens: 1 000 räckte inte till svaret (TRIP-033)

// Det av klienten som används: ett anrop som ger ett svar. Provet byter ut den mot en låtsasklient.
export type ChatClient = {
  messages: {
    create: (params: Anthropic.MessageCreateParamsNonStreaming, options?: { timeout?: number; maxRetries?: number }) => Promise<Anthropic.Message>;
  };
};

// Nyckeln läses här och ingen annanstans, och skickas aldrig till webbläsaren (R6).
// Högst 50 sekunder, så att routens maxDuration (60) hinner svara med Agnetas felmeddelande.
const realClient = (): ChatClient =>
  new Anthropic({ apiKey: process.env.LLM_API_KEY, timeout: 50_000, maxRetries: 1 });

// Låtsasklienten när proven kör (LLM_MOCK=1), annars den riktiga
export const defaultClient = (): ChatClient => (process.env.LLM_MOCK === "1" ? mockClient : realClient());
export { mockClient };

// Agnetas svar på samtalet, och om hon ber om knappen Hjälp mig (TRIP-030-R1), eller null om API:et vägrar
// eller svarar med ingenting. Kastar när anropet misslyckas.
export async function askAgneta(
  messages: ChatMessage[],
  client: ChatClient = defaultClient(),
): Promise<{ reply: string; help: boolean; all: boolean } | null> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
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
  const { text: reply, help, all } = takeMarkers(cut ? cutToWhole(text) : text);
  return { reply, help, all };
}

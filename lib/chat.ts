import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { ChatMessage } from "./chat-rules";
import { buildSystemPrompt } from "./chat-prompt";

export const MODEL = "claude-sonnet-5-5";
export const MAX_TOKENS = 600;

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
      return {
        content: [{ type: "text", text: `Svar från Agneta på: ${question}` }],
        stop_reason: "end_turn",
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
    // Hela systemtexten cachas, så att nästa fråga inom fem minuter läser den billigt
    cache_control: { type: "ephemeral" },
    system: await buildSystemPrompt(),
    messages,
  });
  console.log("chat usage", JSON.stringify(response.usage));
  const text = response.content
    .flatMap((block) => (block.type === "text" ? [block.text] : []))
    .join("")
    .trim();
  return response.stop_reason === "refusal" || text === "" ? null : text;
}

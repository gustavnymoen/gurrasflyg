import type { NextRequest } from "next/server";
import { askAgent } from "@/lib/agent";
import { parseAgentContext } from "@/lib/agent-rules";
import { askAgneta } from "@/lib/chat";
import { parseMessages } from "@/lib/chat-rules";
import { apiLimitResponse, CHAT_LIMIT } from "@/lib/flow-limits";

// Svaret är inte strömmat och kan ta flera sekunder; 60 är mer än klientens 50 sekunder
export const maxDuration = 60;

// POST /api/chat  { messages: [{ role, content }, …], agent?: { url, extras, payment, valid } }
//   ->  { reply, help? }  eller, i agentläget (agent finns),  { reply, actions, book }
// Allt kontrolleras här (TRIP-017-R8, TRIP-030-R2, R4). Felen är korta och utan något från API:et eller nyckeln.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const messages = parseMessages(body);
  const agent = body?.agent === undefined ? undefined : parseAgentContext(body.agent);
  if (!messages || agent === null) return Response.json({ error: "Fel form på frågan." }, { status: 400 });

  const limited = await apiLimitResponse("chat", CHAT_LIMIT);
  if (limited) return limited;

  try {
    const answer = agent ? await askAgent(messages, agent) : await askAgneta(messages);
    if (answer) return Response.json(answer);
  } catch (error) {
    // Bara slaget av fel och HTTP-status: felobjektet kan innehålla svar från API:et
    console.error("chat failed", error instanceof Error ? error.name : "unknown", (error as { status?: number }).status ?? "");
  }
  return Response.json({ error: "Agneta kunde inte svara." }, { status: 502 });
}

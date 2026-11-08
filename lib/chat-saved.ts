import type { ChatMessage } from "./chat-rules";

// failed: frågan som inte fick något svar, med Agnetas felmeddelande (notice) efter sig; inget av det följer med nästa fråga.
// all: hela listan är skriven och ska inte vikas (TRIP-035-R6). help och book: svaret följs av knappen Hjälp mig eller Boka och betala (TRIP-030-R1, R8).
export type Entry = ChatMessage & { failed?: boolean; notice?: boolean; help?: boolean; book?: boolean; all?: boolean };

// Det som sparas i webbläsarens sessionslagring (TRIP-032-R5): om chatten är öppen, samtalet och om
// agentläget är på (TRIP-030-R1)
export type SavedChat = { open: boolean; agent: boolean; entries: Entry[] };

export const EMPTY_CHAT: SavedChat = { open: false, agent: false, entries: [] };

// Sparad text som samtal. Är den skadad eller gammal börjar chatten tom.
export function parseSaved(raw: string | null): SavedChat {
  try {
    const { open, agent, entries } = JSON.parse(raw ?? "null");
    if (typeof open !== "boolean" || !Array.isArray(entries)) return EMPTY_CHAT;
    const valid = entries.every(
      (e) => (e?.role === "user" || e?.role === "assistant") && typeof e.content === "string",
    );
    if (!valid) return EMPTY_CHAT;
    // Bara kända fält, så att inget annat som ligger i lagringen hamnar i sidan
    return {
      open,
      agent: agent === true,
      entries: entries.map((e) => ({
        role: e.role,
        content: e.content,
        ...(e.failed === true && { failed: true }),
        ...(e.notice === true && { notice: true }),
        ...(e.help === true && { help: true }),
        ...(e.book === true && { book: true }),
        ...(e.all === true && { all: true }),
      })),
    };
  } catch {
    return EMPTY_CHAT;
  }
}

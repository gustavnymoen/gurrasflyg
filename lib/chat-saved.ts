import type { ChatMessage } from "./chat-rules";

// failed: frågan som inte fick något svar, med Agnetas felmeddelande (notice) efter sig; inget av det följer med nästa fråga
export type Entry = ChatMessage & { failed?: boolean; notice?: boolean };

// Det som sparas i webbläsarens sessionslagring (TRIP-032-R5): om chatten är öppen och samtalet
export type SavedChat = { open: boolean; entries: Entry[] };

export const EMPTY_CHAT: SavedChat = { open: false, entries: [] };

// Sparad text som samtal. Är den skadad eller gammal börjar chatten tom.
export function parseSaved(raw: string | null): SavedChat {
  try {
    const { open, entries } = JSON.parse(raw ?? "null");
    if (typeof open !== "boolean" || !Array.isArray(entries)) return EMPTY_CHAT;
    const valid = entries.every(
      (e) => (e?.role === "user" || e?.role === "assistant") && typeof e.content === "string",
    );
    if (!valid) return EMPTY_CHAT;
    // Bara kända fält, så att inget annat som ligger i lagringen hamnar i sidan
    return {
      open,
      entries: entries.map((e) => ({
        role: e.role,
        content: e.content,
        ...(e.failed === true && { failed: true }),
        ...(e.notice === true && { notice: true }),
      })),
    };
  } catch {
    return EMPTY_CHAT;
  }
}

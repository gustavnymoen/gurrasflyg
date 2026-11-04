import { useMemo, useSyncExternalStore } from "react";
import { EMPTY_CHAT, parseSaved, type SavedChat } from "@/lib/chat-saved";

// Samtalet och om chatten är öppen ligger i webbläsarens sessionslagring (TRIP-032-R5): kvar vid
// omladdning och när besökaren byter sida, borta när fliken stängs, och inget skickas till servern.
// Ett svar som kommer när besökaren redan lämnat sidan skrivs hit också, så det finns kvar.
const KEY = "agneta-chat";
const listeners = new Set<() => void>();
// shortcut: om lagringen är spärrad räcker minnet bara tills sidan laddas om; byt om samtalet då ska överleva
let memory: string | null = null;

function read() {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return memory;
  }
}

// Räknar hur många gånger chatten rensats: en fråga som skickades före rensningen får inte skriva
// sitt svar, eller sitt felmeddelande, i den nya chatten
let cleared = 0;
export const chatEpoch = () => cleared;

export function clearChat() {
  cleared++;
  updateChat(() => EMPTY_CHAT);
}

export function updateChat(change: (saved: SavedChat) => SavedChat) {
  memory = JSON.stringify(change(parseSaved(read())));
  try {
    sessionStorage.setItem(KEY, memory);
  } catch {}
  listeners.forEach((listener) => listener());
}

export function useSavedChat(): SavedChat {
  const raw = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
    read,
    () => null, // på servern finns inget sparat
  );
  return useMemo(() => parseSaved(raw), [raw]);
}

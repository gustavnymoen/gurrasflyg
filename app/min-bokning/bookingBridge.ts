import type { BookingExtract } from "@/lib/cancel-extract";

// Bron mellan sidan och chatten (TRIP-037): bokningen finns bara i sidans minne, så sidan lägger ut utdraget
// och en funktion som kryssar, och chatten läser dem. Inget av det går till någon server utom utdraget
// utan personuppgifter som följer med en fråga.
type Bridge = { extract: BookingExtract; tick: (ids: number[]) => void };

let current: Bridge | null = null;

export const registerBooking = (bridge: Bridge | null) => {
  current = bridge;
};
export const currentBooking = () => current;

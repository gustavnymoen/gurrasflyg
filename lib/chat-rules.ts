import { HALF_LINK } from "./markdown";

// Regler för chatten med Agneta (TRIP-017, TRIP-032), gemensamma för webbläsaren och servern.
// Servern kontrollerar allt igen: det som skickas därifrån går att förfalska.

export const MAX_QUESTION_LENGTH = 500;
// Så många meddelanden följer med varje fråga (R7) och så många tar routen emot (R8)
export const MAX_MESSAGES = 6;
// Agnetas svar är högst 1 000 tokens (cirka 4 000 tecken); 6 000 är en vid gräns. Historiken får aldrig mer förtroende än en fråga.
export const MAX_ANSWER_LENGTH = 6000;
// Frågan och svaren har bara de här två rollerna
export type ChatMessage = { role: "user" | "assistant"; content: string };

// Nära gränsen visas hur många tecken som är kvar
export const SHOW_LEFT_FROM = 450;

// Meddelandena som skickas med en fråga: de sista sex, men inte med ett svar först,
// eftersom en konversation ska börja med en fråga (R7, R8)
export function lastMessages(history: ChatMessage[]): ChatMessage[] {
  const last = history.slice(-MAX_MESSAGES);
  return last[0]?.role === "assistant" ? last.slice(1) : last;
}

// Kroppen i ett anrop som meddelanden, eller null om något är fel (R8): högst sex,
// en fråga först, rollerna växlar, den sista är en fråga, ingen text är tom eller för lång.
export function parseMessages(body: unknown): ChatMessage[] | null {
  const list = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(list) || list.length === 0 || list.length > MAX_MESSAGES) return null;
  const messages: ChatMessage[] = [];
  for (const [i, item] of list.entries()) {
    const { role, content } = (item ?? {}) as Partial<ChatMessage>;
    if (role !== (i % 2 === 0 ? "user" : "assistant") || typeof content !== "string") return null;
    const max = role === "user" ? MAX_QUESTION_LENGTH : MAX_ANSWER_LENGTH;
    if (content.trim() === "" || content.length > max) return null;
    messages.push({ role, content });
  }
  return messages.at(-1)?.role === "user" ? messages : null;
}

// Agnetas texter när något går fel: aldrig en felkod eller något från API:et (R8)
export const FAIL_TEXT = "Nu krånglar det här. Jag har inget med det att göra, men försök igen om en stund.";

export function waitText(seconds: number) {
  const time = seconds >= 60 ? `${Math.ceil(seconds / 60)} minuter` : `${seconds} sekunder`;
  return `Du har frågat nog för en stund. Kom tillbaka om ${time}, så ska jag se vad jag orkar.`;
}

// Agnetas hälsning när chatten öppnas första gången i en session (TRIP-033-R2). Den är inget
// API-anrop och följer aldrig med frågorna.
export const GREETING = "Vad vill du?!";

// Ett svar som stannade vid tokengränsen (TRIP-033-R4), kapat vid den sista hela stycket eller punkten.
// Sista raden är avbruten och slängs; en huvudpunkt vars underpunkt slängdes följer med, för att
// punkt och underpunkt hör ihop. Finns ingen hel rad kapas vid sista hela ordet. En halv länk visas aldrig.
export function cutToWhole(text: string): string {
  const lines = text.split("\n");
  const last = lines.pop() ?? "";
  if (last.startsWith(" ") && lines.at(-1) !== undefined && !lines.at(-1)!.startsWith(" ")) lines.pop();
  const whole = lines.join("\n").trim();
  if (whole !== "") return whole;
  return text.replace(HALF_LINK, "").replace(/\s+\S*$/, "").trim();
}

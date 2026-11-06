import { MAX_ADDONS, PAYMENTS, type Payment, type PassengerLeg } from "./booking-rules";
import { extraByCode } from "./charter-rules";
import { MAX_TRAVELLERS } from "./search";

// Regler för agentläget (TRIP-030), gemensamma för webbläsaren och servern. Det som kommer från
// modellen eller webbläsaren litar ingen på: servern kontrollerar det med de här reglerna och
// webbläsaren gör det en gång till innan den öppnar något.

// Så många verktygsanrop får modellen göra per fråga (R2)
export const MAX_TOOL_CALLS = 6;

// Raderna modellen skriver sist i ett svar för att visa en knapp (TRIP-030, solution.md)
const HELP_MARKER = "[[HELP]]";
export const BOOK_MARKER = "[[BOOK]]";

// Sidan besökaren är på och det som inte är personligt av det hen valt (R4). Aldrig namn, åldrar,
// kontaktuppgifter eller svar på de tre frågorna: valid är bara om formuläret stämmer.
export type AgentContext = { url: string; extras: string[]; payment: Payment | null; valid: boolean };

// Det chatten gör åt Agneta: öppnar en sida eller skriver till formuläret (R3, R6). "addons" är
// resenärernas klasser och tillägg på varje resa, för resorna som legKeys säger (TRIP-040-R4).
export type AgentAction =
  | { type: "goto"; url: string }
  | { type: "extras"; extras: string[] }
  | { type: "payment"; payment: Payment }
  | { type: "addons"; legKeys: string[]; passengers: PassengerLeg[][] };

export const MAX_URL_LENGTH = 1200;

// Sidorna en åtgärd får öppna (R3): /charter, ett resmål, dess resultat, plan och klass, resenärer och betalning
const PATH = /^\/charter(\/[a-z0-9-]+(\/(resor|plan|boka(\/betala)?))?)?$/;

export function isAgentUrl(url: unknown): url is string {
  if (typeof url !== "string" || url.length > MAX_URL_LENGTH || url.includes("#")) return false;
  return PATH.test(url.split("?")[0]);
}

// Det webbläsaren skickar som sidans läge, eller null om det har fel form. Okända tillägg tas bort.
export function parseAgentContext(value: unknown): AgentContext | null {
  const { url, extras, valid, payment = null } = (value ?? {}) as Partial<AgentContext>;
  if (typeof url !== "string" || url.length > MAX_URL_LENGTH || !url.startsWith("/")) return null;
  if (!Array.isArray(extras) || extras.length > 10 || typeof valid !== "boolean") return null;
  if (payment !== null && !PAYMENTS.some((p) => p.value === payment)) return null;
  return { url, extras: extras.filter((code) => typeof code === "string" && extraByCode(code)), payment, valid };
}

// Resenärernas klasser och tillägg per resa, med rätt form och rimliga tal (TRIP-040-R1)
const isCount = (n: unknown) => Number.isInteger(n) && (n as number) >= 0 && (n as number) <= MAX_ADDONS;
const isPassengerLeg = (leg: PassengerLeg) =>
  Number.isInteger(leg?.classId) && typeof leg.addons === "object" && leg.addons !== null && Object.values(leg.addons).every(isCount);
function isAddonsAction(a: { legKeys?: unknown; passengers?: unknown }) {
  const { legKeys, passengers } = a;
  return (
    Array.isArray(legKeys) &&
    legKeys.length <= 2 &&
    legKeys.every((key) => typeof key === "string" && key.length <= 200) &&
    Array.isArray(passengers) &&
    passengers.length <= MAX_TRAVELLERS &&
    passengers.every((legs) => Array.isArray(legs) && legs.length === legKeys.length && legs.every(isPassengerLeg))
  );
}

// Åtgärderna webbläsaren tar emot, kontrollerade en gång till. Det som inte stämmer släpps (R3).
export function safeActions(value: unknown): AgentAction[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((a): AgentAction[] => {
    if (a?.type === "goto" && isAgentUrl(a.url)) return [{ type: "goto", url: a.url }];
    if (a?.type === "payment" && PAYMENTS.some((p) => p.value === a.payment)) return [{ type: "payment", payment: a.payment }];
    if (a?.type === "addons" && isAddonsAction(a)) return [{ type: "addons", legKeys: a.legKeys, passengers: a.passengers }];
    if (a?.type === "extras" && Array.isArray(a.extras) && a.extras.every((c: unknown) => typeof c === "string" && extraByCode(c))) {
      return [{ type: "extras", extras: a.extras }];
    }
    return [];
  });
}

// Markeringarna ur ett svar: texten utan dem, och vilka som fanns
export function takeMarkers(text: string) {
  const help = text.includes(HELP_MARKER);
  const book = text.includes(BOOK_MARKER);
  const clean = text.replaceAll(HELP_MARKER, "").replaceAll(BOOK_MARKER, "").trim();
  return { text: clean, help, book };
}

// Agnetas texter i agentläget som kommer från chatten och inte från modellen
export const CHANGED_TEXT = "Du hann ändra något medan jag höll på. Jaså. Hur vill du ha det då?";
export const bookedText = (bookingNumber: string) =>
  `Det är bokat. Bokningsnumret är ${bookingNumber}. Spara det, jag letar inte upp det åt dig.`;
export const NOT_READY_TEXT = "Så som sidan ser ut nu går det inte att boka. Titta på formuläret igen, eller fråga mig.";

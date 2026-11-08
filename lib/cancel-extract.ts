import { type MyBooking, seatAmount, tickableIds, TOO_LATE_TEXT } from "./cancel-rules";
import { formatPrice } from "./format";
import { MAX_TRAVELLERS } from "./search";

// Det Agneta får veta om en bokning som hittats på Min bokning (TRIP-037-R4): bara det som behövs för att välja
// vad som ska avbokas. Aldrig namn, kontaktuppgifter, bokningsnummer, efternamn, betalsätt eller adress, och
// resenärerna heter "Resenär 1", "Resenär 2". Bokningen slås aldrig upp på servern: utdraget kommer från sidan.
export type ExtractPart = { id: number; label: string; amount: number; cancelled: boolean };
export type ExtractGroup = { label: string; late: boolean; parts: ExtractPart[] };
export type BookingExtract = { kind: "flight" | "charter"; groups: ExtractGroup[]; ticked: number[] };

const MAX_GROUPS = 4;
export const MAX_TICKS = MAX_GROUPS * MAX_TRAVELLERS;
const MAX_LABEL = 300;

export function bookingExtract(booking: MyBooking, selected: ReadonlySet<number>): BookingExtract {
  const traveller = (passengerId: number) => `Resenär ${booking.passengers.findIndex((p) => p.id === passengerId) + 1}`;
  const groups: ExtractGroup[] =
    booking.kind === "flight"
      ? booking.flights.map((f) => ({
          label: `${f.of} ${f.from.iata}-${f.to.iata} ${f.date} ${f.time}`,
          late: f.late,
          parts: f.seats.map((s) => ({ id: s.id, label: `${traveller(s.passengerId)}, ${s.className}`, amount: seatAmount(s), cancelled: s.cancelled })),
        }))
      : [
          {
            label: `resan till ${booking.destination}: ${booking.trips.map(({ title, trip }) => `${title} ${trip.from.iata}-${trip.to.iata} ${trip.date} ${trip.time}`).join(", ")}`,
            late: booking.late,
            parts: booking.passengers.map((p) => ({ id: p.id, label: traveller(p.id), amount: p.amount, cancelled: p.cancelled })),
          },
        ];
  return { kind: booking.kind, groups, ticked: tickableIds(booking).filter((id) => selected.has(id)) };
}

const isId = (n: unknown): n is number => Number.isInteger(n) && (n as number) > 0 && (n as number) < 1e9;
const isPart = (p: ExtractPart) =>
  isId(p?.id) && typeof p.label === "string" && p.label.length <= MAX_LABEL && Number.isInteger(p.amount) && p.amount >= 0 && p.amount < 1e9 && typeof p.cancelled === "boolean";
const isGroup = (g: ExtractGroup) =>
  typeof g?.label === "string" && g.label.length <= MAX_LABEL && typeof g.late === "boolean" && Array.isArray(g.parts) && g.parts.length <= MAX_TRAVELLERS && g.parts.every(isPart);

// Utdraget webbläsaren skickar, eller null om det har fel form. Det som kommer därifrån litar ingen på: bara formen
// och storleken kontrolleras, och chatten kontrollerar kryssen mot den riktiga bokningen innan den kryssar.
export function parseExtract(value: unknown): BookingExtract | null {
  const { kind, groups, ticked } = (value ?? {}) as Partial<BookingExtract>;
  if (kind !== "flight" && kind !== "charter") return null;
  if (!Array.isArray(groups) || groups.length > MAX_GROUPS || !groups.every(isGroup)) return null;
  if (!Array.isArray(ticked) || ticked.length > MAX_TICKS || !ticked.every(isId)) return null;
  return { kind, groups, ticked };
}

export const allParts = ({ groups }: BookingExtract) => groups.flatMap((g) => g.parts.map((part) => ({ ...part, group: g })));

// Varför en del inte går att kryssa, eller null om den går
export const whyNot = (part: ExtractPart, group: ExtractGroup) => (part.cancelled ? "already cancelled" : group.late ? TOO_LATE_TEXT : null);

// Utdraget som text för modellen (i <page>-blocket)
export function extractText(extract: BookingExtract) {
  const lines = [`A ${extract.kind} booking is found on the page. Amounts are what a win would refund. Parts are named by id for tick_cancellation.`];
  for (const group of extract.groups) {
    lines.push(`## ${group.label}${group.late ? " (too late to cancel: leaves in 24 hours or less)" : ""}`);
    for (const part of group.parts) {
      lines.push(`- id ${part.id}: ${part.label}, ${formatPrice(part.amount)}${part.cancelled ? ", already cancelled" : ""}${extract.ticked.includes(part.id) ? ", ticked now" : ""}`);
    }
  }
  return lines.join("\n");
}

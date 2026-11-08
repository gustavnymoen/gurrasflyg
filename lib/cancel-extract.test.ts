import { describe, expect, test } from "vitest";
import { allParts, bookingExtract, extractText, parseExtract, whyNot } from "./cancel-extract";
import { type CharterBooking, type FlightBooking, tickableIds } from "./cancel-rules";

// Bokningar med namn och kontaktuppgifter som aldrig får synas i utdraget
const secrets = ["Hemlig Hemligsson", "Hemlig", "Hemligsson", "Efternamnsson", "hemlig@exempel.se", "070-999 88 77", "Gömdgatan 9", "K7M2QX", "CH-K7M2QX", "Cash till piloten", "cash"];
const contact = { firstName: "Cecilia", lastName: "Efternamnsson", email: "hemlig@exempel.se", phone: "070-999 88 77", address: "Gömdgatan 9" };
const base = { bookingNumber: "K7M2QX", contact, payment: "cash", total: 4000, cancellations: [] };

const seat = (id: number, passengerId: number, over = {}) => ({ id, passengerId, className: "Ekonomi", price: 1000, addons: [], cancelled: false, ...over });
const flight = (id: number, seats: ReturnType<typeof seat>[], over = {}) => ({
  id,
  title: id === 1 ? "Utresa" : "Hemresa",
  of: id === 1 ? "utresan" : "hemresan",
  date: "2030-01-10",
  time: "07:00",
  from: { iata: "ARN", city: "Stockholm", timezone: "Europe/Stockholm" },
  to: { iata: "LHR", city: "London", timezone: "Europe/London" },
  aircraft: "Hemligt plan",
  minutes: 120,
  arrival: { time: "08:00", days: 0 },
  late: false,
  seats,
  ...over,
});

const flightBooking = {
  ...base,
  kind: "flight",
  passengers: [
    { id: 11, name: "Hemlig Hemligsson", age: 40 },
    { id: 12, name: "Bo Efternamnsson", age: 8 },
  ],
  flights: [
    flight(1, [seat(1, 11), seat(2, 12, { addons: [{ name: "Måltid", count: 2, price: 120 }] })]),
    flight(2, [seat(3, 11, { cancelled: true }), seat(4, 12)], { late: true }),
  ],
} as unknown as FlightBooking;

const trip = (title: string, from: string, to: string) => ({ title, trip: { date: "2030-01-10", time: "07:00", from: { iata: from }, to: { iata: to } } });
const charterBooking = {
  ...base,
  bookingNumber: "CH-K7M2QX",
  kind: "charter",
  destination: "Teufelsberg",
  trips: [trip("Utresa", "ARN", "BER"), trip("Hemresa", "BER", "ARN")],
  late: false,
  passengers: [
    { id: 21, name: "Hemlig Hemligsson", age: 40, amount: 8500, cancelled: false },
    { id: 22, name: "Bo Efternamnsson", age: 8, amount: 8500, cancelled: true },
  ],
  extras: [{ name: "Den ultimata upplevelsen", price: 1000 }],
} as unknown as CharterBooking;

describe("the extract", () => {
  test("TRIP-037-R4 a flight booking gives, per flight, route, date, departure, whether it can be cancelled, and per passenger the number, class and amount", () => {
    const extract = bookingExtract(flightBooking, new Set());
    expect(extract.kind).toBe("flight");
    expect(extract.groups.map((g) => [g.label, g.late])).toEqual([
      ["utresan ARN-LHR 2030-01-10 07:00", false],
      ["hemresan ARN-LHR 2030-01-10 07:00", true],
    ]);
    expect(extract.groups[0].parts).toEqual([
      { id: 1, label: "Resenär 1, Ekonomi", amount: 1000, cancelled: false },
      { id: 2, label: "Resenär 2, Ekonomi", amount: 1240, cancelled: false },
    ]);
    expect(extract.groups[1].parts[0].cancelled).toBe(true); // vad som redan är avbokat
  });

  test("TRIP-037-R4 a charter booking gives the destination, the trips, the travellers with amounts and what is cancelled", () => {
    const extract = bookingExtract(charterBooking, new Set());
    expect(extract.kind).toBe("charter");
    expect(extract.groups).toHaveLength(1);
    expect(extract.groups[0].label).toBe("resan till Teufelsberg: Utresa ARN-BER 2030-01-10 07:00, Hemresa BER-ARN 2030-01-10 07:00");
    expect(extract.groups[0].parts).toEqual([
      { id: 21, label: "Resenär 1", amount: 8500, cancelled: false },
      { id: 22, label: "Resenär 2", amount: 8500, cancelled: true },
    ]);
  });

  test("TRIP-037-R4 the extract and its text have no name, contact detail, booking number, last name, payment method or address", () => {
    for (const booking of [flightBooking, charterBooking]) {
      const extract = bookingExtract(booking, new Set([1, 21]));
      const everything = JSON.stringify(extract) + extractText(extract);
      for (const secret of secrets) expect(everything, secret).not.toContain(secret);
    }
  });

  test("TRIP-037-R4 R5 what is ticked is in the extract, but only what can be ticked", () => {
    expect(bookingExtract(flightBooking, new Set([1, 4, 99])).ticked).toEqual([1]); // 4 är på ett för sent flyg
    expect(tickableIds(flightBooking)).toEqual([1, 2]);
    expect(tickableIds(charterBooking)).toEqual([21]);
    expect(tickableIds({ ...charterBooking, late: true })).toEqual([]);
  });

  test("TRIP-037-R5 a part is refused when it is already cancelled or its flight is too late, otherwise it can be ticked", () => {
    const parts = allParts(bookingExtract(flightBooking, new Set()));
    expect(parts.map((p) => whyNot(p, p.group))).toEqual([null, null, "already cancelled", "Det är för sent att avboka"]);
  });

  test("TRIP-037-R4 the text lists the parts by id, what is cancelled and what is ticked", () => {
    // formatPrice skriver ett hårt mellanrum
    const text = extractText(bookingExtract(flightBooking, new Set([2]))).replaceAll("\u00a0", " ");
    expect(text).toContain("## utresan ARN-LHR 2030-01-10 07:00\n- id 1: Resenär 1, Ekonomi, 1 000 kr\n- id 2: Resenär 2, Ekonomi, 1 240 kr, ticked now");
    expect(text).toContain("## hemresan ARN-LHR 2030-01-10 07:00 (too late to cancel: leaves in 24 hours or less)");
    expect(text).toContain("- id 3: Resenär 1, Ekonomi, 1 000 kr, already cancelled");
  });
});

describe("the extract from the browser", () => {
  const ok = bookingExtract(flightBooking, new Set([1]));

  test("TRIP-037-R4 an extract of the right form is accepted unchanged", () => {
    expect(parseExtract(JSON.parse(JSON.stringify(ok)))).toEqual(ok);
  });

  test("TRIP-037-R4 a wrongly shaped or too large extract is refused", () => {
    const group = ok.groups[0];
    const part = group.parts[0];
    for (const bad of [
      null,
      "x",
      {},
      { ...ok, kind: "hotel" },
      { ...ok, groups: "x" },
      { ...ok, groups: Array(5).fill(group) },
      { ...ok, groups: [{ ...group, label: "a".repeat(301) }] },
      { ...ok, groups: [{ ...group, late: "no" }] },
      { ...ok, groups: [{ ...group, parts: Array(11).fill(part) }] },
      { ...ok, groups: [{ ...group, parts: [{ ...part, id: 1.5 }] }] },
      { ...ok, groups: [{ ...group, parts: [{ ...part, amount: -1 }] }] },
      { ...ok, groups: [{ ...group, parts: [{ ...part, cancelled: "yes" }] }] },
      { ...ok, ticked: "1" },
      { ...ok, ticked: [0] },
    ]) {
      expect(parseExtract(bad), JSON.stringify(bad)).toBeNull();
    }
  });
});

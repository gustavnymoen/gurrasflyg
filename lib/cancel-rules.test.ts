import { describe, expect, test } from "vitest";
import {
  type BookedFlight,
  type BookedSeat,
  bookingCancelled,
  bookingKind,
  canCancel,
  type CharterBooking,
  charterSelection,
  type FlightBooking,
  flightCancelled,
  flightSelection,
  groupState,
  leftToPay,
  normalizeBookingNumber,
  sameLastName,
  seatAmount,
  tickableSeats,
  toggleGroup,
  toggleOne,
  travellerAmount,
  winsLottery,
} from "./cancel-rules";
import { instant } from "./fare-rules";

const HOUR = 3_600_000;

describe("booking numbers", () => {
  test("TRIP-023-R2 any case and spaces around the number are ignored", () => {
    expect(normalizeBookingNumber("  k7m2qx ")).toBe("K7M2QX");
    expect(normalizeBookingNumber("ch-k7m2qx")).toBe("CH-K7M2QX");
  });

  test("TRIP-023-R2 six characters is a flight booking, CH- and six a charter booking, anything else neither", () => {
    expect(bookingKind("K7M2QX")).toBe("flight");
    expect(bookingKind("CH-K7M2QX")).toBe("charter");
    for (const text of ["", "K7M2Q", "K7M2QXX", "K7 M2QX", "CH-K7M2Q", "XX-K7M2QX", "K7M2QX; DROP TABLE bookings"]) {
      expect(bookingKind(text), text).toBeNull();
    }
  });

  test("TRIP-023-R2 last names match in any case, also å ä ö, and with spaces around", () => {
    expect(sameLastName("Ek", " ek ")).toBe(true);
    expect(sameLastName("Öberg", "öBERG")).toBe(true);
    expect(sameLastName("Ek", "Eklund")).toBe(false);
  });
});

describe("the 24 hour rule", () => {
  const now = new Date("2030-01-09T06:00:00Z");

  test("TRIP-023-R8 more than 24 hours left can be cancelled, exactly 24 hours or less and the past cannot", () => {
    expect(canCancel(now.getTime() + 24 * HOUR + 60_000, now)).toBe(true);
    expect(canCancel(now.getTime() + 24 * HOUR, now)).toBe(false);
    expect(canCancel(now.getTime() + 23 * HOUR, now)).toBe(false);
    expect(canCancel(now.getTime(), now)).toBe(false);
    expect(canCancel(now.getTime() - HOUR, now)).toBe(false);
  });

  test("TRIP-023-R8 the departure is judged in the departure airport's time zone, also across summer time", () => {
    // 28 mars 2027 byter Stockholm till sommartid. Avgång 29 mars 07:00 är 05:00 UTC.
    const departs = instant("2027-03-29", "07:00", "Europe/Stockholm");
    expect(departs).toBe(Date.parse("2027-03-29T05:00:00Z"));
    expect(canCancel(departs, new Date("2027-03-28T04:59:00Z"))).toBe(true);
    expect(canCancel(departs, new Date("2027-03-28T05:00:00Z"))).toBe(false);
    // Samma klockslag i New York, fem timmar efter London på vintern
    const newYork = instant("2030-01-10", "07:00", "America/New_York");
    expect(newYork).toBe(Date.parse("2030-01-10T12:00:00Z"));
    expect(canCancel(newYork, new Date("2030-01-09T11:59:00Z"))).toBe(true);
    expect(canCancel(newYork, new Date("2030-01-09T12:00:00Z"))).toBe(false);
  });
});

describe("the lottery", () => {
  test("TRIP-023-R10 a number below one half wins and one half or above loses: exactly 50 %", () => {
    expect(winsLottery(0)).toBe(true);
    expect(winsLottery(0.4999)).toBe(true);
    expect(winsLottery(0.5)).toBe(false);
    expect(winsLottery(0.9999)).toBe(false);
    const wins = Array.from({ length: 1000 }, (_, i) => winsLottery(i / 1000)).filter(Boolean).length;
    expect(wins).toBe(500);
  });
});

const seat = (id: number, passengerId: number, price: number, over: Partial<BookedSeat> = {}): BookedSeat => ({
  id,
  passengerId,
  className: "Ekonomi",
  price,
  addons: [],
  cancelled: false,
  ...over,
});

const flight = (id: number, seats: BookedSeat[], over: Partial<BookedFlight> = {}): BookedFlight => ({
  id,
  title: id === 1 ? "Utresa" : "Hemresa",
  of: id === 1 ? "utresan" : "hemresan",
  date: "2030-01-10",
  time: "07:00",
  from: { iata: "ARN", city: "Stockholm", timezone: "Europe/Stockholm" },
  to: { iata: "LHR", city: "London", timezone: "Europe/London" },
  aircraft: "Plan",
  minutes: 120,
  arrival: { time: "08:00", days: 0 },
  late: false,
  seats,
  ...over,
});

describe("amounts", () => {
  test("TRIP-023-R6 a seat is worth its price and its add-ons, each add-on times its count", () => {
    const s = seat(1, 1, 1000, {
      addons: [
        { name: "Måltid", count: 2, price: 120 },
        { name: "Dåliga nerver", count: 1, price: 1000 },
      ],
    });
    expect(seatAmount(s)).toBe(2240);
  });

  test("TRIP-023-R7 a charter traveller is worth both trips and every extra, each per person", () => {
    expect(travellerAmount([2000, 1500], [1000, 2000])).toBe(6500);
    expect(travellerAmount([2000, 1500], [])).toBe(3500);
  });

  test("TRIP-023-R4 what is left to pay is the total minus the refunds that were won", () => {
    const cancellation = (id: number, won: boolean, amount: number) => ({
      id,
      at: "",
      won,
      amount,
      refunded: won ? amount : 0,
    });
    expect(leftToPay({ total: 5000, cancellations: [] })).toBe(5000);
    expect(leftToPay({ total: 5000, cancellations: [cancellation(1, true, 1200), cancellation(2, false, 800)] })).toBe(3800);
  });
});

describe("ticking", () => {
  test("TRIP-023-R6 ticking a flight ticks all its passengers, and ticking it again unticks them", () => {
    const ids = [1, 2, 3];
    const ticked = toggleGroup(new Set(), ids);
    expect([...ticked]).toEqual([1, 2, 3]);
    expect(groupState(ticked, ids)).toBe("all");
    expect(toggleGroup(ticked, ids).size).toBe(0);
  });

  test("TRIP-023-R6 ticking a flight with some passengers ticked completes it", () => {
    const ids = [1, 2, 3];
    const some = toggleOne(new Set(), 2);
    expect(groupState(some, ids)).toBe("some");
    expect([...toggleGroup(some, ids)].sort()).toEqual([1, 2, 3]);
  });

  test("TRIP-023-R6 ticking one passenger ticks only that seat, and nothing ticked is none", () => {
    const one = toggleOne(new Set(), 5);
    expect([...one]).toEqual([5]);
    expect(groupState(new Set(), [1, 2])).toBe("none");
    expect(toggleOne(one, 5).size).toBe(0);
  });

  test("TRIP-023-R6 R8 only seats that are not cancelled, on a flight that is not too late, can be ticked", () => {
    const f = flight(1, [seat(1, 1, 100), seat(2, 2, 100, { cancelled: true }), seat(3, 3, 100)]);
    expect(tickableSeats(f).map((s) => s.id)).toEqual([1, 3]);
    expect(tickableSeats({ ...f, late: true })).toEqual([]);
  });

  test("TRIP-023-R6 a flight where every seat is cancelled is cancelled, and a booking where every flight is is cancelled", () => {
    const some = flight(1, [seat(1, 1, 100, { cancelled: true }), seat(2, 2, 100)]);
    const all = flight(1, [seat(1, 1, 100, { cancelled: true }), seat(2, 2, 100, { cancelled: true })]);
    expect(flightCancelled(some)).toBe(false);
    expect(flightCancelled(all)).toBe(true);
    const booking = (flights: BookedFlight[]) => ({ kind: "flight", flights }) as FlightBooking;
    expect(bookingCancelled(booking([all, some]))).toBe(false);
    expect(bookingCancelled(booking([all, { ...all, id: 2 }]))).toBe(true);
  });

  test("TRIP-023-R6 the outbound flight can be cancelled and the return kept, and the other way round", () => {
    const out = flight(1, [seat(1, 1, 100, { cancelled: true })]);
    const back = flight(2, [seat(2, 1, 100)]);
    expect(tickableSeats(out)).toEqual([]);
    expect(tickableSeats(back).map((s) => s.id)).toEqual([2]);
    expect(tickableSeats({ ...back, seats: [seat(2, 1, 100, { cancelled: true })] })).toEqual([]);
  });

  test("TRIP-023-R9 the selection lists what is ticked, passenger by flight, and what it is worth", () => {
    const booking = {
      kind: "flight",
      passengers: [
        { id: 1, name: "Anna Ek", age: 40 },
        { id: 2, name: "Bo Ek", age: 8 },
      ],
      flights: [
        flight(1, [seat(1, 1, 1000), seat(2, 2, 1000, { addons: [{ name: "Måltid", count: 2, price: 120 }] })]),
        flight(2, [seat(3, 1, 800), seat(4, 2, 800)]),
      ],
    } as FlightBooking;
    expect(flightSelection(booking, new Set([2, 3]))).toEqual({
      lines: ["Utresa: Bo Ek", "Hemresa: Anna Ek"],
      amount: 1240 + 800,
    });
    expect(flightSelection(booking, new Set())).toEqual({ lines: [], amount: 0 });
  });

  test("TRIP-023-R7 R9 a charter selection lists the travellers and their shares; every traveller cancelled cancels the booking", () => {
    const booking = {
      kind: "charter",
      passengers: [
        { id: 1, name: "Anna Ek", age: 40, amount: 6500, cancelled: false },
        { id: 2, name: "Bo Ek", age: 8, amount: 6500, cancelled: true },
      ],
    } as CharterBooking;
    expect(charterSelection(booking, new Set([1]))).toEqual({ lines: ["Anna Ek"], amount: 6500 });
    expect(bookingCancelled(booking)).toBe(false);
    expect(bookingCancelled({ ...booking, passengers: booking.passengers.map((p) => ({ ...p, cancelled: true })) })).toBe(true);
  });
});

import { describe, expect, test } from "vitest";
import {
  anyMinor,
  asCharterForm,
  type CharterForm,
  type CharterSearch,
  charterParams,
  charterProblems,
  charterSummary,
  charterTotal,
  EXTRAS,
  emptyCharterForm,
  extraRows,
  extrasProblem,
  fitCharterForm,
  fitsCharterForm,
  makeTrip,
  MINOR_TEXT,
  parseCharterSearch,
  parseChoice,
  resultsUrl,
  runsOn,
  sortTrips,
  stopsText,
  type Timetable,
  tripsAfter,
  weekdayOf,
} from "./charter-rules";

// En tidtabell som i kursdatan, med de fält testet behöver
const ARN = { iata: "ARN", city: "Stockholm", timezone: "Europe/Stockholm" };
const timetable = (over: Partial<Timetable>): Timetable => ({
  id: "ARN-BER-TEST",
  airline: "Test",
  flights: ["XX1"],
  from: ARN,
  to: { iata: "BER", city: "Berlin", timezone: "Europe/Berlin" },
  stops: [],
  validFrom: "2026-11-01",
  validTo: "2027-04-30",
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  departs: "07:00",
  minutes: 100,
  price: 1000,
  ...over,
});

const windhoek = timetable({
  id: "ARN-WDH-LH1570",
  to: { iata: "WDH", city: "Windhoek", timezone: "Africa/Windhoek" },
  stops: [{ iata: "FRA", city: "Frankfurt", timezone: "Europe/Berlin" }],
  departs: "06:25",
  minutes: 840,
});
const dubai = timetable({
  id: "ARN-DXB-EK650",
  to: { iata: "DXB", city: "Dubai", timezone: "Asia/Dubai" },
  departs: "15:35",
  minutes: 380,
});

describe("the search and its address", () => {
  const valid = { fran: "ARN", utresa: "2027-01-11", hemresa: "2027-01-16", resenarer: "2" };

  test("TRIP-014-R1 a valid search is read and written back to the same address", () => {
    const search = parseCharterSearch(valid);
    expect(search).toEqual({ from: "ARN", outbound: "2027-01-11", return: "2027-01-16", travellers: 2 });
    expect(Object.fromEntries(charterParams(search!))).toEqual(valid);
    expect(resultsUrl("teufelsberg", search!, { out: "A", back: null })).toBe(
      "/charter/teufelsberg/resor?fran=ARN&utresa=2027-01-11&hemresa=2027-01-16&resenarer=2&ut=A",
    );
  });

  test("TRIP-014-R1 an unknown airport, a wrong date or 0 or 11 travellers is not a search", () => {
    for (const bad of [
      { fran: "LHR" },
      { fran: undefined },
      { fran: "arn" },
      { utresa: "2027-02-30" },
      { utresa: undefined },
      { hemresa: undefined },
      { hemresa: "2027-01-10" },
      { hemresa: "16/1" },
      { resenarer: "0" },
      { resenarer: "11" },
      { resenarer: "1.5" },
      { resenarer: undefined },
      { fran: ["ARN", "CPH"] },
    ]) {
      expect(parseCharterSearch({ ...valid, ...bad }), JSON.stringify(bad)).toBeNull();
    }
  });

  test("TRIP-014-R1 the Copenhagen airport and a return on the outbound day are searches", () => {
    expect(parseCharterSearch({ ...valid, fran: "CPH", hemresa: "2027-01-11", resenarer: "10" })).not.toBeNull();
  });

  test("TRIP-014-R5 the chosen trips are read from ut and hem", () => {
    expect(parseChoice({ ut: "ARN-BER-SK1122", hem: "BER-ARN-SK1123" })).toEqual({
      out: "ARN-BER-SK1122",
      back: "BER-ARN-SK1123",
    });
    expect(parseChoice({})).toEqual({ out: null, back: null });
  });
});

describe("which trips run", () => {
  test("TRIP-014-R2 a timetable runs on its weekdays inside its period", () => {
    const weekend = { validFrom: "2027-03-28", validTo: "2027-04-30", days: ["Wed", "Sat"] };
    expect(weekdayOf("2027-01-11")).toBe("Mon");
    expect(weekdayOf("2027-01-17")).toBe("Sun");
    expect(runsOn(weekend, "2027-03-31")).toBe(true); // Wednesday
    expect(runsOn(weekend, "2027-04-03")).toBe(true); // Saturday
    expect(runsOn(weekend, "2027-04-01")).toBe(false); // Thursday
    expect(runsOn(weekend, "2027-03-27")).toBe(false); // Saturday before the period
    expect(runsOn(weekend, "2027-05-01")).toBe(false); // Saturday after it
    expect(runsOn(weekend, "2027-03-28")).toBe(false); // first day of the period, a Sunday
  });
});

describe("arrival and travel time", () => {
  test("TRIP-014-R4 ARN-WDH-LH1570 leaving 06:25 with 840 min arrives 21:25 the same day at Windhoek", () => {
    const trip = makeTrip(windhoek, "2027-01-11");
    expect(trip.arrival).toEqual({ time: "21:25", days: 0 });
    expect(trip.arrivesAt - trip.departsAt).toBe(840 * 60_000);
  });

  test("TRIP-014-R4 a trip that crosses midnight arrives the next day", () => {
    // 15:35 in Stockholm (UTC+1) is 14:35 UTC, 380 min later is 20:55 UTC, 00:55 in Dubai (UTC+4)
    expect(makeTrip(dubai, "2027-01-11").arrival).toEqual({ time: "00:55", days: 1 });
  });

  test("TRIP-014-R4 the change to summer time (28 March 2027) moves the arrival, not the travel time", () => {
    // Winter: UTC+1 in Stockholm, so 06:25 is 05:25 UTC and Windhoek (UTC+2) is at 21:25.
    // Summer: UTC+2, so 06:25 is 04:25 UTC and Windhoek is at 20:25.
    expect(makeTrip(windhoek, "2027-03-27").arrival).toEqual({ time: "21:25", days: 0 });
    expect(makeTrip(windhoek, "2027-03-29").arrival).toEqual({ time: "20:25", days: 0 });
    // Dubai the same two days: 00:55 +1 in winter, 23:55 the same day in summer
    expect(makeTrip(dubai, "2027-03-27").arrival).toEqual({ time: "00:55", days: 1 });
    expect(makeTrip(dubai, "2027-03-29").arrival).toEqual({ time: "23:55", days: 0 });
  });

  test("TRIP-014-R3 a trip says its changes in order", () => {
    expect(stopsText([])).toBe("Direkt");
    expect(stopsText(["Frankfurt"])).toBe("1 byte i Frankfurt");
    expect(stopsText(["Frankfurt", "Wien"])).toBe("2 byten i Frankfurt och Wien");
    expect(stopsText(["A", "B", "C"])).toBe("3 byten i A, B och C");
    expect(makeTrip(windhoek, "2027-01-11").stops).toEqual(["Frankfurt"]);
  });
});

describe("the lists", () => {
  const trips = [
    makeTrip(timetable({ id: "late", departs: "14:00", price: 900 }), "2027-01-11"),
    makeTrip(timetable({ id: "early", departs: "06:50", price: 1100 }), "2027-01-11"),
    makeTrip(timetable({ id: "early-cheap", departs: "07:30", price: 900 }), "2027-01-11"),
  ];

  test("TRIP-014-R3 trips are sorted by departure time, or by price with equal prices by time", () => {
    expect(sortTrips(trips, "time").map((t) => t.id)).toEqual(["early", "early-cheap", "late"]);
    expect(sortTrips(trips, "price").map((t) => t.id)).toEqual(["early-cheap", "late", "early"]);
  });

  test("TRIP-014-R3 the return list has only trips that depart after the outbound trip has arrived", () => {
    // Outbound ARN 14:00 + 100 min = 15:40 in Berlin (the same clock, one hour ahead of UTC like Stockholm)
    const outbound = makeTrip(timetable({ departs: "14:00" }), "2027-01-11");
    const back = (id: string, departs: string, date: string) =>
      makeTrip(
        timetable({ id, from: { iata: "BER", city: "Berlin", timezone: "Europe/Berlin" }, to: ARN, departs }),
        date,
      );
    const list = [
      back("before", "10:00", "2027-01-11"),
      back("at-landing", "15:40", "2027-01-11"),
      back("after", "15:41", "2027-01-11"),
      back("next-day", "06:00", "2027-01-12"),
    ];
    expect(tripsAfter(list, outbound).map((t) => t.id)).toEqual(["after", "next-day"]);
    expect(tripsAfter(list, undefined)).toHaveLength(4);
  });
});

describe("the extras", () => {
  test("TRIP-014-R7 the three extras are defined in the code with their prices per person", () => {
    expect(EXTRAS.map((e) => [e.name, e.price, e.adultsOnly])).toEqual([
      ["Den ultimata upplevelsen", 1000, false],
      ["Bear Grylls Experience", 2000, false],
      ["Dryckespaket XXXL", 4000, true],
    ]);
  });

  test("TRIP-014-R7 two extras add, for every traveller, and neither turns the other off", () => {
    expect(extraRows(["ultimate", "grylls"], 2).map((e) => [e.name, e.sum])).toEqual([
      ["Den ultimata upplevelsen", 2000],
      ["Bear Grylls Experience", 4000],
    ]);
    // Two trips at 1 290 + 990 per person, two travellers, and 2 × 1 000 + 2 × 2 000 in extras
    expect(charterTotal([1290, 990], ["ultimate", "grylls"], 2)).toBe(2 * (1290 + 990) + 2 * 1000 + 2 * 2000);
    expect(charterTotal([1290, 990], [], 2)).toBe(4560);
  });

  test("TRIP-014-R7 Dryckespaket XXXL can't be chosen when any traveller is under 18", () => {
    const adults = [{ age: "40" }, { age: "18" }];
    const withChild = [{ age: "40" }, { age: "17" }];
    expect(anyMinor(adults)).toBe(false);
    expect(anyMinor(withChild)).toBe(true);
    expect(anyMinor([{ age: "" }])).toBe(false);
    expect(extrasProblem({ extras: ["drinks"], passengers: adults })).toBeNull();
    expect(extrasProblem({ extras: ["drinks"], passengers: withChild })).toBe(MINOR_TEXT);
    expect(extrasProblem({ extras: ["ultimate", "grylls"], passengers: withChild })).toBeNull();
  });

  test("TRIP-014-R7 an unknown extra, or the same twice, is refused", () => {
    const passengers = [{ age: "40" }];
    expect(extrasProblem({ extras: ["free-flight"], passengers })).not.toBeNull();
    expect(extrasProblem({ extras: ["ultimate", "ultimate"], passengers })).not.toBeNull();
    expect(extrasProblem({ extras: [7 as unknown as string], passengers })).not.toBeNull();
  });
});

describe("the form", () => {
  const person = { firstName: "Anna", lastName: "Ek", age: "40" };
  const filled = (over: Partial<CharterForm> = {}): CharterForm => ({
    ...emptyCharterForm("request-0001"),
    passengers: [person],
    contact: { firstName: "Anna", lastName: "Ek", email: "anna@exempel.se", phone: "070-123 45 67", address: "Storgatan 1" },
    checks: [true, true, true],
    payment: "cash",
    ...over,
  });

  test("TRIP-014-R6 a changed number of travellers adds or removes travellers and keeps the rest", () => {
    const form = filled({ passengers: [person, { ...person, firstName: "Bo" }] });
    expect(fitCharterForm(form, 3).passengers.map((p) => p.firstName)).toEqual(["Anna", "Bo", ""]);
    expect(fitCharterForm(form, 1).passengers.map((p) => p.firstName)).toEqual(["Anna"]);
    expect(fitCharterForm(form, 1).contact).toEqual(form.contact);
  });

  test("TRIP-014-R7 a chosen Dryckespaket XXXL is dropped when a traveller is under 18", () => {
    const child = [{ ...person, age: "12" }];
    expect(fitCharterForm(filled({ extras: ["drinks", "grylls"], passengers: child }), 1).extras).toEqual(["grylls"]);
    expect(fitCharterForm(filled({ extras: ["drinks"] }), 1).extras).toEqual(["drinks"]);
  });

  test("TRIP-014-R6 the checks and messages are the flight booking's", () => {
    expect(charterProblems(filled())).toEqual({});
    const problems = charterProblems(
      filled({ passengers: [{ firstName: "", lastName: "Ek", age: "" }], checks: [true, false, true] }),
    );
    expect(problems).toEqual({
      "p0-fornamn": "Skriv passagerarens förnamn.",
      "p0-alder": "Välj passagerarens ålder.",
      "fraga-1": "Kryssa i rutan för att gå vidare.",
    });
    // The first problem comes first, so that focus goes to it
    expect(Object.keys(problems)[0]).toBe("p0-fornamn");
  });

  test("TRIP-014-R8 the server checks the form's shape", () => {
    expect(fitsCharterForm(filled(), 1)).toBe(true);
    expect(fitsCharterForm(filled(), 2)).toBe(false);
    expect(fitsCharterForm(filled({ extras: [4] as unknown as string[] }), 1)).toBe(false);
    expect(fitsCharterForm(filled({ requestId: "x" }), 1)).toBe(false);
    expect(fitsCharterForm(filled({ payment: "gold" as "cash" }), 1)).toBe(false);
    expect(fitsCharterForm(null as unknown as CharterForm, 1)).toBe(false);
  });

  test("TRIP-014-R6 a stored form is read only if it has the form's shape", () => {
    expect(asCharterForm(filled())).not.toBeNull();
    expect(asCharterForm({ requestId: "x" })).toBeNull();
    expect(asCharterForm(null)).toBeNull();
  });

  test("TRIP-014-R9 the summary has the booking number, the trips, the extras and the total", () => {
    const search: CharterSearch = { from: "ARN", outbound: "2027-01-11", return: "2027-01-16", travellers: 1 };
    const trips = [makeTrip(timetable({ price: 1290 }), search.outbound), makeTrip(timetable({ price: 990 }), search.return)];
    const summary = charterSummary("CH-K7M2QX", "Teufelsberg", filled({ extras: ["grylls"] }), trips);
    expect(summary.bookingNumber).toBe("CH-K7M2QX");
    expect(summary.trips.map((t) => t.title)).toEqual(["Utresa", "Hemresa"]);
    expect(summary.passengers).toEqual([{ name: "Anna Ek", age: "40" }]);
    expect(summary.extras).toEqual([{ name: "Bear Grylls Experience", sum: 2000 }]);
    expect(summary.payment).toBe("Cash till piloten");
    expect(summary.total).toBe(1290 + 990 + 2000);
  });
});

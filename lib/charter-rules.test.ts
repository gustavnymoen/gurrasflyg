import { describe, expect, test } from "vitest";
import { type BookingLeg, removedAddons } from "./booking-rules";
import {
  anyMinor,
  asCharterForm,
  type CharterChoice,
  type CharterForm,
  type CharterSearch,
  charterParams,
  charterProblems,
  charterSummary,
  charterTotal,
  chooseHome,
  chooseOutbound,
  departuresTotal,
  EXTRAS,
  emptyCharterForm,
  extraRows,
  extrasProblem,
  fitCharterForm,
  fitsCharterForm,
  fitTravellers,
  legText,
  makeTrip,
  MINOR_TEXT,
  NO_CHOICE,
  NO_PLAN,
  parseCharterSearch,
  parseChoice,
  planText,
  planUrl,
  resultsUrl,
  runsOn,
  sortTrips,
  stopsText,
  type Timetable,
  toPlanFlight,
  tripsAfter,
  weekdayOf,
} from "./charter-rules";
import { aircraftOptions, fare } from "./fare-rules";

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
    expect(resultsUrl("teufelsberg", search!, { ...NO_CHOICE, out: "A" })).toBe(
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
      ...NO_CHOICE,
      out: "ARN-BER-SK1122",
      back: "BER-ARN-SK1123",
    });
    expect(parseChoice({})).toEqual(NO_CHOICE);
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
    expect(departuresTotal([1290, 990], ["ultimate", "grylls"], 2)).toBe(2 * (1290 + 990) + 2 * 1000 + 2 * 2000);
    expect(departuresTotal([1290, 990], [], 2)).toBe(4560);
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

// Ett plan med två klasser och två resor: avgångarnas pris är basen (TRIP-039)
const ECONOMY = { id: 1, name: "Ekonomi", capacity: 10, pricePercent: 100 };
const BUSINESS = { id: 2, name: "Business", capacity: 4, pricePercent: 150 };
const PLANE = { id: 7, name: "Testplan", pricePercent: 120, timePercent: 100, classes: [ECONOMY, BUSINESS] };
const MEAL = { id: 11, name: "Måltid", description: "Mat", price: 120 };
const BEER = { id: 12, name: "Öl", description: "Kall", price: 80 };
const leg = (price: number, of: string, seating: Record<number, number>, key = `${of}-key`): BookingLeg => ({
  key,
  of,
  price,
  aircraft: PLANE,
  seating,
  addons: { 1: [MEAL], 2: [MEAL, BEER] },
});
// Två resenärer: en i Business och en i Ekonomi på båda resorna
const legs = [leg(1290, "utresan", { 1: 1, 2: 1 }), leg(990, "hemresan", { 1: 1, 2: 1 })];

describe("aircraft and classes in charter", () => {
  test("TRIP-039-R3 the plan and the classes are kept in the address, and an address without them has none", () => {
    const search = parseCharterSearch({ fran: "ARN", utresa: "2027-01-11", hemresa: "2027-01-16", resenarer: "2" })!;
    const choice: CharterChoice = {
      out: "ARN-BER-SK1122",
      back: "BER-ARN-SK1123",
      plans: [{ aircraftId: 7, seating: { 1: 1, 2: 1 } }, NO_PLAN],
    };
    const url = planUrl("teufelsberg", search, choice);
    expect(url).toBe(
      "/charter/teufelsberg/plan?fran=ARN&utresa=2027-01-11&hemresa=2027-01-16&resenarer=2&ut=ARN-BER-SK1122&hem=BER-ARN-SK1123&ut-plan=7&ut-klasser=1%3A1%2C2%3A1",
    );
    expect(parseChoice(Object.fromEntries(new URL(url, "http://x").searchParams))).toEqual(choice);
    // Ett fel plan eller fel antal är inte valt
    expect(parseChoice({ "ut-plan": "x", "ut-klasser": "1:a" }).plans[0]).toEqual(NO_PLAN);
  });

  test("TRIP-039-R3 another trip clears the plan of that trip, the same trip again keeps it", () => {
    const plan = { aircraftId: 7, seating: { 1: 2 } };
    const early = makeTrip(timetable({ id: "early", departs: "07:00" }), "2027-01-11");
    const late = makeTrip(timetable({ id: "late", departs: "14:00" }), "2027-01-11");
    const back = ["10:00", "20:00"].map((departs, i) =>
      makeTrip(timetable({ id: `back${i}`, from: { iata: "BER", city: "Berlin", timezone: "Europe/Berlin" }, to: ARN, departs }), "2027-01-11"),
    );
    const chosen: CharterChoice = { out: "early", back: "back1", plans: [plan, plan] };
    expect(chooseOutbound(chosen, "early", [early, late], back)).toEqual(chosen);
    // Utresan byts: dess plan försvinner, hemresan som fortfarande passar behåller sitt
    expect(chooseOutbound(chosen, "late", [early, late], back)).toEqual({ out: "late", back: "back1", plans: [NO_PLAN, plan] });
    expect(chooseHome(chosen, "back1").plans).toEqual([plan, plan]);
    expect(chooseHome(chosen, "back0").plans).toEqual([plan, NO_PLAN]);
  });

  test("TRIP-039-R3 the price of a trip is the departure's price with the aircraft's and the class's factor", () => {
    // 1 290 × 1,20 × 1,50 for Business and 1 290 × 1,20 for Ekonomi, then the same for 990
    const seats = (price: number) => fare(price, 120, 150) + fare(price, 120, 100);
    const form = fitCharterForm(emptyCharterForm("request-0001"), legs, 2);
    expect(charterTotal(legs, form)).toBe(seats(1290) + seats(990));
    expect(charterTotal(legs, { ...form, extras: ["ultimate", "grylls"] })).toBe(seats(1290) + seats(990) + 2 * (1000 + 2000));
  });

  test("TRIP-039-R4 the add-ons of the classes are counted next to the charter extras, per traveller", () => {
    const form = fitCharterForm(emptyCharterForm("request-0001"), legs, 2);
    form.passengers[0].legs[0].addons = { 11: 2, 12: 1 }; // Business: 2 Måltid and 1 Öl on the outbound trip
    form.passengers[1].legs[1].addons = { 11: 1 };
    const without = charterTotal(legs, { ...form, passengers: fitCharterForm(emptyCharterForm("r"), legs, 2).passengers });
    expect(charterTotal(legs, { ...form, extras: [] }) - without).toBe(2 * 120 + 80 + 120);
    expect(charterTotal(legs, { ...form, extras: ["ultimate"] })).toBe(charterTotal(legs, { ...form, extras: [] }) + 2 * 1000);
  });

  test("TRIP-039-R8 the travellers are placed in the classes in order, and a changed trip starts its classes again", () => {
    const form = fitCharterForm(emptyCharterForm("request-0001"), legs, 2);
    // The dearest class first, as in flight booking: the first traveller in Business
    expect(form.passengers.map((p) => p.legs.map((l) => l.classId))).toEqual([[2, 2], [1, 1]]);
    expect(form.legKeys).toEqual(["utresan-key", "hemresan-key"]);

    // Add-ons are kept while the trips are the same
    form.passengers[0].legs[0].addons = { 11: 1 };
    expect(fitCharterForm(form, legs, 2).passengers[0].legs[0].addons).toEqual({ 11: 1 });
    // A changed outbound trip (another key) starts it again; the return trip is left alone
    form.passengers[1].legs[1].addons = { 11: 3 };
    const changed = [leg(1290, "utresan", { 1: 2 }, "utresan-new"), legs[1]];
    const fitted = fitCharterForm(form, changed, 2);
    expect(fitted.passengers.map((p) => p.legs[0].classId)).toEqual([1, 1]);
    expect(fitted.passengers[0].legs[0].addons).toEqual({});
    expect(fitted.passengers[1].legs[1].addons).toEqual({ 11: 3 });
  });

  test("TRIP-039-R8 the page tells which add-ons were removed by a changed plan or classes", () => {
    const form = fitCharterForm(emptyCharterForm("request-0001"), legs, 2);
    form.passengers[0].legs[0].addons = { 11: 2, 12: 1 };
    form.passengers[1].legs[1].addons = { 11: 1 };
    const names = { 11: "Måltid", 12: "Öl" };
    expect(removedAddons(form, legs, 2, names)).toEqual([]);
    const changed = [leg(1290, "utresan", { 1: 2 }, "utresan-new"), legs[1]];
    expect(removedAddons(form, changed, 2, names)).toEqual(["Passagerare 1, utresan: Måltid (2 st)", "Passagerare 1, utresan: Öl"]);
  });

  test("TRIP-039-R3 the cards show the departure's own flight time and arrival, whatever the aircraft's time factor", () => {
    // charter.ts sets the factor to 100 for every aircraft (R2); the options then show the departure's times
    const trip = makeTrip(windhoek, "2027-01-11");
    const [option] = aircraftOptions([PLANE], toPlanFlight(trip), 2);
    expect(option.minutes).toBe(trip.minutes);
    expect(option.arrival).toEqual(trip.arrival);
    expect(toPlanFlight(trip).price).toBe(trip.price);
  });

  test("TRIP-039-R3 the plan and the classes are written as a line in Din resa", () => {
    expect(planText({ aircraftId: 7, seating: { 1: 1, 2: 1 } }, [PLANE])).toBe("Testplan · Ekonomi: 1 · Business: 1");
    expect(planText({ aircraftId: 7, seating: null }, [PLANE])).toBe("Testplan");
    expect(planText(NO_PLAN, [PLANE])).toBeNull();
    expect(legText(legs[0])).toBe("Testplan · Ekonomi: 1 · Business: 1");
  });
});

describe("the form", () => {
  const person = { firstName: "Anna", lastName: "Ek", age: "40", legs: [] };
  const filled = (over: Partial<CharterForm> = {}): CharterForm => ({
    ...emptyCharterForm("request-0001"),
    passengers: [person],
    contact: { firstName: "Anna", lastName: "Ek", email: "anna@exempel.se", phone: "070-123 45 67", address: "Storgatan 1" },
    checks: [true, true, true],
    payment: "cash",
    ...over,
  });
  // En resenär i Business på båda resorna, som planet för en resenär ger
  const oneLeg = [leg(1000, "utresan", { 2: 1 }), leg(1000, "hemresan", { 2: 1 })];
  const seated = (over: Partial<CharterForm> = {}) => fitCharterForm(filled(over), oneLeg, 1);

  test("TRIP-014-R6 a changed number of travellers adds or removes travellers and keeps the rest", () => {
    const form = filled({ passengers: [person, { ...person, firstName: "Bo" }] });
    expect(fitTravellers(form, 3).passengers.map((p) => p.firstName)).toEqual(["Anna", "Bo", ""]);
    expect(fitTravellers(form, 1).passengers.map((p) => p.firstName)).toEqual(["Anna"]);
    expect(fitTravellers(form, 1).contact).toEqual(form.contact);
    expect(fitCharterForm(form, legs, 1).passengers.map((p) => p.firstName)).toEqual(["Anna"]);
  });

  test("TRIP-014-R7 a chosen Dryckespaket XXXL is dropped when a traveller is under 18", () => {
    const child = [{ ...person, age: "12" }];
    expect(fitTravellers(filled({ extras: ["drinks", "grylls"], passengers: child }), 1).extras).toEqual(["grylls"]);
    expect(fitTravellers(filled({ extras: ["drinks"] }), 1).extras).toEqual(["drinks"]);
    expect(fitCharterForm(filled({ extras: ["drinks", "grylls"], passengers: child }), oneLeg, 1).extras).toEqual(["grylls"]);
  });

  test("TRIP-014-R6 the checks and messages are the flight booking's", () => {
    expect(charterProblems(seated(), oneLeg)).toEqual({});
    const problems = charterProblems(
      seated({ passengers: [{ firstName: "", lastName: "Ek", age: "", legs: [] }], checks: [true, false, true] }),
      oneLeg,
    );
    expect(problems).toEqual({
      "p0-fornamn": "Skriv passagerarens förnamn.",
      "p0-alder": "Välj passagerarens ålder.",
      "fraga-1": "Kryssa i rutan för att gå vidare.",
    });
    // The first problem comes first, so that focus goes to it
    expect(Object.keys(problems)[0]).toBe("p0-fornamn");
  });

  test("TRIP-039-R4 beer is only for travellers from 18 years, as in flight booking (TRIP-029)", () => {
    const form = seated({ passengers: [{ ...person, age: "17", legs: [] }] });
    expect(charterProblems(form, oneLeg)).toEqual({});
    form.passengers[0].legs[0].addons = { 12: 1 };
    expect(charterProblems(form, oneLeg)).toEqual({ "p0-alder": "Öl går bara att köpa från 18 år." });
    form.passengers[0].age = "18";
    expect(charterProblems(form, oneLeg)).toEqual({});
  });

  test("TRIP-014-R8 TRIP-039-R5 the server checks the form's shape, the classes in order and the add-ons", () => {
    expect(fitsCharterForm(seated(), oneLeg, 1)).toBe(true);
    expect(fitsCharterForm(seated(), oneLeg, 2)).toBe(false);
    expect(fitsCharterForm(seated({ extras: [4] as unknown as string[] }), oneLeg, 1)).toBe(false);
    expect(fitsCharterForm(seated({ requestId: "x" }), oneLeg, 1)).toBe(false);
    expect(fitsCharterForm(seated({ payment: "gold" as "cash" }), oneLeg, 1)).toBe(false);
    expect(fitsCharterForm(null as unknown as CharterForm, oneLeg, 1)).toBe(false);

    // A class other than the one the numbers give, a missing trip, a class the plane doesn't have, an add-on that isn't sold there
    const wrongClass = seated();
    wrongClass.passengers[0].legs[0].classId = 1;
    expect(fitsCharterForm(wrongClass, oneLeg, 1)).toBe(false);
    const missing = seated();
    missing.passengers[0].legs = missing.passengers[0].legs.slice(0, 1);
    expect(fitsCharterForm(missing, oneLeg, 1)).toBe(false);
    const foreign = seated();
    foreign.passengers[0].legs[1].classId = 99;
    expect(fitsCharterForm(foreign, oneLeg, 1)).toBe(false);
    const unknownAddon = seated();
    unknownAddon.passengers[0].legs[0].addons = { 99: 1 };
    expect(fitsCharterForm(unknownAddon, oneLeg, 1)).toBe(false);
    const tooMany = seated();
    tooMany.passengers[0].legs[0].addons = { 11: 11 };
    expect(fitsCharterForm(tooMany, oneLeg, 1)).toBe(false);
  });

  test("TRIP-014-R6 a stored form is read only if it has the form's shape", () => {
    expect(asCharterForm(filled())).not.toBeNull();
    expect(asCharterForm({ requestId: "x" })).toBeNull();
    // A form stored before the plan step has no trips to say
    const old: Partial<CharterForm> = filled();
    delete old.legKeys;
    expect(asCharterForm(old)).toBeNull();
    expect(asCharterForm(null)).toBeNull();
  });

  test("TRIP-014-R9 TRIP-039-R5 the summary has the booking number, the trips with aircraft and classes, the extras and the total", () => {
    const search: CharterSearch = { from: "ARN", outbound: "2027-01-11", return: "2027-01-16", travellers: 1 };
    const trips = [makeTrip(timetable({ price: 1000 }), search.outbound), makeTrip(timetable({ price: 1000 }), search.return)];
    const form = seated({ extras: ["grylls"] });
    form.passengers[0].legs[1].addons = { 11: 2 };
    const summary = charterSummary("CH-K7M2QX", "Teufelsberg", form, trips, oneLeg);
    expect(summary.bookingNumber).toBe("CH-K7M2QX");
    expect(summary.trips.map((t) => [t.title, t.aircraft, t.seating])).toEqual([
      ["Utresa", "Testplan", "Business: 1"],
      ["Hemresa", "Testplan", "Business: 1"],
    ]);
    expect(summary.passengers).toEqual([
      {
        name: "Anna Ek",
        age: "40",
        legs: [
          { className: "Business", addons: [] },
          { className: "Business", addons: [{ name: "Måltid", count: 2 }] },
        ],
      },
    ]);
    expect(summary.extras).toEqual([{ name: "Bear Grylls Experience", sum: 2000 }]);
    expect(summary.payment).toBe("Cash till piloten");
    expect(summary.total).toBe(2 * fare(1000, 120, 150) + 2 * 120 + 2000);
  });
});

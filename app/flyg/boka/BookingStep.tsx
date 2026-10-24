import { loadBookingTrip } from "@/lib/flights";
import type { Params } from "@/lib/search";
import { planUrl } from "@/lib/trip";
import Problem, { TripProblem } from "../Problem";
import PaymentForm from "./PaymentForm";
import TravellersForm from "./TravellersForm";

// Resenärerna eller betalningen för resan i adressen (TRIP-012). Flygen,
// planen, priserna och tilläggen läses från databasen; går resan inte att
// boka står det vad som saknas.
export default async function BookingStep({
  searchParams,
  step,
}: {
  searchParams: Promise<Params>;
  step: "travellers" | "payment";
}) {
  const trip = await loadBookingTrip(await searchParams);
  if ("problem" in trip) {
    if (trip.problem !== "plan") return <TripProblem trip={trip} />;
    return (
      <Problem
        text="Välj plan och klass för varje flyg först."
        href={planUrl(trip.trip.search, trip.trip.legs)}
        link="Till plan och klass"
      />
    );
  }
  const Form = step === "travellers" ? TravellersForm : PaymentForm;
  return <Form search={trip.search} legs={trip.legs} flights={trip.flights} fleet={trip.fleet} booking={trip.booking} />;
}

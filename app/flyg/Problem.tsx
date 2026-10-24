import Link from "next/link";
import type { TripProblem as Trouble } from "@/lib/flights";
import { searchUrl } from "@/lib/search";
import { buttonClass } from "../components/Button";

// Vad som är fel och en länk dit besökaren kan gå vidare
export default function Problem({ text, href, link }: { text: string; href: string; link: string }) {
  return (
    <div className="flex flex-col items-start gap-4">
      <p>{text}</p>
      <Link href={href} className={buttonClass("secondary")}>
        {link}
      </Link>
    </div>
  );
}

// När resan i adressen inte går att läsa (loadTrip i lib/flights.ts)
export function TripProblem({ trip }: { trip: Trouble }) {
  if (trip.problem === "address") {
    return <Problem text="Adressen saknar något. Börja med att söka efter ett flyg." href="/" link="Till sökningen" />;
  }
  return (
    <Problem
      text="Flyget finns inte eller har redan gått. Välj ett annat flyg."
      href={searchUrl(trip.search)}
      link="Till flygen"
    />
  );
}

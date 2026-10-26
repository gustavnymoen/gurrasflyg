"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  type CharterChoice,
  type CharterSearch,
  type CharterTrip,
  charterParams,
  charterTotal,
  chosenTrips,
  CHARTER_PATH,
  type SortBy,
  sortTrips,
  stopsText,
  tripsAfter,
  travellersUrl,
} from "@/lib/charter-rules";
import { formatDay } from "@/lib/dates";
import { formatDuration, formatPrice } from "@/lib/format";
import Button, { buttonClass } from "../components/Button";
import Card from "../components/Card";
import { ArrivalTime } from "../flyg/plan/FlightTime";
import SortChoice from "../flyg/SortChoice";
import Steps from "../flyg/Steps";
import CharterOverview from "./CharterOverview";
import { charterSteps } from "./steps";

// Resorna att välja bland: först utresan, sedan hemresan som går efter att
// utresan har landat, och Din resa med Fortsätt när båda är valda (TRIP-014-R3, R5).
// Valen står i adressen, så att sidan går att ladda om och dela.
export default function CharterResults({
  id,
  title,
  airport,
  search,
  out,
  back,
  initial,
}: {
  id: string;
  title: string;
  airport: string;
  search: CharterSearch;
  out: CharterTrip[];
  back: CharterTrip[];
  initial: CharterChoice;
}) {
  const [choice, setChoice] = useState(initial);
  const [sortBy, setSortBy] = useState<SortBy>("time");
  // Det som läses upp för skärmläsare när något väljs eller sorteras
  const [announcement, setAnnouncement] = useState("");

  // Hemresor som passar utresan, och valen som finns kvar efter en ändring (R5)
  const { outbound, home } = chosenTrips(choice, out, back);
  const backList = tripsAfter(back, outbound);

  // Adressen följer valen utan att sidan läses om från servern. Inte när sidan öppnas.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const params = charterParams(search, { out: outbound?.id ?? null, back: home?.id ?? null });
    window.history.replaceState(null, "", `${CHARTER_PATH}/${id}/resor?${params}`);
  }, [id, search, outbound, home]);

  const chosen = { out: outbound?.id ?? null, back: home?.id ?? null };
  const label = (trip: CharterTrip) => `${trip.flights.join(", ")} kl ${trip.time}`;

  function chooseOutbound(trip: CharterTrip) {
    // Hemresan som inte passar den nya utresan tas bort (R5)
    const kept = chosenTrips({ out: trip.id, back: choice.back }, out, back).home;
    setChoice({ out: trip.id, back: kept?.id ?? null });
    setAnnouncement(`Utresa vald: ${label(trip)}. Välj nu hemresa.`);
  }

  function chooseHome(trip: CharterTrip) {
    setChoice({ ...choice, back: trip.id });
    setAnnouncement(`Hemresa vald: ${label(trip)}. Fortsätt är nu möjlig.`);
  }

  function sort(by: SortBy) {
    setSortBy(by);
    setAnnouncement(by === "price" ? "Sorterat på pris." : "Sorterat på avgångstid.");
  }

  const prices = [outbound, home].flatMap((t) => (t ? [t.price] : []));
  return (
    <div className="flex flex-col gap-6">
      <p role="status" className="sr-only">
        {announcement}
      </p>
      <Steps steps={charterSteps(id, search, chosen)} current={0} />

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-10">
          <TripList
            name="utresa"
            heading={`Utresa ${search.from} – ${airport}`}
            date={search.outbound}
            trips={out}
            sortBy={sortBy}
            onSort={sort}
            chosen={outbound}
            onChoose={chooseOutbound}
            empty="Inga resor den här dagen."
            searchHref={`${CHARTER_PATH}/${id}`}
          />
          {outbound && (
            <TripList
              name="hemresa"
              heading={`Hemresa ${airport} – ${search.from}`}
              date={search.return}
              trips={backList}
              sortBy={sortBy}
              onSort={sort}
              chosen={home}
              onChoose={chooseHome}
              empty={
                back.length > 0
                  ? "Inga hemresor går efter att utresan har landat."
                  : "Inga resor den här dagen."
              }
              searchHref={`${CHARTER_PATH}/${id}`}
            />
          )}
        </div>

        <div className="lg:sticky lg:top-6">
          <CharterOverview
            destination={title}
            trips={[outbound, home]}
            travellers={search.travellers}
            total={charterTotal(prices, [], search.travellers)}
          >
            {outbound && home && (
              <Link href={travellersUrl(id, search, chosen)} className={`${buttonClass()} self-start`}>
                Fortsätt
              </Link>
            )}
          </CharterOverview>
        </div>
      </div>
    </div>
  );
}

function TripList({
  name,
  heading,
  date,
  trips,
  sortBy,
  onSort,
  chosen,
  onChoose,
  empty,
  searchHref,
}: {
  name: string;
  heading: string;
  date: string;
  trips: CharterTrip[];
  sortBy: SortBy;
  onSort: (by: SortBy) => void;
  chosen: CharterTrip | undefined;
  onChoose: (trip: CharterTrip) => void;
  empty: string;
  searchHref: string;
}) {
  return (
    <section aria-labelledby={`${name}-rubrik`} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <h2 id={`${name}-rubrik`} className="text-section font-bold">
            {heading}
          </h2>
          <p className="mt-1 text-ink-muted">
            {formatDay(date)} · {trips.length} {trips.length === 1 ? "resa" : "resor"}
          </p>
        </div>
        {trips.length > 1 && <SortChoice value={sortBy} onChange={onSort} />}
      </div>

      {trips.length === 0 ? (
        <div className="flex flex-col items-start gap-3">
          <p>{empty}</p>
          <Link href={searchHref} className={buttonClass("secondary")}>
            Tillbaka till sökningen
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {sortTrips(trips, sortBy).map((trip) => (
            <TripCard key={trip.id} trip={trip} chosen={chosen?.id === trip.id} onChoose={() => onChoose(trip)} />
          ))}
        </ul>
      )}
    </section>
  );
}

// En resa i listan med allt som behövs för att välja (R3)
function TripCard({ trip, chosen, onChoose }: { trip: CharterTrip; chosen: boolean; onChoose: () => void }) {
  return (
    <li>
      <Card
        size="compact"
        className={`grid items-center gap-x-6 gap-y-3 sm:grid-cols-[1fr_auto] ${chosen ? "border-accent-strong ring-2 ring-accent-strong" : ""}`}
      >
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-bold">
            <span className="tabular-nums">{trip.time}</span>
            <span aria-hidden="true"> – </span>
            <span className="sr-only"> landar </span>
            <ArrivalTime {...trip.arrival} />
          </p>
          <p className="text-small text-ink-muted">
            {trip.airline} · {trip.flights.join(", ")}
          </p>
          <p className="text-small">
            {formatDuration(trip.minutes)} · {stopsText(trip.stops)}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 sm:flex-col sm:items-end">
          <p>
            <span className="font-bold">{formatPrice(trip.price)}</span> / person
          </p>
          {/* Valet läses upp av aria-pressed; "Vald" är bara för ögat */}
          <div className="flex items-center gap-3">
            {chosen && (
              <span aria-hidden="true" className="text-small font-bold">
                ✓ Vald
              </span>
            )}
            <Button
              variant={chosen ? "primary" : "secondary"}
              size="compact"
              aria-pressed={chosen}
              aria-label={`Välj ${trip.flights.join(", ")} kl ${trip.time}`}
              onClick={onChoose}
            >
              Välj
            </Button>
          </div>
        </div>
      </Card>
    </li>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  type CharterChoice,
  type CharterSearch,
  type CharterTrip,
  charterParams,
  chooseHome as chooseHomeTrip,
  chooseOutbound as chooseOutboundTrip,
  chosenTrips,
  CHARTER_PATH,
  departuresTotal,
  planUrl,
  type SortBy,
  sortTrips,
  stopsText,
  tripsAfter,
} from "@/lib/charter-rules";
import { formatDay, formatLong } from "@/lib/dates";
import { formatDuration, formatPrice } from "@/lib/format";
import { buttonClass } from "../components/Button";
import Card from "../components/Card";
import ChoiceCard from "../components/ChoiceCard";
import Detail from "../components/Detail";
import { ArrivalTime } from "../flyg/plan/FlightTime";
import SortChoice from "../flyg/SortChoice";
import Steps from "../flyg/Steps";
import CharterOverview from "./CharterOverview";
import { charterSteps } from "./steps";

// Resorna att välja bland: först utresan, sedan hemresan som går efter att
// utresan har landat, och Din resa med Fortsätt till plan och klass när båda är valda (TRIP-014-R3, R5,
// TRIP-039). Valen står i adressen, så att sidan går att ladda om och dela. En annan resa tar bort
// planet och klasserna för den resan; samma resa igen låter dem vara.
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
    const params = charterParams(search, { out: outbound?.id ?? null, back: home?.id ?? null, plans: choice.plans });
    window.history.replaceState(null, "", `${CHARTER_PATH}/${id}/resor?${params}`);
  }, [id, search, outbound, home, choice.plans]);

  const chosen = { out: outbound?.id ?? null, back: home?.id ?? null, plans: choice.plans };
  const label = (trip: CharterTrip) => `${trip.flights.join(", ")} kl ${trip.time}`;

  function chooseOutbound(trip: CharterTrip) {
    // Hemresan som inte passar den nya utresan tas bort (R5)
    setChoice(chooseOutboundTrip(choice, trip.id, out, back));
    setAnnouncement(`Utresa vald: ${label(trip)}. Välj nu hemresa.`);
  }

  function chooseHome(trip: CharterTrip) {
    setChoice(chooseHomeTrip(choice, trip.id));
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
            total={departuresTotal(prices, [], search.travellers)}
          >
            {outbound && home && (
              <Link href={planUrl(id, search, chosen)} className={`${buttonClass()} self-start`}>
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
            <TripCard key={trip.id} trip={trip} date={date} chosen={chosen?.id === trip.id} onChoose={() => onChoose(trip)} />
          ))}
        </ul>
      )}
    </section>
  );
}

// En resa i listan: tider, restid och pris på raden och Välj, resten i en utfällning (R3, TRIP-043-R1, R2)
function TripCard({
  trip,
  date,
  chosen,
  onChoose,
}: {
  trip: CharterTrip;
  date: string;
  chosen: boolean;
  onChoose: () => void;
}) {
  return (
    <li>
      <Card size="flush" className={chosen ? "border-accent-strong ring-2 ring-accent-strong" : ""}>
        <ChoiceCard
          label={`${trip.flights.join(", ")} kl ${trip.time}`}
          chosen={chosen}
          onChoose={onChoose}
          summary={
            <span className="flex flex-col gap-1">
              <span className="text-2xl font-bold">
                <span className="tabular-nums">{trip.time}</span>
                <span aria-hidden="true"> – </span>
                <span className="sr-only"> landar </span>
                <ArrivalTime {...trip.arrival} />
              </span>
              <span className="text-small">
                {formatDuration(trip.minutes)} · <span className="font-bold">{formatPrice(trip.price)}</span> / person
              </span>
            </span>
          }
        >
          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
            <Detail term="Flygbolag">{trip.airline}</Detail>
            <Detail term="Flygnummer">{trip.flights.join(", ")}</Detail>
            <Detail term="Byten">{stopsText(trip.stops)}</Detail>
            <Detail term="Datum">{formatLong(date)}</Detail>
          </dl>
        </ChoiceCard>
      </Card>
    </li>
  );
}

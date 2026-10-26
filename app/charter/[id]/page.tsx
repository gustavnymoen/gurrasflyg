import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Message from "@/app/components/Message";
import Prose from "@/app/components/Prose";
import { countryName, swedishName, TRANSPORT_NAMES } from "@/lib/destination-names";
import { listHref, NO_FLIGHTS_TEXT } from "@/lib/destinations";
import { formatPrice } from "@/lib/format";
import { getCharterDestination } from "@/lib/travel";
import DestinationTag from "../DestinationTag";

export const metadata: Metadata = {
  title: "Resmål – Gurras Flyg",
};

// Ett resmåls sida: allt om det, men ingen bokning än (TRIP-013, bokningen kommer med TRIP-014).
// Sökningen och filtren i adressen skickas bara vidare till länken tillbaka till listan.
export default function DestinationPage({ params, searchParams }: PageProps<"/charter/[id]">) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 pt-8 pb-16 md:pt-12">
      {/* Resmålet läses från databasen när sidan efterfrågas */}
      <Suspense>
        <Destination params={params} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Destination({ params, searchParams }: Pick<PageProps<"/charter/[id]">, "params" | "searchParams">) {
  const found = await getCharterDestination((await params).id);
  if (!found) notFound();
  const { destination: d, trip, statusSource } = found;
  const nearest = d.nearest_airport;

  return (
    <>
      <Link href={listHref(await searchParams)} className="self-start underline hover:text-ink-muted">
        ← Tillbaka till listan
      </Link>
      <h1 className="text-title-phone font-bold break-words">
        {d.title}, {countryName(d.country)}
      </h1>
      <p className="max-w-prose text-[17px] text-ink-muted">{d.description}</p>

      <div className="flex flex-wrap gap-2">
        <DestinationTag kind="category" value={d.category} />
        <DestinationTag kind="access" value={d.access} />
      </div>

      {d.image && (
        <figure className="flex flex-col gap-2">
          <div className="relative aspect-[16/9] overflow-hidden rounded-card-compact bg-surface-sunk">
            <Image src={d.image.src} alt={d.title} fill sizes="(min-width: 1024px) 1024px, 100vw" loading="eager" className="object-cover" />
          </div>
          <figcaption className="text-small text-ink-muted">
            Foto: {d.image.author},{" "}
            {d.image.license_url ? (
              <a href={d.image.license_url} className="underline hover:text-ink">
                {d.image.license}
              </a>
            ) : (
              d.image.license
            )}
            , <a href={d.image.source} className="underline hover:text-ink">bildens källa</a>.
          </figcaption>
        </figure>
      )}
      {/* Texten bygger på Wikipedia, också när resmålet saknar foto */}
      <p className="text-small text-ink-muted">
        Text: sammanfattad från{" "}
        <a href="https://www.wikipedia.org" className="underline hover:text-ink">
          Wikipedia
        </a>
        .
      </p>

      {trip ? (
        <p className="text-section font-bold">Från {formatPrice(trip.price)} / person</p>
      ) : (
        <Message kind="error" className="text-base">
          {NO_FLIGHTS_TEXT}
        </Message>
      )}

      <section aria-labelledby="airport" className="flex flex-col gap-2">
        <h2 id="airport" className="text-section font-bold">
          Flygplats
        </h2>
        {trip ? (
          <>
            <p>
              Du flyger till {trip.airport.name} ({trip.airport.iata}).
            </p>
            {trip.viaGateway && (
              <p className="text-ink-muted">
                Närmaste flygplats är {nearest.name} ({nearest.iata}), men dit går inga flyg från Arlanda eller
                Köpenhamn. <Distance km={nearest.distance_km} />
              </p>
            )}
            {!trip.viaGateway && (
              <p>
                <Distance km={nearest.distance_km} />
              </p>
            )}
          </>
        ) : (
          <p>
            Närmaste flygplats är {nearest.name} ({nearest.iata}). <Distance km={nearest.distance_km} />
          </p>
        )}
        <p>
          Från flygplatsen tar du dig dit med: {d.transport.map((t) => swedishName(TRANSPORT_NAMES, t)).join(", ")}.
        </p>
      </section>

      <Section title="Översikt" markdown={found.overview} />
      <Section title="Ta sig dit" markdown={found.gettingThere} />
      <Section title="Besöka" markdown={found.visiting} />

      <section aria-labelledby="facts" className="flex flex-col gap-2">
        <h2 id="facts" className="text-section font-bold">
          Fakta
        </h2>
        <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-1 [&>dd]:break-words">
          <dt className="text-ink-muted">Region</dt>
          <dd>{d.region}</dd>
          <dt className="text-ink-muted">Plats</dt>
          <dd>{d.locality}</dd>
          {d.aliases.length > 0 && (
            <>
              <dt className="text-ink-muted">Även kallad</dt>
              <dd>{d.aliases.join(", ")}</dd>
            </>
          )}
          <dt className="text-ink-muted">Taggar</dt>
          <dd>{d.tags.join(", ")}</dd>
          {d.status_checked && (
            <>
              <dt className="text-ink-muted">Kontrollerad</dt>
              <dd>
                {d.status_checked}
                {statusSource && (
                  <>
                    , källa: <Source source={statusSource} />
                  </>
                )}
              </dd>
            </>
          )}
        </dl>
      </section>

      <p className="max-w-prose text-small text-ink-muted">
        Texterna är på engelska. Texterna är hämtade från vår samarbetspartner Gurras charter AB och är jobbiga att
        översätta.
      </p>
    </>
  );
}

// Källan är oftast en webbadress: bara en riktig https-adress blir en länk
function Source({ source }: { source: string }) {
  return /^https?:\/\//.test(source) ? (
    <a href={source} className="underline hover:text-ink">
      {source}
    </a>
  ) : (
    <>{source}</>
  );
}

function Distance({ km }: { km: number | null }) {
  return km === null ? <>Nås bara med lång båtresa.</> : <>{km} km från destinationen.</>;
}

function Section({ title, markdown }: { title: string; markdown: string }) {
  const id = `section-${title}`;
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="text-section font-bold">
        {title}
      </h2>
      <Prose markdown={markdown} />
    </section>
  );
}

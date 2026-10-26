import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/app/components/Button";
import Card from "@/app/components/Card";
import { countryName } from "@/lib/destination-names";
import { NO_FLIGHTS_TEXT, type DestinationCard as DestinationCardData } from "@/lib/destinations";
import { formatPrice } from "@/lib/format";
import DestinationTag from "./DestinationTag";

// Ett resmål i en lista: foto, namn, första meningen, taggar och "från"-pris,
// med en knapp till resmålets sida (TRIP-013-R5). href bär med sig sökningen
// och filtren, så att sidan kan länka tillbaka till samma lista.
export default function DestinationCard({
  destination: d,
  href,
  eager = false,
}: {
  destination: DestinationCardData;
  href: string;
  eager?: boolean;
}) {
  return (
    <Card size="flush" className="flex min-w-0 flex-col overflow-hidden">
      {/* Utan foto tar en enkel yta fotots plats */}
      <div className="relative aspect-[3/2] bg-surface-sunk">
        {d.photo && (
          // Fotot är dekoration här: namnet står bredvid
          <Image
            src={d.photo}
            alt=""
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw"
            loading={eager ? "eager" : "lazy"}
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-lg leading-tight font-bold break-words">
          {d.title}, {countryName(d.country)}
        </h3>
        <p className="text-ink-muted">{d.summary}</p>
        <div className="flex flex-wrap gap-2">
          <DestinationTag kind="category" value={d.category} />
          <DestinationTag kind="access" value={d.access} />
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
          {d.price === null ? (
            <p className="text-small font-medium text-danger">{NO_FLIGHTS_TEXT}</p>
          ) : (
            <p className="font-bold">Från {formatPrice(d.price)} / person</p>
          )}
          <Link href={href} aria-label={`Visa ${d.title}`} className={buttonClass("secondary", "compact")}>
            Visa
          </Link>
        </div>
      </div>
    </Card>
  );
}

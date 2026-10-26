import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/app/components/Button";
import Card from "@/app/components/Card";
import { countryName } from "@/lib/destination-names";
import { NO_FLIGHTS_TEXT, type DestinationCard as DestinationCardData } from "@/lib/destinations";
import { formatPrice } from "@/lib/format";
import DestinationTag from "./DestinationTag";

// Ett resmål i en lista: foto, namn, första meningen, taggar och "från"-pris,
// och ett helt klickbart kort till resmålets sida (TRIP-028-R2). href bär med
// sig sökningen och filtren, så att sidan kan länka tillbaka till samma lista.
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
    <Card
      size="flush"
      className="relative flex min-w-0 flex-col overflow-hidden has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-accent-strong"
    >
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
          {/* Länken sträcks över hela kortet (after:, kortet är relative), så att en enda länk räcker för skärmläsare */}
          <Link href={href} className="outline-none after:absolute after:inset-0">
            {d.title}, {countryName(d.country)}
          </Link>
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
          {/* Bara utseendet: kortets länk gör jobbet */}
          <span aria-hidden="true" className={buttonClass("secondary", "compact")}>
            Visa
          </span>
        </div>
      </div>
    </Card>
  );
}

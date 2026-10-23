import "server-only";
import { connection } from "next/server";
import { all } from "./db";

// Kursens resmål (charter), i samma form som data/destinations.json
export type Destination = {
  id: string;
  title: string;
  aliases: string[];
  description: string;
  continent: string;
  country: string;
  country_name: string;
  region: string;
  locality: string;
  category: string;
  access: string;
  nearest_airport: { iata: string; name: string; distance_km: number | null };
  gateway_airport: { iata: string; name: string } | null;
  transport: string[];
  tags: string[];
  status_checked: string | null;
  image: { src: string; author: string; license: string; license_url: string | null; source: string } | null;
  path: string;
};

type DestinationRow = Omit<Destination, "aliases" | "nearest_airport" | "gateway_airport" | "transport" | "tags" | "image"> & {
  nearest_iata: string;
  nearest_name: string;
  nearest_distance_km: number | null;
  gateway_iata: string | null;
  gateway_name: string | null;
};
type ListRow = { destination_id: string; value: string };
type PhotoRow = NonNullable<Destination["image"]> & { destination_id: string };

// Ett resmåls lista (alias, taggar eller transport) i den ordning den har i kursdatan.
// Tabell och kolumn kommer bara från anropen här i filen, aldrig från en besökare.
const listQuery = (table: string, column: string) =>
  all<ListRow>(`SELECT destination_id, ${column} AS value FROM ${table} ORDER BY destination_id, position`); // nosemgrep

// Alla resmål, sorterade på id
export async function getDestinations(): Promise<Destination[]> {
  // Läs från databasen när någon frågar, inte en gång vid bygget
  await connection();
  const [rows, aliases, tags, transport, photos] = await Promise.all([
    all<DestinationRow>(
      `SELECT d.id, d.title, d.description, d.continent, d.country, d.country_name, d.region, d.locality,
              d.category, d.access, d.status_checked, d.path,
              n.iata AS nearest_iata, n.name AS nearest_name, d.nearest_distance_km,
              g.iata AS gateway_iata, g.name AS gateway_name
       FROM destinations d
       JOIN charter_airports n ON n.iata = d.nearest_airport
       LEFT JOIN charter_airports g ON g.iata = d.gateway_airport
       ORDER BY d.id`,
    ),
    listQuery("destination_aliases", "alias"),
    listQuery("destination_tags", "tag"),
    listQuery("destination_transport", "transport"),
    all<PhotoRow>("SELECT destination_id, src, author, license, license_url, source FROM destination_photos"),
  ]);

  const values = (list: ListRow[]) => {
    const byDestination = Map.groupBy(list, (row) => row.destination_id);
    return (id: string) => byDestination.get(id)?.map((row) => row.value) ?? [];
  };
  const [aliasesOf, tagsOf, transportOf] = [values(aliases), values(tags), values(transport)];
  const photoOf = new Map(photos.map(({ destination_id, ...image }) => [destination_id, image]));

  // Samma fält och ordning som i data/destinations.json
  return rows.map((d) => ({
    id: d.id,
    title: d.title,
    aliases: aliasesOf(d.id),
    description: d.description,
    continent: d.continent,
    country: d.country,
    country_name: d.country_name,
    region: d.region,
    locality: d.locality,
    category: d.category,
    access: d.access,
    nearest_airport: { iata: d.nearest_iata, name: d.nearest_name, distance_km: d.nearest_distance_km },
    gateway_airport: d.gateway_iata && d.gateway_name ? { iata: d.gateway_iata, name: d.gateway_name } : null,
    transport: transportOf(d.id),
    tags: tagsOf(d.id),
    status_checked: d.status_checked,
    image: photoOf.get(d.id) ?? null,
    path: d.path,
  }));
}

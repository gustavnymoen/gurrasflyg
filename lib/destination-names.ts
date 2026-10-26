// Svenska namn på kursens världsdelar, kategorier, tillträden och sätt att ta
// sig dit (TRIP-013-R4). Kursdatan är engelsk och får inte ändras, så namnen
// definieras här, en gång. Ett nytt värde i databasen utan namn här fångas av
// ett enhetstest (lib/destination-names.test.ts).

export const CONTINENT_NAMES: Record<string, string> = {
  Africa: "Afrika",
  Antarctica: "Antarktis",
  Asia: "Asien",
  Europe: "Europa",
  "North America": "Nordamerika",
  Oceania: "Oceanien",
  "South America": "Sydamerika",
};

export const CATEGORY_NAMES: Record<string, string> = {
  "Abandoned public building": "Övergiven offentlig byggnad",
  "Abandoned resort or hotel": "Övergiven semesterort eller hotell",
  "Amusement park or Olympic site": "Nöjespark eller olympisk anläggning",
  "Castle or mansion": "Slott eller herrgård",
  "Disused railway": "Nedlagd järnväg",
  "Ghost town or village": "Spökstad eller spökby",
  "Hospital or sanatorium": "Sjukhus eller sanatorium",
  "Industrial site": "Industriplats",
  "Military or Cold War site": "Militärt eller kalla kriget",
  "Monument or memorial": "Monument eller minnesmärke",
  Prison: "Fängelse",
  Underground: "Underjordiskt",
  "Wreck or film set": "Vrak eller filmkuliss",
};

export const ACCESS_NAMES: Record<string, string> = {
  Closed: "Stängd",
  "Exterior only": "Bara utsidan",
  "Guided tour": "Guidad tur",
  Open: "Öppen",
  "Open on set days": "Öppen vissa dagar",
};

export const TRANSPORT_NAMES: Record<string, string> = {
  "4x4 tour": "Terrängbilstur",
  "boat tour": "Båttur",
  bus: "Buss",
  "cable car": "Linbana",
  car: "Bil",
  cruise: "Kryssning",
  ferry: "Färja",
  metro: "Tunnelbana",
  plane: "Flyg",
  snowmobile: "Snöskoter",
  taxi: "Taxi",
  train: "Tåg",
  tram: "Spårvagn",
  walk: "Promenad",
};

// Landets namn på svenska från landskoden, t.ex. DE -> "Tyskland"
const regionNames = new Intl.DisplayNames("sv", { type: "region" });
export const countryName = (code: string) => regionNames.of(code) ?? code;

// Namnet på svenska; ett värde utan namn visas som det är
export const swedishName = (names: Record<string, string>, value: string) => names[value] ?? value;

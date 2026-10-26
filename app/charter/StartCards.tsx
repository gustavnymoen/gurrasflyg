"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/app/components/Button";
import Card from "@/app/components/Card";
import { CONTINENT_WITHOUT_COUNTRIES, continentChoices, countriesIn, topCategories, type DestinationCard } from "@/lib/destinations";
import { swedishName, CONTINENT_NAMES } from "@/lib/destination-names";

type Choice = { value: string; name: string; count: number };

// Två sätt att börja innan något är sökt eller filtrerat (TRIP-013-R3):
// Plats, i två steg (världsdel, sedan land), och Aktivitet (kategori).
export default function StartCards({
  cards,
  onContinent,
  onCountry,
  onCategory,
}: {
  cards: DestinationCard[];
  // Antarktis har inga länder att välja: dess resmål listas direkt
  onContinent: (continent: string) => void;
  onCountry: (continent: string, country: string) => void;
  onCategory: (category: string) => void;
}) {
  const [continent, setContinent] = useState<string | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  // Fokus följer med till stegets rubrik, eftersom knappen som valdes försvinner
  useEffect(() => {
    if (continent !== null) heading.current?.focus();
  }, [continent]);

  function chooseContinent(value: string) {
    if (value === CONTINENT_WITHOUT_COUNTRIES) onContinent(value);
    else setContinent(value);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card size="compact" labelledBy="start-place" className="flex flex-col content-start gap-3">
        <h2 id="start-place" ref={heading} tabIndex={-1} className="text-lg font-bold outline-none">
          {continent === null ? "Plats" : `Plats: ${swedishName(CONTINENT_NAMES, continent)}`}
        </h2>
        {continent === null ? (
          <Choices choices={continentChoices(cards)} onChoose={chooseContinent} />
        ) : (
          <>
            <Choices choices={countriesIn(cards, continent)} onChoose={(country) => onCountry(continent, country)} />
            <Button variant="quiet" size="compact" onClick={() => setContinent(null)} className="self-start">
              Tillbaka till världsdelarna
            </Button>
          </>
        )}
      </Card>
      <Card size="compact" labelledBy="start-activity" className="flex flex-col gap-3">
        <h2 id="start-activity" className="text-lg font-bold">
          Aktivitet
        </h2>
        <Choices choices={topCategories(cards)} onChoose={onCategory} />
      </Card>
    </div>
  );
}

// Valen i ett rutnät med lika stora knappar: namnet till vänster och antalet till
// höger, så att kolumnerna linjerar mellan korten
function Choices({ choices, onChoose }: { choices: Choice[]; onChoose: (value: string) => void }) {
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {choices.map((choice) => (
        <li key={choice.value} className="flex">
          <Button
            variant="secondary"
            size="compact"
            onClick={() => onChoose(choice.value)}
            className="h-auto min-h-8.5 w-full justify-between gap-3 py-1.5 text-left"
          >
            <span>{choice.name}</span>
            {/* Mellanslaget ger knappen namnet "Europa (47)" */}{" "}
            <span className="tabular-nums text-ink-muted">({choice.count})</span>
          </Button>
        </li>
      ))}
    </ul>
  );
}

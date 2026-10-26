"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import Autocomplete from "@/app/components/Autocomplete";
import Button from "@/app/components/Button";
import Field, { fieldInputClass } from "@/app/components/Field";
import {
  applyFilters,
  filterOptions,
  filtersToParams,
  hasFilters,
  NO_FILTERS,
  parseFilters,
  type DestinationCard as DestinationCardData,
  type FilterKey,
  type Filters,
} from "@/lib/destinations";
import DestinationCard from "./DestinationCard";
import StartCards from "./StartCards";

type Suggestion = { id: string; name: string; detail: string };

const FILTER_LABELS: Record<FilterKey, string> = {
  continent: "Världsdel",
  country: "Land",
  access: "Tillträde",
  category: "Kategori",
};

// Sidan /charter: fritextsökning, filter och startkort över resmålen (TRIP-013).
// Sökningen och filtren står i adressen (lib/destinations.ts) och resmålen
// filtreras här i webbläsaren, så att varje val svarar direkt.
export default function DestinationBrowser({ cards }: { cards: DestinationCardData[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams, cards), [searchParams, cards]);
  const results = useMemo(() => applyFilters(cards, filters), [cards, filters]);
  const active = hasFilters(filters);

  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const searchBox = useRef<HTMLDivElement>(null);
  // Sant när sökfältet byggs om för en ny söktext och ska få tillbaka fokus
  const refocusSearch = useRef(false);
  // Söktexten byggs om när adressen ändras (Back, Rensa), men inte medan besökaren skriver
  useEffect(() => {
    if (!refocusSearch.current) return;
    refocusSearch.current = false;
    searchBox.current?.querySelector("input")?.focus();
  }, [filters.q]);

  // Nytt läge i adressen, utan att ladda om sidan. Fokus hamnar kvar eller flyttas
  // till rubriken över resultaten, eftersom knappen som valdes kan försvinna.
  function go(next: Filters, focus: "results" | "search" | null = null) {
    const query = filtersToParams(next).toString();
    window.history.pushState(null, "", query ? `/charter?${query}` : "/charter");
    if (focus === "results") resultsHeading.current?.focus();
    if (focus === "search") {
      if (next.q !== filters.q) refocusSearch.current = true;
      else searchBox.current?.querySelector("input")?.focus();
    }
  }

  function search(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("sok") ?? "").trim();
    go({ ...filters, q }, "search");
  }

  const listQuery = filtersToParams(filters).toString();
  const countText = `${results.length} ${results.length === 1 ? "destination" : "destinationer"}`;

  return (
    <>
      <form role="search" onSubmit={search} className="flex flex-col gap-3 md:flex-row md:items-start">
        <div ref={searchBox} className="md:flex-1">
          <Field label="Sök resmål" htmlFor="charter-search">
            {/* Ny söktext i adressen bygger om fältet: det visar alltid det som söks */}
            <Autocomplete<Suggestion>
              key={filters.q}
              id="charter-search"
              name="sok"
              enterSearches
              placeholder="Plats, land, namn eller tagg"
              className={fieldInputClass}
              searchUrl="/api/destination-search"
              label={(s) => s.name}
              detail={(s) => s.detail}
              emptyText="Inga destinationer matchar"
              initial={filters.q ? { id: "", name: filters.q, detail: "" } : undefined}
              onSelect={(suggestion) => {
                // Ett valt förslag öppnar resmålets sida; filtren följer med för länken tillbaka till listan
                if (suggestion) router.push(`/charter/${suggestion.id}${listQuery ? `?${listQuery}` : ""}`);
              }}
            />
          </Field>
        </div>
        <Button type="submit" className="md:h-14.5 md:px-6">
          Sök
        </Button>
      </form>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {(Object.keys(FILTER_LABELS) as FilterKey[]).map((key) => (
          <Field key={key} label={FILTER_LABELS[key]} htmlFor={`filter-${key}`}>
            <select
              id={`filter-${key}`}
              value={filters[key] ?? ""}
              onChange={(e) =>
                // Ett annat land hör inte till en ny världsdel: landet väljs om
                go({ ...filters, [key]: e.target.value || null, ...(key === "continent" && { country: null }) })
              }
              className={fieldInputClass}
            >
              <option value="">Alla</option>
              {filterOptions(cards, filters, key).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name} ({option.count})
                </option>
              ))}
            </select>
          </Field>
        ))}
      </div>

      {!active && (
        <StartCards
          cards={cards}
          onContinent={(continent) => go({ ...NO_FILTERS, continent }, "results")}
          onCountry={(continent, country) => go({ ...NO_FILTERS, continent, country }, "results")}
          onCategory={(category) => go({ ...NO_FILTERS, category }, "results")}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 ref={resultsHeading} tabIndex={-1} className="text-section font-bold outline-none">
          {countText}
        </h2>
        {active && (
          <Button variant="secondary" size="compact" onClick={() => go(NO_FILTERS, "search")}>
            Rensa
          </Button>
        )}
      </div>
      {/* Läses upp när antalet ändras */}
      <p role="status" className="sr-only">
        {active ? `${countText} matchar` : ""}
      </p>

      {results.length === 0 ? (
        <div className="flex flex-col items-start gap-3">
          <p>Inga destinationer matchar. Rensa sökningen eller filtren för att se alla.</p>
          <Button onClick={() => go(NO_FILTERS, "search")}>Rensa sökning och filter</Button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((destination, i) => (
            <li key={destination.id} className="flex min-w-0 [&>section]:w-full">
              <DestinationCard
                destination={destination}
                href={`/charter/${destination.id}${listQuery ? `?${listQuery}` : ""}`}
                eager={i < 3}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

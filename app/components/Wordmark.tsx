"use client";

import { useState } from "react";
import { StartLink } from "./AbortFlow";

// Ordmärket i sidhuvudet: planet i en mässingsring följt av namnet, länk till
// startsidan (i ett flöde frågar den först om besökaren vill avbryta,
// TRIP-018-R3). Planet lyfter in i ringen när sidan laddas och hoppar till när
// pekaren är över. Animationerna finns i globals.css och körs bara om
// besökaren inte valt mindre rörelse (motion-safe).
export default function Wordmark() {
  // Startanimationen tas bort när den har spelats klart. Annars ligger den
  // kvar i document.getAnimations(), och sidan ser aldrig ut att stå still.
  const [landed, setLanded] = useState(false);
  const takeoff = landed ? "" : "motion-safe:animate-takeoff";
  const trail = landed ? "" : "motion-safe:animate-trail";

  return (
    <StartLink
      className="group inline-flex items-center gap-3.5 font-display text-[22px] leading-none font-bold tracking-[-0.02em] md:text-[27px]"
    >
      <span className="relative grid h-9.5 w-9.5 shrink-0 place-items-center overflow-hidden rounded-full border-[1.5px] border-brass md:h-11.5 md:w-11.5">
        {/* Kondensstrimman bakom planet, syns bara under starten */}
        <span
          aria-hidden="true"
          className={`absolute bottom-2.25 left-1 h-[1.5px] w-4.5 origin-right bg-brass opacity-0 ${trail}`}
        />
        {/* Hoppet och starten ligger på olika element, så att starten inte
            spelas om när pekaren lämnar ordmärket */}
        <span className="block motion-safe:group-hover:animate-hop">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            onAnimationEnd={(e) => e.animationName === "takeoff" && setLanded(true)}
            className={`block h-5.5 w-5.5 fill-brass ${takeoff}`}
          >
            <path
              transform="rotate(45 12 12)"
              d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"
            />
          </svg>
        </span>
      </span>
      Gurras Flyg
    </StartLink>
  );
}

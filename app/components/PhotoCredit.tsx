"use client";

import { usePathname } from "next/navigation";

// Fotot bakom startsidan (CC BY-SA 2.0) ska anges med fotograf och licens.
// Sidfoten är gemensam för alla sidor, så krediten visas bara på startsidan.
export default function PhotoCredit() {
  if (usePathname() !== "/") return null;
  return (
    <p>
      Foto: Bill Abbott,{" "}
      <a href="https://creativecommons.org/licenses/by-sa/2.0" className="underline hover:text-ink">
        CC BY-SA 2.0
      </a>
      , via{" "}
      <a
        href="https://commons.wikimedia.org/wiki/File:Boeing_757_climbing_after_the_sunset._Beautiful_sky._Stars!_(7256174454).jpg"
        className="underline hover:text-ink"
      >
        Wikimedia Commons
      </a>
    </p>
  );
}

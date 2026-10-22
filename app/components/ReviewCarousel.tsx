"use client";

// Karusell med omdömen: ett kort i fokus i mitten, de andra mindre och
// nedtonade bakom. Pilarna sitter på mittkortets kant. När man bläddrar
// glider alla kort ett steg (CSS-transition på transform), så nästa kort
// hamnar i fokus längst fram. Karusellen går runt: efter sista kommer första.

import { useRef, useState } from "react";
import type { Review } from "@/lib/reviews";
import RoundButton from "./RoundButton";
import Stars from "./Stars";

// Utseende per position: 0 = mitten, 1 = närmast bredvid, 2 = längre bort
const LOOK = [
  { scale: 1, shift: 0, opacity: 1 },
  { scale: 0.78, shift: 62, opacity: 0.45 },
  { scale: 0.6, shift: 108, opacity: 0.15 },
];

export default function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const [active, setActive] = useState(0);
  const swipeStart = useRef<number | null>(null);
  // Ett svep som slutar på ett sidokort ska inte också räknas som klick på det
  const swiped = useRef(false);
  const count = reviews.length;

  if (count === 0) return null;

  const go = (step: number) => setActive((a) => (a + step + count) % count);

  // Kortets position i förhållande till mittkortet, t.ex. -1 = till vänster.
  // Räknas runt, så att första kortet ligger till höger om det sista.
  function offsetOf(index: number) {
    let d = (((index - active) % count) + count) % count;
    if (d > count / 2) d -= count;
    return d;
  }

  return (
    <div
      role="region"
      aria-roledescription="karusell"
      aria-label="Omdömen"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      // Svep på mobil
      onPointerDown={(e) => {
        swipeStart.current = e.clientX;
        swiped.current = false;
      }}
      onPointerUp={(e) => {
        if (swipeStart.current === null) return;
        const dx = e.clientX - swipeStart.current;
        swipeStart.current = null;
        if (Math.abs(dx) > 40) {
          swiped.current = true;
          go(dx < 0 ? 1 : -1);
        }
      }}
      className="relative mx-auto h-60 w-full touch-pan-y overflow-x-clip outline-none"
    >
      {reviews.map((review, index) => {
        const offset = offsetOf(index);
        const distance = Math.abs(offset);
        const look = LOOK[Math.min(distance, LOOK.length - 1)];
        const hidden = distance >= LOOK.length;
        const focused = offset === 0;

        return (
          <article
            key={review.id}
            aria-hidden={!focused}
            onClick={() => !focused && !swiped.current && go(offset)}
            style={{
              transform: `translateX(calc(-50% + ${Math.sign(offset) * look.shift}%)) scale(${look.scale})`,
              opacity: hidden ? 0 : look.opacity,
              zIndex: 10 - distance,
            }}
            className={`absolute left-1/2 top-2 flex h-56 w-64 flex-col gap-1.5 rounded-card border bg-surface p-4 transition-[transform,opacity,box-shadow] duration-500 ease-out motion-reduce:transition-none ${
              focused
                ? "border-accent-strong shadow-card"
                : "cursor-pointer border-edge blur-[1px] shadow-float"
            } ${hidden ? "pointer-events-none" : ""}`}
          >
            <Stars rating={review.rating} />
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{review.title}</h3>
            {/* line-clamp kortar av äldre, längre texter med "…" */}
            <p className="line-clamp-5 flex-1 text-small leading-snug text-ink-muted">{review.body}</p>
            <p className="text-xs text-brass">– {review.author}</p>
          </article>
        );
      })}

      {count > 1 && (
        <>
          <Arrow direction={-1} onClick={() => go(-1)} />
          <Arrow direction={1} onClick={() => go(1)} />
        </>
      )}
    </div>
  );
}

// Pil som ligger mitt på mittkortets vänstra/högra kant (kortet är 16rem brett, 14rem högt)
function Arrow({ direction, onClick }: { direction: 1 | -1; onClick: () => void }) {
  return (
    <div
      style={{ left: `calc(50% ${direction === 1 ? "+" : "-"} 8rem)` }}
      className="absolute top-[calc(0.5rem+7rem)] z-20 -translate-x-1/2 -translate-y-1/2"
    >
      <RoundButton
        label={direction === 1 ? "Nästa omdöme" : "Föregående omdöme"}
        onClick={onClick}
        className="bg-surface"
      >
        {direction === 1 ? "›" : "‹"}
      </RoundButton>
    </div>
  );
}

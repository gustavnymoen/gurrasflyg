"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { MY_BOOKING_PATH } from "@/lib/cancel-rules";
import { FlowLink } from "./AbortFlow";
import { floatClass } from "./Card";
import { MenuIcon } from "./icons";

const ITEMS = [
  { to: "/", label: "Start" },
  { to: MY_BOOKING_PATH, label: "Min bokning" },
  { to: "/admin", label: "Admin" },
];

// Menyknappen i sidhuvudet (TRIP-023-R1): en lista med Start, Min bokning och Admin.
// Escape och klick utanför stänger den, och fokus går då tillbaka till knappen.
// Länkarna frågar först i ett flöde, som ordmärket (FlowLink).
export default function Menu() {
  // Menyn är öppen på den sida där den öppnades: byter sidan stängs den av sig själv
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const button = useRef<HTMLButtonElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const listId = useId();

  function close() {
    setOpenOn(null);
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (wrapper.current?.contains(e.target as Node)) return;
      close();
      // Ett klick på något annat som går att fokusera behåller sitt fokus
      requestAnimationFrame(() => document.activeElement === document.body && button.current?.focus());
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div
      ref={wrapper}
      className="relative"
      onKeyDown={(e) => {
        // Escape i frågan "Är du säker?" stänger bara frågan
        if (e.key !== "Escape" || (e.target as Element).closest("dialog")) return;
        close();
        button.current?.focus();
      }}
    >
      <button
        ref={button}
        type="button"
        aria-label="Meny"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => setOpenOn(open ? null : pathname)}
        className="grid h-9.5 w-9.5 cursor-pointer place-items-center rounded-pill border-[1.5px] border-line-strong transition-colors hover:border-accent-strong md:h-11.5 md:w-11.5"
      >
        <MenuIcon />
      </button>
      {open && (
        <nav id={listId} aria-label="Meny" className={`${floatClass} absolute top-full right-0 z-20 mt-2 w-48 rounded-card-compact p-2`}>
          <ul className="flex flex-col">
            {ITEMS.map((item) => (
              <li key={item.to}>
                <FlowLink
                  to={item.to}
                  onNavigate={close}
                  className="block w-full rounded-field px-3 py-2 text-left hover:bg-accent/25"
                >
                  {item.label}
                </FlowLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

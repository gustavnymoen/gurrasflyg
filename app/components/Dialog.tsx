"use client";

import { useEffect, useId, useRef } from "react";
import { floatingCardClass } from "./Card";

// Dialogruta som svävar ovanpå sidan. Webbläsarens egen <dialog> med
// showModal(): sidan bakom går inte att nå med Tab och Escape stänger
// (WCAG 2.1.2). När dialogen stängs får knappen som öppnade den fokus igen
// (WCAG 2.4.3), och Tab går runt bland knapparna. Klick utanför rutan
// stänger också. Själva <dialog> är det svävande kortet.
// role: alertdialog för en varning, t.ex. att ta bort en rad, och dialog för
// en vanlig fråga, t.ex. att avbryta resan (TRIP-018-R4).
export default function Dialog({
  title,
  detail,
  role = "alertdialog",
  onClose,
  children,
}: {
  title: string;
  detail?: string;
  role?: "dialog" | "alertdialog";
  onClose: () => void;
  children: React.ReactNode; // knapparna
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current!;
    const opener = document.activeElement as HTMLElement | null;
    dialog.showModal();
    // Reacts autoFocus körs medan dialogen ännu är stängd, så knappen som ska
    // ha fokus först märks med data-autofocus och får fokus här
    dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    // Webbläsaren lämnar inte tillbaka fokus själv: när den här städningen körs
    // har React redan tagit bort dialogen från sidan
    return () => {
      dialog.close();
      opener?.focus();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      role={role}
      aria-modal="true"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={(e) => {
        // Fokus går runt bland knapparna i stället för ut ur sidan till
        // webbläsarens egna fält (WCAG 2.4.3)
        if (e.key !== "Tab") return;
        const buttons = [...e.currentTarget.querySelectorAll<HTMLElement>("button:not(:disabled)")];
        const edge = buttons[e.shiftKey ? 0 : buttons.length - 1];
        if (document.activeElement !== edge) return;
        e.preventDefault();
        buttons[e.shiftKey ? buttons.length - 1 : 0].focus();
      }}
      onClick={(e) => {
        // Klick på bakgrunden landar på själva <dialog>, utanför rutan. Klick på
        // knapparna (också med Enter, som ger ett klick i punkten 0, 0) räknas inte.
        if (e.target !== e.currentTarget) return;
        const box = e.currentTarget.getBoundingClientRect();
        const outside =
          e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom;
        if (outside) onClose();
      }}
      className={`${floatingCardClass} m-auto w-[calc(100%-2rem)] max-w-sm text-center text-ink backdrop:bg-ground/80`}
    >
      <h2 id={titleId} className="text-lg font-semibold">
        {title}
      </h2>
      {detail && <p className="mt-2 text-sm text-ink-muted">{detail}</p>}
      <div className="mt-6 flex justify-center gap-3">{children}</div>
    </dialog>
  );
}

"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { bookableRange, formatShort, readDate, returnRange, toDateString } from "@/lib/dates";
import Calendar, { clampMonth, monthOf, monthShowing } from "./Calendar";
import { FieldBox, fieldInputClass } from "./Field";
import Message from "./Message";

// Valda datum som "YYYY-MM-DD". Utan tur och retur är hemresan alltid null.
export type TripDates = { outbound: string | null; return: string | null; roundTrip: boolean };

type Leg = "outbound" | "return";

const LABELS: Record<Leg, string> = { outbound: "Utresa", return: "Hemresa" };
const CALENDAR_ID = "date-calendar";
const NO_TRIP_ERROR = "Det går ingen resa den dagen.";

// Två månader bredvid varandra från Tailwinds lg (64rem), annars en.
// Klasserna placerar kalendern: under fälten, på mobil i formulärets bredd.
const WIDE = "(min-width: 64rem)";
const PLACEMENT = { one: "inset-x-0 md:right-auto md:w-80", two: "lg:right-0 lg:left-auto lg:w-[38rem]" };

// Dagens datum läses bara när besökaren gör något eller kalendern är öppen,
// alltså i webbläsaren, så att det blir besökarens idag och inte serverns
const todayString = () => toDateString(new Date());

// Datumgruppen i sökformuläret: fälten Utresa och Hemresa, som går att skriva
// i, och kalendern som öppnas under dem (TRIP-009). missing är meddelanden för
// datum som saknas när besökaren trycker Sök (TRIP-010-R1); ett eget fel går före.
export default function DatePicker({
  value,
  onChange,
  missing = {},
  className = "",
  runs,
}: {
  value: TripDates;
  onChange: (value: TripDates) => void;
  missing?: Partial<Record<Leg, string | null>>;
  className?: string;
  // Charter (TRIP-014-R2): resan är alltid tur och retur, och bara dagar då en resa går går att
  // välja eller skriva in. Utan runs gäller flygbokningens regler.
  runs?: (leg: Leg, day: string) => boolean;
}) {
  const [open, setOpen] = useState(false);
  // Fältet kalendern väljer för
  const [active, setActive] = useState<Leg>("outbound");
  // Texten i fälten: det besökaren skrivit, eller det valda datumet som "13/11"
  const [texts, setTexts] = useState<Record<Leg, string>>(() => ({
    outbound: value.outbound ? formatShort(value.outbound) : "",
    return: value.return ? formatShort(value.return) : "",
  }));
  const [errors, setErrors] = useState<Record<Leg, string | null>>({ outbound: null, return: null });
  // Första månaden kalendern visar, och dagen som har fokus i den
  const [month, setMonth] = useState("");
  const [focusedDay, setFocusedDay] = useState<string | null>(null);
  // Enkel resa har bara ett datum att välja, och visar en månad (R3)
  const count = useMediaQuery(WIDE) && value.roundTrip ? 2 : 1;

  const wrapper = useRef<HTMLDivElement>(null);
  const outboundInput = useRef<HTMLInputElement>(null);
  const returnInput = useRef<HTMLInputElement>(null);
  const inputFor = (leg: Leg) => (leg === "outbound" ? outboundInput : returnInput).current;
  // Fokus som ska flyttas när sidan ritats om: till ett fält, eller till dagen i focusedDay
  const pendingFocus = useRef<Leg | "day" | null>(null);
  // När koden flyttar fokus till ett fält ska kalendern inte öppnas av det.
  // Flaggan sätts bara när fokus verkligen flyttas, så att fältets onFocus
  // alltid nollställer den; annars skulle nästa riktiga fokus inte öppna kalendern.
  const quietFocus = useRef(false);

  useEffect(() => {
    const target = pendingFocus.current;
    pendingFocus.current = null;
    if (!target) return;
    const element =
      target === "day" ? wrapper.current?.querySelector<HTMLElement>('[data-day][tabindex="0"]') : inputFor(target);
    if (!element || element === document.activeElement) return;
    if (target !== "day") quietFocus.current = true;
    element.focus();
  });

  function openFor(leg: Leg) {
    setActive(leg);
    if (open) return;
    setOpen(true);
    setMonth(monthOf(value[leg] ?? todayString()));
    setFocusedDay(null);
  }

  // Stänger kalendern. Med ett fält får det fokus, t.ex. efter Escape i kalendern.
  function close(focusLeg?: Leg) {
    setOpen(false);
    if (focusLeg) pendingFocus.current = focusLeg;
  }

  // Sätter ett fälts datum. Passar hemresan inte längre efter en ny utresa tas den bort (R7).
  function setDate(leg: Leg, day: string) {
    if (leg === "outbound") {
      const fits = returnRange(day, bookableRange(new Date()));
      const keepReturn = value.return === null || (value.return >= fits.min && value.return <= fits.max);
      onChange({ ...value, outbound: day, return: keepReturn ? value.return : null });
      setTexts((t) => ({ outbound: formatShort(day), return: keepReturn ? t.return : "" }));
    } else {
      onChange({ ...value, return: day });
      setTexts((t) => ({ ...t, return: formatShort(day) }));
    }
    setErrors((e) => ({ ...e, [leg]: null }));
  }

  // En dag vald i kalendern, eller ett inskrivet datum med Enter (R6)
  function choose(leg: Leg, day: string) {
    setDate(leg, day);
    if (leg === "outbound" && value.roundTrip) {
      setActive("return");
      pendingFocus.current = "return";
    } else {
      close(leg);
    }
  }

  // Läser det inskrivna när besökaren trycker Enter eller lämnar fältet (R8, R9)
  function commit(leg: Leg, viaEnter: boolean) {
    const chosen = value[leg];
    // Oförändrad text: Enter går vidare som ett klick på dagen, att lämna fältet gör inget
    if (chosen && texts[leg] === formatShort(chosen)) {
      if (viaEnter) choose(leg, chosen);
      return;
    }
    const outbound = leg === "return" ? (value.outbound ?? undefined) : undefined;
    const read = readDate(texts[leg], new Date(), outbound);
    const { date } = read;
    const error = read.error ?? (date && runs && !runs(leg, date) ? NO_TRIP_ERROR : null);
    if (!date || error) {
      if (chosen) onChange({ ...value, [leg]: null });
      setErrors((e) => ({ ...e, [leg]: error }));
      return;
    }
    setMonth(monthOf(date));
    if (viaEnter) choose(leg, date);
    else setDate(leg, date);
  }

  function handleFocus(leg: Leg) {
    if (quietFocus.current) {
      quietFocus.current = false;
      setActive(leg);
    } else {
      openFor(leg);
    }
  }

  function handleKeyDown(leg: Leg, e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault(); // skickar inte formuläret
      commit(leg, true);
    } else if (e.key === "ArrowDown") {
      // Ned i kalendern, till fältets datum eller idag (R2)
      e.preventDefault();
      const day = value[leg] ?? todayString();
      setActive(leg);
      setOpen(true);
      setMonth(monthOf(day));
      setFocusedDay(day);
      pendingFocus.current = "day";
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      close();
    }
  }

  function handleTextChange(leg: Leg, text: string) {
    setTexts((t) => ({ ...t, [leg]: text }));
    // Ett tömt fält har inget datum och inget fel (R9)
    if (text === "") {
      if (value[leg]) onChange({ ...value, [leg]: null });
      setErrors((e) => ({ ...e, [leg]: null }));
    }
  }

  function setRoundTrip(on: boolean) {
    onChange({ ...value, roundTrip: on, return: null });
    setTexts((t) => ({ ...t, return: "" }));
    setErrors((e) => ({ ...e, return: null }));
    if (!on) {
      setActive("outbound");
      pendingFocus.current = "outbound";
    }
  }

  // Bara när kalendern är öppen, alltså i webbläsaren (se todayString)
  const range = open ? bookableRange(new Date()) : null;
  const shownMonth = range ? clampMonth(month, range, count) : "";

  function focusDay(day: string, move: boolean) {
    setFocusedDay(day);
    if (!move) return;
    setMonth(monthShowing(day, shownMonth, count));
    pendingFocus.current = "day";
  }

  const legs: Leg[] = value.roundTrip ? ["outbound", "return"] : ["outbound"];
  // Felet som visas för ett fält: det inskrivna först, annars att datumet saknas
  const shownError = (leg: Leg) => errors[leg] ?? missing[leg] ?? null;

  return (
    <div
      ref={wrapper}
      // Kalendern stängs när fokus lämnar fälten och kalendern (R11)
      onBlur={(e) => {
        if (!wrapper.current?.contains(e.relatedTarget)) setOpen(false);
      }}
      className={className}
    >
      <div className="relative">
        <fieldset className="flex gap-2">
          <legend className="sr-only">Datum</legend>
          {legs.map((leg) => (
            <FieldBox
              key={leg}
              label={LABELS[leg]}
              htmlFor={leg}
              invalid={shownError(leg) !== null}
              active={open && active === leg}
              className="min-w-0 flex-1"
            >
              <input
                ref={leg === "outbound" ? outboundInput : returnInput}
                id={leg}
                type="text"
                role="combobox"
                aria-haspopup="dialog"
                aria-expanded={open && active === leg}
                aria-controls={open ? CALENDAR_ID : undefined}
                aria-invalid={shownError(leg) ? true : undefined}
                aria-describedby={shownError(leg) ? `${leg}-error` : undefined}
                autoComplete="off"
                placeholder="dd/mm"
                value={texts[leg]}
                onChange={(e) => handleTextChange(leg, e.target.value)}
                onFocus={() => handleFocus(leg)}
                onClick={() => openFor(leg)}
                onKeyDown={(e) => handleKeyDown(leg, e)}
                onBlur={() => commit(leg, false)}
                className={`${fieldInputClass} ${errors[leg] ? "text-danger" : ""}`}
              />
            </FieldBox>
          ))}
        </fieldset>

        {range && (
          <Calendar
            id={CALENDAR_ID}
            month={shownMonth}
            count={count}
            range={range}
            selectable={active === "return" && value.outbound ? returnRange(value.outbound, range) : range}
            outbound={value.outbound}
            returnDate={value.return}
            focusedDay={tabbableDay([focusedDay, value[active], range.min], shownMonth, count, range)}
            instruction={!value.roundTrip ? "Välj datum" : active === "outbound" ? "Välj utresa" : "Välj hemresa"}
            roundTrip={value.roundTrip}
            onRoundTripChange={runs ? undefined : setRoundTrip}
            isChoosable={runs && ((day) => runs(active, day))}
            onMonthChange={setMonth}
            onChoose={(day) => choose(active, day)}
            onFocusDay={focusDay}
            onClose={() => close(active)}
            className={`${PLACEMENT.one} ${count === 2 ? PLACEMENT.two : ""}`}
          />
        )}
      </div>

      {legs.map(
        (leg) =>
          shownError(leg) && (
            <Message key={leg} kind="error" id={`${leg}-error`} className="mt-1.5">
              {shownError(leg)}
            </Message>
          ),
      )}
    </div>
  );
}

// Dagen som Tab går till i kalendern: den första av kandidaterna som syns,
// annars första dagen som visas (men inte före idag)
function tabbableDay(candidates: (string | null)[], month: string, count: number, range: { min: string }) {
  const shown = (day: string | null): day is string => day !== null && monthShowing(day, month, count) === month;
  return candidates.find(shown) ?? (month < range.min ? range.min : month);
}

// Följer en mediefråga, t.ex. skärmens bredd. På servern: false.
function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

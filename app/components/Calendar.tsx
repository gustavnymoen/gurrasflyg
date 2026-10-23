"use client";

import { useRef } from "react";
import {
  addDays,
  addMonths,
  formatDay,
  formatLong,
  formatMonth,
  fromDateString,
  nightsBetween,
  toDateString,
  WEEK,
  type DateRange,
} from "@/lib/dates";
import { floatClass } from "./Card";
import RoundButton from "./RoundButton";
import Switch from "./Switch";

// Månader skrivs som sin första dag, "YYYY-MM-01"
export const monthOf = (day: string) => `${day.slice(0, 8)}01`;
const shiftMonth = (month: string, months: number) => toDateString(addMonths(fromDateString(month), months));

// Första månaden att visa, så att varken månaden före idag eller efter sista
// bokningsbara dagen visas
export function clampMonth(month: string, range: DateRange, count: number) {
  const first = monthOf(range.min);
  const last = shiftMonth(monthOf(range.max), -(count - 1));
  if (month > last) return last > first ? last : first;
  return month < first ? first : month;
}

// Första månaden att visa så att dagen syns, med så lite hopp som möjligt
export function monthShowing(day: string, month: string, count: number) {
  if (day < month) return monthOf(day);
  if (day >= shiftMonth(month, count)) return shiftMonth(monthOf(day), -(count - 1));
  return month;
}

// Vart fokus flyttas i kalendern med tangentbordet (WAI-ARIA:s datumväljare)
function dayAfterKey(day: string, key: string) {
  const weekday = (fromDateString(day).getDay() + 6) % 7; // måndag = 0
  const moves: Record<string, () => string> = {
    ArrowLeft: () => addDays(day, -1),
    ArrowRight: () => addDays(day, 1),
    ArrowUp: () => addDays(day, -7),
    ArrowDown: () => addDays(day, 7),
    Home: () => addDays(day, -weekday),
    End: () => addDays(day, 6 - weekday),
    PageUp: () => toDateString(addMonths(fromDateString(day), -1)),
    PageDown: () => toDateString(addMonths(fromDateString(day), 1)),
  };
  return moves[key]?.();
}

// Kalendern under datumfälten: månadsknappar, instruktion, "Tur och retur",
// en eller två månader och, för tur och retur, en sammanfattning. Den har inga regler själv:
// vilka dagar som går att välja kommer från DatePicker.
export default function Calendar({
  id,
  month,
  count,
  range,
  selectable,
  outbound,
  returnDate,
  focusedDay,
  instruction,
  roundTrip,
  onRoundTripChange,
  onMonthChange,
  onChoose,
  onFocusDay,
  onFocusGrid,
  onClose,
  className = "",
}: {
  id: string;
  // Första månaden som visas, och hur många
  month: string;
  count: number;
  // Idag till sista bokningsbara dagen; fokus stannar inom dem
  range: DateRange;
  // Dagarna som går att välja just nu
  selectable: DateRange;
  outbound: string | null;
  returnDate: string | null;
  // Dagen som Tab går till i rutnätet
  focusedDay: string;
  instruction: string;
  roundTrip: boolean;
  onRoundTripChange: (on: boolean) => void;
  onMonthChange: (month: string) => void;
  onChoose: (day: string) => void;
  // move: fokus ska flyttas dit (tangentbordet), inte bara noteras
  onFocusDay: (day: string, move: boolean) => void;
  // Flyttar fokus till dagen som Tab går till i rutnätet
  onFocusGrid: () => void;
  onClose: () => void;
  className?: string;
}) {
  const months = Array.from({ length: count }, (_, i) => shiftMonth(month, i));
  const dialog = useRef<HTMLDivElement>(null);
  const isFirst = (first: string) => first <= monthOf(range.min);
  const isLast = (first: string) => shiftMonth(first, count - 1) >= monthOf(range.max);

  // En månadsknapp som blir inaktiv tappar fokus. Har den fokus från
  // tangentbordet (ett klick lämnar fokus i fältet) flyttas det till rutnätet.
  function changeMonth(next: string) {
    onMonthChange(next);
    const keyboard = dialog.current?.contains(document.activeElement);
    if (keyboard && (isFirst(next) || isLast(next))) onFocusGrid();
  }

  function handleGridKey(e: React.KeyboardEvent) {
    const next = dayAfterKey(focusedDay, e.key);
    if (!next) return;
    e.preventDefault();
    onFocusDay(next < range.min ? range.min : next > range.max ? range.max : next, true);
  }

  return (
    <div
      ref={dialog}
      id={id}
      role="dialog"
      aria-label="Välj datum"
      // Ett klick i kalendern lämnar fokus där det var, oftast i fältet,
      // så att man kan fortsätta skriva och kalendern inte stängs
      onMouseDown={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
      }}
      className={`absolute top-full z-10 mt-1.5 animate-float-in rounded-card p-4 text-base md:p-5 ${floatClass} ${className}`}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex flex-1 items-center justify-between gap-3">
          <RoundButton
            label="Föregående månad"
            disabled={isFirst(month)}
            onClick={() => changeMonth(shiftMonth(month, -1))}
          >
            ‹
          </RoundButton>
          <span className="text-small text-ink-muted">{instruction}</span>
          <RoundButton
            label="Nästa månad"
            disabled={isLast(month)}
            onClick={() => changeMonth(shiftMonth(month, 1))}
          >
            ›
          </RoundButton>
        </div>
        {/* Högerställd, också när den hamnar på en egen rad i en smal kalender */}
        <Switch label="Tur och retur" checked={roundTrip} onChange={onRoundTripChange} className="ml-auto" />
      </div>

      <div className={`grid gap-7 ${count === 2 ? "grid-cols-2" : ""}`}>
        {months.map((m) => (
          <MonthGrid
            key={m}
            id={`${id}-${m}`}
            month={m}
            today={range.min}
            selectable={selectable}
            outbound={outbound}
            returnDate={returnDate}
            focusedDay={focusedDay}
            onKeyDown={handleGridKey}
            onChoose={onChoose}
            onFocusDay={(day) => onFocusDay(day, false)}
          />
        ))}
      </div>

      {/* Enkel resa har bara ett datum, och det syns redan i fältet och i kalendern */}
      {roundTrip && (
        <p className="mt-3 border-t border-line pt-3 text-small text-ink-muted">
          <Summary outbound={outbound} returnDate={returnDate} />
        </p>
      )}
    </div>
  );
}

function MonthGrid({
  id,
  month,
  today,
  selectable,
  outbound,
  returnDate,
  focusedDay,
  onKeyDown,
  onChoose,
  onFocusDay,
}: {
  id: string;
  month: string;
  today: string;
  selectable: DateRange;
  outbound: string | null;
  returnDate: string | null;
  focusedDay: string;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onChoose: (day: string) => void;
  onFocusDay: (day: string) => void;
}) {
  // Veckorna börjar på måndag; tomma rutor före den första
  const first = fromDateString(month);
  const length = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const blanks = (first.getDay() + 6) % 7;
  const cells = [...Array<null>(blanks).fill(null), ...Array.from({ length }, (_, i) => addDays(month, i))];
  const weeks = Array.from({ length: Math.ceil(cells.length / 7) }, (_, i) => cells.slice(i * 7, i * 7 + 7));
  const hasRange = outbound !== null && returnDate !== null && returnDate > outbound;

  return (
    <div>
      <p id={id} className="mb-2 text-center text-[15px] font-semibold">
        {formatMonth(month)}
      </p>
      <table role="grid" aria-labelledby={id} onKeyDown={onKeyDown} className="w-full border-collapse text-center text-sm tabular-nums">
        <thead>
          <tr>
            {WEEK.map(([short, long]) => (
              <th key={short} scope="col" className="pb-1 text-xs font-normal text-ink-faint">
                <span aria-hidden="true">{short}</span>
                <span className="sr-only">{long}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, i) => (
            <tr key={i}>
              {week.map((day, j) => {
                if (!day) return <td key={j} />;
                const canChoose = day >= selectable.min && day <= selectable.max;
                const isStart = day === outbound;
                const isEnd = day === returnDate;
                const inRange = hasRange && day > outbound! && day < returnDate!;
                return (
                  <td key={day} aria-selected={isStart || isEnd} className="p-0 py-px">
                    <button
                      type="button"
                      data-day={day}
                      tabIndex={day === focusedDay ? 0 : -1}
                      aria-label={formatLong(day)}
                      aria-disabled={canChoose ? undefined : true}
                      onClick={() => canChoose && onChoose(day)}
                      onFocus={() => onFocusDay(day)}
                      className={`h-9 w-full focus-visible:outline-offset-0 ${dayLook({
                        canChoose,
                        isToday: day === today,
                        isStart,
                        isEnd,
                        inRange,
                        hasRange,
                      })}`}
                    >
                      {fromDateString(day).getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Utseendet på en dag. Utresa och hemresa i stark accent (3:1 mot ytan),
// dagarna mellan som ett band med accentlinjer (också 3:1), idag med mässingsring.
function dayLook(day: {
  canChoose: boolean;
  isToday: boolean;
  isStart: boolean;
  isEnd: boolean;
  inRange: boolean;
  hasRange: boolean;
}) {
  if (day.isStart || day.isEnd) {
    const joined = day.hasRange ? (day.isStart ? "rounded-r-none" : "rounded-l-none") : "";
    return `rounded-option bg-accent-strong font-bold text-on-accent ${joined}`;
  }
  const ring = day.isToday ? "ring-[1.5px] ring-inset ring-brass" : "";
  if (day.inRange) return `bg-accent/30 shadow-[inset_0_1.5px_0_var(--color-accent-strong),inset_0_-1.5px_0_var(--color-accent-strong)] ${ring}`;
  if (!day.canChoose) return `cursor-not-allowed rounded-option text-ink/30 ${ring}`;
  return `cursor-pointer rounded-option hover:bg-ink/6 ${ring}`;
}

// "Utresa fre 13 nov · Hemresa fre 20 nov · 7 nätter"
function Summary({ outbound, returnDate }: { outbound: string | null; returnDate: string | null }) {
  const day = (value: string | null) => (value ? <b className="font-semibold text-ink">{formatDay(value)}</b> : "–");
  const showReturn = outbound !== null || returnDate !== null;
  const nights = outbound && returnDate ? nightsBetween(outbound, returnDate) : null;
  return (
    <>
      Utresa {day(outbound)}
      {showReturn && <> · Hemresa {day(returnDate)}</>}
      {nights !== null && <> · {nights === 0 ? "Dagstur" : nights === 1 ? "1 natt" : `${nights} nätter`}</>}
    </>
  );
}

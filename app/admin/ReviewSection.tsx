"use client";

import { useState } from "react";
import type { Review } from "@/lib/reviews";
import Stars from "../components/Stars";
import { Alert, compactPrimaryButtonClass, compactInputClass, compactTextareaClass } from "../components/ui";
import { createReviewAction, deleteReviewAction } from "./actions";
import { CollapsibleCard, DeleteButton, rowClass, subheadingClass, thClass, useAction } from "./admin-ui";

const MAX_LENGTH = 255; // samma som i databasen

export default function ReviewSection({ reviews }: { reviews: Review[] }) {
  return (
    <CollapsibleCard title="Omdömen" count={reviews.length}>
      <div className="grid gap-6 md:grid-cols-2">
        <ReviewForm />
        <div>
          <h3 className={subheadingClass}>Alla omdömen</h3>
          {reviews.length === 0 ? (
            <p className="text-sm text-neutral-500">Inga omdömen än.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className={thClass}>Person</th>
                  <th className={thClass}>Betyg</th>
                  <th className="w-10">
                    <span className="sr-only">Ta bort</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id} className={rowClass}>
                    <td className="py-1.5" title={r.title}>
                      {r.author}
                    </td>
                    <td className="py-1.5">
                      <Stars rating={r.rating} className="text-sm" />
                    </td>
                    <td className="py-1.5">
                      <DeleteButton
                        label={`Ta bort omdöme från ${r.author}`}
                        inUse={false}
                        inUseReason=""
                        onDelete={() => deleteReviewAction(r.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </CollapsibleCard>
  );
}

function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [saved, setSaved] = useState(false);
  const { pending, error, setError, run } = useAction();

  function save() {
    if (rating === 0) {
      setError("Välj antal stjärnor.");
      return;
    }
    setSaved(false);
    run(
      () => createReviewAction({ rating, title, author, body }),
      () => {
        setRating(0);
        setTitle("");
        setAuthor("");
        setBody("");
        setSaved(true);
      },
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="flex flex-col gap-2"
    >
      <h3 className={subheadingClass}>Nytt omdöme</h3>
      <input
        aria-label="Namn på personen"
        placeholder="Namn på personen"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className={compactInputClass}
      />
      <StarPicker value={rating} onChange={setRating} />
      <input
        aria-label="Rubrik"
        placeholder="Rubrik"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={compactInputClass}
      />
      <div>
        <textarea
          aria-label="Text"
          placeholder="Text"
          maxLength={MAX_LENGTH}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className={compactTextareaClass}
        />
        <p className="text-right text-xs text-neutral-500">
          {body.length}/{MAX_LENGTH}
        </p>
      </div>
      {error && <Alert kind="error" compact>{error}</Alert>}
      {saved && !error && <Alert kind="success" compact>Omdömet sparades.</Alert>}
      <button type="submit" disabled={pending} className={`${compactPrimaryButtonClass} self-start`}>
        {pending ? "Sparar…" : "Spara omdöme"}
      </button>
    </form>
  );
}

// Fem klickbara stjärnor
function StarPicker({ value, onChange }: { value: number; onChange: (rating: number) => void }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div role="radiogroup" aria-label="Betyg" className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} ${n === 1 ? "stjärna" : "stjärnor"}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          className={`text-xl leading-none transition-colors ${
            n <= shown ? "text-wine-light" : "text-neutral-700 hover:text-neutral-500"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

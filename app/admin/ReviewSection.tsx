"use client";

import { useState } from "react";
import { MAX_REVIEW_LENGTH } from "@/lib/review-rules";
import type { Review } from "@/lib/reviews";
import Stars from "../components/Stars";
import Button from "../components/Button";
import { fieldClass, textAreaClass } from "../components/Field";
import Message from "../components/Message";
import { createReviewAction, deleteReviewAction } from "./actions";
import { CollapsibleCard, DeleteButton, rowClass, subheadingClass, thClass, useAction } from "./admin-ui";

export default function ReviewSection({ reviews }: { reviews: Review[] }) {
  return (
    <CollapsibleCard title="Omdömen" count={reviews.length}>
      <div className="grid gap-6 md:grid-cols-2">
        <ReviewForm />
        <div>
          <h3 className={subheadingClass}>Alla omdömen</h3>
          {reviews.length === 0 ? (
            <p className="text-sm text-ink-muted">Inga omdömen än.</p>
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
        className={fieldClass("compact")}
      />
      <StarPicker value={rating} onChange={setRating} />
      <input
        aria-label="Rubrik"
        placeholder="Rubrik"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={fieldClass("compact")}
      />
      <div>
        <textarea
          aria-label="Text"
          placeholder="Text"
          maxLength={MAX_REVIEW_LENGTH}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className={textAreaClass("compact")}
        />
        <p className="text-right text-xs text-ink-muted">
          {body.length}/{MAX_REVIEW_LENGTH}
        </p>
      </div>
      {error && <Message kind="error">{error}</Message>}
      {saved && !error && <Message kind="success">Omdömet sparades.</Message>}
      <Button type="submit" size="compact" disabled={pending} className="self-start">
        {pending ? "Sparar…" : "Spara omdöme"}
      </Button>
    </form>
  );
}

// Fem klickbara stjärnor
function StarPicker({ value, onChange }: { value: number; onChange: (rating: number) => void }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div role="radiogroup" aria-label="Betyg" className="flex" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} ${n === 1 ? "stjärna" : "stjärnor"}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          // Klickytan är minst 24 px (WCAG 2.5.8), större än själva stjärnan
          className={`grid h-7 w-7 place-items-center text-xl leading-none transition-colors ${
            n <= shown ? "text-brass" : "text-line-strong hover:text-ink-muted"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

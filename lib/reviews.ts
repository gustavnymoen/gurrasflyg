import "server-only";
import { connection } from "next/server";
import { AdminError } from "./admin";
import { all, run } from "./db";
import { MAX_AUTHOR_LENGTH, MAX_REVIEW_LENGTH, MAX_TITLE_LENGTH } from "./review-rules";

export type Review = { id: number; rating: number; title: string; author: string; body: string };
export type ReviewInput = Omit<Review, "id">;

// Nyaste först
export async function listReviews(): Promise<Review[]> {
  await connection();
  return all<Review>("SELECT id, rating, title, author, body FROM reviews ORDER BY id DESC");
}

export async function createReview(input: ReviewInput) {
  const rating = Number(input.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new AdminError("Välj mellan 1 och 5 stjärnor.");
  }
  // Typerna gäller bara i koden; en server action kan anropas med vad som helst
  const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
  const title = text(input.title);
  const author = text(input.author);
  const body = text(input.body);
  if (!title) throw new AdminError("Omdömet måste ha en rubrik.");
  if (!author) throw new AdminError("Ange vem som lämnat omdömet.");
  if (!body) throw new AdminError("Skriv en text till omdömet.");
  if (author.length > MAX_AUTHOR_LENGTH) {
    throw new AdminError(`Namnet får vara max ${MAX_AUTHOR_LENGTH} tecken.`);
  }
  if (title.length > MAX_TITLE_LENGTH) {
    throw new AdminError(`Rubriken får vara max ${MAX_TITLE_LENGTH} tecken.`);
  }
  if (body.length > MAX_REVIEW_LENGTH) {
    throw new AdminError(`Texten får vara max ${MAX_REVIEW_LENGTH} tecken.`);
  }
  await run("INSERT INTO reviews (rating, title, author, body) VALUES (?, ?, ?, ?)", [
    rating,
    title,
    author,
    body,
  ]);
}

export async function deleteReview(id: number) {
  await run("DELETE FROM reviews WHERE id = ?", [id]);
}

import "server-only";
import { connection } from "next/server";
import { AdminError } from "./admin";
import { all, run } from "./db";

// Databasen tillåter 255 tecken, men korten på startsidan är byggda för 150
export const MAX_REVIEW_LENGTH = 150;

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
  const title = input.title.trim();
  const author = input.author.trim();
  const body = input.body.trim();
  if (!title) throw new AdminError("Omdömet måste ha en rubrik.");
  if (!author) throw new AdminError("Ange vem som lämnat omdömet.");
  if (!body) throw new AdminError("Skriv en text till omdömet.");
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

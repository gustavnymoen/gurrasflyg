import { Suspense } from "react";
import { listReviews } from "@/lib/reviews";
import ReviewCarousel from "./components/ReviewCarousel";
import SearchForm from "./components/SearchForm";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-20">
      <header className="mb-12 flex flex-col items-center gap-3">
        <h1 className="flex items-center gap-4 text-title-phone font-bold md:text-title">
          <PlaneIcon />
          Gurras Flyg
        </h1>
        <p className="text-lg text-ink-muted">Ditt livs flygresa</p>
      </header>
      <SearchForm />

      <section className="mt-16 w-full max-w-5xl">
        <h2 className="mb-6 text-center text-section font-bold">
          Vad våra resenärer säger
        </h2>
        {/* Omdömena läses från databasen när sidan efterfrågas */}
        <Suspense fallback={<div className="h-60" />}>
          <Reviews />
        </Suspense>
      </section>
    </main>
  );
}

async function Reviews() {
  return <ReviewCarousel reviews={await listReviews()} />;
}

function PlaneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-10 w-10 shrink-0 rotate-45 text-brass md:h-14 md:w-14"
    >
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
    </svg>
  );
}

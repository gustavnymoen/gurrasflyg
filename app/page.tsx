import Image from "next/image";
import { Suspense } from "react";
import { listReviews } from "@/lib/reviews";
import ReviewCarousel from "./components/ReviewCarousel";
import SearchForm from "./components/SearchForm";

export default function Home() {
  return (
    <>
      <HeroPhoto />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-16">
        <h1 className="mt-12 max-w-165 text-title-phone font-bold md:mt-20 md:text-title">
          Vi ordnar det ingen annan kan
        </h1>
        <p className="mt-4 mb-6 max-w-130 text-[17px] text-ink-muted md:mt-4.5 md:mb-8.5 md:text-xl">
          Ditt livs flygresa, till städer och till platser andra flygbolag glömt bort.
        </p>
        <SearchForm />

        <section className="mt-14">
          <h2 className="mb-2 text-center text-section font-bold">Vad våra resenärer säger</h2>
          {/* Omdömena läses från databasen när sidan efterfrågas */}
          <Suspense fallback={<div className="h-52" />}>
            <Reviews />
          </Suspense>
        </section>
      </main>
    </>
  );
}

async function Reviews() {
  return <ReviewCarousel reviews={await listReviews()} />;
}

// Kvällsfotot bakom sidhuvudet, rubriken och sökformuläret. Det är dekoration
// (tom alt-text) och mörkas mot texten (photo-shade i globals.css). Det
// hämtas med hög prioritet, eftersom det syns direkt.
function HeroPhoto() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-176 md:h-224">
      <Image
        src="/brand/skymning.jpg"
        alt=""
        fill
        sizes="100vw"
        fetchPriority="high"
        loading="eager"
        className="object-cover object-[60%_45%]"
      />
      <div className="photo-shade lg:photo-shade-wide absolute inset-0" />
    </div>
  );
}

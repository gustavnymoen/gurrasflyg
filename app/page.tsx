import SearchForm from "./components/SearchForm";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-20">
      <header className="mb-12 flex flex-col items-center gap-3">
        <h1 className="flex items-center gap-4 text-6xl font-extrabold tracking-tight">
          <PlaneIcon />
          {/* Text med färgtoning från ljusare till mörkare vinrött, plus ett svagt sken */}
          <span className="bg-linear-to-br from-wine-light via-wine to-[#5c1029] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(176,40,79,0.35)]">
            Gurras Flyg
          </span>
        </h1>
        <div className="h-0.5 w-40 bg-linear-to-r from-transparent via-wine to-transparent" />
        <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
          Ditt livs flygresa
        </p>
      </header>
      <SearchForm />
    </main>
  );
}

function PlaneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-12 w-12 rotate-45 text-wine-light"
    >
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
    </svg>
  );
}

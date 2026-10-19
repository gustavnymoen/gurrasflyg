import SearchForm from "./components/SearchForm";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-16">
      <h1 className="mb-10 text-5xl font-bold tracking-tight text-wine">
        Gurras Flyg
      </h1>
      <SearchForm />
    </main>
  );
}

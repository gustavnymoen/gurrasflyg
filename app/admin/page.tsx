import type { Metadata } from "next";
import { Suspense } from "react";
import { getRouteStats, listAddons, listAircraft, listClasses } from "@/lib/admin";
import { requireAdminPage } from "@/lib/auth";
import { secondaryButtonClass } from "../components/ui";
import AddonTable from "./AddonTable";
import AircraftTable from "./AircraftTable";
import AssignAircraftButton from "./AssignAircraftButton";
import ClassTable from "./ClassTable";
import { logoutAction } from "./login/actions";

export const metadata: Metadata = {
  title: "Admin – Gurras Flyg",
};

export default function AdminPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12">
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="bg-linear-to-br from-wine-light via-wine to-[#5c1029] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            Admin
          </h1>
          <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
            Plan, klasser och addons
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Suspense>
            <AssignAircraft />
          </Suspense>
          <form action={logoutAction}>
            <button type="submit" className={secondaryButtonClass}>
              Logga ut
            </button>
          </form>
        </div>
      </header>
      {/* Datan läses från databasen när sidan efterfrågas, så den visas via Suspense */}
      <Suspense fallback={<p className="text-neutral-500">Laddar…</p>}>
        <AdminContent />
      </Suspense>
    </main>
  );
}

// Inloggningen kontrolleras här också, inte bara i proxy.ts
async function AssignAircraft() {
  await requireAdminPage();
  const { total, assigned } = await getRouteStats();
  return <AssignAircraftButton total={total} assigned={assigned} />;
}

async function AdminContent() {
  await requireAdminPage();
  const [classes, addons, aircraft] = await Promise.all([
    listClasses(),
    listAddons(),
    listAircraft(),
  ]);
  return (
    <>
      {/* Klasser till vänster, addons till höger */}
      <div className="grid items-start gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <ClassTable classes={classes} />
        </div>
        <div className="lg:col-span-3">
          <AddonTable addons={addons} />
        </div>
      </div>
      <AircraftTable aircraft={aircraft} classes={classes} addons={addons} />
    </>
  );
}

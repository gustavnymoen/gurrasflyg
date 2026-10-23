// Tillfällig demo (TECH-015): Semgreps egna regel ska fortfarande hitta det här
import { run } from "@/lib/db";

export async function findByName(name: string) {
  await run("SELECT * FROM classes WHERE name = '" + name + "'");
}

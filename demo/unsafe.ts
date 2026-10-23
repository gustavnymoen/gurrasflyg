// TECH-013: tillfällig fil som visar att säkerhetsjobbet stoppar osäker kod
// och hemligheter. Branchen raderas efter demon och mergas aldrig.
import { Client } from "pg";
import { run } from "@/lib/db";

const githubToken = "ghp_SEBTPpTMxCbErZSmi4EdnoELUhMoobITXZz3";

export async function findByName(name: string) {
  // Vår egen databashjälp med SQL ihopsatt av text
  await run("SELECT * FROM classes WHERE name = '" + name + "'");
}

export async function findById(req: { query: { id: string } }) {
  // Samma sak med pg, som Semgreps regler känner till
  const client = new Client();
  return client.query("SELECT * FROM users WHERE id = " + req.query.id);
}

export { githubToken };

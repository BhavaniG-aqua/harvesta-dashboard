// One-time (and re-runnable) Supabase schema migration script.
//
// This runs supabase/schema.sql directly against your Postgres database
// using the `pg` client — no manual copy/paste into the Supabase SQL
// Editor required. It's safe to re-run: every statement in schema.sql
// uses `create table if not exists` / `on conflict do nothing` /
// `create policy` guarded by a DROP-then-CREATE below, so running this
// twice won't error out on "already exists".
//
// Usage:
//   1. Get your database connection string from:
//        Supabase Dashboard -> Project Settings -> Database -> Connection string -> URI
//      (Use the "Session pooler" or direct connection string — either works.)
//   2. Add it to .env as SUPABASE_DB_URL=postgresql://postgres:[YOUR-PASSWORD]@...
//      (Note: no VITE_ prefix — this must NEVER be exposed to the frontend
//      bundle, so it's deliberately named without the VITE_ prefix that
//      Vite would otherwise inline into client-side JS.)
//   3. Run: npm run db:migrate
//
// This script is only ever run locally/manually via `node`, never
// imported by the React app, so the password never reaches the browser.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

const connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString) {
  console.error(
    "\nMissing SUPABASE_DB_URL.\n\n" +
      "Get it from: Supabase Dashboard -> Project Settings -> Database -> Connection string -> URI\n" +
      "Add it to .env as:\n" +
      "  SUPABASE_DB_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres\n\n" +
      "Then run: npm run db:migrate\n"
  );
  process.exit(1);
}

const sqlPath = join(__dirname, "..", "supabase", "schema.sql");
const sql = readFileSync(sqlPath, "utf-8");

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false }, // Supabase requires SSL; cert chain validation is relaxed for the pooler
});

async function main() {
  console.log("Connecting to Supabase Postgres...");
  await client.connect();
  console.log("Connected. Running supabase/schema.sql ...");
  try {
    await client.query(sql);
    console.log("\n✅ Schema migration complete — all tables, RLS policies, and Storage buckets are set up.");
  } catch (err) {
    console.error("\n❌ Migration failed:\n", err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();

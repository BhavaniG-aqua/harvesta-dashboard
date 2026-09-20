// ONE-TIME reset script — clears all app data so the dashboard can be
// handed off to a new user as if freshly installed, WITHOUT touching the
// "one-more-thing" Storage bucket (the curated daily photos stay put).
//
// This is not meant to be part of the running app or committed as a
// permanent feature — it's a maintenance script run manually via:
//   node --env-file=.env scripts/reset-for-new-user.js
//
// What it does:
//   1. Deletes every row from every domain table (placements, prep,
//      interview files/folders, notes, letters, health logs) — except
//      the fixed/singleton rows the app expects to always exist
//      (settings id=1, letters_passcode id=1, one_more_thing_fixed id=1,
//      preparation_categories "Others"), which are reset to blank
//      instead of deleted.
//   2. Deletes every Storage object in interview-files, note-attachments,
//      and profile-photos (recursively). Deliberately SKIPS the
//      "one-more-thing" bucket entirely.
import { createClient } from "@supabase/supabase-js";
import pg from "pg";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const dbUrl = process.env.SUPABASE_DB_URL;

if (!supabaseUrl || !supabaseAnonKey || !dbUrl) {
  console.error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY / SUPABASE_DB_URL in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Buckets to fully empty. "one-more-thing" is intentionally NOT here.
const BUCKETS_TO_CLEAR = ["interview-files", "note-attachments", "profile-photos"];

async function listAllFilesRecursive(bucket, prefix = "") {
  const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 1000 });
  if (error) throw error;

  const files = [];
  for (const entry of data || []) {
    const fullPath = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.id === null) {
      // No id => it's a "folder" placeholder; recurse into it.
      const nested = await listAllFilesRecursive(bucket, fullPath);
      files.push(...nested);
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function clearBucket(bucket) {
  const files = await listAllFilesRecursive(bucket);
  if (files.length === 0) {
    console.log(`  ${bucket}: already empty`);
    return;
  }
  // Storage remove() accepts up to ~1000 paths at once; chunk defensively.
  const chunkSize = 100;
  for (let i = 0; i < files.length; i += chunkSize) {
    const chunk = files.slice(i, i + chunkSize);
    const { error } = await supabase.storage.from(bucket).remove(chunk);
    if (error) throw error;
  }
  console.log(`  ${bucket}: deleted ${files.length} file(s)`);
}

const RESET_SQL = `
-- Domain data — full wipe.
delete from placement_events;
delete from preparation_topic_companies;
delete from preparation_topics;
delete from preparation_companies;
delete from preparation_categories where id <> '00000000-0000-0000-0000-000000000001';
delete from interview_files;
delete from interview_folders;
delete from note_attachments;
delete from notes;
delete from letters;
delete from health_daily_logs;
delete from one_more_thing_rotation;

-- Singleton/fixed rows — reset to blank instead of deleting, since the
-- app always expects exactly one row to exist here.
update settings set
  friend_name = null,
  sleep_target_hours = null,
  profile_photo_url = null,
  birthday = null,
  bio = null,
  current_goal = null,
  permanent_reminder = null
where id = 1;

update letters_passcode set passcode_hash = null where id = 1;

update one_more_thing_fixed set image_url = null, caption = null where id = 1;
`;

async function main() {
  const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  console.log("Connecting to Supabase Postgres...");
  await client.connect();
  try {
    console.log("Wiping domain tables + resetting singleton rows...");
    await client.query(RESET_SQL);
    console.log("✅ Database reset complete.");
  } finally {
    await client.end();
  }

  console.log("\nClearing Storage buckets (skipping 'one-more-thing')...");
  for (const bucket of BUCKETS_TO_CLEAR) {
    await clearBucket(bucket);
  }
  console.log("\n✅ All done. 'one-more-thing' bucket was left untouched.");
}

main().catch((err) => {
  console.error("\n❌ Reset failed:\n", err);
  process.exitCode = 1;
});

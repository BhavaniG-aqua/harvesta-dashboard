-- Supabase schema for Phase 8 — Harvesta.
--
-- Re-runnable / idempotent: every statement here is safe to run more
-- than once (create table if not exists, on conflict do nothing, and
-- policies are dropped-then-recreated). This can be applied either by:
--   (a) pasting this whole file into Supabase Dashboard -> SQL Editor,
--       or
--   (b) running `npm run db:migrate` (see scripts/migrate.js), which
--       runs this exact file directly against your database.
--
-- Table/column shapes mirror src/data/mockData.js and the current hooks
-- in src/hooks/*.js as closely as possible, so the Supabase-backed hooks
-- require minimal remapping from the localStorage-backed versions.
--
-- This app has NO end-user authentication (Master Context §5) — it is a
-- single-person personal dashboard. RLS is enabled on every table purely
-- so the Supabase linter doesn't flag "RLS disabled" warnings, but every
-- policy is "allow all" for the anon key. Security here comes from the
-- Supabase project URL/anon key not being shared, not from RLS rules.

-- ---------------------------------------------------------------------------
-- Settings — single row, single-user app.
-- ---------------------------------------------------------------------------
create table if not exists settings (
  id int primary key default 1,
  friend_name text,
  sleep_target_hours numeric,
  profile_photo_url text,       -- Storage URL (bucket: profile-photos), or null
  birthday date,
  bio text,
  current_goal text,
  permanent_reminder text,
  constraint single_row check (id = 1)
);

insert into settings (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Placements
-- ---------------------------------------------------------------------------
create table if not exists placement_events (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  date date not null,
  time text,
  role text,
  package text,
  requirements text,
  selection_process text,
  what_to_prepare text,
  notes text,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Preparation — Categories, Companies & Topics.
--
-- Hierarchy: a topic belongs to exactly ONE category, but can be tagged
-- with MANY companies (many-to-many via preparation_topic_companies).
-- "Others" is a fixed, non-deletable fallback category — see
-- OTHERS_CATEGORY_ID in src/hooks/usePreparationData.js. Its row id here
-- must stay stable, so it's inserted with a fixed UUID rather than
-- gen_random_uuid().
-- ---------------------------------------------------------------------------
create table if not exists preparation_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

insert into preparation_categories (id, name)
  values ('00000000-0000-0000-0000-000000000001', 'Others')
  on conflict (id) do nothing;

create table if not exists preparation_companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table if not exists preparation_topics (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references preparation_categories(id) on delete set null,
  name text not null,
  status text not null default 'NEW' check (status in ('NEW','COMPLETED','REVISE')),
  created_at timestamptz default now()
);

create table if not exists preparation_topic_companies (
  topic_id uuid references preparation_topics(id) on delete cascade,
  company_id uuid references preparation_companies(id) on delete cascade,
  primary key (topic_id, company_id)
);

-- ---------------------------------------------------------------------------
-- Interview Preparation — nested folders + files.
-- Storage bucket: "interview-files"
-- Object path convention: {folder_id}/{filename}
-- ---------------------------------------------------------------------------
create table if not exists interview_folders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  parent_folder_id uuid references interview_folders(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists interview_files (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid references interview_folders(id) on delete cascade,
  name text not null,
  type text,               -- 'pdf' | 'image' | 'word' | 'sheet' | 'text' | 'unsupported'
  size text,
  storage_path text,       -- path inside the "interview-files" bucket
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Notes — Word-style notepad.
-- `notes.content` stores rich HTML; images inserted by the user are
-- embedded INLINE at the cursor position directly inside this HTML
-- (as <img src="..."> tags pointing at Supabase Storage URLs), exactly
-- like inserting a picture inside a Word document — they are NOT tracked
-- as separate rows.
-- `note_attachments` is only for separate, non-inline files (PDFs, docs,
-- images attached as downloadable files, etc.) shown as a list below the
-- note body.
-- Storage bucket: "note-attachments" (used for BOTH inline image uploads
-- and file attachments). Object path convention: {note_id}/{filename}
-- ---------------------------------------------------------------------------
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  title text,
  content text,             -- rich HTML; inline <img> tags reference Storage URLs
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists note_attachments (
  id uuid primary key default gen_random_uuid(),
  note_id uuid references notes(id) on delete cascade,
  name text not null,
  type text not null,         -- 'pdf' | 'word' | 'sheet' | 'image' | ...
  size text,
  storage_path text not null, -- path inside the "note-attachments" bucket
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Letters — private, day-wise personal journal.
-- The 6-digit passcode's SHA-256 hash lives here (single row, id = 1),
-- never the raw digits. `unlocked` state itself stays client-side only
-- (in-memory, per session) — it is never persisted anywhere.
-- ---------------------------------------------------------------------------
create table if not exists letters (
  id uuid primary key default gen_random_uuid(),
  letter_date date not null unique,
  content text,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists letters_passcode (
  id int primary key default 1,
  passcode_hash text,
  constraint single_row check (id = 1)
);

insert into letters_passcode (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Health
-- ---------------------------------------------------------------------------
create table if not exists health_daily_logs (
  id uuid primary key default gen_random_uuid(),
  log_date date not null unique,
  fruits boolean default false,
  nuts boolean default false,
  meals int check (meals in (1,2,3)),
  sleep_hours numeric,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- One More Thing — manually curated quote rotation, plus a single
-- "fixed" image shown unchanged every day (Master Context §20).
-- `rotation_order` controls the deterministic day-by-day cycle order for
-- QUOTES (see dayIndex()/weave() in src/hooks/useOneMoreThingData.js);
-- there is intentionally NO in-app add/upload UI — quote rows are
-- managed by editing this table directly (Supabase Table Editor)
-- outside the running app.
--
-- Rotation PHOTOS work differently and need no row here at all: just
-- drop image files straight into the "one-more-thing" Storage bucket's
-- root folder from the Supabase dashboard. The app lists that bucket on
-- load and automatically weaves whatever it finds in there, alternating
-- with the quote rows below, into the daily rotation — sorted by
-- filename, so prefixing files like "01-beach.jpg", "02-cat.jpg" gives
-- you control over the order they appear in.
-- ---------------------------------------------------------------------------
create table if not exists one_more_thing_rotation (
  id uuid primary key default gen_random_uuid(),
  rotation_order int not null,
  type text not null check (type in ('quote','image')),
  quote text,
  author text,
  image_url text,
  caption text,
  created_at timestamptz default now()
);

create table if not exists one_more_thing_fixed (
  id int primary key default 1,
  image_url text,
  caption text,
  constraint single_row check (id = 1)
);

insert into one_more_thing_fixed (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Row Level Security — "allow all" for every table (see note at top).
-- Policies are dropped-then-recreated so this whole file can be re-run
-- safely without "policy already exists" errors.
-- ---------------------------------------------------------------------------
alter table settings enable row level security;
alter table placement_events enable row level security;
alter table preparation_categories enable row level security;
alter table preparation_companies enable row level security;
alter table preparation_topics enable row level security;
alter table preparation_topic_companies enable row level security;
alter table interview_folders enable row level security;
alter table interview_files enable row level security;
alter table notes enable row level security;
alter table note_attachments enable row level security;
alter table letters enable row level security;
alter table letters_passcode enable row level security;
alter table health_daily_logs enable row level security;
alter table one_more_thing_rotation enable row level security;
alter table one_more_thing_fixed enable row level security;

drop policy if exists "allow all" on settings;
create policy "allow all" on settings for all using (true) with check (true);

drop policy if exists "allow all" on placement_events;
create policy "allow all" on placement_events for all using (true) with check (true);

drop policy if exists "allow all" on preparation_categories;
create policy "allow all" on preparation_categories for all using (true) with check (true);

drop policy if exists "allow all" on preparation_companies;
create policy "allow all" on preparation_companies for all using (true) with check (true);

drop policy if exists "allow all" on preparation_topics;
create policy "allow all" on preparation_topics for all using (true) with check (true);

drop policy if exists "allow all" on preparation_topic_companies;
create policy "allow all" on preparation_topic_companies for all using (true) with check (true);

drop policy if exists "allow all" on interview_folders;
create policy "allow all" on interview_folders for all using (true) with check (true);

drop policy if exists "allow all" on interview_files;
create policy "allow all" on interview_files for all using (true) with check (true);

drop policy if exists "allow all" on notes;
create policy "allow all" on notes for all using (true) with check (true);

drop policy if exists "allow all" on note_attachments;
create policy "allow all" on note_attachments for all using (true) with check (true);

drop policy if exists "allow all" on letters;
create policy "allow all" on letters for all using (true) with check (true);

drop policy if exists "allow all" on letters_passcode;
create policy "allow all" on letters_passcode for all using (true) with check (true);

drop policy if exists "allow all" on health_daily_logs;
create policy "allow all" on health_daily_logs for all using (true) with check (true);

drop policy if exists "allow all" on one_more_thing_rotation;
create policy "allow all" on one_more_thing_rotation for all using (true) with check (true);

drop policy if exists "allow all" on one_more_thing_fixed;
create policy "allow all" on one_more_thing_fixed for all using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Storage buckets — all public (no auth in this app, per Master Context §5).
-- Bucket names must match EXACTLY what the app's Storage helper uses:
--   interview-files
--   note-attachments
--   profile-photos
--   one-more-thing   (the rotation's PHOTOS live here — just drop image
--                      files into this bucket's root folder from the
--                      Supabase dashboard; the app lists them
--                      automatically, no database row needed per photo.
--                      The single "fixed" image's URL is still stored in
--                      one_more_thing_fixed.image_url, e.g. pointing at a
--                      file uploaded here.)
--
-- `on conflict ... do update set public = true` (not `do nothing`) is
-- deliberate: if any of these buckets already existed from an earlier
-- manual creation (e.g. via the Dashboard, possibly left private by
-- default), re-running this migration self-heals it back to public
-- instead of silently leaving it private forever.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
  values ('interview-files', 'interview-files', true)
  on conflict (id) do update set public = true;
insert into storage.buckets (id, name, public)
  values ('note-attachments', 'note-attachments', true)
  on conflict (id) do update set public = true;
insert into storage.buckets (id, name, public)
  values ('profile-photos', 'profile-photos', true)
  on conflict (id) do update set public = true;
insert into storage.buckets (id, name, public)
  values ('one-more-thing', 'one-more-thing', true)
  on conflict (id) do update set public = true;

drop policy if exists "allow all interview-files" on storage.objects;
create policy "allow all interview-files" on storage.objects for all
  using (bucket_id = 'interview-files') with check (bucket_id = 'interview-files');

drop policy if exists "allow all note-attachments" on storage.objects;
create policy "allow all note-attachments" on storage.objects for all
  using (bucket_id = 'note-attachments') with check (bucket_id = 'note-attachments');

drop policy if exists "allow all profile-photos" on storage.objects;
create policy "allow all profile-photos" on storage.objects for all
  using (bucket_id = 'profile-photos') with check (bucket_id = 'profile-photos');

drop policy if exists "allow all one-more-thing" on storage.objects;
create policy "allow all one-more-thing" on storage.objects for all
  using (bucket_id = 'one-more-thing') with check (bucket_id = 'one-more-thing');

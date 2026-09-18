-- Supabase schema reference for Phase 8.
-- Run this in Supabase Dashboard -> SQL Editor.
-- Table shapes mirror src/data/mockData.js closely so the eventual
-- Supabase-backed hooks require minimal remapping.

-- ---------------------------------------------------------------------------
-- Placements
-- ---------------------------------------------------------------------------
create table placement_events (
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
-- Preparation
-- ---------------------------------------------------------------------------
create table preparation_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table preparation_topics (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references preparation_categories(id) on delete cascade,
  name text not null,
  status text not null default 'NEW' check (status in ('NEW','COMPLETED','REVISE')),
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Interview Preparation — nested folders + files
-- Storage bucket: "interview-files"
-- Object path convention: {folder_id}/{filename}
-- ---------------------------------------------------------------------------
create table interview_folders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  parent_folder_id uuid references interview_folders(id) on delete cascade,
  created_at timestamptz default now()
);

create table interview_files (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid references interview_folders(id) on delete cascade,
  name text not null,
  type text,              -- 'pdf' | 'image' | 'doc' | ...
  size text,
  storage_path text,      -- path inside the "interview-files" bucket
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Notes — Word-style notepad.
-- `notes.content` stores rich HTML: images inserted by the user are
-- embedded INLINE at the cursor position directly inside this HTML
-- (as <img src="..."> tags pointing at Supabase Storage URLs), exactly
-- like inserting a picture inside a Word document. They are NOT tracked
-- as separate rows.
-- `note_attachments` is only for separate, non-inline files (PDFs, docs,
-- etc.) that are shown as a downloadable list below the note body —
-- these don't make sense embedded inline in running text.
-- Storage bucket: "note-attachments" (used for BOTH inline image uploads
-- and file attachments; inline images are referenced directly from the
-- `content` HTML, attachments are tracked via note_attachments rows).
-- Object path convention: {note_id}/{filename}
-- ---------------------------------------------------------------------------
create table notes (
  id uuid primary key default gen_random_uuid(),
  title text,
  content text,        -- rich HTML; inline <img> tags reference Storage URLs
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create table note_attachments (
  id uuid primary key default gen_random_uuid(),
  note_id uuid references notes(id) on delete cascade,
  name text not null,
  type text not null,       -- 'pdf' | 'doc' | ...
  size text,
  storage_path text not null, -- path inside the "note-attachments" bucket
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Health
-- ---------------------------------------------------------------------------
create table health_daily_logs (
  id uuid primary key default gen_random_uuid(),
  log_date date not null unique,
  fruits boolean default false,
  nuts boolean default false,
  meals int check (meals in (1,2,3)),
  sleep_hours numeric,
  created_at timestamptz default now()
);

create table fruit_reminders (
  id uuid primary key default gen_random_uuid(),
  reminder_date date not null,
  reminder_time text not null,
  done boolean default false,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Inspiration (manually curated — Section 20)
-- ---------------------------------------------------------------------------
create table inspiration_content (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('motivation','funny')),
  quote text,
  author text,
  text text,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Settings (single row — single-user app)
-- ---------------------------------------------------------------------------
create table settings (
  id int primary key default 1,
  friend_name text,
  reminder_days text[],
  reminder_times text[],
  sleep_target_hours numeric,
  constraint single_row check (id = 1)
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- No authentication exists in this app (Master Context Section 5), so we
-- rely on the anon key + RLS "allow all" pattern. This is safe here
-- because: (a) only the friend has the URL, (b) no sensitive data
-- (passwords/PII) is stored, (c) the service-role key is never exposed.
-- ---------------------------------------------------------------------------
alter table placement_events enable row level security;
alter table preparation_categories enable row level security;
alter table preparation_topics enable row level security;
alter table interview_folders enable row level security;
alter table interview_files enable row level security;
alter table notes enable row level security;
alter table note_attachments enable row level security;
alter table health_daily_logs enable row level security;
alter table fruit_reminders enable row level security;
alter table inspiration_content enable row level security;
alter table settings enable row level security;

create policy "allow all" on placement_events for all using (true) with check (true);
create policy "allow all" on preparation_categories for all using (true) with check (true);
create policy "allow all" on preparation_topics for all using (true) with check (true);
create policy "allow all" on interview_folders for all using (true) with check (true);
create policy "allow all" on interview_files for all using (true) with check (true);
create policy "allow all" on notes for all using (true) with check (true);
create policy "allow all" on note_attachments for all using (true) with check (true);
create policy "allow all" on health_daily_logs for all using (true) with check (true);
create policy "allow all" on fruit_reminders for all using (true) with check (true);
create policy "allow all" on inspiration_content for all using (true) with check (true);
create policy "allow all" on settings for all using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Storage buckets (create via Supabase Dashboard -> Storage, or SQL below)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public) values ('interview-files', 'interview-files', true);
insert into storage.buckets (id, name, public) values ('note-attachments', 'note-attachments', true);

create policy "allow all interview-files" on storage.objects for all
  using (bucket_id = 'interview-files') with check (bucket_id = 'interview-files');

create policy "allow all note-attachments" on storage.objects for all
  using (bucket_id = 'note-attachments') with check (bucket_id = 'note-attachments');

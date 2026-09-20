# Harvesta — Phases 1–8 (Supabase-backed)

A lightweight, mobile-first personal dashboard built for a friend's campus
placement season. See `Personal_Dashboard_Master_Context.md` in the repo
root for the full product spec and constraints.

## Stack

- React 19 + Vite
- React Router v7
- Tailwind CSS v4 (via `@tailwindcss/vite`) — custom sea-blue + amber palette (see `src/index.css` `@theme`), with a full light/dark theme toggle (`ThemeContext` + `ThemeToggle`, class-based via `@custom-variant dark`)
- `mammoth` (docx → HTML) and `xlsx` (xls/xlsx/csv → table) for in-browser file preview, both lazy-loaded via dynamic `import()` so they don't bloat the initial bundle
- **Supabase** (Postgres + Storage) as the backend — see `supabase/schema.sql`.
  All domain hooks (`src/hooks/`) talk to Supabase directly via
  `src/services/supabaseClient.js`, wrapped in React Context providers
  (`src/services/`). No custom backend server; only the client-safe anon
  key is used (see Master Context §5 — no service-role key in frontend
  code).

## Getting Started

```bash
npm install
npm run dev       # start dev server
npm run build     # production build
npm run lint      # oxlint
npm run preview   # preview production build
```

## What's Implemented (Phases 1–8)

| Phase | Area | Status |
|-------|------|--------|
| 1 | React foundation, routing, mobile-first layout | ✅ |
| 2 | Placements — create / edit / delete events, calendar view | ✅ |
| 3 | Preparation — categories, companies & topics with hierarchy, CRUD, status filters | ✅ |
| 4 | Interview File Manager — nested folders, rename, upload/download, delete | ✅ |
| 5 | Health — daily log (Today/Yesterday editable, explicit Save) + monthly history browser | ✅ |
| 6 | Notes — create/edit/delete/download/search, image insert, rich text formatting toolbar | ✅ |
| 7 | One More Thing — quiet daily quote/image feed shown on Dashboard (no add/upload UI; curated externally) | ✅ |
| 8 | Supabase (Postgres + Storage) integration | ✅ |

All data now lives in Supabase Postgres; uploaded files/images (Interview
Files, Note attachments/inline images, Profile photo) are uploaded to
Supabase Storage buckets and only their public URLs are stored in the
database. See `supabase/schema.sql` for the full schema, and the
"Connecting to Supabase" section below for setup steps.

## Project Structure

```
src/
├── assets/
├── components/
│   ├── layout/          # AppLayout shell (sidebar + bottom nav + outlet)
│   ├── navigation/        # Sidebar, BottomNav, NavItems (shared nav config)
│   ├── dashboard/          # Dashboard-only presentational components
│   ├── placements/          # Placement card
│   ├── preparation/           # Category tabs, status filters, topic item, manage panel
│   ├── health/                  # Toggle, meal selector, sleep input, reminder card
│   ├── notes/                     # Note card
│   ├── files/                       # Folder/file manager UI pieces
│   ├── onemorething/                  # OneMoreThingCard (read-only display)
│   └── common/                          # Button, Card, PageHeader, FormField, ConfirmButton, etc.
├── pages/
│   ├── Dashboard/
│   ├── Placements/          (+ PlacementDetail, PlacementForm)
│   ├── Preparation/           (+ InterviewFilesRoot, InterviewFolderDetail)
│   ├── Health/
│   ├── Notes/                    (+ NoteEditor)
│   ├── OneMoreThing/
│   └── Settings/
├── data/
│   └── mockData.js       # seed data, shaped like the future Supabase schema
├── hooks/                  # one hook per domain; all persisted via useLocalStorageState
├── services/                 # Context providers wrapping the hooks above
├── utils/                       # date helpers
├── App.jsx                        # routes + provider tree
└── main.jsx
```

## Routes

| Path                              | Page                             |
| ---------------------------------- | --------------------------------- |
| `/`                                | Dashboard                         |
| `/placements`                     | Placements list                   |
| `/placements/new`                 | Add placement event                |
| `/placements/:eventId`            | Placement detail                   |
| `/placements/:eventId/edit`       | Edit placement event               |
| `/preparation`                    | Preparation Categories -> Topics tracker |
| `/preparation/companies`          | Preparation Companies -> Topics tracker |
| `/preparation/files`              | Interview Prep file manager root    |
| `/preparation/files/:folderId`    | Folder detail (nested)              |
| `/health`                         | Health habit tracker                |
| `/notes`                          | Notes list                          |
| `/notes/:noteId`                  | Note editor                         |
| `/one-more-thing`                 | Quiet daily quote/image feed         |
| `/settings`                       | Settings                            |

## Notes on Implementation

- **No CSE/IT bias**: Preparation categories/topics are fully user-defined.
- **Notes formatting toolbar (`NoteToolbar`)**: sits directly above the
  editor and supports Bold, Italic, 4 font sizes, and text color (preset
  swatches + a native color picker), applied via the browser's built-in
  `execCommand` (still supported everywhere for these operations, so no
  extra editor framework dependency was needed). All page-level actions
  (Insert Image, Attach File, Download, Delete, Save) were moved into a
  single action bar at the very top of the note editor page, above the
  title field.
- **Placements calendar**: `/placements` has a List/Calendar toggle. The
  calendar (`PlacementCalendar`) shows a month grid with a dot on any day
  that has an event; selecting a day shows that day's events below
  (`SelectedDayEvents`).
- **Light/dark theme toggle**: `ThemeContext` tracks `theme` ("light" |
  "dark"), persists the choice in `localStorage` (`dashboard.theme`), and
  respects the OS/browser `prefers-color-scheme` on first visit. It syncs
  a `dark` class onto `<html>`, which Tailwind's `dark:` variant
  (`@custom-variant dark` in `index.css`) responds to. Every component
  with a background/text/border color has a matching `dark:` variant —
  the `ThemeToggle` button (🌙/☀️) lives in the desktop Sidebar footer, at
  the top of the mobile content area, and again on the Settings page for
  discoverability.
- **File preview & editing (`FileViewerModal`)**: clicking any file row
  (Interview Prep files, Note attachments) opens a modal that renders:
  images and SVG inline, PDFs via `<iframe>`, `.txt`/`.py` as editable
  plain text (Edit → Save writes back through `updateFileContent` /
  `onSaveText`), `.docx`/`.doc` converted to HTML via `mammoth`, and
  `.csv`/`.xls`/`.xlsx` rendered as a real table (with a sheet-tab
  switcher for multi-sheet workbooks) via `xlsx`. `.ppt`/`.pptx` have no
  lightweight in-browser renderer, so the modal clearly says so and
  offers Download instead. Images are read-only (can only be deleted),
  per spec.
- **"One More Thing" cycles daily, not randomly, and is never explicitly
  labeled as motivation/inspiration in the UI**: `useOneMoreThingData.getTodayItem()`
  picks `dayIndex() % items.length` (days since epoch, local time) so
  the Dashboard shows a different quote/image every calendar day and
  only repeats once every item has been shown exactly once. There is
  intentionally **no add/upload UI anywhere in the app** — content is
  curated directly in the Supabase Table Editor (`one_more_thing_rotation`
  / `one_more_thing_fixed` tables); the page at `/one-more-thing` is
  read-only, reachable via its own bottom-nav/sidebar tab (below Notes)
  and a "See more" link on the Dashboard.
- **Nested folders**: `useInterviewFiles` models folders with
  `parentFolderId` (`parent_folder_id` in Postgres). Folders and files
  support create/rename/delete; files upload to the "interview-files"
  Supabase Storage bucket and are downloadable from any device since
  the stored URL is a real hosted URL, not a session-only blob URL.
- **No progress-based motivation on the Dashboard**: only a single item
  from "One More Thing" is shown; no completion stats, streaks, etc.
- **Health edits require an explicit Save**: the Health page stages
  fruits/nuts/meals/sleep changes in local form state and only writes
  them via `saveLogForDate` when the Save button is pressed — no more
  auto-save on every toggle. A Today/Yesterday selector
  (`DaySelector`) lets the user correct either day's entry. A separate
  History tab (`HealthTabs`) has two compact Month/Year `<select>`
  dropdowns (`MonthYearPicker`) — not a single wide button — that browse
  `getLogsForMonth(year, month)`. The fruit-reminder feature was removed
  entirely (no more reminder days/times in Settings).
- **Mobile-first**: `AppLayout` renders a bottom tab bar on mobile and a
  sidebar on desktop (`md:` breakpoint switch).
- **Persistence today, Supabase tomorrow**: all domain hooks
  (`usePlacementsData`, `usePreparationData`, `useInterviewFiles`,
  `useHealthData`, `useNotesData`, `useOneMoreThingData`, `useSettingsData`,
  `useLettersData`) now talk to Supabase directly instead of
  `useLocalStorageState`; `useLocalStorageState` itself is still available
  in `src/hooks/useLocalStorageState.js` for any future local-only feature.

## Connecting to Supabase

1. Create a free Supabase project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env` and fill in your project's URL + anon
   public key (Project Settings → API in the Supabase dashboard). Never
   put the service-role key in this file — it must never reach the
   frontend.
3. Apply the database schema — two options:
   - **Automated (recommended):** get your database connection string
     from Project Settings → Database → Connection string → URI, add it
     to `.env` as `SUPABASE_DB_URL=...` (see `.env.example` for the exact
     format), then run:
     ```bash
     npm run db:migrate
     ```
     This runs `supabase/schema.sql` directly against your database. It's
     safe to re-run anytime — every statement is idempotent (`create
     table if not exists`, `on conflict do nothing`, policies are
     dropped-then-recreated).
   - **Manual:** open the Supabase SQL Editor and paste/run the entire
     contents of `supabase/schema.sql` yourself.

   Either way, this creates every table, enables RLS with "allow all"
   policies (this app has no authentication, see Master Context §5), and
   creates the four public Storage buckets the app uses
   (`interview-files`, `note-attachments`, `profile-photos`,
   `one-more-thing`).
4. Restart `npm run dev` after editing `.env` (Vite only reads env vars
   at startup).
5. Optional: seed the "One More Thing" feed by adding rows directly in
   the Supabase Table Editor to `one_more_thing_rotation` (alternating
   `type = 'quote'` / `type = 'image'` rows, ordered by
   `rotation_order`) and a single row to `one_more_thing_fixed`.

## Next Steps (do not start automatically — wait for instruction)

- Phase 9: Testing (mobile/desktop, file upload/download, persistence,
  RLS behavior with the anon key).

## Deploying (Cloudflare Pages)

The app is a static Vite build with client-side routing (React Router's
`BrowserRouter`), so hosting it is just "build + serve the `dist/`
folder" on any static host. Cloudflare Pages is the one called out in
the Master Context, and it's free for this use case.

1. **Push this repo to GitHub** (create a new empty repo on GitHub first,
   then from this folder):
   ```bash
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin master
   ```
2. **Cloudflare dashboard** → Workers & Pages → Create → Pages → Connect
   to Git → pick this repo.
3. Build settings:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. **Environment variables** (Pages → Settings → Environment variables) —
   add these for both Production and Preview:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   (Never add `SUPABASE_DB_URL` here — that one is only for your local
   `npm run db:migrate` and must never reach the deployed build.)
5. Click **Save and Deploy**. Cloudflare builds and gives you a URL like
   `harvesta.pages.dev` — that's the public link to share.
6. `public/_redirects` (already in this repo) tells Cloudflare Pages to
   serve `index.html` for every route, so refreshing/deep-linking into
   e.g. `/preparation` or `/one-more-thing` works instead of 404ing —
   required because routing happens client-side.

After the first deploy, every `git push` to `master` auto-redeploys —
no manual rebuild step needed.

## Handing Off To A New User

`scripts/reset-for-new-user.js` wipes all personal data (placements,
preparation topics, interview files, notes, letters, health logs,
settings/profile photo, letters passcode) back to a fresh-install state,
while deliberately leaving the "one-more-thing" Storage bucket's photos
alone. Run it once against the target Supabase project before handing
the app/URL to someone new:

```bash
npm run db:reset-for-new-user
```

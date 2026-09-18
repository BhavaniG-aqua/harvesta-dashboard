# Harvesta — Phases 1–7 (React Frontend Complete)

A lightweight, mobile-first personal dashboard built for a friend's campus
placement season. See `Personal_Dashboard_Master_Context.md` in the repo
root for the full product spec and constraints.

## Stack

- React 19 + Vite
- React Router v7
- Tailwind CSS v4 (via `@tailwindcss/vite`) — custom sea-blue + amber palette (see `src/index.css` `@theme`), with a full light/dark theme toggle (`ThemeContext` + `ThemeToggle`, class-based via `@custom-variant dark`)
- `mammoth` (docx → HTML) and `xlsx` (xls/xlsx/csv → table) for in-browser file preview, both lazy-loaded via dynamic `import()` so they don't bloat the initial bundle
- **No backend yet.** All data lives in `localStorage` via small domain
  hooks (see `src/hooks/`) wrapped in React Context providers
  (`src/services/`). Supabase integration is Phase 8 — not started.

## Getting Started

```bash
npm install
npm run dev       # start dev server
npm run build     # production build
npm run lint      # oxlint
npm run preview   # preview production build
```

## What's Implemented (Phases 1–7)

| Phase | Area | Status |
|-------|------|--------|
| 1 | React foundation, routing, mobile-first layout | ✅ |
| 2 | Placements — create / edit / delete events, calendar view | ✅ |
| 3 | Preparation — categories & topics CRUD, rename, status filters | ✅ |
| 4 | Interview File Manager — nested folders, rename, upload/download, delete | ✅ |
| 5 | Health — daily log (Today/Yesterday editable, explicit Save) + monthly history browser | ✅ |
| 6 | Notes — create/edit/delete/download/search, image insert, rich text formatting toolbar | ✅ |
| 7 | One More Thing — quiet daily quote/image feed shown on Dashboard (no add/upload UI; curated externally) | ✅ |
| 8 | Supabase (Postgres + Storage) integration | ⏳ Not started |

All data persists across page reloads via `localStorage` (see
`useLocalStorageState`). Uploaded files/images use in-memory blob URLs,
which do **not** survive a reload — this is expected and will be replaced
by real Supabase Storage URLs in Phase 8.

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
| `/preparation`                    | Preparation Topics tracker         |
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
  curated by hand in `mockData.js` today (a Supabase table in Phase 8);
  the page at `/one-more-thing` is read-only, reachable via its own
  bottom-nav/sidebar tab (below Notes) and a "See more" link on the
  Dashboard.
- **Nested folders**: `useInterviewFiles` models folders with
  `parentFolderId`, mirroring the intended Supabase schema. Folders and
  files support create/rename/delete; files support upload/download
  (download only works for files uploaded in the current session, since
  blob URLs aren't persisted).
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
  `useHealthData`, `useNotesData`, `useOneMoreThingData` (read-only, no
  persistence needed since there's no in-app write path),
  `useSettingsData`) use `useLocalStorageState` internally where
  relevant. Swapping to Supabase later means replacing the *inside* of
  these hooks — the components' props/behavior should not need to change.

## Next Steps (do not start automatically — wait for instruction)

- Phase 8: Supabase integration (Postgres + Storage), replacing
  `useLocalStorageState` with real Supabase calls inside each hook, and
  wiring RLS policies carefully since there's no authentication.
- Phase 9: Testing (mobile/desktop, file upload/download, persistence).
- Phase 10: Deployment to Cloudflare Pages via GitHub.

# Friend Dashboard — Phases 1–7 (React Frontend Complete)

A lightweight, mobile-first personal dashboard built for a friend's campus
placement season. See `Personal_Dashboard_Master_Context.md` in the repo
root for the full product spec and constraints.

## Stack

- React 19 + Vite
- React Router v7
- Tailwind CSS v4 (via `@tailwindcss/vite`)
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
| 5 | Health — daily log, fruit reminders driven by Settings | ✅ |
| 6 | Notes — create/edit/delete/download/search, image insert | ✅ |
| 7 | Inspiration — manage motivation/funny content, shown on Dashboard | ✅ |
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
│   ├── motivation/                    # Inspiration item card, add form
│   └── common/                          # Button, Card, PageHeader, FormField, ConfirmButton, etc.
├── pages/
│   ├── Dashboard/
│   ├── Placements/          (+ PlacementDetail, PlacementForm)
│   ├── Preparation/           (+ InterviewFilesRoot, InterviewFolderDetail)
│   ├── Health/
│   ├── Notes/                    (+ NoteEditor)
│   ├── Inspiration/
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
| `/inspiration`                    | Manage motivation/funny content      |
| `/settings`                       | Settings                            |

## Notes on Implementation

- **No CSE/IT bias**: Preparation categories/topics are fully user-defined.
- **Placements calendar**: `/placements` has a List/Calendar toggle. The
  calendar (`PlacementCalendar`) shows a month grid with a dot on any day
  that has an event; selecting a day shows that day's events below
  (`SelectedDayEvents`).
- **Nested folders**: `useInterviewFiles` models folders with
  `parentFolderId`, mirroring the intended Supabase schema. Folders and
  files support create/rename/delete; files support upload/download
  (download only works for files uploaded in the current session, since
  blob URLs aren't persisted).
- **No progress-based motivation on the Dashboard**: only a single random
  quote/joke is shown; no completion stats, streaks, etc. Full
  Inspiration management lives at `/inspiration` (reachable via a "See
  more" link on the Dashboard and a link on Settings) — kept out of the
  main 6-item bottom nav per the master context's Section 8 spec.
- **Health edits require an explicit Save**: the Health page stages
  fruits/nuts/meals/sleep changes in local form state and only writes
  them via `saveLogForDate` when the Save button is pressed — no more
  auto-save on every toggle. A Today/Yesterday selector
  (`DaySelector`) lets the user correct either day's entry.
- **Settings-driven reminders**: `useHealthData` reads `reminderDays` /
  `reminderTimes` from Settings and auto-generates today's fruit reminders
  if today is a configured day. Reminders stay "pending" until marked
  DONE, so they naturally persist across days until dismissed.
- **Mobile-first**: `AppLayout` renders a bottom tab bar on mobile and a
  sidebar on desktop (`md:` breakpoint switch).
- **Persistence today, Supabase tomorrow**: all domain hooks
  (`usePlacementsData`, `usePreparationData`, `useInterviewFiles`,
  `useHealthData`, `useNotesData`, `useInspirationData`,
  `useSettingsData`) use `useLocalStorageState` internally. Swapping to
  Supabase later means replacing the *inside* of these hooks — the
  components' props/behavior should not need to change.

## Next Steps (do not start automatically — wait for instruction)

- Phase 8: Supabase integration (Postgres + Storage), replacing
  `useLocalStorageState` with real Supabase calls inside each hook, and
  wiring RLS policies carefully since there's no authentication.
- Phase 9: Testing (mobile/desktop, file upload/download, persistence).
- Phase 10: Deployment to Cloudflare Pages via GitHub.

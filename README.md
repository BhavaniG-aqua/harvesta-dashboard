# Friend Dashboard — Phase 1 (React Foundation)

A lightweight, mobile-first personal dashboard built for a friend's campus
placement season. See `Personal_Dashboard_Master_Context.md` in the repo
root for the full product spec and constraints.

## Stack

- React 19 + Vite
- React Router v7
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Mock data only for now — no backend yet (Supabase comes in Phase 8)

## Getting Started

```bash
npm install
npm run dev       # start dev server
npm run build     # production build
npm run lint       # oxlint
npm run preview    # preview production build
```

## Project Structure

```
src/
├── assets/            # static assets (images, icons)
├── components/
│   ├── layout/         # AppLayout shell (sidebar + bottom nav + outlet)
│   ├── navigation/      # Sidebar, BottomNav, NavItems (shared nav config)
│   ├── dashboard/        # Dashboard-only presentational components
│   ├── placements/        # Placement card, etc.
│   ├── preparation/         # Category tabs, status filters, topic item
│   ├── health/               # Toggle, meal selector, sleep input, reminder
│   ├── notes/                  # Note card
│   ├── files/                    # Folder/file manager UI pieces
│   ├── motivation/                 # (reserved for Phase 7)
│   └── common/                       # Button, Card, PageHeader, etc.
├── pages/
│   ├── Dashboard/
│   ├── Placements/         (+ PlacementDetail)
│   ├── Preparation/         (+ InterviewFilesRoot, InterviewFolderDetail)
│   ├── Health/
│   ├── Notes/                (+ NoteEditor)
│   └── Settings/
├── data/
│   └── mockData.js    # all mock data, shaped like the future Supabase schema
├── hooks/              # usePreparationData, useInterviewFiles, useHealthData, useNotesData
├── services/           # React context providers wrapping the hooks above
├── utils/              # date helpers
├── App.jsx             # routes
└── main.jsx
```

## Routes

| Path                              | Page                          |
| ---------------------------------- | ------------------------------ |
| `/`                                | Dashboard                      |
| `/placements`                     | Placements list                |
| `/placements/:eventId`            | Placement detail               |
| `/preparation`                    | Preparation Topics tracker      |
| `/preparation/files`              | Interview Prep file manager root |
| `/preparation/files/:folderId`    | Folder detail (nested)          |
| `/health`                         | Health habit tracker            |
| `/notes`                          | Notes list                      |
| `/notes/:noteId`                  | Note editor                     |
| `/settings`                       | Settings                        |

## Notes on Implementation

- **No CSE/IT bias**: Preparation categories/topics are fully user-defined
  (see `usePreparationData`), matching the master context's EEE/core focus.
- **Nested folders**: `useInterviewFiles` models folders with
  `parentFolderId`, mirroring the intended Supabase schema.
- **No progress-based motivation on the Dashboard**: only a single random
  quote/joke is shown; no completion stats, streaks, etc.
- **Mobile-first**: `AppLayout` renders a bottom tab bar on mobile and a
  sidebar on desktop (`md:` breakpoint switch).
- All data is currently in-memory (via hooks + mock seed data). Swapping
  to Supabase later means replacing the *inside* of these hooks — the
  components' props/behavior should not need to change.

## Next Steps (do not start automatically — wait for instruction)

- Phase 2: Placement calendar create/edit forms
- Phase 3: Preparation category/topic edit + delete polish
- Phase 4: Interview file manager polish (drag/drop, rename)
- Phase 5: Health — richer reminder scheduling logic
- Phase 6: Notes — richer rich-text editor if needed
- Phase 7: Inspiration — dedicated page/content rotation
- Phase 8: Supabase integration (Postgres + Storage)

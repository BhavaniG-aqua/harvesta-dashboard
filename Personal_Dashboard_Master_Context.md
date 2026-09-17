# Friend Personal Dashboard — Updated Master Project Context

## 1. Project Overview

We are building a personal web dashboard dedicated to one friend.

The friend is an **M.Tech EEE student at IIT Kharagpur** and is currently focused on **campus placements, placement preparation, interviews, and basic health habits**.

This is a lightweight personal dashboard, not a general student management system.

The website should help him:

- Track upcoming core placement companies and events
- Store company requirements, roles, packages, and preparation information
- Organize placement preparation material
- Track preparation topics using simple statuses
- Upload and download placement-related files
- Maintain general notes
- Track a few basic health habits
- Remember recurring fruit-buying tasks
- View motivational/inspirational content
- Quickly understand what requires attention

The friend will **not interact with the website heavily**, so the UX must minimize typing and unnecessary interaction.

---

# 2. Core Goal

The goal is to create a simple personal command center for the placement period.

The ideal interaction is:

> Open the website → see what is coming up → check what needs to be done → update a few things if necessary → leave.

The website should prioritize:

- Simplicity
- Speed
- Mobile usability
- Clear information
- Minimal interaction
- Easy maintenance
- Free hosting and storage

---

# 3. Important Scope Decision

The friend is an **EEE student**, not a CSE/IT student.

Therefore:

- Do NOT assume software engineering preparation.
- Do NOT hard-code DSA, programming, SQL, software engineering, or IT interview categories.
- Do NOT create predefined CSE-oriented preparation categories.

His placements will primarily be **core EEE/core engineering related**.

The preparation categories/topics should therefore be **fully configurable by the user**.

He should be able to create his own:

- Preparation categories
- Topics
- Company-specific preparation items
- Other preparation areas

The system should provide the structure and let him decide what belongs inside it.

---

# 4. Technology Architecture

Use a simple serverless architecture.

```text
                         INTERNET
                            │
                            ▼
                  ┌────────────────────┐
                  │  Cloudflare Pages  │
                  │   React + Vite     │
                  └─────────┬──────────┘
                            │
                         API/HTTPS
                            │
                            ▼
                  ┌────────────────────┐
                  │      Supabase      │
                  │                    │
                  │ PostgreSQL         │
                  │ Storage            │
                  └────────────────────┘
```

## Frontend

- React
- Vite
- JavaScript or TypeScript
- React Router if required
- Lightweight styling solution such as Tailwind CSS

## Database

- Supabase PostgreSQL

## File Storage

- Supabase Storage

## Source Control

- Git
- GitHub

## Hosting

- Cloudflare Pages

## Domain

Use the free hosting-provided domain initially:

```text
your-project.pages.dev
```

## Backend

No traditional Node.js/Express server is required initially.

Use Supabase directly from the React application for database and storage operations.

---

# 5. No Authentication

Authentication is intentionally NOT required.

Do not implement:

- Login
- Signup
- Passwords
- User registration
- Multi-user accounts

This is a single-purpose personal dashboard.

However, never expose privileged backend credentials such as a Supabase service-role key in frontend code.

Only client-safe configuration may be used in the React application.

Because authentication is absent, database/storage access must be designed carefully later.

---

# 6. Free Requirement

The entire project should initially cost **₹0**.

Use free tiers for:

- Development
- GitHub
- Hosting
- Database
- Storage
- Deployment

Avoid paid APIs or services unless explicitly approved later.

Be conscious of:

- Database limits
- Storage limits
- Bandwidth limits
- Build limits
- Serverless/function limits

The application is for one friend, so the expected usage is small.

---

# 7. Mobile-First Requirement

The friend will primarily use the website from his mobile phone.

Therefore mobile-first development is mandatory.

Target:

- 360px
- 375px
- 390px
- 412px
- Tablet
- Desktop

Requirements:

- Touch-friendly buttons
- No unnecessary typing
- No horizontal scrolling
- Readable text
- Appropriate spacing
- Responsive cards
- Simple navigation
- Fast loading
- Mobile-friendly file handling
- Desktop should adapt naturally but mobile is the priority

---

# 8. Main Website Sections

The main navigation should contain:

```text
🏠 Dashboard

💼 Placements

🎯 Preparation

❤️ Health

📝 Notes

⚙️ Settings
```

There is no semester/academic section.

There is no separate sleep section.

Sleep belongs inside Health.

---

# 9. Dashboard

The Dashboard is a quick overview.

It should contain only useful, high-level information.

## Include

### Greeting

Example:

> Good morning 👋

Show the current date.

### Upcoming Placement Event

Example:

```text
Next Event

Siemens
Power Engineer
Oct 10
```

### Today's Focus / Important Items

Show only a small number of relevant upcoming items or reminders.

### Upcoming Placement Events

Show upcoming companies/events with:

- Company
- Date
- Role

### Health Summary

Show basic health information such as:

- Fruits: ✓ / ✗
- Nuts: ✓ / ✗
- Meals: 1 / 2 / 3
- Sleep: 7h 20m

### Motivation / Inspiration

Display one of the inspirational content formats described later.

## Do NOT include

- Preparation progress
- Topics that need revision
- Completion statistics
- Preparation completion summaries

The dashboard should not feel like a performance-monitoring system.

---

# 10. Placement Calendar

This is a dedicated calendar for campus/core placement activities.

It is NOT a general academic calendar.

The user should be able to track which company comes when.

Each placement event/company should contain:

- Company name
- Date
- Time
- Role name
- Package / CTC
- Requirements
- Selection process if needed
- What to prepare
- Additional information/notes

Example:

```text
Company:
ABC Energy

Date:
October 10

Role:
Graduate Engineer Trainee

Package:
X LPA

Requirements:
[User-defined]

Selection Process:
[User-defined]

What to Prepare:
[User-defined]
```

## Do NOT include

- Application deadline
- Preparation status

Those are intentionally excluded from the Placement Calendar.

The calendar should primarily answer:

> Which company is coming when, what role are they offering, what is the package, what are their requirements, and what should I prepare?

---

# 11. Placement Preparation

Create a dedicated Placement Preparation area.

The preparation system must be **user-defined**.

Do NOT assume predefined CSE/IT categories.

The user should be able to create their own categories.

For example, the user may create:

```text
Electrical Machines
Power Systems
Control Systems
Power Electronics
Company Preparation
Technical Interview
```

But these are only examples.

The application itself should not force these categories.

---

# 12. Preparation Topics

Create a separate feature called:

## Preparation Topics

This is primarily a topic tracker, not a notes system.

The friend will usually add a topic and track its state instead of writing long study notes.

Each topic has exactly ONE status:

```text
NEW
COMPLETED
REVISE
```

Only one status can be active at any time.

Example:

```text
Power Transformer

[ NEW ] [ COMPLETED ] [ REVISE ]
```

The user should be able to:

- Create categories
- Create topics
- Edit topics
- Delete topics
- Change topic status
- Filter by status

Filters:

```text
ALL
NEW
COMPLETED
REVISE
```

The system may display counts inside this page if useful, but do NOT push completion statistics into the Dashboard.

---

# 13. Interview Preparation

Interview Preparation should provide a file/folder organization system.

The user should be able to:

- Create folders
- Create nested folders inside folders
- Rename folders
- Delete folders
- Upload files into a folder
- Download files
- View files
- Delete files where appropriate

Example:

```text
Interview Preparation
│
├── Siemens
│   ├── Previous Questions
│   │   ├── questions.pdf
│   │   └── notes.pdf
│   │
│   ├── Company Information
│   │   └── company.pdf
│   │
│   └── Technical Preparation
│       └── preparation.pdf
│
├── Tata Power
│   ├── Questions
│   └── Resources
│
└── General
    ├── HR
    └── Technical
```

The folder hierarchy should support arbitrary nesting.

This should behave somewhat like a lightweight personal file manager.

---

# 14. File Storage

Files uploaded by the user must be stored in free cloud storage.

Preferred:

## Supabase Storage

Do NOT store uploaded files directly inside the React application.

The application should eventually use:

```text
React
  ↓
Supabase Storage
  ↓
Uploaded file
```

The database can store metadata such as:

- File name
- Folder ID
- Storage path
- File type
- File size
- Created date

Files should be accessible from different devices.

Example:

```text
Upload from laptop
       ↓
Supabase Storage
       ↓
Download/view from mobile
```

---

# 15. General Notes

Notes are for general information and should work more like a simple personal notepad.

The friend may use notes for anything that does not belong in Preparation Topics.

Required capabilities:

- Create a new note
- Save note
- Edit note
- Delete note
- Download note
- Insert images
- View notes
- Search notes if useful

The experience should be similar to a lightweight notepad/document editor.

Example:

```text
New Note

Title:
[ Interview questions ]

Content:

[ Rich/simple editor area ]

Insert image
Save
Download
```

Images inserted into notes should eventually be stored in Supabase Storage rather than embedded as huge base64 strings in the database.

Notes are general-purpose and should not be tightly coupled to placement preparation.

---

# 16. Health

Health should remain intentionally simple.

This is a basic habit tracker, NOT a medical or detailed fitness application.

Health contains:

```text
Health
├── Daily Food
├── Sleep
└── Fruit Reminder
```

Do NOT create:

- Water tracking
- Exercise tracking
- Detailed calorie tracking
- Meal-by-meal tracking
- Detailed nutrition analytics

---

# 17. Daily Food Tracking

Do NOT track individual meals.

Instead, record a simple daily summary.

For each day track:

### Fruits

Did he eat fruits?

```text
✓ / ✗
```

### Nuts

Did he eat nuts?

```text
✓ / ✗
```

### Number of meals

Choose exactly one:

```text
1
2
3
```

### Sleep

Track:

```text
Hours slept
```

Example:

```text
September 17

🍎 Fruits: ✓
🥜 Nuts: ✓
🍽️ Meals: 3
😴 Sleep: 7.5 hours
```

The interaction should take only a few seconds.

---

# 18. Sleep

Sleep is inside Health.

Track only:

- Sleep duration

Optionally, later, the user may record:

- Sleep time
- Wake-up time

But do not turn this into a complicated sleep analytics system.

The main information needed is:

> How many hours did he sleep?

Show simple recent history if useful.

---

# 19. Fruit Buying Reminders

There should be recurring reminders to buy fruits.

Requirement:

- 2 reminder days per week
- 3 reminders per day on those days

The exact reminder days should be configurable.

For example:

```text
Tuesday
Thursday

09:00
14:00
20:00
```

If the friend does not mark the reminder as completed:

```text
Today:
🍎 Buy fruits

[ DONE ]
```

If not completed, give a reminder again the following day.

Example:

```text
Tuesday
Reminder → Not completed

Wednesday
🔔 Reminder again
```

Once marked DONE, do not keep reminding for that task.

The exact reminder implementation can initially be simple and can later use browser notification capabilities if appropriate.

Do not create a complicated notification backend unless required.

---

# 20. Motivation / Inspiration

Remove all progress-based motivational systems.

Do NOT include:

- Progress reminders
- Placement completion reminders
- Achievement messages
- Completion streaks
- "You completed X topics"
- "You have revised X topics"
- Career progress scoring
- Daily preparation statistics
- Future-goal pressure messages

The purpose here is simply to provide **inspiration and entertainment**, not to monitor performance.

There should be one or two sections/forms of inspirational content.

## Inspiration Format 1 — Quotes / Achievements / Images / Information

This section can contain:

- Inspirational quotes
- Images
- Short stories
- Information about someone who achieved something
- Interesting achievements
- Short inspirational facts
- Photos with captions

Examples:

```text
"Quote of the day"

[IMAGE]

Short information about a person
who achieved something remarkable.
```

The content can be manually curated.

Later, we can decide whether this should rotate automatically.

## Inspiration Format 2 — Funny / Entertainment

A separate section can contain:

- Funny images
- Memes
- Light jokes
- Funny engineering-related content
- Placement-season humor
- Relatable student content
- Short entertaining content

The exact design/content strategy will be decided later.

For now, create the architecture so these can exist as separate content types.

---

# 21. Settings

Settings should be lightweight.

Potential configuration:

- Friend's name
- Reminder days
- Reminder times
- Fruit reminder settings
- Sleep target if eventually needed
- Basic dashboard preferences

Do not build an extensive settings system.

---

# 22. Data Model — High-Level

The eventual Supabase database will likely contain entities such as:

```text
placement_events
placement_requirements
preparation_categories
preparation_topics
interview_folders
interview_files
notes
note_images
health_daily_logs
fruit_reminders
inspiration_content
settings
```

The exact schema should be designed before database implementation.

The database should support folder nesting using a parent-folder relationship.

Example:

```text
folder
id
name
parent_folder_id
```

Root folders have:

```text
parent_folder_id = NULL
```

Nested folders reference their parent.

---

# 23. React Architecture

Suggested frontend structure:

```text
src/
│
├── assets/
│
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── dashboard/
│   ├── placements/
│   ├── preparation/
│   ├── health/
│   ├── notes/
│   ├── files/
│   ├── motivation/
│   └── common/
│
├── pages/
│   ├── Dashboard/
│   ├── Placements/
│   ├── Preparation/
│   ├── Health/
│   ├── Notes/
│   └── Settings/
│
├── data/
│   └── mockData
│
├── hooks/
│
├── services/
│
├── utils/
│
├── App
└── main
```

Keep components modular but do not over-engineer.

---

# 24. Development Strategy

Develop incrementally.

## Phase 1 — React Foundation

Build:

- React + Vite
- Routing
- Mobile-first layout
- Navigation
- Page structure
- Dashboard
- Placement page
- Preparation page
- Health page
- Notes page
- Settings page
- Mock data

No backend yet.

---

## Phase 2 — Placement Features

Implement:

- Placement calendar
- Placement event creation/editing
- Company details
- Requirements
- Role
- Package
- What to prepare

---

## Phase 3 — Preparation

Implement:

- User-created preparation categories
- User-created topics
- NEW / COMPLETED / REVISE status
- Filters
- Topic management

---

## Phase 4 — Interview File Manager

Implement:

- Folder creation
- Nested folders
- File upload
- File listing
- File download
- File deletion
- File/folder management

---

## Phase 5 — Health

Implement:

- Daily fruit status
- Nuts status
- Meal count: 1/2/3
- Sleep hours
- Fruit-buying reminders
- Reminder completion

---

## Phase 6 — Notes

Implement:

- Create note
- Save
- Edit
- Delete
- Download
- Image insertion
- Image storage

---

## Phase 7 — Inspiration

Implement:

- Inspirational content
- Achievement/story/image content
- Funny/entertainment content
- Content rotation if required

---

## Phase 8 — Supabase

Connect:

```text
React
 ↓
Supabase PostgreSQL
 ↓
Supabase Storage
```

Move mock data to persistent storage.

---

## Phase 9 — Testing

Test:

- Mobile
- Desktop
- File upload/download
- Nested folders
- Database persistence
- Notes
- Health logs
- Reminders
- Responsive layout
- Security
- Performance

---

## Phase 10 — Deployment

Deployment flow:

```text
Developer
   ↓
VS Code
   ↓
Git
   ↓
GitHub
   ↓
Cloudflare Pages
   ↓
Build
   ↓
Deploy
   ↓
Public URL
```

Example:

```text
friend-dashboard.pages.dev
```

The friend should be able to access the application from his mobile without running anything locally.

---

# 25. Development Principles

Follow these rules throughout the project:

1. Mobile-first.
2. Keep interaction minimal.
3. Do not assume CSE/IT placement topics.
4. Let the user define EEE/core preparation categories and topics.
5. No authentication.
6. No semester/academic management.
7. Sleep belongs inside Health.
8. Health should remain simple.
9. No water tracking.
10. No exercise tracking.
11. No meal-by-meal tracking.
12. No progress-based motivation.
13. Do not turn the dashboard into a performance-monitoring system.
14. Notes should behave like a lightweight notepad.
15. Interview Preparation should support arbitrary nested folders.
16. Files should eventually use Supabase Storage.
17. Keep the entire project compatible with free hosting.
18. Never expose privileged credentials in frontend code.
19. Avoid unnecessary dependencies.
20. Avoid over-engineering.
21. Use mock data during frontend development.
22. Keep frontend data structures compatible with the future Supabase schema.
23. Build and test one phase at a time.
24. Do not automatically proceed to the next phase without instruction.

---

# 26. Success Criteria

The final website should allow the friend to quickly answer:

### Placements

- Which company is coming next?
- When is it coming?
- What role is available?
- What is the package?
- What are the requirements?
- What should I prepare?

### Preparation

- What topics have I added?
- Which are new?
- Which are completed?
- Which need revision?
- Where are my preparation files?

### Health

- Did I eat fruits today?
- Did I eat nuts?
- How many meals did I have?
- How many hours did I sleep?
- Do I need to buy fruits?

### Notes

- Can I quickly write something?
- Can I insert an image?
- Can I edit and save it?
- Can I download it later?

### Inspiration

- Can I see something motivating?
- Can I see an interesting achievement/story?
- Can I get something funny/entertaining?

The website should accomplish these tasks with minimal interaction and work smoothly on a mobile phone.

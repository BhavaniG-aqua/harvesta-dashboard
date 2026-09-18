// Centralized mock data for Phase 1 (React Foundation).
// Structure is designed to closely mirror the future Supabase schema
// described in the Master Context (Section 22), so migrating to real
// data later requires minimal changes to component logic.

export const settingsMock = {
  friendName: "Arjun",
  sleepTargetHours: 7,
};

// ---------------------------------------------------------------------------
// Placements
// ---------------------------------------------------------------------------
export const placementEventsMock = [
  {
    id: "pe-1",
    company: "Siemens",
    date: "2025-10-10",
    time: "10:00 AM",
    role: "Power Engineer",
    package: "18 LPA",
    requirements: "EEE/EE, CGPA > 7.5, no active backlogs",
    selectionProcess: "Online Test -> GD -> Technical Interview -> HR",
    whatToPrepare: "Power Systems, Electrical Machines, basic aptitude",
    notes: "Bring laptop for the online round.",
  },
  {
    id: "pe-2",
    company: "Tata Power",
    date: "2025-10-18",
    time: "9:30 AM",
    role: "Graduate Engineer Trainee",
    package: "14 LPA",
    requirements: "EEE, CGPA > 7.0",
    selectionProcess: "Written Test -> Technical Interview -> HR",
    whatToPrepare: "Power Systems, Control Systems, Company profile",
    notes: "",
  },
  {
    id: "pe-3",
    company: "ABB",
    date: "2025-10-25",
    time: "11:00 AM",
    role: "Graduate Engineer Trainee",
    package: "16 LPA",
    requirements: "EEE/Instrumentation",
    selectionProcess: "Aptitude -> Technical -> HR",
    whatToPrepare: "Power Electronics, Control Systems",
    notes: "",
  },
];

// ---------------------------------------------------------------------------
// Preparation — Categories & Topics
// ---------------------------------------------------------------------------
export const preparationCategoriesMock = [
  { id: "cat-1", name: "Electrical Machines" },
  { id: "cat-2", name: "Power Systems" },
  { id: "cat-3", name: "Control Systems" },
  { id: "cat-4", name: "Power Electronics" },
];

export const preparationTopicsMock = [
  { id: "top-1", categoryId: "cat-1", name: "Power Transformer", status: "REVISE" },
  { id: "top-2", categoryId: "cat-1", name: "Induction Motor", status: "COMPLETED" },
  { id: "top-3", categoryId: "cat-1", name: "Synchronous Machines", status: "NEW" },
  { id: "top-4", categoryId: "cat-2", name: "Load Flow Analysis", status: "NEW" },
  { id: "top-5", categoryId: "cat-2", name: "Fault Analysis", status: "REVISE" },
  { id: "top-6", categoryId: "cat-3", name: "Root Locus", status: "COMPLETED" },
  { id: "top-7", categoryId: "cat-4", name: "Buck-Boost Converter", status: "NEW" },
];

// ---------------------------------------------------------------------------
// Interview Preparation — Folder / File tree
// ---------------------------------------------------------------------------
export const interviewFoldersMock = [
  { id: "fol-1", name: "Siemens", parentFolderId: null },
  { id: "fol-2", name: "Previous Questions", parentFolderId: "fol-1" },
  { id: "fol-3", name: "Company Information", parentFolderId: "fol-1" },
  { id: "fol-4", name: "Technical Preparation", parentFolderId: "fol-1" },
  { id: "fol-5", name: "Tata Power", parentFolderId: null },
  { id: "fol-6", name: "Questions", parentFolderId: "fol-5" },
  { id: "fol-7", name: "Resources", parentFolderId: "fol-5" },
  { id: "fol-8", name: "General", parentFolderId: null },
  { id: "fol-9", name: "HR", parentFolderId: "fol-8" },
  { id: "fol-10", name: "Technical", parentFolderId: "fol-8" },
];

export const interviewFilesMock = [
  { id: "file-1", folderId: "fol-2", name: "questions.pdf", type: "pdf", size: "240 KB", createdAt: "2025-09-10" },
  { id: "file-2", folderId: "fol-2", name: "notes.pdf", type: "pdf", size: "120 KB", createdAt: "2025-09-11" },
  { id: "file-3", folderId: "fol-3", name: "company.pdf", type: "pdf", size: "310 KB", createdAt: "2025-09-09" },
  { id: "file-4", folderId: "fol-4", name: "preparation.pdf", type: "pdf", size: "500 KB", createdAt: "2025-09-12" },
];

// ---------------------------------------------------------------------------
// Notes
// ---------------------------------------------------------------------------
// `attachments` holds BOTH inline images and general file attachments
// (pdf, doc, etc.) for a note — mirrors the Interview Files shape
// ({ id, name, type, size, url, createdAt }) so the same FileRow-style
// UI and Supabase Storage pattern can be reused (Section 15).
export const notesMock = [
  {
    id: "note-1",
    title: "Interview questions",
    content: "Common HR questions to prep for:<br>- Tell me about yourself<br>- Why this company?",
    attachments: [],
    updatedAt: "2025-09-14",
  },
  {
    id: "note-2",
    title: "Siemens campus notes",
    content: "Reach venue by 9 AM. Carry 2 photocopies of resume.",
    attachments: [],
    updatedAt: "2025-09-15",
  },
];

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------
export const healthDailyLogsMock = [
  { id: "hl-1", date: "2025-09-17", fruits: true, nuts: true, meals: 3, sleepHours: 7.5 },
  { id: "hl-2", date: "2025-09-16", fruits: false, nuts: true, meals: 2, sleepHours: 6.5 },
  { id: "hl-3", date: "2025-09-15", fruits: true, nuts: false, meals: 3, sleepHours: 8 },
  { id: "hl-4", date: "2025-08-30", fruits: true, nuts: true, meals: 3, sleepHours: 7 },
  { id: "hl-5", date: "2025-08-15", fruits: false, nuts: false, meals: 2, sleepHours: 6 },
];

// ---------------------------------------------------------------------------
// Inspiration
// ---------------------------------------------------------------------------
export const inspirationContentMock = [
  {
    id: "insp-1",
    type: "motivation",
    quote: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    id: "insp-2",
    type: "motivation",
    quote: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
  },
  {
    id: "insp-3",
    type: "funny",
    text: "Engineers don't fail, they just find 10,000 ways that don't work.",
  },
  {
    id: "insp-4",
    type: "funny",
    text: "My code doesn't work, I have no idea why. My code works, I have no idea why.",
  },
];

import { oneMoreThingContentMock } from "../data/mockData";

// Number of whole days since the Unix epoch, in LOCAL time — used as a
// stable "day index" so the picked item only changes once per calendar
// day (not on every render/reload).
function dayIndex() {
  const now = new Date();
  const local = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor(local.getTime() / 86400000);
}

// Read-only hook for "One More Thing" — a small daily quote/image shown
// to quietly motivate, without ever labeling itself as "motivation" or
// "inspiration" to the user. Content is curated ahead of time (seeded
// into mockData.js today; a Supabase table in Phase 8) — there is
// intentionally NO add/upload UI in the app itself; content is managed
// entirely outside the running app.
//
// "Today's pick" cycles deterministically through every item exactly
// once (in stable insertion order) before repeating, using
// `dayIndex() % items.length`.
export function useOneMoreThingData() {
  const items = oneMoreThingContentMock;

  function getTodayItem() {
    if (items.length === 0) return null;
    const index = dayIndex() % items.length;
    return items[index];
  }

  return { items, getTodayItem };
}

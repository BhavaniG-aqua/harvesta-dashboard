import { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { inspirationContentMock } from "../data/mockData";

// Number of whole days since the Unix epoch, in LOCAL time — used as a
// stable "day index" so the picked item only changes once per calendar
// day (not on every render/reload).
function dayIndex() {
  const now = new Date();
  const local = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor(local.getTime() / 86400000);
}

// Persisted state hook for Inspiration content (motivation quotes,
// images, and funny content). Content is manually curated (added by the
// user) per Section 20 of the master context — no automatic fetching.
//
// "Today's pick" cycles deterministically through every item exactly
// once (in stable insertion order) before repeating, using
// `dayIndex() % items.length`. Adding a new item extends the cycle; it
// naturally gets folded in the next time the index wraps around.
export function useInspirationData() {
  const [items, setItems] = useLocalStorageState(
    "dashboard.inspirationContent",
    inspirationContentMock
  );

  const motivationItems = items.filter((i) => i.type === "motivation");
  const funnyItems = items.filter((i) => i.type === "funny");

  const addItem = useCallback(
    (item) => {
      setItems((prev) => [...prev, { id: `insp-${Date.now()}`, ...item }]);
    },
    [setItems]
  );

  const deleteItem = useCallback(
    (id) => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    },
    [setItems]
  );

  // Deterministic "today's" item across the WHOLE pool (motivation +
  // funny + images) so the Dashboard shows exactly one new thing per day,
  // cycling through everything before repeating.
  const getTodayItem = useCallback(() => {
    if (items.length === 0) return null;
    const index = dayIndex() % items.length;
    return items[index];
  }, [items]);

  // Kept for any caller that still wants a purely random pick.
  const getRandomItem = useCallback(
    (type) => {
      const pool = type ? items.filter((i) => i.type === type) : items;
      if (pool.length === 0) return null;
      return pool[Math.floor(Math.random() * pool.length)];
    },
    [items]
  );

  return {
    items,
    motivationItems,
    funnyItems,
    addItem,
    deleteItem,
    getTodayItem,
    getRandomItem,
  };
}

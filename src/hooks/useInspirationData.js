import { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { inspirationContentMock } from "../data/mockData";

// Persisted state hook for Inspiration content (motivation + funny).
// Content is manually curated (added/edited/deleted by the user) per
// Section 20 of the master context — no automatic fetching from the web.
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
    getRandomItem,
  };
}

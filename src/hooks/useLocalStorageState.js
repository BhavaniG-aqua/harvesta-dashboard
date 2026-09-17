import { useState, useCallback } from "react";

// Generic localStorage-backed state, used by all domain hooks so data
// survives page refreshes even before Supabase (Phase 8) is wired up.
// Falls back silently to in-memory state if localStorage is unavailable.
export function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setPersistedState = useCallback(
    (value) => {
      setState((prev) => {
        const next = typeof value === "function" ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Ignore storage errors (quota, private mode, etc.)
        }
        return next;
      });
    },
    [key]
  );

  return [state, setPersistedState];
}

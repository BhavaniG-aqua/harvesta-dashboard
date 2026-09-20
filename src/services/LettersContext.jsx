import { createContext, useContext } from "react";
import { useLettersData } from "../hooks/useLettersData";

const LettersContext = createContext(null);

// Shared state for the Letters tab (day-wise personal letters + its own
// 6-digit passcode gate), kept as a single top-level provider so the
// Settings page can also drive "change passcode" without duplicating
// state.
export function LettersProvider({ children }) {
  const value = useLettersData();
  return (
    <LettersContext.Provider value={value}>{children}</LettersContext.Provider>
  );
}

export function useLettersContext() {
  const ctx = useContext(LettersContext);
  if (!ctx) {
    throw new Error("useLettersContext must be used within LettersProvider");
  }
  return ctx;
}

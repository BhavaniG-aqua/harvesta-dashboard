import { createContext, useContext } from "react";
import { useSettingsData } from "../hooks/useSettingsData";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const value = useSettingsData();
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettingsContext must be used within SettingsProvider");
  }
  return ctx;
}

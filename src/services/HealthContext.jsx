import { createContext, useContext } from "react";
import { useHealthData } from "../hooks/useHealthData";
import { useSettingsContext } from "./SettingsContext";

const HealthContext = createContext(null);

// Wraps useHealthData with the current Settings (reminder days/times),
// so both the Dashboard and Health page see the exact same live data.
export function HealthProvider({ children }) {
  const { settings } = useSettingsContext();
  const value = useHealthData(settings);
  return (
    <HealthContext.Provider value={value}>{children}</HealthContext.Provider>
  );
}

export function useHealthContext() {
  const ctx = useContext(HealthContext);
  if (!ctx) {
    throw new Error("useHealthContext must be used within HealthProvider");
  }
  return ctx;
}

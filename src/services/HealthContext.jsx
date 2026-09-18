import { createContext, useContext } from "react";
import { useHealthData } from "../hooks/useHealthData";

const HealthContext = createContext(null);

export function HealthProvider({ children }) {
  const value = useHealthData();
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

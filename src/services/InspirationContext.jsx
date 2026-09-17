import { createContext, useContext } from "react";
import { useInspirationData } from "../hooks/useInspirationData";

const InspirationContext = createContext(null);

export function InspirationProvider({ children }) {
  const value = useInspirationData();
  return (
    <InspirationContext.Provider value={value}>
      {children}
    </InspirationContext.Provider>
  );
}

export function useInspirationContext() {
  const ctx = useContext(InspirationContext);
  if (!ctx) {
    throw new Error(
      "useInspirationContext must be used within InspirationProvider"
    );
  }
  return ctx;
}

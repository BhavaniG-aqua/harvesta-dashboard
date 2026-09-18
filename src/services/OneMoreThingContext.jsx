import { createContext, useContext } from "react";
import { useOneMoreThingData } from "../hooks/useOneMoreThingData";

const OneMoreThingContext = createContext(null);

export function OneMoreThingProvider({ children }) {
  const value = useOneMoreThingData();
  return (
    <OneMoreThingContext.Provider value={value}>
      {children}
    </OneMoreThingContext.Provider>
  );
}

export function useOneMoreThingContext() {
  const ctx = useContext(OneMoreThingContext);
  if (!ctx) {
    throw new Error(
      "useOneMoreThingContext must be used within OneMoreThingProvider"
    );
  }
  return ctx;
}

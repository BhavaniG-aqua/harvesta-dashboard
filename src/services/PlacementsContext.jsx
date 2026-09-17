import { createContext, useContext } from "react";
import { usePlacementsData } from "../hooks/usePlacementsData";

const PlacementsContext = createContext(null);

export function PlacementsProvider({ children }) {
  const value = usePlacementsData();
  return (
    <PlacementsContext.Provider value={value}>
      {children}
    </PlacementsContext.Provider>
  );
}

export function usePlacementsContext() {
  const ctx = useContext(PlacementsContext);
  if (!ctx) {
    throw new Error(
      "usePlacementsContext must be used within PlacementsProvider"
    );
  }
  return ctx;
}

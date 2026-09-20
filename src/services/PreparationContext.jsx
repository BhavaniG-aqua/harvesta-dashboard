import { createContext, useContext } from "react";
import { usePreparationData } from "../hooks/usePreparationData";

const PreparationContext = createContext(null);

// Shared Preparation state (categories, companies, topics) so the
// Categories page, Companies page, and any other view all read/write
// the same underlying data — adding/renaming/deleting a category or
// company is reflected everywhere immediately.
export function PreparationProvider({ children }) {
  const value = usePreparationData();
  return (
    <PreparationContext.Provider value={value}>
      {children}
    </PreparationContext.Provider>
  );
}

export function usePreparationContext() {
  const ctx = useContext(PreparationContext);
  if (!ctx) {
    throw new Error(
      "usePreparationContext must be used within PreparationProvider"
    );
  }
  return ctx;
}

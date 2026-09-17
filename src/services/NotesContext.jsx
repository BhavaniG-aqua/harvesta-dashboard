import { createContext, useContext } from "react";
import { useNotesData } from "../hooks/useNotesData";

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const value = useNotesData();
  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotesContext() {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error("useNotesContext must be used within NotesProvider");
  }
  return ctx;
}

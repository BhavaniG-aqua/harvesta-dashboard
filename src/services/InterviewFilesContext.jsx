import { createContext, useContext } from "react";
import { useInterviewFiles } from "../hooks/useInterviewFiles";

const InterviewFilesContext = createContext(null);

// Provides shared folder/file state to both the root file manager page
// and the nested folder detail page, so navigating between them keeps
// using the same in-memory data during Phase 1 (mock data stage).
export function InterviewFilesProvider({ children }) {
  const value = useInterviewFiles();
  return (
    <InterviewFilesContext.Provider value={value}>
      {children}
    </InterviewFilesContext.Provider>
  );
}

export function useInterviewFilesContext() {
  const ctx = useContext(InterviewFilesContext);
  if (!ctx) {
    throw new Error(
      "useInterviewFilesContext must be used within InterviewFilesProvider"
    );
  }
  return ctx;
}

import { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { notesMock } from "../data/mockData";

const todayStr = () => new Date().toISOString().slice(0, 10);

// Persisted state hook for General Notes.
// Note: inserted image blob URLs are session-only (they expire on reload)
// until Phase 8 swaps them for real Supabase Storage URLs.
export function useNotesData() {
  const [notes, setNotes] = useLocalStorageState("dashboard.notes", notesMock);

  const getNote = useCallback(
    (id) => notes.find((n) => n.id === id) || null,
    [notes]
  );

  const createNote = useCallback(() => {
    const id = `note-${Date.now()}`;
    setNotes((prev) => [
      { id, title: "Untitled note", content: "", images: [], updatedAt: todayStr() },
      ...prev,
    ]);
    return id;
  }, [setNotes]);

  const updateNote = useCallback(
    (id, partial) => {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, ...partial, updatedAt: todayStr() } : n
        )
      );
    },
    [setNotes]
  );

  const deleteNote = useCallback(
    (id) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    },
    [setNotes]
  );

  return { notes, getNote, createNote, updateNote, deleteNote };
}

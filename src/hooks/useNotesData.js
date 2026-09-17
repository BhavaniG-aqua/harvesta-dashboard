import { useState, useCallback } from "react";
import { notesMock } from "../data/mockData";

const todayStr = () => new Date().toISOString().slice(0, 10);

// Local state hook for General Notes.
export function useNotesData() {
  const [notes, setNotes] = useState(notesMock);

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
  }, []);

  const updateNote = useCallback((id, partial) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, ...partial, updatedAt: todayStr() } : n
      )
    );
  }, []);

  const deleteNote = useCallback((id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { notes, getNote, createNote, updateNote, deleteNote };
}

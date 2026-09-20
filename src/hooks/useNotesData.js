import { useCallback, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

function fromNoteRow(row, attachments = []) {
  return {
    id: row.id,
    title: row.title || "",
    content: row.content || "",
    updatedAt: row.updated_at,
    attachments: attachments.map(fromAttachmentRow),
  };
}

function fromAttachmentRow(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    size: row.size,
    url: row.storage_path, // already a public Storage URL
    createdAt: row.created_at,
  };
}

// Supabase-backed hook for General Notes.
//
// `note.attachments` (separate downloadable files, not inline images) is
// kept in its own `note_attachments` table; inline images inserted into
// the rich-text body live directly inside `content` as <img> tags
// pointing at Supabase Storage URLs, so they don't need a table of
// their own — saving the note's `content` HTML is enough.
export function useNotesData() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    const { data: noteRows, error } = await supabase
      .from("notes")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) {
      console.error("Failed to load notes:", error);
      setLoading(false);
      return;
    }
    const { data: attachmentRows, error: attError } = await supabase
      .from("note_attachments")
      .select("*");
    if (attError) console.error("Failed to load note attachments:", attError);

    const grouped = (noteRows || []).map((row) =>
      fromNoteRow(
        row,
        (attachmentRows || []).filter((a) => a.note_id === row.id)
      )
    );
    setNotes(grouped);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const getNote = useCallback(
    (id) => notes.find((n) => n.id === id) || null,
    [notes]
  );

  const createNote = useCallback(async () => {
    const { data, error } = await supabase
      .from("notes")
      .insert({ title: "Untitled note", content: "" })
      .select()
      .single();
    if (error) {
      console.error("Failed to create note:", error);
      return null;
    }
    setNotes((prev) => [fromNoteRow(data), ...prev]);
    return data.id;
  }, []);

  // `partial.attachments`, if present, is diffed against what's already
  // in `note_attachments` for this note: new entries are inserted, and
  // entries no longer present are deleted — so NoteEditor can keep
  // managing attachments as a plain local array and this hook takes
  // care of syncing that array to the database on Save.
  const updateNote = useCallback(async (id, partial) => {
    const { title, content, attachments } = partial;

    const { error } = await supabase
      .from("notes")
      .update({ title, content, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      console.error("Failed to update note:", error);
      return;
    }

    if (attachments) {
      const { data: existingRows } = await supabase
        .from("note_attachments")
        .select("id")
        .eq("note_id", id);
      const existingIds = new Set((existingRows || []).map((r) => r.id));
      const nextIds = new Set(attachments.map((a) => a.id));

      const toDelete = [...existingIds].filter((rid) => !nextIds.has(rid));
      const toInsert = attachments.filter((a) => !existingIds.has(a.id));

      if (toDelete.length > 0) {
        await supabase.from("note_attachments").delete().in("id", toDelete);
      }
      if (toInsert.length > 0) {
        await supabase.from("note_attachments").insert(
          toInsert.map((a) => ({
            id: a.id,
            note_id: id,
            name: a.name,
            type: a.type,
            size: a.size,
            storage_path: a.url,
          }))
        );
      }
    }

    await loadAll();
  }, [loadAll]);

  const deleteNote = useCallback(async (id) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete note:", error);
      return;
    }
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { notes, loading, getNote, createNote, updateNote, deleteNote };
}

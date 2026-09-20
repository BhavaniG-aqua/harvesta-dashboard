import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import NoteCard from "../../components/notes/NoteCard";
import { useNotesContext } from "../../services/NotesContext";
import { stripHtml } from "../../utils/html";

function NotesListPage() {
  const { notes, createNote } = useNotesContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title?.toLowerCase().includes(q) ||
        stripHtml(n.content).toLowerCase().includes(q)
    );
  }, [notes, search]);

  async function handleCreate() {
    const id = await createNote();
    if (id) navigate(`/notes/${id}`);
  }

  return (
    <div>
      <PageHeader
        title="Notes"
        subtitle="A quick personal notepad"
        action={<Button onClick={handleCreate}>+ New Note</Button>}
      />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search notes..."
        className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      />

      {filteredNotes.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No notes found"
          description="Create a note to jot something down quickly."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}

export default NotesListPage;

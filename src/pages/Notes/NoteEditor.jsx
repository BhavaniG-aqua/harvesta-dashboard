import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackLink from "../../components/common/BackLink";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { useNotesContext } from "../../services/NotesContext";

// Simple notepad-style editor for a single note.
// Image insertion stores a local object URL for now (Phase 1); this will
// be swapped for a real Supabase Storage upload URL in Phase 8.
function NoteEditorPage() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { getNote, updateNote, deleteNote } = useNotesContext();
  const imageInputRef = useRef(null);

  const note = getNote(noteId);
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [images, setImages] = useState(note?.images || []);

  if (!note) {
    return (
      <div>
        <BackLink to="/notes" label="Back to Notes" />
        <EmptyState icon="🔍" title="Note not found" />
      </div>
    );
  }

  function handleSave() {
    updateNote(noteId, { title, content, images });
  }

  function handleDelete() {
    deleteNote(noteId);
    navigate("/notes");
  }

  function handleDownload() {
    const blob = new Blob([`${title}\n\n${content}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "note"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleInsertImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImages((prev) => [...prev, { url, name: file.name }]);
    e.target.value = "";
  }

  return (
    <div>
      <BackLink to="/notes" label="Back to Notes" />

      <div className="mb-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="w-full border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900 outline-none focus:border-brand-400"
        />
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing..."
        rows={12}
        className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />

      {images.length > 0 ? (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {images.map((img, i) => (
            <img
              key={i}
              src={img.url}
              alt={img.name}
              className="h-24 w-full rounded-xl object-cover"
            />
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInsertImage}
        />
        <Button variant="secondary" onClick={() => imageInputRef.current?.click()}>
          🖼️ Insert Image
        </Button>
        <Button onClick={handleSave}>💾 Save</Button>
        <Button variant="secondary" onClick={handleDownload}>
          ⬇️ Download
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          🗑️ Delete
        </Button>
      </div>
    </div>
  );
}

export default NoteEditorPage;

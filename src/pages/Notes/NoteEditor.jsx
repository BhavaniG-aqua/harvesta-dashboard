import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackLink from "../../components/common/BackLink";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import FileRow from "../../components/files/FileRow";
import { useNotesContext } from "../../services/NotesContext";

function detectAttachmentType(file) {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  return "doc";
}

// Simple notepad-style editor for a single note.
// Supports inline images (shown as a thumbnail grid) AND general file
// attachments like PDFs/docs (shown as downloadable rows, same as the
// Interview Prep file manager). Both share one `attachments` array —
// only presentation differs based on `type`.
// Attachment blob URLs are session-only for now; Phase 8 replaces them
// with real Supabase Storage URLs (note_attachments table).
function NoteEditorPage() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { getNote, updateNote, deleteNote } = useNotesContext();
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const note = getNote(noteId);
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [attachments, setAttachments] = useState(note?.attachments || []);

  if (!note) {
    return (
      <div>
        <BackLink to="/notes" label="Back to Notes" />
        <EmptyState icon="🔍" title="Note not found" />
      </div>
    );
  }

  const images = attachments.filter((a) => a.type === "image");
  const files = attachments.filter((a) => a.type !== "image");

  function handleSave() {
    updateNote(noteId, { title, content, attachments });
  }

  function handleDelete() {
    deleteNote(noteId);
    navigate("/notes");
  }

  function handleDownloadNote() {
    const blob = new Blob([`${title}\n\n${content}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "note"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function addAttachment(file) {
    const type = detectAttachmentType(file);
    setAttachments((prev) => [
      ...prev,
      {
        id: `att-${Date.now()}`,
        name: file.name,
        type,
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        url: URL.createObjectURL(file),
        createdAt: new Date().toISOString().slice(0, 10),
      },
    ]);
  }

  function handleInsertImage(e) {
    const file = e.target.files?.[0];
    if (file) addAttachment(file);
    e.target.value = "";
  }

  function handleAttachFile(e) {
    const file = e.target.files?.[0];
    if (file) addAttachment(file);
    e.target.value = "";
  }

  function handleDeleteAttachment(id) {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
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
          {images.map((img) => (
            <div key={img.id} className="group relative">
              <img
                src={img.url}
                alt={img.name}
                className="h-24 w-full rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={() => handleDeleteAttachment(img.id)}
                className="absolute -right-1 -top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-white text-xs text-red-500 shadow ring-1 ring-slate-200 group-hover:flex"
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {files.length > 0 ? (
        <div className="mt-3 flex flex-col gap-2">
          {files.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              onDelete={handleDeleteAttachment}
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

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleAttachFile}
        />
        <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
          📎 Attach File
        </Button>

        <Button onClick={handleSave}>💾 Save</Button>
        <Button variant="secondary" onClick={handleDownloadNote}>
          ⬇️ Download Note
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          🗑️ Delete
        </Button>
      </div>
    </div>
  );
}

export default NoteEditorPage;

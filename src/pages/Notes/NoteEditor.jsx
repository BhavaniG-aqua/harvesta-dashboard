import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackLink from "../../components/common/BackLink";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import FileRow from "../../components/files/FileRow";
import RichTextEditor from "../../components/notes/RichTextEditor";
import { useNotesContext } from "../../services/NotesContext";
import { stripHtml } from "../../utils/html";

// Word-style notepad editor for a single note.
//
// - Body text + images live TOGETHER inline in one contentEditable area
//   (like inserting a picture inside a Word document at the cursor).
// - Separate non-image files (PDFs, docs, etc.) are kept as a distinct
//   "attachments" list below the body, shown as downloadable rows —
//   these don't make sense embedded inline in running text.
//
// Image blob URLs embedded in the HTML, and attachment blob URLs, are
// session-only for now; Phase 8 replaces both with real Supabase Storage
// URLs (note_attachments table / "note-attachments" bucket).
function NoteEditorPage() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { getNote, updateNote, deleteNote } = useNotesContext();
  const editorRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const note = getNote(noteId);
  const [title, setTitle] = useState(note?.title || "");
  const [attachments, setAttachments] = useState(note?.attachments || []);

  if (!note) {
    return (
      <div>
        <BackLink to="/notes" label="Back to Notes" />
        <EmptyState icon="🔍" title="Note not found" />
      </div>
    );
  }

  function currentHtml() {
    return editorRef.current?.innerHTML ?? note.content ?? "";
  }

  function handleSave() {
    updateNote(noteId, { title, content: currentHtml(), attachments });
  }

  function handleDelete() {
    deleteNote(noteId);
    navigate("/notes");
  }

  function handleDownloadNote() {
    const plainText = stripHtml(currentHtml());
    const blob = new Blob([`${title}\n\n${plainText}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "note"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Inserts the picked image directly at the current cursor position
  // inside the editor, exactly like Word's "Insert > Picture".
  function handleInsertImage(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editorRef.current) return;

    const url = URL.createObjectURL(file);
    const img = document.createElement("img");
    img.src = url;
    img.alt = file.name;

    editorRef.current.focus();
    const selection = window.getSelection();
    let range;
    if (selection && selection.rangeCount > 0 && editorRef.current.contains(selection.anchorNode)) {
      range = selection.getRangeAt(0);
    } else {
      // No active cursor inside the editor — append to the end.
      range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
    }
    range.deleteContents();
    range.insertNode(img);
    // Move cursor just after the inserted image.
    range.setStartAfter(img);
    range.setEndAfter(img);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  function detectAttachmentType(file) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "pdf";
    return "doc";
  }

  function handleAttachFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setAttachments((prev) => [
      ...prev,
      {
        id: `att-${Date.now()}`,
        name: file.name,
        type: detectAttachmentType(file),
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        url: URL.createObjectURL(file),
        createdAt: new Date().toISOString().slice(0, 10),
      },
    ]);
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

      <RichTextEditor
        editorRef={editorRef}
        initialHtml={note.content}
        placeholder="Start writing... insert images anywhere with 🖼️ Insert Image"
      />

      {attachments.length > 0 ? (
        <div className="mt-3 flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Attached Files
          </p>
          {attachments.map((file) => (
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

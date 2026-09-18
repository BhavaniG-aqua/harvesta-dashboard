import { useEffect, useState } from "react";
import { getFileIcon, getPreviewCategory } from "../../utils/fileTypes";
import FileViewerBody from "./FileViewerBody";
import Button from "../common/Button";

// Full-screen-on-mobile / centered-on-desktop modal for viewing a file.
// Text-based files (txt, py) can be edited in place and re-saved; images
// are read-only (per spec — "images read only and can be deleted");
// everything else is read-only preview + download.
function FileViewerModal({ file, onClose, onSaveText, onDelete }) {
  const category = getPreviewCategory(file.name);
  const isEditableText = category === "text";

  const [editing, setEditing] = useState(false);
  const [draftText, setDraftText] = useState(null);

  // Close on Escape for desktop convenience.
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function handleStartEdit() {
    const response = await fetch(file.url);
    const text = await response.text();
    setDraftText(text);
    setEditing(true);
  }

  function handleSaveEdit() {
    onSaveText?.(file, draftText);
    setEditing(false);
  }

  function handleDownload() {
    const a = document.createElement("a");
    a.href = file.url;
    a.download = file.name;
    a.click();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl md:max-w-2xl md:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xl">{getFileIcon(file.name)}</span>
            <p className="truncate text-sm font-semibold text-slate-800">
              {file.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {editing ? (
            <textarea
              autoFocus
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              rows={16}
              className="w-full resize-none rounded-xl border border-slate-200 p-3 font-mono text-xs text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          ) : (
            <FileViewerBody file={file} />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 px-4 py-3">
          {editing ? (
            <>
              <Button variant="secondary" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>💾 Save</Button>
            </>
          ) : (
            <>
              {isEditableText ? (
                <Button variant="secondary" onClick={handleStartEdit}>
                  ✏️ Edit
                </Button>
              ) : null}
              {onDelete ? (
                <Button
                  variant="danger"
                  onClick={() => {
                    onDelete(file.id);
                    onClose();
                  }}
                >
                  🗑️ Delete
                </Button>
              ) : null}
              <Button variant="secondary" onClick={handleDownload} disabled={!file.url}>
                ⬇️ Download
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileViewerModal;

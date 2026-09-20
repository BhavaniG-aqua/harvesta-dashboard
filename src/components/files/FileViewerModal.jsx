import { useEffect, useState } from "react";
import { getFileIcon, getPreviewCategory } from "../../utils/fileTypes";
import FileViewerBody from "./FileViewerBody";
import Button from "../common/Button";

// Full-screen file viewer — covers the ENTIRE viewport (not a small
// centered dialog) so the file content has as much room as possible,
// exactly like opening the file in its own page. Text-based files (txt,
// py) can be edited in place and re-saved; images are read-only (per
// spec — "images read only and can be deleted"); everything else is
// read-only preview + download.
//
// Pushes a history entry when opened so the browser/hardware Back
// button (and Escape) closes the viewer and returns to the exact list
// page underneath, instead of navigating away from the app.
function FileViewerModal({ file, onClose, onSaveText, onDelete }) {
  const category = getPreviewCategory(file.name);
  const isEditableText = category === "text";

  const [editing, setEditing] = useState(false);
  const [draftText, setDraftText] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Treat browser Back (or Escape) as "close the viewer, stay on this
  // page" — push a throwaway history entry on open, and close whenever
  // that entry is popped (back gesture) instead of letting the browser
  // navigate to whatever was there before this page.
  useEffect(() => {
    window.history.pushState({ fileViewer: true }, "");

    function handlePopState() {
      onClose();
    }
    function handleKey(e) {
      if (e.key === "Escape") {
        window.history.back();
      }
    }

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClose() {
    // Pops the throwaway history entry we pushed on open, which triggers
    // the popstate listener above to actually close the viewer — keeps
    // browser history consistent whether the user closes via the X
    // button or the Back gesture.
    window.history.back();
  }

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

  function handleConfirmDelete() {
    onDelete(file.id);
    handleClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <button
            type="button"
            onClick={handleClose}
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <span aria-hidden="true">←</span> Back
          </button>
          <span className="h-5 w-px shrink-0 bg-slate-200 dark:bg-slate-700" />
          <span className="text-xl shrink-0">{getFileIcon(file.name)}</span>
          <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
            {file.name}
          </p>
        </div>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8">
        {editing ? (
          <textarea
            autoFocus
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            className="h-full w-full resize-none rounded-xl border border-slate-200 bg-white p-3 font-mono text-xs text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        ) : (
          <div className="mx-auto h-full w-full max-w-5xl">
            <FileViewerBody file={file} fullScreen />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 px-4 py-3 dark:border-slate-800">
        {editing ? (
          <>
            <Button variant="secondary" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>✨ Save</Button>
          </>
        ) : confirmingDelete ? (
          <>
            <span className="mr-auto text-xs font-medium text-slate-500 dark:text-slate-400">
              Delete this file?
            </span>
            <Button variant="secondary" onClick={() => setConfirmingDelete(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              🗑️ Confirm Delete
            </Button>
          </>
        ) : (
          <>
            {isEditableText ? (
              <Button variant="secondary" onClick={handleStartEdit}>
                ✏️ Edit
              </Button>
            ) : null}
            {onDelete ? (
              <Button variant="danger" onClick={() => setConfirmingDelete(true)}>
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
  );
}

export default FileViewerModal;

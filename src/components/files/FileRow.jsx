import { useState } from "react";
import { getFileIcon } from "../../utils/fileTypes";
import FileViewerModal from "./FileViewerModal";

// A single file row inside the file manager list. Clicking the row opens
// a full-screen preview/edit view supporting images, PDFs, text/code,
// Word docs, and spreadsheets — everything else falls back to a clear
// "download to open" message. Deleting always asks for confirmation
// first.
function FileRow({ file, onDelete, onSaveText }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const icon = getFileIcon(file.name);
  const canOpen = Boolean(file.url);

  function handleDownload(e) {
    e.stopPropagation();
    if (!file.url) return;
    const a = document.createElement("a");
    a.href = file.url;
    a.download = file.name;
    a.click();
  }

  if (confirmingDelete) {
    return (
      <div className="flex w-full items-center justify-between rounded-2xl border border-red-200 bg-red-50/60 p-3 dark:border-red-900/40 dark:bg-red-900/10">
        <p className="truncate text-sm text-slate-700 dark:text-slate-200">
          Delete "{file.name}"?
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => {
              onDelete(file.id);
              setConfirmingDelete(false);
            }}
            className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(false)}
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        role="button"
        tabIndex={canOpen ? 0 : -1}
        onClick={() => canOpen && setViewerOpen(true)}
        onKeyDown={(e) => {
          if (canOpen && (e.key === "Enter" || e.key === " ")) setViewerOpen(true);
        }}
        className={[
          "flex w-full items-center justify-between rounded-2xl border border-slate-200/70 bg-white p-3 text-left shadow-sm shadow-slate-200/40 transition-all dark:border-slate-700/70 dark:bg-slate-800",
          canOpen
            ? "cursor-pointer hover:border-brand-200 hover:shadow-md dark:hover:border-brand-700"
            : "cursor-not-allowed opacity-60",
        ].join(" ")}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="text-2xl">{icon}</span>
          <div className="overflow-hidden">
            <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
              {file.name}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {file.size} • {file.createdAt}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!canOpen}
            className={[
              "rounded-lg px-2 py-1.5 text-sm",
              canOpen ? "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700" : "cursor-not-allowed text-slate-300 dark:text-slate-600",
            ].join(" ")}
            title={canOpen ? "Download" : "No file content stored (mock entry)"}
            aria-label="Download file"
          >
            ⬇️
          </button>
          {onDelete ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmingDelete(true);
              }}
              className="rounded-lg px-2 py-1.5 text-sm text-accent-500 hover:bg-accent-100"
              title="Delete"
              aria-label="Delete file"
            >
              🗑️
            </button>
          ) : null}
        </div>
      </div>

      {viewerOpen ? (
        <FileViewerModal
          file={file}
          onClose={() => setViewerOpen(false)}
          onSaveText={onSaveText}
          onDelete={onDelete}
        />
      ) : null}
    </>
  );
}

export default FileRow;

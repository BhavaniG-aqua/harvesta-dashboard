import { useState } from "react";
import { getFileIcon } from "../../utils/fileTypes";
import FileViewerModal from "./FileViewerModal";

// A single file row inside the file manager list. Clicking the row opens
// a preview/edit modal supporting images, PDFs, text/code, Word docs,
// and spreadsheets — everything else falls back to a clear "download to
// open" message inside the modal.
function FileRow({ file, onDelete, onSaveText }) {
  const [viewerOpen, setViewerOpen] = useState(false);
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
          "flex w-full items-center justify-between rounded-2xl border border-slate-200/70 bg-white p-3 text-left shadow-sm shadow-slate-200/40 transition-all",
          canOpen
            ? "cursor-pointer hover:border-brand-200 hover:shadow-md"
            : "cursor-not-allowed opacity-60",
        ].join(" ")}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="text-2xl">{icon}</span>
          <div className="overflow-hidden">
            <p className="truncate text-sm font-medium text-slate-800">
              {file.name}
            </p>
            <p className="text-xs text-slate-400">
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
              canOpen ? "text-slate-500 hover:bg-slate-100" : "cursor-not-allowed text-slate-300",
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
                onDelete(file.id);
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

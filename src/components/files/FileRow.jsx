const FILE_ICONS = {
  pdf: "📄",
  image: "🖼️",
  doc: "📃",
};

// A single file row inside the file manager list.
// If the file has a stored blob URL (uploaded during this session), the
// download button uses it directly; otherwise it's a mock file with no
// real content and the button is disabled with a helpful hint.
function FileRow({ file, onDelete }) {
  const icon = FILE_ICONS[file.type] || "📄";
  const canDownload = Boolean(file.url);

  function handleDownload() {
    if (!file.url) return;
    const a = document.createElement("a");
    a.href = file.url;
    a.download = file.name;
    a.click();
  }

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3">
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
          disabled={!canDownload}
          className={[
            "rounded-lg px-2 py-1.5 text-sm",
            canDownload
              ? "text-slate-500 hover:bg-slate-100"
              : "cursor-not-allowed text-slate-300",
          ].join(" ")}
          aria-label="Download file"
          title={canDownload ? "Download" : "No file content stored (mock entry)"}
        >
          ⬇️
        </button>
        {onDelete ? (
          <button
            type="button"
            onClick={() => onDelete(file.id)}
            className="rounded-lg px-2 py-1.5 text-sm text-red-500 hover:bg-red-50"
            aria-label="Delete file"
            title="Delete"
          >
            🗑️
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default FileRow;

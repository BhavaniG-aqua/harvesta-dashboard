const FILE_ICONS = {
  pdf: "📄",
  image: "🖼️",
  doc: "📃",
};

// A single file row inside the file manager list.
function FileRow({ file, onDelete }) {
  const icon = FILE_ICONS[file.type] || "📄";

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
          className="rounded-lg px-2 py-1.5 text-sm text-slate-500 hover:bg-slate-100"
          aria-label="Download file"
          title="Download"
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

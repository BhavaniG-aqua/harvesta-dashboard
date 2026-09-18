import { useState } from "react";
import { Link } from "react-router-dom";

// A folder tile inside the file manager grid. Supports inline rename
// (double-click or the small "rename" affordance) and delete.
function FolderCard({ folder, onDelete, onRename }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(folder.name);

  function commitRename() {
    const trimmed = name.trim();
    if (trimmed && trimmed !== folder.name) {
      onRename?.(folder.id, trimmed);
    } else {
      setName(folder.name);
    }
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-brand-300 bg-white p-4 text-center dark:border-brand-600 dark:bg-slate-800">
        <span className="text-3xl">📁</span>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitRename();
            if (e.key === "Escape") {
              setName(folder.name);
              setEditing(false);
            }
          }}
          className="w-full rounded-lg border border-slate-200 bg-white px-1 py-0.5 text-center text-xs text-slate-900 outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
    );
  }

  return (
    <div className="group relative">
      <Link
        to={`/preparation/files/${folder.id}`}
        className="flex flex-col items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-4 text-center transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
      >
        <span className="text-3xl">📁</span>
        <span className="w-full truncate text-xs font-medium text-slate-700 dark:text-slate-200">
          {folder.name}
        </span>
      </Link>
      <div className="absolute -right-1 -top-1 hidden gap-1 group-hover:flex">
        {onRename ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs text-slate-500 shadow ring-1 ring-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-600"
            aria-label="Rename folder"
          >
            ✏️
          </button>
        ) : null}
        {onDelete ? (
          <button
            type="button"
            onClick={() => onDelete(folder.id)}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs text-red-500 shadow ring-1 ring-slate-200 dark:bg-slate-700 dark:ring-slate-600"
            aria-label="Delete folder"
          >
            ✕
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default FolderCard;

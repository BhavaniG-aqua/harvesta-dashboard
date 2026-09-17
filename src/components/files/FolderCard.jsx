import { Link } from "react-router-dom";

// A folder tile inside the file manager grid.
function FolderCard({ folder, onDelete }) {
  return (
    <div className="group relative">
      <Link
        to={`/preparation/files/${folder.id}`}
        className="flex flex-col items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-4 text-center transition-shadow hover:shadow-md"
      >
        <span className="text-3xl">📁</span>
        <span className="w-full truncate text-xs font-medium text-slate-700">
          {folder.name}
        </span>
      </Link>
      {onDelete ? (
        <button
          type="button"
          onClick={() => onDelete(folder.id)}
          className="absolute -right-1 -top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-white text-xs text-red-500 shadow ring-1 ring-slate-200 group-hover:flex"
          aria-label="Delete folder"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}

export default FolderCard;

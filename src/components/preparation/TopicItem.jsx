import { useState } from "react";
import ConfirmButton from "../common/ConfirmButton";

const STATUS_OPTIONS = [
  { key: "NEW", label: "New", dot: "bg-slate-400" },
  { key: "COMPLETED", label: "Done", dot: "bg-emerald-500" },
  { key: "REVISE", label: "Revise", dot: "bg-amber-500" },
];

// A single preparation topic row: name on the left, status toggle
// buttons on the right, all on ONE line (topic — space — status
// buttons), with inline rename (click the name) and delete.
function TopicItem({ topic, onStatusChange, onDelete, onRename }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(topic.name);

  function commitRename() {
    const trimmed = name.trim();
    if (trimmed && trimmed !== topic.name) {
      onRename?.(topic.id, trimmed);
    } else {
      setName(topic.name);
    }
    setEditing(false);
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white px-3 py-2 shadow-sm shadow-slate-200/40 dark:border-slate-700/70 dark:bg-slate-800">
      {editing ? (
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitRename();
            if (e.key === "Escape") {
              setName(topic.name);
              setEditing(false);
            }
          }}
          className="min-w-0 flex-1 rounded-lg border border-brand-300 bg-white px-2 py-1 text-sm text-slate-900 outline-none dark:bg-slate-900 dark:text-slate-100"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="min-w-0 flex-1 truncate text-left text-sm font-medium text-slate-800 dark:text-slate-100"
          title={topic.name}
        >
          {topic.name}
        </button>
      )}

      <div className="flex shrink-0 items-center gap-1">
        {STATUS_OPTIONS.map((opt) => {
          const isActive = topic.status === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onStatusChange(topic.id, opt.key)}
              title={opt.label}
              className={[
                "flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium transition-colors",
                isActive
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600",
              ].join(" ")}
            >
              <span
                className={[
                  "h-1.5 w-1.5 rounded-full",
                  isActive ? "bg-white" : opt.dot,
                ].join(" ")}
              />
              <span className="hidden sm:inline">{opt.label}</span>
            </button>
          );
        })}
        {onDelete ? (
          <ConfirmButton
            label="🗑️"
            confirmLabel="Delete?"
            onConfirm={() => onDelete(topic.id)}
            className="!px-2 !py-1"
          />
        ) : null}
      </div>
    </div>
  );
}

export default TopicItem;

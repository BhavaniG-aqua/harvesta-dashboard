import { useState } from "react";
import Card from "../common/Card";
import StatusPill from "../common/StatusPill";

const STATUS_OPTIONS = ["NEW", "COMPLETED", "REVISE"];

// A single preparation topic row with inline status switcher and
// inline rename support (click the name to edit it).
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
    <Card className="flex flex-col gap-3 bg-white">
      <div className="flex items-start justify-between gap-2">
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
            className="w-full rounded-lg border border-brand-300 px-2 py-1 text-sm outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-left text-sm font-medium text-slate-800"
          >
            {topic.name}
          </button>
        )}
        <StatusPill status={topic.status} />
      </div>

      <div className="flex gap-2">
        {STATUS_OPTIONS.map((status) => {
          const isActive = topic.status === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => onStatusChange(topic.id, status)}
              className={[
                "flex-1 rounded-lg py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200",
              ].join(" ")}
            >
              {status}
            </button>
          );
        })}
        {onDelete ? (
          <button
            type="button"
            onClick={() => onDelete(topic.id)}
            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-100"
            aria-label="Delete topic"
          >
            🗑️
          </button>
        ) : null}
      </div>
    </Card>
  );
}

export default TopicItem;

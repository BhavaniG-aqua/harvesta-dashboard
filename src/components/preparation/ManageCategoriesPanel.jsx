import { useState } from "react";
import Card from "../common/Card";
import ConfirmButton from "../common/ConfirmButton";

// Inline manage panel for renaming/deleting preparation categories.
function ManageCategoriesPanel({ categories, onRename, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");

  function startEdit(cat) {
    setEditingId(cat.id);
    setName(cat.name);
  }

  function commit(cat) {
    const trimmed = name.trim();
    if (trimmed && trimmed !== cat.name) {
      onRename(cat.id, trimmed);
    }
    setEditingId(null);
  }

  if (categories.length === 0) return null;

  return (
    <Card className="flex flex-col gap-2">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        Manage Categories
      </p>
      {categories.map((cat) => (
        <div key={cat.id} className="flex items-center justify-between gap-2">
          {editingId === cat.id ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => commit(cat)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit(cat);
                if (e.key === "Escape") setEditingId(null);
              }}
              className="w-full rounded-lg border border-brand-300 px-2 py-1 text-sm outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => startEdit(cat)}
              className="text-left text-sm text-slate-700 hover:text-brand-600"
            >
              {cat.name}
            </button>
          )}
          <ConfirmButton
            label="🗑️"
            confirmLabel="Delete category + its topics?"
            onConfirm={() => onDelete(cat.id)}
          />
        </div>
      ))}
    </Card>
  );
}

export default ManageCategoriesPanel;

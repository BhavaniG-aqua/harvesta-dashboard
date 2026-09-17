import { useState } from "react";
import Button from "./Button";

// Minimal inline "add" form: a text input + submit button, collapsed by
// default behind a small trigger button. Used for adding categories,
// topics, folders, etc. without needing a full modal.
function InlineAddForm({ placeholder = "Add new...", onSubmit, buttonLabel = "+ Add" }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
    setOpen(false);
  }

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {buttonLabel}
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
      <Button type="submit">Add</Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => {
          setOpen(false);
          setValue("");
        }}
      >
        ✕
      </Button>
    </form>
  );
}

export default InlineAddForm;

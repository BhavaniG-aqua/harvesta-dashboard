import { useEffect, useRef } from "react";

// Labeled rich-text field supporting Bold via Ctrl+B (Cmd+B on Mac), plus
// a small "B" tap button next to the label for mobile, where keyboard
// shortcuts aren't available. Deliberately minimal — just Bold, no full
// toolbar — since these are short structured fields (Requirements,
// Selection Process, etc.), not a full notepad like Notes.
//
// Like RichTextEditor (Notes), this is UNCONTROLLED after mount —
// contentEditable fights with controlled re-renders on every keystroke
// (cursor jumps to the start), so `value` only seeds the initial content
// once on mount; live changes are reported via onChange(html).
function RichTextField({ label, value, onChange, placeholder, minRows = 2 }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || "";
    }
    // Intentionally only runs once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleBold() {
    editorRef.current?.focus();
    document.execCommand("bold");
    onChange?.(editorRef.current.innerHTML);
  }

  function handleKeyDown(e) {
    const isModPressed = e.ctrlKey || e.metaKey;
    if (isModPressed && e.key.toLowerCase() === "b") {
      e.preventDefault();
      toggleBold();
    }
  }

  return (
    <label className="block">
      <span className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggleBold}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          aria-label="Bold"
          title="Bold (Ctrl+B)"
        >
          B
        </button>
      </span>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange?.(editorRef.current.innerHTML)}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        style={{ minHeight: `${minRows * 1.5}rem` }}
        className="rich-field mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-brand-400 dark:focus:ring-brand-800/40"
      />
    </label>
  );
}

export default RichTextField;

import { useEffect, useRef } from "react";

const FONT_SIZES = [
  { label: "Small", value: "2" },
  { label: "Normal", value: "3" },
  { label: "Large", value: "5" },
  { label: "Huge", value: "7" },
];

const COLOR_PRESETS = [
  "#1c1410", // near-black (default/dark text)
  "#dc2626", // red
  "#ea580c", // orange
  "#16a34a", // green
  "#2563eb", // blue
  "#8b5a2e", // brand brown
  "#db2777", // pink
];

// Lightweight formatting toolbar for the Word-style note editor. Uses the
// browser's built-in execCommand — deprecated but still supported by every
// major browser for these basic operations (bold/italic/font size/color),
// which keeps this dependency-free instead of pulling in a full editor
// framework like TipTap/Slate for what is meant to be a simple notepad.
//
// Selection tracking: contentEditable loses its text selection the instant
// focus moves to a toolbar control (a <button>, <select>, or the native
// color picker). Rather than trying to capture the selection only at the
// one right moment (fragile — differs per control type), we continuously
// track the LAST valid selection made inside the editor via a
// `selectionchange` listener on the document, and restore that exact
// range immediately before running any command. This is the standard,
// reliable pattern for building a custom contentEditable toolbar.
function NoteToolbar({ editorRef }) {
  const savedRangeRef = useRef(null);

  useEffect(() => {
    function handleSelectionChange() {
      const sel = window.getSelection();
      if (
        sel &&
        sel.rangeCount > 0 &&
        editorRef.current &&
        editorRef.current.contains(sel.anchorNode)
      ) {
        savedRangeRef.current = sel.getRangeAt(0).cloneRange();
      }
    }
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [editorRef]);

  function exec(command, value = null) {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();

    const range = savedRangeRef.current;
    if (range) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }

    document.execCommand("styleWithCSS", false, true);
    document.execCommand(command, false, value);

    // Keep our snapshot in sync with whatever the selection now is
    // (execCommand can change it), so the next action still works.
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  }

  return (
    <div className="no-scrollbar flex items-center gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800">
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          exec("bold");
        }}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
        aria-label="Bold"
        title="Bold"
      >
        B
      </button>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          exec("italic");
        }}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm italic text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
        aria-label="Italic"
        title="Italic"
      >
        I
      </button>

      <div className="h-6 w-px shrink-0 bg-slate-200 dark:bg-slate-700" aria-hidden="true" />

      <select
        onChange={(e) => {
          exec("fontSize", e.target.value);
          e.target.blur();
        }}
        defaultValue=""
        aria-label="Font size"
        className="shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 outline-none focus:border-brand-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
      >
        <option value="" disabled>
          Size
        </option>
        {FONT_SIZES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <div className="h-6 w-px shrink-0 bg-slate-200 dark:bg-slate-700" aria-hidden="true" />

      <div className="flex shrink-0 items-center gap-1.5">
        {COLOR_PRESETS.map((color) => (
          <button
            key={color}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("foreColor", color);
            }}
            className="h-6 w-6 shrink-0 rounded-full ring-1 ring-slate-200 transition-transform hover:scale-110 dark:ring-slate-600"
            style={{ backgroundColor: color }}
            aria-label={`Text color ${color}`}
            title="Text color"
          />
        ))}
        <label
          className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-xs ring-1 ring-slate-200 hover:bg-slate-50 dark:ring-slate-600 dark:hover:bg-slate-700"
          title="Custom color"
        >
          🎨
          <input
            type="color"
            className="hidden"
            onChange={(e) => exec("foreColor", e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}

export default NoteToolbar;

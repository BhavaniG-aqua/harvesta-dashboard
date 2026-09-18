import { useRef } from "react";

const FONT_SIZES = [
  { label: "Small", value: "2" },
  { label: "Normal", value: "3" },
  { label: "Large", value: "5" },
  { label: "Huge", value: "7" },
];

const COLOR_PRESETS = [
  "#0f172a", // slate-900 (default/dark)
  "#dc2626", // red
  "#ea580c", // orange
  "#16a34a", // green
  "#2563eb", // blue
  "#7c3aed", // violet (brand)
  "#db2777", // pink
];

// Lightweight formatting toolbar for the Word-style note editor. Uses the
// browser's built-in execCommand — deprecated but still supported by every
// major browser for these basic operations (bold/italic/font size/color),
// which keeps this dependency-free instead of pulling in a full editor
// framework like TipTap/Slate for what is meant to be a simple notepad.
function NoteToolbar({ editorRef }) {
  const savedRangeRef = useRef(null);

  // Native <select>/<input type="color"> steal focus away from the
  // contentEditable the instant they open, which wipes out the current
  // text selection. We snapshot it on mousedown (just before focus
  // shifts) and restore it right before applying the format.
  function saveSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  }

  function restoreSelection() {
    const range = savedRangeRef.current;
    if (!range) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function exec(command, value = null) {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand("styleWithCSS", false, true);
    document.execCommand(command, false, value);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2">
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          saveSelection();
          exec("bold");
        }}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100"
        aria-label="Bold"
        title="Bold"
      >
        B
      </button>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          saveSelection();
          exec("italic");
        }}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-sm italic text-slate-700 hover:bg-slate-100"
        aria-label="Italic"
        title="Italic"
      >
        I
      </button>

      <div className="h-6 w-px bg-slate-200" aria-hidden="true" />

      <select
        onMouseDown={saveSelection}
        onChange={(e) => {
          exec("fontSize", e.target.value);
          e.target.blur();
        }}
        defaultValue=""
        aria-label="Font size"
        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 outline-none focus:border-brand-400"
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

      <div className="h-6 w-px bg-slate-200" aria-hidden="true" />

      <div className="flex items-center gap-1.5">
        {COLOR_PRESETS.map((color) => (
          <button
            key={color}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
              exec("foreColor", color);
            }}
            className="h-6 w-6 rounded-full ring-1 ring-slate-200 transition-transform hover:scale-110"
            style={{ backgroundColor: color }}
            aria-label={`Text color ${color}`}
            title="Text color"
          />
        ))}
        <label
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-xs ring-1 ring-slate-200 hover:bg-slate-50"
          title="Custom color"
          onMouseDown={saveSelection}
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

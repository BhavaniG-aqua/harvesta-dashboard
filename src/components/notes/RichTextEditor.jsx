import { useEffect } from "react";

// Word-style rich text editor: a contentEditable surface where images can
// be inserted directly at the cursor position, inline with typed text —
// exactly like inserting a picture inside a Word document.
//
// Deliberately UNCONTROLLED after mount: contentEditable fights with React
// state updates on every keystroke (cursor jumps to the start, etc.), so we
// only set innerHTML once (on load) and read it back out on demand via the
// forwarded ref, instead of re-rendering on every input event.
function RichTextEditor({ editorRef, initialHtml, onChange, placeholder }) {
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialHtml || "";
    }
    // Intentionally only runs once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onInput={() => onChange?.(editorRef.current.innerHTML)}
      data-placeholder={placeholder}
      className="note-editor min-h-[280px] w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
    />
  );
}

export default RichTextEditor;

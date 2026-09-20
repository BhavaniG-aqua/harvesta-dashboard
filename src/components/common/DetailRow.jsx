// Label/value row used in detail views (Placement detail, etc.).
//
// `html` renders `value` as rich HTML (used for fields edited with
// RichTextField, e.g. Requirements/Selection Process, which can contain
// <b> tags from Ctrl+B) instead of plain text — never pass raw untrusted
// HTML here, only content the user typed into RichTextField themselves.
function DetailRow({ label, value, html = false }) {
  if (!value) return null;
  return (
    <div className="border-b border-slate-100 py-3 last:border-b-0 dark:border-slate-800">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </p>
      {html ? (
        <p
          className="mt-1 whitespace-pre-line text-sm text-slate-700 dark:text-slate-300"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : (
        <p className="mt-1 whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">
          {value}
        </p>
      )}
    </div>
  );
}

export default DetailRow;

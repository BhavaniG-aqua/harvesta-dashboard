// Label/value row used in detail views (Placement detail, etc.).
function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="border-b border-slate-100 py-3 last:border-b-0">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 whitespace-pre-line text-sm text-slate-700">
        {value}
      </p>
    </div>
  );
}

export default DetailRow;

// Lightweight empty-state block for lists/pages with no data yet.
function EmptyState({ icon = "📭", title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 px-6 py-10 text-center">
      <span className="text-3xl">{icon}</span>
      <p className="mt-3 text-sm font-medium text-slate-700">{title}</p>
      {description ? (
        <p className="mt-1 max-w-xs text-xs text-slate-400">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export default EmptyState;

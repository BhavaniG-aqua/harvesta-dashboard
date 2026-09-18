// Simple two-way toggle between List and Calendar views.
function ViewToggle({ view, onChange }) {
  return (
    <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
      {["list", "calendar"].map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={[
            "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            view === v
              ? "bg-white text-brand-700 shadow-sm dark:bg-slate-700 dark:text-brand-300"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
          ].join(" ")}
        >
          {v === "list" ? "📋 List" : "📅 Calendar"}
        </button>
      ))}
    </div>
  );
}

export default ViewToggle;

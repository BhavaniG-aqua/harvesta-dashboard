// Simple two-way toggle between List and Calendar views.
function ViewToggle({ view, onChange }) {
  return (
    <div className="inline-flex rounded-xl bg-slate-100 p-1">
      {["list", "calendar"].map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={[
            "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            view === v
              ? "bg-white text-brand-700 shadow-sm"
              : "text-slate-500 hover:text-slate-700",
          ].join(" ")}
        >
          {v === "list" ? "📋 List" : "📅 Calendar"}
        </button>
      ))}
    </div>
  );
}

export default ViewToggle;

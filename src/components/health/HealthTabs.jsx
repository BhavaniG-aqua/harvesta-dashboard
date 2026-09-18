// Simple two-way in-page tab switcher between "Today" and "History"
// within the Health page. Not route-based since history browsing is
// just a different view of the same page, not a separate destination.
function HealthTabs({ active, onChange }) {
  const tabs = [
    { id: "today", label: "Today" },
    { id: "history", label: "History" },
  ];

  return (
    <div className="mb-4 flex gap-2 border-b border-slate-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={[
            "border-b-2 -mb-px px-1 pb-2.5 text-sm font-medium transition-colors",
            active === tab.id
              ? "border-brand-600 text-brand-700"
              : "border-transparent text-slate-400 hover:text-slate-600",
          ].join(" ")}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default HealthTabs;

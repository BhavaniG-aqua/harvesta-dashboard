// Segmented filter tabs used for Preparation Topics status filter.
const FILTERS = ["ALL", "NEW", "COMPLETED", "REVISE"];

function StatusFilterTabs({ active, onChange, counts = {} }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {FILTERS.map((filter) => {
        const isActive = active === filter;
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            className={[
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
            ].join(" ")}
          >
            {filter}
            {counts[filter] !== undefined ? ` (${counts[filter]})` : ""}
          </button>
        );
      })}
    </div>
  );
}

export default StatusFilterTabs;

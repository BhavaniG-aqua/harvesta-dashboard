// Status filter chips for Preparation Topics. "ALL" clears the
// selection; NEW/COMPLETED/REVISE are multi-select — tap any combination
// of them to see topics matching ANY of the selected statuses (an OR
// filter), still grouped by category/company same as always.
const STATUS_FILTERS = ["NEW", "COMPLETED", "REVISE"];

function StatusFilterTabs({ active = [], onChange, counts = {} }) {
  const isAllActive = active.length === 0;

  function toggleStatus(status) {
    if (active.includes(status)) {
      onChange(active.filter((s) => s !== status));
    } else {
      onChange([...active, status]);
    }
  }

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => onChange([])}
        className={[
          "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
          isAllActive
            ? "bg-brand-600 text-white"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
        ].join(" ")}
      >
        ALL{counts.ALL !== undefined ? ` (${counts.ALL})` : ""}
      </button>
      {STATUS_FILTERS.map((filter) => {
        const isActive = active.includes(filter);
        return (
          <button
            key={filter}
            type="button"
            onClick={() => toggleStatus(filter)}
            aria-pressed={isActive}
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

// Simple Today / Yesterday toggle for the Health page, so the user can
// correct either day's log (Section 17/18 only requires "today" but a
// same-day correction for yesterday is a common real need).
function DaySelector({ selected, onChange }) {
  return (
    <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
      {["today", "yesterday"].map((day) => (
        <button
          key={day}
          type="button"
          onClick={() => onChange(day)}
          className={[
            "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",
            selected === day
              ? "bg-white text-brand-700 shadow-sm dark:bg-slate-700 dark:text-brand-300"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
          ].join(" ")}
        >
          {day}
        </button>
      ))}
    </div>
  );
}

export default DaySelector;

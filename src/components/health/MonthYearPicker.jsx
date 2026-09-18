import { MONTH_NAMES } from "../../utils/date";

// Month/Year selector for browsing health history one month at a time.
function MonthYearPicker({ year, month, onChange }) {
  function goToPrevMonth() {
    if (month === 0) onChange(year - 1, 11);
    else onChange(year, month - 1);
  }

  function goToNextMonth() {
    if (month === 11) onChange(year + 1, 0);
    else onChange(year, month + 1);
  }

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2">
      <button
        type="button"
        onClick={goToPrevMonth}
        aria-label="Previous month"
        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
      >
        ‹
      </button>
      <p className="text-sm font-semibold text-slate-800">
        {MONTH_NAMES[month]} {year}
      </p>
      <button
        type="button"
        onClick={goToNextMonth}
        aria-label="Next month"
        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
      >
        ›
      </button>
    </div>
  );
}

export default MonthYearPicker;

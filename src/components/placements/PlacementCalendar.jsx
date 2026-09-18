import { useMemo, useState } from "react";
import {
  getMonthGrid,
  toDateKey,
  MONTH_NAMES,
  WEEKDAY_LABELS,
} from "../../utils/date";

// Month calendar grid. Days that have at least one placement event get a
// small dot indicator. Clicking a day calls onSelectDate.
function PlacementCalendar({ eventsByDate, selectedDateKey, onSelectDate }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const todayKey = toDateKey(today);

  const cells = useMemo(
    () => getMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  function goToPrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={goToPrevMonth}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goToNextMonth}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="text-xs font-medium text-slate-400 dark:text-slate-500">
            {label}
          </div>
        ))}

        {cells.map(({ date, inCurrentMonth }) => {
          const key = toDateKey(date);
          const isToday = key === todayKey;
          const isSelected = key === selectedDateKey;
          const dayEvents = eventsByDate[key] || [];
          const hasEvents = dayEvents.length > 0;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDate(key)}
              className={[
                "relative mx-auto flex h-9 w-9 flex-col items-center justify-center rounded-full text-sm transition-colors",
                !inCurrentMonth ? "text-slate-300 dark:text-slate-600" : "text-slate-700 dark:text-slate-200",
                isSelected
                  ? "bg-brand-600 text-white"
                  : isToday
                  ? "border border-brand-400 text-brand-600 dark:text-brand-400"
                  : "hover:bg-slate-100 dark:hover:bg-slate-700",
              ].join(" ")}
            >
              {date.getDate()}
              {hasEvents ? (
                <span
                  className={[
                    "absolute bottom-1 h-1 w-1 rounded-full",
                    isSelected ? "bg-white" : "bg-brand-500",
                  ].join(" ")}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PlacementCalendar;

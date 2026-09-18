import { MONTH_NAMES } from "../../utils/date";

// Two compact dropdowns (Month, Year) — sits flush right, works well on
// both mobile and desktop without a single oversized button.
function MonthYearPicker({ year, month, onChange, minYear }) {
  const currentYear = new Date().getFullYear();
  const startYear = minYear ?? currentYear - 5;
  const years = [];
  for (let y = currentYear + 1; y >= startYear; y--) years.push(y);

  return (
    <div className="flex items-center justify-end gap-2">
      <select
        value={month}
        onChange={(e) => onChange(year, Number(e.target.value))}
        aria-label="Month"
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      >
        {MONTH_NAMES.map((name, index) => (
          <option key={name} value={index}>
            {name}
          </option>
        ))}
      </select>
      <select
        value={year}
        onChange={(e) => onChange(Number(e.target.value), month)}
        aria-label="Year"
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}

export default MonthYearPicker;

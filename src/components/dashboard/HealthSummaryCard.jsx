import Card from "../common/Card";
import { MONTH_NAMES } from "../../utils/date";

// Monthly health snapshot shown on the Dashboard — averages/totals for
// the current calendar month, not just today's raw log (Fruits/Nuts show
// how many days they were eaten, Meals/Sleep show the month's average).
function HealthSummaryCard({ summary, monthIndex }) {
  const monthLabel = MONTH_NAMES[monthIndex] || "";

  if (!summary || summary.totalDays === 0) {
    return (
      <Card className="bg-white dark:bg-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No health entries logged yet this month. Add one from the Health page.
        </p>
      </Card>
    );
  }

  const stats = [
    {
      icon: "🍎",
      label: "Fruits",
      value: `${summary.fruitsDays}/${summary.totalDays}`,
      hint: "days",
    },
    {
      icon: "🥜",
      label: "Nuts",
      value: `${summary.nutsDays}/${summary.totalDays}`,
      hint: "days",
    },
    {
      icon: "🍽️",
      label: "Meals",
      value: summary.avgMeals,
      hint: "avg/day",
    },
    {
      icon: "😴",
      label: "Sleep",
      value: `${summary.avgSleepHours}h`,
      hint: "avg/night",
    },
  ];

  return (
    <Card className="bg-white dark:bg-slate-800">
      <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {monthLabel} average
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 py-3 dark:bg-slate-900/40"
          >
            <p className="text-2xl leading-none">{s.icon}</p>
            <p className="text-lg font-bold leading-tight text-slate-800 dark:text-slate-100">
              {s.value}
            </p>
            <p className="text-[11px] leading-none text-slate-400 dark:text-slate-500">
              {s.label} · {s.hint}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default HealthSummaryCard;

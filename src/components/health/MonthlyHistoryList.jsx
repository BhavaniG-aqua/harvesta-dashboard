import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import { formatShortDate } from "../../utils/date";

// Monthly health history list — shows every logged day within the
// currently selected month/year. No charts/analytics, just raw entries.
function MonthlyHistoryList({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <EmptyState
        icon="📆"
        title="No entries for this month"
        description="Switch months using the arrows above, or log today's habits from the Today tab."
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {logs.map((log) => (
        <Card key={log.id} className="flex items-center justify-between bg-white dark:bg-slate-800">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {formatShortDate(log.date)}
          </p>
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span>🍎 {log.fruits ? "✓" : "✗"}</span>
            <span>🥜 {log.nuts ? "✓" : "✗"}</span>
            <span>🍽️ {log.meals}</span>
            <span>😴 {log.sleepHours}h</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default MonthlyHistoryList;

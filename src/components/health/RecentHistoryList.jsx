import Card from "../common/Card";
import { formatShortDate } from "../../utils/date";

// Simple recent history list (last few daily logs), no charts/analytics.
function RecentHistoryList({ logs }) {
  if (!logs || logs.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {logs.map((log) => (
        <Card key={log.id} className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">
            {formatShortDate(log.date)}
          </p>
          <div className="flex items-center gap-3 text-sm text-slate-500">
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

export default RecentHistoryList;

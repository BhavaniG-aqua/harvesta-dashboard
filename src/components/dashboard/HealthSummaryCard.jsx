import Card from "../common/Card";

// Compact health snapshot shown on the Dashboard (today's log only).
// This intentionally shows raw values, not stats/streaks/progress.
function HealthSummaryCard({ log }) {
  if (!log) {
    return (
      <Card>
        <p className="text-sm text-slate-500">
          No health entry for today yet. Add one from the Health page.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div>
          <p className="text-xl">🍎</p>
          <p className="mt-1 text-xs text-slate-500">Fruits</p>
          <p className="text-sm font-semibold text-slate-800">
            {log.fruits ? "✓" : "✗"}
          </p>
        </div>
        <div>
          <p className="text-xl">🥜</p>
          <p className="mt-1 text-xs text-slate-500">Nuts</p>
          <p className="text-sm font-semibold text-slate-800">
            {log.nuts ? "✓" : "✗"}
          </p>
        </div>
        <div>
          <p className="text-xl">🍽️</p>
          <p className="mt-1 text-xs text-slate-500">Meals</p>
          <p className="text-sm font-semibold text-slate-800">{log.meals}</p>
        </div>
        <div>
          <p className="text-xl">😴</p>
          <p className="mt-1 text-xs text-slate-500">Sleep</p>
          <p className="text-sm font-semibold text-slate-800">
            {log.sleepHours}h
          </p>
        </div>
      </div>
    </Card>
  );
}

export default HealthSummaryCard;

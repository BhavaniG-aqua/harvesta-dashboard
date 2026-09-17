import Card from "../common/Card";
import EmptyState from "../common/EmptyState";

// "Today's Focus" — a small, curated list of things that need attention
// today (e.g. a pending fruit reminder). Intentionally short and not a
// task-management system.
function TodayFocusList({ items }) {
  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon="✅"
        title="Nothing urgent today"
        description="You're all caught up."
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <Card key={item.id} className="flex items-center gap-3">
          <span className="text-xl">{item.icon}</span>
          <p className="text-sm text-slate-700">{item.label}</p>
        </Card>
      ))}
    </div>
  );
}

export default TodayFocusList;

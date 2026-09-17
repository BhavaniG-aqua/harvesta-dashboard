import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import { formatShortDate, daysFromToday } from "../../utils/date";

// List of upcoming placement events (excluding the very next one, which
// already has its own highlight card).
function UpcomingEventsList({ events }) {
  if (!events || events.length === 0) {
    return (
      <EmptyState
        icon="🗓️"
        title="No other upcoming events"
        description="Companies you add will show up here in order."
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {events.map((event) => {
        const daysAway = daysFromToday(event.date);
        return (
          <Card key={event.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {event.company}
              </p>
              <p className="text-xs text-slate-500">{event.role}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700">
                {formatShortDate(event.date)}
              </p>
              <p className="text-xs text-slate-400">
                {daysAway > 0 ? `in ${daysAway}d` : "today"}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default UpcomingEventsList;

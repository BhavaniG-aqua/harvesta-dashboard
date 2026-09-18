import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import { formatShortDate, daysFromToday } from "../../utils/date";

// "Next Event" highlight card on the Dashboard.
function NextEventCard({ event }) {
  if (!event) {
    return (
      <EmptyState
        icon="💼"
        title="No upcoming placement events"
        description="Add a company in the Placements section to see it here."
      />
    );
  }

  const daysAway = daysFromToday(event.date);
  const dayLabel =
    daysAway === 0
      ? "Today"
      : daysAway === 1
      ? "Tomorrow"
      : daysAway > 1
      ? `In ${daysAway} days`
      : "Past";

  return (
    <Card className="bg-brand-700 text-white">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-100">
        Next Event
      </p>
      <p className="mt-2 text-2xl font-bold">{event.company}</p>
      <p className="text-sm text-brand-100">{event.role}</p>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <span className="rounded-full bg-white/15 px-2.5 py-1 font-medium">
          {formatShortDate(event.date)}
        </span>
        <span className="rounded-full bg-white/15 px-2.5 py-1 font-medium">
          {dayLabel}
        </span>
      </div>
    </Card>
  );
}

export default NextEventCard;

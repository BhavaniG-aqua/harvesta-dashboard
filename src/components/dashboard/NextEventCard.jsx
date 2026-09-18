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
    <Card className="relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 text-white">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10"
        aria-hidden="true"
      />
      <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
        Next Event
      </p>
      <p className="mt-2 text-2xl font-bold">{event.company}</p>
      <p className="text-sm text-white/80">{event.role}</p>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <span className="rounded-full bg-white/20 px-2.5 py-1 font-medium backdrop-blur-sm">
          {formatShortDate(event.date)}
        </span>
        <span className="rounded-full bg-white/20 px-2.5 py-1 font-medium backdrop-blur-sm">
          {dayLabel}
        </span>
      </div>
    </Card>
  );
}

export default NextEventCard;

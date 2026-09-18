import { Link } from "react-router-dom";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";

// List of placement events for a single selected calendar day —
// mirrors the "Today's Task" list style from the reference design.
function SelectedDayEvents({ dateLabel, events }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {dateLabel}
      </p>

      {events.length === 0 ? (
        <EmptyState icon="📅" title="No placement events on this day" />
      ) : (
        <div className="flex flex-col gap-2">
          {events.map((event) => (
            <Link key={event.id} to={`/placements/${event.id}`}>
              <Card className="flex items-center justify-between bg-white dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {event.company}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{event.role}</p>
                  </div>
                </div>
                {event.time ? (
                  <p className="shrink-0 text-sm font-medium text-slate-600 dark:text-slate-300">
                    {event.time}
                  </p>
                ) : null}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectedDayEvents;

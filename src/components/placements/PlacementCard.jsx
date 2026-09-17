import { Link } from "react-router-dom";
import Card from "../common/Card";
import { formatShortDate } from "../../utils/date";

// Compact summary card for a placement event, used in the Placements list.
function PlacementCard({ event }) {
  return (
    <Link to={`/placements/${event.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-slate-900">
              {event.company}
            </p>
            <p className="text-sm text-slate-500">{event.role}</p>
          </div>
          <span className="shrink-0 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-700">
            {formatShortDate(event.date)}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <span>💰 {event.package}</span>
          <span>•</span>
          <span>{event.time}</span>
        </div>
      </Card>
    </Link>
  );
}

export default PlacementCard;

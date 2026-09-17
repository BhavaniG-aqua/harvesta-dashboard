import Card from "../common/Card";
import StatusPill from "../common/StatusPill";

const STATUS_OPTIONS = ["NEW", "COMPLETED", "REVISE"];

// A single preparation topic row with inline status switcher.
function TopicItem({ topic, onStatusChange, onDelete }) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-800">{topic.name}</p>
        <StatusPill status={topic.status} />
      </div>

      <div className="flex gap-2">
        {STATUS_OPTIONS.map((status) => {
          const isActive = topic.status === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => onStatusChange(topic.id, status)}
              className={[
                "flex-1 rounded-lg py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200",
              ].join(" ")}
            >
              {status}
            </button>
          );
        })}
        {onDelete ? (
          <button
            type="button"
            onClick={() => onDelete(topic.id)}
            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-100"
            aria-label="Delete topic"
          >
            🗑️
          </button>
        ) : null}
      </div>
    </Card>
  );
}

export default TopicItem;

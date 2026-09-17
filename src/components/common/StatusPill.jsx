// Status pill used for Preparation Topics (NEW / COMPLETED / REVISE).
const STATUS_STYLES = {
  NEW: "bg-slate-100 text-slate-600",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  REVISE: "bg-amber-100 text-amber-700",
};

function StatusPill({ status, className = "" }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.NEW;
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        style,
        className,
      ].join(" ")}
    >
      {status}
    </span>
  );
}

export default StatusPill;

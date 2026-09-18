// Status pill used for Preparation Topics (NEW / COMPLETED / REVISE).
const STATUS_STYLES = {
  NEW: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  REVISE: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
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

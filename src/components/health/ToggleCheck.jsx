// Large touch-friendly ✓ / ✗ toggle used for Fruits / Nuts tracking.
function ToggleCheck({ label, icon, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        "flex flex-1 flex-col items-center gap-1 rounded-2xl border p-4 transition-all",
        checked
          ? "border-success-500/30 bg-success-50 shadow-sm shadow-success-500/10"
          : "border-slate-200 bg-white hover:border-slate-300",
      ].join(" ")}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <span
        className={[
          "text-lg font-semibold",
          checked ? "text-success-600" : "text-slate-400",
        ].join(" ")}
      >
        {checked ? "✓" : "✗"}
      </span>
    </button>
  );
}

export default ToggleCheck;

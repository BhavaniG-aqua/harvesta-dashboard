import Card from "../common/Card";

// Simple numeric sleep hours input.
function SleepInput({ value, onChange }) {
  return (
    <Card className="bg-white dark:bg-slate-800">
      <label className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">😴 Sleep (hours)</span>
        <input
          type="number"
          step="0.5"
          min="0"
          max="14"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-right text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </label>
    </Card>
  );
}

export default SleepInput;

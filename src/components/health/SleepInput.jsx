import Card from "../common/Card";

// Simple numeric sleep hours input.
function SleepInput({ value, onChange }) {
  return (
    <Card className="bg-white">
      <label className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-slate-500">😴 Sleep (hours)</span>
        <input
          type="number"
          step="0.5"
          min="0"
          max="14"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-right text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
      </label>
    </Card>
  );
}

export default SleepInput;

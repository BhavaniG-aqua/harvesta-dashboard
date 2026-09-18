import Card from "../common/Card";

// Meal count selector: choose exactly one of 1 / 2 / 3.
function MealCountSelector({ value, onChange }) {
  return (
    <Card>
      <p className="mb-2 text-xs font-medium text-slate-500">🍽️ Meals today</p>
      <div className="flex gap-2">
        {[1, 2, 3].map((count) => {
          const isActive = value === count;
          return (
            <button
              key={count}
              type="button"
              onClick={() => onChange(count)}
              className={[
                "flex-1 rounded-xl py-3 text-sm font-semibold transition-all",
                isActive
                  ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-sm shadow-brand-600/20"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200",
              ].join(" ")}
            >
              {count}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export default MealCountSelector;

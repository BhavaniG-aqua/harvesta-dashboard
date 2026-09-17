// Horizontal scrollable category chip list, with an "All" option.
function CategoryTabs({ categories, activeId, onChange }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={[
          "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
          activeId === null
            ? "bg-slate-800 text-white"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200",
        ].join(" ")}
      >
        All Categories
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={[
            "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
            activeId === cat.id
              ? "bg-slate-800 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200",
          ].join(" ")}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;

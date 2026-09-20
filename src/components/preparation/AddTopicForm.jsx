import { useMemo, useState } from "react";
import Button from "../common/Button";

// Shared "add topic" form used from BOTH the Categories page and the
// Companies page. Lets the user:
//   - pick an existing category from a dropdown, OR type a brand new
//     category name (optional — falls back to "Others" if both are left
//     blank)
//   - tag the topic with any number of companies — the list shown here
//     is the UNION of companies already in the Preparation "Companies"
//     page AND every company name already used in the Placements list,
//     so a company you've only added as an upcoming placement event
//     still shows up here without retyping it
//   - and/or type a brand-new company name that exists nowhere yet
// A topic can belong to only one category but many companies, matching
// the Category -> Topics / Company -> Topics hierarchy.
function AddTopicForm({ categories, companies, placementCompanyNames = [], onSubmit, defaultCompanyId }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(
    defaultCompanyId ? [defaultCompanyId] : []
  );
  const [newCompanyName, setNewCompanyName] = useState("");

  // Merge companies already tracked in Preparation with company names
  // that only exist so far in the Placements list — deduped by
  // case-insensitive name, existing companies win (real id kept).
  // Placement-only entries get a synthetic key ("placement:Name") since
  // they don't have a preparation_companies row yet.
  const selectableCompanies = useMemo(() => {
    const byName = new Map();
    for (const c of companies) {
      byName.set(c.name.trim().toLowerCase(), { key: c.id, id: c.id, name: c.name });
    }
    for (const placementName of placementCompanyNames) {
      const trimmed = (placementName || "").trim();
      if (!trimmed) continue;
      const lower = trimmed.toLowerCase();
      if (!byName.has(lower)) {
        byName.set(lower, { key: `placement:${trimmed}`, id: null, name: trimmed });
      }
    }
    return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [companies, placementCompanyNames]);

  function reset() {
    setName("");
    setCategoryId("");
    setNewCategoryName("");
    setSelectedKeys(defaultCompanyId ? [defaultCompanyId] : []);
    setNewCompanyName("");
  }

  function toggleCompany(key) {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    // Split selected keys back into real existing ids vs. placement-only
    // names that still need a preparation_companies row created.
    const companyIds = [];
    const companyNames = [];
    for (const key of selectedKeys) {
      if (typeof key === "string" && key.startsWith("placement:")) {
        companyNames.push(key.slice("placement:".length));
      } else {
        companyIds.push(key);
      }
    }

    onSubmit({
      name: trimmed,
      categoryId: newCategoryName.trim() ? null : categoryId || null,
      categoryName: newCategoryName.trim(),
      companyIds,
      companyNames,
      companyName: newCompanyName.trim(),
    });

    reset();
    setOpen(false);
  }

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        + Topic
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
          Topic name
        </label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Power Transformer"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={Boolean(newCategoryName.trim())}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">Others (default)</option>
            {categories
              .filter((c) => c.name !== "Others")
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
            Or new category (optional)
          </label>
          <input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Type a new category"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {selectableCompanies.length > 0 ? (
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
            Companies (optional, pick any — includes companies from your
            Placements list)
          </label>
          <div className="flex flex-wrap gap-2">
            {selectableCompanies.map((c) => {
              const active = selectedKeys.includes(c.key);
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => toggleCompany(c.key)}
                  className={[
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    active
                      ? "bg-brand-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600",
                  ].join(" ")}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
          Or new company (optional)
        </label>
        <input
          value={newCompanyName}
          onChange={(e) => setNewCompanyName(e.target.value)}
          placeholder="Type a new company name"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            reset();
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">Add Topic</Button>
      </div>
    </form>
  );
}

export default AddTopicForm;

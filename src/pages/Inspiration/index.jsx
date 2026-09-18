import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import InspirationItemCard from "../../components/motivation/InspirationItemCard";
import AddInspirationForm from "../../components/motivation/AddInspirationForm";
import EmptyState from "../../components/common/EmptyState";
import { useInspirationContext } from "../../services/InspirationContext";

const TABS = [
  { id: "motivation", label: "✨ Motivation" },
  { id: "funny", label: "😄 Funny" },
  { id: "image", label: "🖼️ Images" },
];

function InspirationPage() {
  const { items, deleteItem, addItem } = useInspirationContext();
  const [tab, setTab] = useState("motivation");

  const activeItems = items.filter((i) => i.type === tab);

  return (
    <div>
      <PageHeader
        title="Inspiration"
        subtitle="Just for motivation and entertainment — no performance tracking here"
      />

      <div className="mb-4 flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={[
              "border-b-2 -mb-px px-1 pb-2.5 text-sm font-medium transition-colors",
              tab === t.id
                ? "border-brand-600 text-brand-700 dark:border-brand-400 dark:text-brand-400"
                : "border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <AddInspirationForm onSubmit={addItem} />
      </div>

      {activeItems.length === 0 ? (
        <EmptyState
          icon={tab === "motivation" ? "✨" : tab === "funny" ? "😄" : "🖼️"}
          title="Nothing here yet"
          description="Add a quote, image, or something funny — it will appear here and cycle into the Dashboard's daily pick."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {activeItems.map((item) => (
            <InspirationItemCard
              key={item.id}
              item={item}
              onDelete={deleteItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default InspirationPage;

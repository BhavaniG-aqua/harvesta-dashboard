import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import InspirationItemCard from "../../components/motivation/InspirationItemCard";
import AddInspirationForm from "../../components/motivation/AddInspirationForm";
import EmptyState from "../../components/common/EmptyState";
import { useInspirationContext } from "../../services/InspirationContext";

function InspirationPage() {
  const { motivationItems, funnyItems, addItem, deleteItem } =
    useInspirationContext();
  const [tab, setTab] = useState("motivation");

  const activeItems = tab === "motivation" ? motivationItems : funnyItems;

  return (
    <div>
      <PageHeader
        title="Inspiration"
        subtitle="Just for motivation and entertainment — no performance tracking here"
      />

      <div className="mb-4 flex gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setTab("motivation")}
          className={[
            "border-b-2 -mb-px px-1 pb-2.5 text-sm font-medium transition-colors",
            tab === "motivation"
              ? "border-brand-600 text-brand-700"
              : "border-transparent text-slate-400 hover:text-slate-600",
          ].join(" ")}
        >
          ✨ Motivation
        </button>
        <button
          type="button"
          onClick={() => setTab("funny")}
          className={[
            "border-b-2 -mb-px px-1 pb-2.5 text-sm font-medium transition-colors",
            tab === "funny"
              ? "border-brand-600 text-brand-700"
              : "border-transparent text-slate-400 hover:text-slate-600",
          ].join(" ")}
        >
          😄 Funny
        </button>
      </div>

      <div className="mb-4">
        <AddInspirationForm onSubmit={addItem} />
      </div>

      {activeItems.length === 0 ? (
        <EmptyState
          icon={tab === "motivation" ? "✨" : "😄"}
          title="Nothing here yet"
          description="Add a quote, story, or something funny to see it appear here and occasionally on the Dashboard."
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

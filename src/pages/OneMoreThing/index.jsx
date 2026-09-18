import PageHeader from "../../components/common/PageHeader";
import OneMoreThingCard from "../../components/onemorething/OneMoreThingCard";
import EmptyState from "../../components/common/EmptyState";
import { useOneMoreThingContext } from "../../services/OneMoreThingContext";

// A quiet little feed — no explicit "motivation" or "inspiration"
// labeling anywhere in the copy. Just something small to see each day.
// Read-only: content is curated ahead of time outside the running app.
function OneMoreThingPage() {
  const { items } = useOneMoreThingContext();

  return (
    <div>
      <PageHeader title="One More Thing" />

      {items.length === 0 ? (
        <EmptyState icon="🌿" title="Nothing here yet" />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <OneMoreThingCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default OneMoreThingPage;

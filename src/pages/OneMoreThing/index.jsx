import PageHeader from "../../components/common/PageHeader";
import OneMoreThingCard from "../../components/onemorething/OneMoreThingCard";
import EmptyState from "../../components/common/EmptyState";
import { useOneMoreThingContext } from "../../services/OneMoreThingContext";

// A quiet little feed — no explicit "motivation" or "inspiration"
// labeling anywhere in the copy. Just ONE small quote/image for today
// (never a scrollable list of everything), plus one fixed image that
// never changes. Read-only: content is curated ahead of time outside
// the running app (quotes via the Supabase Table Editor, photos by
// dropping files straight into the "one-more-thing" Storage bucket).
function OneMoreThingPage() {
  const { getTodayItem, fixedItem } = useOneMoreThingContext();
  const todayItem = getTodayItem();

  return (
    <div className="relative">
      {/* Soft decorative blobs behind the content — purely visual, no
          interaction, clipped so they never cause page overflow/scroll. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 overflow-hidden">
        <div className="absolute -left-10 -top-16 h-56 w-56 rounded-full bg-brand-200/50 blur-3xl dark:bg-brand-700/20" />
        <div className="absolute -right-16 top-6 h-64 w-64 rounded-full bg-accent-200/40 blur-3xl dark:bg-accent-500/10" />
      </div>

      <PageHeader title="One More Thing" subtitle="A little something for today 🌿" />

      {!todayItem && !fixedItem ? (
        <EmptyState icon="🌿" title="Nothing here yet" />
      ) : (
        <div className="flex flex-col gap-8">
          <OneMoreThingCard item={todayItem} label="Today" />
          <OneMoreThingCard item={fixedItem} label="Always" />
        </div>
      )}
    </div>
  );
}

export default OneMoreThingPage;

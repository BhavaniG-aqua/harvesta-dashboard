import { useMemo } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import PlacementCard from "../../components/placements/PlacementCard";
import EmptyState from "../../components/common/EmptyState";
import { placementEventsMock } from "../../data/mockData";

function PlacementsListPage() {
  const sortedEvents = useMemo(
    () =>
      [...placementEventsMock].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      ),
    []
  );

  return (
    <div>
      <PageHeader
        title="Placements"
        subtitle="Companies coming for campus placements"
        action={<Button>+ Add</Button>}
      />

      {sortedEvents.length === 0 ? (
        <EmptyState
          icon="💼"
          title="No placement events yet"
          description="Add a company to start tracking its role, package and requirements."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {sortedEvents.map((event) => (
            <PlacementCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PlacementsListPage;

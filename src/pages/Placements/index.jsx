import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import PlacementCard from "../../components/placements/PlacementCard";
import EmptyState from "../../components/common/EmptyState";
import { usePlacementsContext } from "../../services/PlacementsContext";

function PlacementsListPage() {
  const { events } = usePlacementsContext();
  const navigate = useNavigate();

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [events]
  );

  return (
    <div>
      <PageHeader
        title="Placements"
        subtitle="Companies coming for campus placements"
        action={<Button onClick={() => navigate("/placements/new")}>+ Add</Button>}
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

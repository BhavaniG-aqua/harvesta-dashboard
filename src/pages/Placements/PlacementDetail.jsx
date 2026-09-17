import { useParams } from "react-router-dom";
import BackLink from "../../components/common/BackLink";
import Card from "../../components/common/Card";
import DetailRow from "../../components/common/DetailRow";
import EmptyState from "../../components/common/EmptyState";
import { formatShortDate } from "../../utils/date";
import { placementEventsMock } from "../../data/mockData";

function PlacementDetailPage() {
  const { eventId } = useParams();
  const event = placementEventsMock.find((e) => e.id === eventId);

  return (
    <div>
      <BackLink to="/placements" label="Back to Placements" />

      {!event ? (
        <EmptyState icon="🔍" title="Event not found" />
      ) : (
        <>
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-slate-900">
              {event.company}
            </h1>
            <p className="text-sm text-slate-500">{event.role}</p>
          </div>

          <Card padded={false}>
            <div className="px-4">
              <DetailRow label="Date" value={formatShortDate(event.date)} />
              <DetailRow label="Time" value={event.time} />
              <DetailRow label="Package / CTC" value={event.package} />
              <DetailRow label="Requirements" value={event.requirements} />
              <DetailRow
                label="Selection Process"
                value={event.selectionProcess}
              />
              <DetailRow label="What to Prepare" value={event.whatToPrepare} />
              <DetailRow label="Additional Notes" value={event.notes} />
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export default PlacementDetailPage;

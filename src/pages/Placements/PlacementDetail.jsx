import { useNavigate, useParams } from "react-router-dom";
import BackLink from "../../components/common/BackLink";
import Card from "../../components/common/Card";
import DetailRow from "../../components/common/DetailRow";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import ConfirmButton from "../../components/common/ConfirmButton";
import { formatShortDate } from "../../utils/date";
import { usePlacementsContext } from "../../services/PlacementsContext";

function PlacementDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { getEvent, deleteEvent } = usePlacementsContext();
  const event = getEvent(eventId);

  function handleDelete() {
    deleteEvent(eventId);
    navigate("/placements");
  }

  return (
    <div>
      <BackLink to="/placements" label="Back to Placements" />

      {!event ? (
        <EmptyState icon="🔍" title="Event not found" />
      ) : (
        <>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                {event.company}
              </h1>
              <p className="text-sm text-slate-500">{event.role}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                variant="secondary"
                onClick={() => navigate(`/placements/${eventId}/edit`)}
              >
                ✏️ Edit
              </Button>
            </div>
          </div>

          <Card padded={false} className="bg-white">
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

          <div className="mt-4">
            <ConfirmButton
              label="🗑️ Delete Event"
              confirmLabel="Delete this event?"
              onConfirm={handleDelete}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default PlacementDetailPage;

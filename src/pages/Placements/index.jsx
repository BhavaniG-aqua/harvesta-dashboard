import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import PlacementCard from "../../components/placements/PlacementCard";
import PlacementCalendar from "../../components/placements/PlacementCalendar";
import SelectedDayEvents from "../../components/placements/SelectedDayEvents";
import ViewToggle from "../../components/placements/ViewToggle";
import NotificationPermissionBanner from "../../components/common/NotificationPermissionBanner";
import EmptyState from "../../components/common/EmptyState";
import { usePlacementsContext } from "../../services/PlacementsContext";
import { useEventReminders } from "../../hooks/useEventReminders";
import { toDateKey } from "../../utils/date";

function PlacementsListPage() {
  const { events } = usePlacementsContext();
  const { permission, requestPermission } = useEventReminders(events);
  const navigate = useNavigate();
  const [view, setView] = useState("list");
  const [selectedDateKey, setSelectedDateKey] = useState(() =>
    toDateKey(new Date())
  );

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [events]
  );

  // Group events by their date ("YYYY-MM-DD") for quick calendar lookups.
  const eventsByDate = useMemo(() => {
    const map = {};
    for (const event of events) {
      if (!event.date) continue;
      if (!map[event.date]) map[event.date] = [];
      map[event.date].push(event);
    }
    return map;
  }, [events]);

  const selectedDayEvents = eventsByDate[selectedDateKey] || [];
  const selectedDateLabel = new Date(
    `${selectedDateKey}T00:00:00`
  ).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div>
      <PageHeader
        title="Placements"
        subtitle="Companies coming for campus placements"
        action={<Button onClick={() => navigate("/placements/new")}>+ Add</Button>}
      />

      <div className="mb-4">
        <ViewToggle view={view} onChange={setView} />
      </div>

      <NotificationPermissionBanner
        permission={permission}
        onRequest={requestPermission}
        description="Get a silent notification 1 day and 1 hour before each placement event (only while this tab is open)."
      />

      {view === "calendar" ? (
        <div className="flex flex-col gap-4">
          <PlacementCalendar
            eventsByDate={eventsByDate}
            selectedDateKey={selectedDateKey}
            onSelectDate={setSelectedDateKey}
          />
          <SelectedDayEvents
            dateLabel={selectedDateLabel}
            events={selectedDayEvents}
          />
        </div>
      ) : sortedEvents.length === 0 ? (
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

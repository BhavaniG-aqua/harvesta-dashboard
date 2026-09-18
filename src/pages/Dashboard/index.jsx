import { useMemo } from "react";
import { Link } from "react-router-dom";
import GreetingBanner from "../../components/dashboard/GreetingBanner";
import NextEventCard from "../../components/dashboard/NextEventCard";
import UpcomingEventsList from "../../components/dashboard/UpcomingEventsList";
import HealthSummaryCard from "../../components/dashboard/HealthSummaryCard";
import InspirationCard from "../../components/dashboard/InspirationCard";
import SectionTitle from "../../components/common/SectionTitle";
import { usePlacementsContext } from "../../services/PlacementsContext";
import { useHealthContext } from "../../services/HealthContext";
import { useInspirationContext } from "../../services/InspirationContext";
import { useSettingsContext } from "../../services/SettingsContext";

function DashboardPage() {
  const { events } = usePlacementsContext();
  const { todayLog } = useHealthContext();
  const { getTodayItem } = useInspirationContext();
  const { settings } = useSettingsContext();

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [events]
  );

  const [nextEvent, ...restEvents] = sortedEvents;

  // Cycles once per calendar day through every inspiration item.
  const inspirationItem = useMemo(() => getTodayItem(), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-6">
      <GreetingBanner name={settings.friendName} />

      <NextEventCard event={nextEvent} />

      <div>
        <SectionTitle>Upcoming Events</SectionTitle>
        <UpcomingEventsList events={restEvents} />
      </div>

      <div>
        <SectionTitle>Health Summary</SectionTitle>
        <HealthSummaryCard log={todayLog} />
      </div>

      <div>
        <SectionTitle>Inspiration</SectionTitle>
        <InspirationCard item={inspirationItem} />
        <Link
          to="/inspiration"
          className="mt-2 inline-block text-xs font-medium text-brand-600 hover:underline"
        >
          See more →
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;

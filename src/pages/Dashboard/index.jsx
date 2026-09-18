import { useMemo } from "react";
import { Link } from "react-router-dom";
import GreetingBanner from "../../components/dashboard/GreetingBanner";
import NextEventCard from "../../components/dashboard/NextEventCard";
import UpcomingEventsList from "../../components/dashboard/UpcomingEventsList";
import HealthSummaryCard from "../../components/dashboard/HealthSummaryCard";
import OneMoreThingCard from "../../components/onemorething/OneMoreThingCard";
import SectionTitle from "../../components/common/SectionTitle";
import { usePlacementsContext } from "../../services/PlacementsContext";
import { useHealthContext } from "../../services/HealthContext";
import { useOneMoreThingContext } from "../../services/OneMoreThingContext";
import { useSettingsContext } from "../../services/SettingsContext";

function DashboardPage() {
  const { events } = usePlacementsContext();
  const { todayLog } = useHealthContext();
  const { getTodayItem } = useOneMoreThingContext();
  const { settings } = useSettingsContext();

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [events]
  );

  const [nextEvent, ...restEvents] = sortedEvents;

  // Cycles once per calendar day through every item.
  const todayItem = useMemo(() => getTodayItem(), []); // eslint-disable-line react-hooks/exhaustive-deps

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
        <SectionTitle>One More Thing</SectionTitle>
        <OneMoreThingCard item={todayItem} />
        <Link
          to="/one-more-thing"
          className="mt-2 inline-block text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          See more →
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;

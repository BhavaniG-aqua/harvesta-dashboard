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
  const { getMonthSummary } = useHealthContext();
  const { getTodayItem, fixedItem } = useOneMoreThingContext();
  const { settings } = useSettingsContext();

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [events]
  );

  const [nextEvent, ...restEvents] = sortedEvents;
  const MAX_DASHBOARD_EVENTS = 3;
  const visibleUpcomingEvents = restEvents.slice(0, MAX_DASHBOARD_EVENTS - 1);
  const hasMoreEvents = restEvents.length > visibleUpcomingEvents.length;

  const now = new Date();
  const monthSummary = useMemo(
    () => getMonthSummary(now.getFullYear(), now.getMonth()),
    [getMonthSummary] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Cycles once per calendar day through every item.
  const todayItem = useMemo(() => getTodayItem(), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-6">
      {/* Header band */}
      <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-5 py-6 text-white shadow-sm shadow-brand-700/20 md:px-8">
        <GreetingBanner name={settings.friendName} light />
      </div>

      {settings.permanentReminder ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-center dark:border-amber-900/40 dark:bg-amber-900/10">
          <p className="font-serif text-sm italic text-amber-800 dark:text-amber-200">
            “{settings.permanentReminder}”
          </p>
        </div>
      ) : null}

      {/* Top glance row: next event + health summary side by side on larger screens */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <SectionTitle className="flex items-center gap-1">
            <span>📌</span> Next Event
          </SectionTitle>
          <NextEventCard event={nextEvent} />
        </div>
        <div>
          <SectionTitle className="flex items-center gap-1">
            <span>❤️</span> Health Summary
          </SectionTitle>
          <HealthSummaryCard summary={monthSummary} monthIndex={now.getMonth()} />
        </div>
      </div>

      <div>
        <SectionTitle className="flex items-center gap-1">
          <span>🗓️</span> Upcoming Events
        </SectionTitle>
        <UpcomingEventsList events={visibleUpcomingEvents} />
        {hasMoreEvents ? (
          <Link
            to="/placements"
            className="mt-2 inline-block text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            See all events →
          </Link>
        ) : null}
      </div>

      <div>
        <SectionTitle className="flex items-center gap-1">
          <span>🌿</span> One More Thing
        </SectionTitle>
        <OneMoreThingCard item={todayItem} compact />
        <OneMoreThingCard item={fixedItem} compact className="mt-3" />
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

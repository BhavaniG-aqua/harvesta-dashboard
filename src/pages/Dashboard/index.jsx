import { useMemo } from "react";
import { Link } from "react-router-dom";
import GreetingBanner from "../../components/dashboard/GreetingBanner";
import NextEventCard from "../../components/dashboard/NextEventCard";
import UpcomingEventsList from "../../components/dashboard/UpcomingEventsList";
import HealthSummaryCard from "../../components/dashboard/HealthSummaryCard";
import InspirationCard from "../../components/dashboard/InspirationCard";
import TodayFocusList from "../../components/dashboard/TodayFocusList";
import SectionTitle from "../../components/common/SectionTitle";
import { usePlacementsContext } from "../../services/PlacementsContext";
import { useHealthContext } from "../../services/HealthContext";
import { useInspirationContext } from "../../services/InspirationContext";
import { useSettingsContext } from "../../services/SettingsContext";

function DashboardPage() {
  const { events } = usePlacementsContext();
  const { todayLog, pendingReminders } = useHealthContext();
  const { getRandomItem } = useInspirationContext();
  const { settings } = useSettingsContext();

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [events]
  );

  const [nextEvent, ...restEvents] = sortedEvents;

  const todayFocusItems = useMemo(() => {
    if (pendingReminders.length === 0) return [];
    return [
      {
        id: "focus-fruit",
        icon: "🍎",
        label: `Buy fruits reminder pending (${pendingReminders.length})`,
      },
    ];
  }, [pendingReminders]);

  // Picked once per page load (not on every render).
  const inspirationItem = useMemo(() => getRandomItem(), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-6">
      <GreetingBanner name={settings.friendName} />

      <NextEventCard event={nextEvent} />

      <div>
        <SectionTitle>Today&apos;s Focus</SectionTitle>
        <TodayFocusList items={todayFocusItems} />
      </div>

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

import { useMemo, useState } from "react";
import GreetingBanner from "../../components/dashboard/GreetingBanner";
import NextEventCard from "../../components/dashboard/NextEventCard";
import UpcomingEventsList from "../../components/dashboard/UpcomingEventsList";
import HealthSummaryCard from "../../components/dashboard/HealthSummaryCard";
import InspirationCard from "../../components/dashboard/InspirationCard";
import TodayFocusList from "../../components/dashboard/TodayFocusList";
import SectionTitle from "../../components/common/SectionTitle";
import {
  placementEventsMock,
  healthDailyLogsMock,
  fruitRemindersMock,
  inspirationContentMock,
  settingsMock,
} from "../../data/mockData";

function DashboardPage() {
  const sortedEvents = useMemo(
    () =>
      [...placementEventsMock].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      ),
    []
  );

  const [nextEvent, ...restEvents] = sortedEvents;

  // Today's health log is the most recent entry for now (mock data has no
  // guaranteed "today" row).
  const todayLog = healthDailyLogsMock[0] ?? null;

  // Today's focus: any pending fruit reminder for "today" (first mock date).
  const todayFocusItems = useMemo(() => {
    const pending = fruitRemindersMock.filter((r) => !r.done);
    if (pending.length === 0) return [];
    return [
      {
        id: "focus-fruit",
        icon: "🍎",
        label: `Buy fruits reminder pending (${pending.length})`,
      },
    ];
  }, []);

  // Picked once when the component mounts (not on every render).
  const [inspirationItem] = useState(() => {
    const pool = inspirationContentMock;
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  });

  return (
    <div className="flex flex-col gap-6">
      <GreetingBanner name={settingsMock.friendName} />

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
      </div>
    </div>
  );
}

export default DashboardPage;

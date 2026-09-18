import PageHeader from "../../components/common/PageHeader";
import SectionTitle from "../../components/common/SectionTitle";
import NotificationPermissionBanner from "../../components/common/NotificationPermissionBanner";
import ToggleCheck from "../../components/health/ToggleCheck";
import MealCountSelector from "../../components/health/MealCountSelector";
import SleepInput from "../../components/health/SleepInput";
import FruitReminderCard from "../../components/health/FruitReminderCard";
import RecentHistoryList from "../../components/health/RecentHistoryList";
import { useHealthContext } from "../../services/HealthContext";
import { useFruitReminderNotifications } from "../../hooks/useFruitReminderNotifications";

function HealthPage() {
  const { logs, todayLog, upsertTodayLog, reminders, pendingReminders, markReminderDone } =
    useHealthContext();
  const { permission, requestPermission } = useFruitReminderNotifications(reminders);

  const recentLogs = logs.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Health" subtitle="Quick daily habit tracker" />

      <NotificationPermissionBanner
        permission={permission}
        onRequest={requestPermission}
        description="Get a silent notification when it's time to buy fruits (only while this tab is open)."
      />

      <div>
        <SectionTitle>Today</SectionTitle>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <ToggleCheck
              label="Fruits"
              icon="🍎"
              checked={!!todayLog?.fruits}
              onChange={(v) => upsertTodayLog({ fruits: v })}
            />
            <ToggleCheck
              label="Nuts"
              icon="🥜"
              checked={!!todayLog?.nuts}
              onChange={(v) => upsertTodayLog({ nuts: v })}
            />
          </div>

          <MealCountSelector
            value={todayLog?.meals ?? 1}
            onChange={(v) => upsertTodayLog({ meals: v })}
          />

          <SleepInput
            value={todayLog?.sleepHours ?? 0}
            onChange={(v) => upsertTodayLog({ sleepHours: v })}
          />
        </div>
      </div>

      <div>
        <SectionTitle>Fruit Reminder</SectionTitle>
        <FruitReminderCard
          pendingReminders={pendingReminders}
          onMarkDone={markReminderDone}
        />
      </div>

      <div>
        <SectionTitle>Recent History</SectionTitle>
        <RecentHistoryList logs={recentLogs} />
      </div>
    </div>
  );
}

export default HealthPage;

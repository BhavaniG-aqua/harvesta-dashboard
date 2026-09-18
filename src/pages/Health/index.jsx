import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SectionTitle from "../../components/common/SectionTitle";
import Button from "../../components/common/Button";
import DaySelector from "../../components/health/DaySelector";
import ToggleCheck from "../../components/health/ToggleCheck";
import MealCountSelector from "../../components/health/MealCountSelector";
import SleepInput from "../../components/health/SleepInput";
import FruitReminderCard from "../../components/health/FruitReminderCard";
import RecentHistoryList from "../../components/health/RecentHistoryList";
import { useHealthContext } from "../../services/HealthContext";
import { todayStr, yesterdayStr } from "../../hooks/useHealthData";
import { formatShortDate } from "../../utils/date";

const EMPTY_LOG = { fruits: false, nuts: false, meals: 1, sleepHours: 0 };

function HealthPage() {
  const {
    logs,
    getLogForDate,
    saveLogForDate,
    pendingReminders,
    markReminderDone,
  } = useHealthContext();

  const [selectedDay, setSelectedDay] = useState("today");
  const dateKey = selectedDay === "today" ? todayStr() : yesterdayStr();

  // Staged (unsaved) form state — only written to storage when Save is
  // pressed, so toggling fruits/nuts/meals/sleep no longer auto-saves.
  const [form, setForm] = useState(() => getLogForDate(dateKey) || EMPTY_LOG);
  const [saved, setSaved] = useState(false);

  // Re-load the staged form whenever the selected day changes.
  useEffect(() => {
    setForm(getLogForDate(dateKey) || EMPTY_LOG);
    setSaved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  function setField(partial) {
    setForm((prev) => ({ ...prev, ...partial }));
    setSaved(false);
  }

  function handleSave() {
    saveLogForDate(dateKey, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const recentLogs = logs.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Health" subtitle="Quick daily habit tracker" />

      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            {formatShortDate(dateKey)}
          </p>
          <DaySelector selected={selectedDay} onChange={setSelectedDay} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <ToggleCheck
              label="Fruits"
              icon="🍎"
              checked={!!form.fruits}
              onChange={(v) => setField({ fruits: v })}
            />
            <ToggleCheck
              label="Nuts"
              icon="🥜"
              checked={!!form.nuts}
              onChange={(v) => setField({ nuts: v })}
            />
          </div>

          <MealCountSelector
            value={form.meals ?? 1}
            onChange={(v) => setField({ meals: v })}
          />

          <SleepInput
            value={form.sleepHours ?? 0}
            onChange={(v) => setField({ sleepHours: v })}
          />

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} className="self-start">
              💾 Save
            </Button>
            {saved ? (
              <span className="text-xs font-medium text-emerald-600">
                Saved ✓
              </span>
            ) : null}
          </div>
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

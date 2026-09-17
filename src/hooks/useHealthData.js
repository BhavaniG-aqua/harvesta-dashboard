import { useCallback, useEffect } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { healthDailyLogsMock, fruitRemindersMock } from "../data/mockData";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const todayStr = () => new Date().toISOString().slice(0, 10);
const todayDayName = () => DAY_NAMES[new Date().getDay()];

// Persisted state hook for Health: daily food/sleep logs + fruit reminders.
// Reminder generation is driven by Settings (reminderDays / reminderTimes):
// each configured reminder day gets one reminder entry per configured time.
// A reminder keeps showing as "pending" until marked DONE — since it isn't
// tied to a hard deadline, this naturally satisfies "remind again the
// following day if not completed" (Section 19 of the master context).
export function useHealthData(settings) {
  const [logs, setLogs] = useLocalStorageState(
    "dashboard.healthLogs",
    healthDailyLogsMock
  );
  const [reminders, setReminders] = useLocalStorageState(
    "dashboard.fruitReminders",
    fruitRemindersMock
  );

  // Ensure today's reminders exist if today is a configured reminder day.
  useEffect(() => {
    if (!settings) return;
    const isReminderDay = settings.reminderDays?.includes(todayDayName());
    if (!isReminderDay) return;

    setReminders((prev) => {
      const date = todayStr();
      const existingTimes = new Set(
        prev.filter((r) => r.date === date).map((r) => r.time)
      );
      const missing = (settings.reminderTimes || [])
        .filter((time) => !existingTimes.has(time))
        .map((time, i) => ({
          id: `fr-${Date.now()}-${i}`,
          date,
          time,
          done: false,
        }));
      return missing.length > 0 ? [...prev, ...missing] : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.reminderDays, settings?.reminderTimes]);

  const todayLog = logs.find((l) => l.date === todayStr()) || null;

  const upsertTodayLog = useCallback(
    (partial) => {
      setLogs((prev) => {
        const date = todayStr();
        const existingIndex = prev.findIndex((l) => l.date === date);
        if (existingIndex === -1) {
          return [
            {
              id: `hl-${Date.now()}`,
              date,
              fruits: false,
              nuts: false,
              meals: 1,
              sleepHours: 0,
              ...partial,
            },
            ...prev,
          ];
        }
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...partial };
        return updated;
      });
    },
    [setLogs]
  );

  const pendingReminders = reminders.filter((r) => !r.done);

  const markReminderDone = useCallback(
    (reminderId) => {
      setReminders((prev) =>
        prev.map((r) => (r.id === reminderId ? { ...r, done: true } : r))
      );
    },
    [setReminders]
  );

  return {
    logs,
    todayLog,
    upsertTodayLog,
    reminders,
    pendingReminders,
    markReminderDone,
  };
}

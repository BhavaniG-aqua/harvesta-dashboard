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

export const todayStr = () => new Date().toISOString().slice(0, 10);
export const yesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};
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

  // Returns the log for an arbitrary date key ("YYYY-MM-DD"), or null.
  const getLogForDate = useCallback(
    (dateKey) => logs.find((l) => l.date === dateKey) || null,
    [logs]
  );

  // Creates or overwrites the log for a given date key. Used by the
  // explicit Save action on the Health page (Today/Yesterday editable).
  const saveLogForDate = useCallback(
    (dateKey, data) => {
      setLogs((prev) => {
        const existingIndex = prev.findIndex((l) => l.date === dateKey);
        if (existingIndex === -1) {
          return [
            {
              id: `hl-${Date.now()}`,
              date: dateKey,
              fruits: false,
              nuts: false,
              meals: 1,
              sleepHours: 0,
              ...data,
            },
            ...prev,
          ];
        }
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...data };
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
    getLogForDate,
    saveLogForDate,
    reminders,
    pendingReminders,
    markReminderDone,
  };
}

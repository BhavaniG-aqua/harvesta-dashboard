import { useState, useCallback } from "react";
import { healthDailyLogsMock, fruitRemindersMock } from "../data/mockData";

const todayStr = () => new Date().toISOString().slice(0, 10);

// Local state hook for Health: daily food/sleep logs + fruit reminders.
export function useHealthData() {
  const [logs, setLogs] = useState(healthDailyLogsMock);
  const [reminders, setReminders] = useState(fruitRemindersMock);

  const todayLog = logs.find((l) => l.date === todayStr()) || logs[0] || null;

  const upsertTodayLog = useCallback((partial) => {
    setLogs((prev) => {
      const date = todayStr();
      const existingIndex = prev.findIndex((l) => l.date === date);
      if (existingIndex === -1) {
        return [
          { id: `hl-${Date.now()}`, date, fruits: false, nuts: false, meals: 1, sleepHours: 0, ...partial },
          ...prev,
        ];
      }
      const updated = [...prev];
      updated[existingIndex] = { ...updated[existingIndex], ...partial };
      return updated;
    });
  }, []);

  const pendingReminders = reminders.filter((r) => !r.done);

  const markReminderDone = useCallback((reminderId) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminderId ? { ...r, done: true } : r))
    );
  }, []);

  return {
    logs,
    todayLog,
    upsertTodayLog,
    reminders,
    pendingReminders,
    markReminderDone,
  };
}

import { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { healthDailyLogsMock } from "../data/mockData";

export const todayStr = () => new Date().toISOString().slice(0, 10);
export const yesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

// Persisted state hook for Health: daily food/sleep logs.
export function useHealthData() {
  const [logs, setLogs] = useLocalStorageState(
    "dashboard.healthLogs",
    healthDailyLogsMock
  );

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

  // Returns logs for a given month, sorted newest first. `month` is
  // 0-indexed (0 = January), matching JS Date conventions.
  const getLogsForMonth = useCallback(
    (year, month) => {
      return logs
        .filter((l) => {
          const d = new Date(`${l.date}T00:00:00`);
          return d.getFullYear() === year && d.getMonth() === month;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    [logs]
  );

  return {
    logs,
    todayLog,
    getLogForDate,
    saveLogForDate,
    getLogsForMonth,
  };
}

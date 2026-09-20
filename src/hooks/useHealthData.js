import { useCallback, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export const todayStr = () => new Date().toISOString().slice(0, 10);
export const yesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

function fromRow(row) {
  return {
    id: row.id,
    date: row.log_date,
    fruits: row.fruits,
    nuts: row.nuts,
    meals: row.meals,
    sleepHours: row.sleep_hours,
  };
}

// Supabase-backed hook for Health: daily food/sleep logs.
export function useHealthData() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("health_daily_logs")
      .select("*")
      .order("log_date", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) console.error("Failed to load health logs:", error);
        setLogs((data || []).map(fromRow));
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const todayLog = logs.find((l) => l.date === todayStr()) || null;

  const getLogForDate = useCallback(
    (dateKey) => logs.find((l) => l.date === dateKey) || null,
    [logs]
  );

  // Upserts (create or overwrite) the log for a given date key — used by
  // the explicit Save action on the Health page (Today/Yesterday editable).
  const saveLogForDate = useCallback(async (dateKey, data) => {
    const { data: saved, error } = await supabase
      .from("health_daily_logs")
      .upsert(
        {
          log_date: dateKey,
          fruits: data.fruits ?? false,
          nuts: data.nuts ?? false,
          meals: data.meals ?? 1,
          sleep_hours: data.sleepHours ?? 0,
        },
        { onConflict: "log_date" }
      )
      .select()
      .single();
    if (error) {
      console.error("Failed to save health log:", error);
      return;
    }
    const saved2 = fromRow(saved);
    setLogs((prev) => {
      const existingIndex = prev.findIndex((l) => l.date === dateKey);
      if (existingIndex === -1) return [saved2, ...prev];
      const updated = [...prev];
      updated[existingIndex] = saved2;
      return updated;
    });
  }, []);

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

  const getMonthSummary = useCallback(
    (year, month) => {
      const monthLogs = logs.filter((l) => {
        const d = new Date(`${l.date}T00:00:00`);
        return d.getFullYear() === year && d.getMonth() === month;
      });

      const totalDays = monthLogs.length;
      const fruitsDays = monthLogs.filter((l) => l.fruits).length;
      const nutsDays = monthLogs.filter((l) => l.nuts).length;
      const avgMeals = totalDays
        ? Math.round(
            monthLogs.reduce((sum, l) => sum + (l.meals || 0), 0) / totalDays
          )
        : 0;
      const avgSleepHours = totalDays
        ? Math.round(
            (monthLogs.reduce((sum, l) => sum + (l.sleepHours || 0), 0) /
              totalDays) *
              10
          ) / 10
        : 0;

      return { totalDays, fruitsDays, nutsDays, avgMeals, avgSleepHours };
    },
    [logs]
  );

  return {
    logs,
    loading,
    todayLog,
    getLogForDate,
    saveLogForDate,
    getLogsForMonth,
    getMonthSummary,
  };
}

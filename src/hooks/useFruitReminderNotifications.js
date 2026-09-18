import { useEffect } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { useNotificationPermission } from "./useNotificationPermission";
import { parseTimeToHoursMinutes } from "../utils/eventTime";

const CHECK_INTERVAL_MS = 60 * 1000; // check once a minute

// Watches fruit-buying reminders and fires a silent browser notification
// at the moment each reminder's scheduled time arrives, as long as it's
// still pending (not marked DONE). Each reminder fires at most once
// (deduped via localStorage), and per Section 19 of the master context,
// an incomplete reminder keeps showing as pending in the UI the next day
// until marked DONE — this hook only handles the "ping me right now"
// notification, not the multi-day carry-over (that's handled by
// useHealthData already leaving it un-done).
//
// Same in-tab-only limitation as event reminders (Section 19): no service
// worker / push backend.
export function useFruitReminderNotifications(reminders) {
  const { permission, requestPermission } = useNotificationPermission();
  const [firedReminders, setFiredReminders] = useLocalStorageState(
    "dashboard.firedFruitReminders",
    []
  );

  useEffect(() => {
    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "granted") return;

    function checkReminders() {
      const now = new Date();
      const firedSet = new Set(firedReminders);
      const newlyFired = [];

      for (const reminder of reminders) {
        if (reminder.done) continue;
        if (firedSet.has(reminder.id)) continue;

        const parsed = parseTimeToHoursMinutes(reminder.time);
        if (!parsed) continue;

        const [year, month, day] = reminder.date.split("-").map(Number);
        const reminderTime = new Date(
          year,
          month - 1,
          day,
          parsed.hours,
          parsed.minutes,
          0,
          0
        ).getTime();

        // Fire once we've reached (or passed) the scheduled time.
        if (now.getTime() >= reminderTime) {
          new Notification("🍎 Buy fruits", {
            body: `Reminder for ${reminder.time} — tap DONE once you've bought them.`,
            silent: true,
            tag: `fruit-${reminder.id}`,
          });
          newlyFired.push(reminder.id);
        }
      }

      if (newlyFired.length > 0) {
        setFiredReminders((prev) => [...prev, ...newlyFired]);
      }
    }

    checkReminders();
    const interval = setInterval(checkReminders, CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reminders, permission, firedReminders]);

  return { permission, requestPermission };
}

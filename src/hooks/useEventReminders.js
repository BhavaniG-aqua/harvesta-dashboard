import { useEffect } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { useNotificationPermission } from "./useNotificationPermission";
import { getEventDateTime } from "../utils/eventTime";

const CHECK_INTERVAL_MS = 60 * 1000; // check once a minute
const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

// Watches placement events and fires a silent browser notification:
//   - 1 day before the event
//   - 1 hour before the event
// Each reminder fires at most once per event (deduped via localStorage).
//
// Limitation (intentional, per Master Context Section 19 — "do not create
// a complicated notification backend"): this only works while the app is
// open in a browser tab. There is no service worker / push backend, so no
// notification can be delivered while the site is fully closed. This is
// the simplest option that still satisfies "just a notification, not an
// alarm" without server-side infrastructure or paid push services.
export function useEventReminders(events) {
  const { permission, requestPermission } = useNotificationPermission();
  const [firedReminders, setFiredReminders] = useLocalStorageState(
    "dashboard.firedEventReminders",
    []
  );

  useEffect(() => {
    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "granted") return;

    function checkReminders() {
      const now = Date.now();
      const firedSet = new Set(firedReminders);
      const newlyFired = [];

      for (const event of events) {
        const eventTime = getEventDateTime(event)?.getTime();
        if (!eventTime || eventTime <= now) continue; // skip past/invalid events

        const dayBeforeKey = `${event.id}-1day`;
        const hourBeforeKey = `${event.id}-1hour`;
        const dayBeforeTime = eventTime - DAY_MS;
        const hourBeforeTime = eventTime - HOUR_MS;

        if (
          now >= dayBeforeTime &&
          now < eventTime &&
          !firedSet.has(dayBeforeKey)
        ) {
          new Notification(`Tomorrow: ${event.company}`, {
            body: `${event.role || "Placement event"} — ${event.time || ""}`.trim(),
            silent: true,
            tag: dayBeforeKey,
          });
          newlyFired.push(dayBeforeKey);
        }

        if (
          now >= hourBeforeTime &&
          now < eventTime &&
          !firedSet.has(hourBeforeKey)
        ) {
          new Notification(`In 1 hour: ${event.company}`, {
            body: `${event.role || "Placement event"} — ${event.time || ""}`.trim(),
            silent: true,
            tag: hourBeforeKey,
          });
          newlyFired.push(hourBeforeKey);
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
  }, [events, permission, firedReminders]);

  return { permission, requestPermission };
}

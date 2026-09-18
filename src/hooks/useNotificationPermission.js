import { useState, useCallback } from "react";

// Shared browser Notification permission state + request function.
// Both event reminders (Placements) and fruit reminders (Health) rely on
// this same browser permission — requesting it once (from either page)
// covers both features.
export function useNotificationPermission() {
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "unsupported"
  );

  const requestPermission = useCallback(async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setPermission(result);
  }, []);

  return { permission, requestPermission };
}

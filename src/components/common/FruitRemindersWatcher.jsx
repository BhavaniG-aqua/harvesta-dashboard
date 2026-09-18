import { useHealthContext } from "../../services/HealthContext";
import { useFruitReminderNotifications } from "../../hooks/useFruitReminderNotifications";

// Mounted once near the app root so fruit-reminder notification checks
// keep running no matter which page the user is currently viewing (as
// long as the tab is open). Renders nothing — purely a background
// watcher, mirroring EventRemindersWatcher for Placements.
function FruitRemindersWatcher() {
  const { reminders } = useHealthContext();
  useFruitReminderNotifications(reminders);
  return null;
}

export default FruitRemindersWatcher;

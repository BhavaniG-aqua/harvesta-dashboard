import { usePlacementsContext } from "../../services/PlacementsContext";
import { useEventReminders } from "../../hooks/useEventReminders";

// Mounted once near the app root so reminder checks keep running no
// matter which page the user is currently viewing (as long as the tab
// is open). Renders nothing — purely a background watcher.
function EventRemindersWatcher() {
  const { events } = usePlacementsContext();
  useEventReminders(events);
  return null;
}

export default EventRemindersWatcher;

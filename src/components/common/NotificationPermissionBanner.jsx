import Card from "./Card";
import Button from "./Button";

// Small banner prompting the user to enable browser notifications.
// Shared by Placements (event reminders) and Health (fruit reminders) —
// both features rely on the same browser Notification permission, so
// granting it from either page enables both. Browsers require an
// explicit user gesture to request permission, so this can't be
// triggered automatically.
function NotificationPermissionBanner({
  permission,
  onRequest,
  description = "Get a silent notification for reminders (only while this tab is open).",
}) {
  if (permission === "unsupported" || permission === "granted") return null;

  return (
    <Card className="mb-4 flex items-center justify-between gap-3 bg-amber-50">
      <div>
        <p className="text-sm font-medium text-slate-800">
          🔔 Enable notifications
        </p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <Button onClick={onRequest} className="shrink-0">
        Enable
      </Button>
    </Card>
  );
}

export default NotificationPermissionBanner;

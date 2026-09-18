import Card from "../common/Card";
import Button from "../common/Button";

// Small banner prompting the user to enable browser notifications for
// event reminders (1 day / 1 hour before a placement event). Browsers
// require an explicit user gesture to request permission, so this can't
// be triggered automatically.
function NotificationPermissionBanner({ permission, onRequest }) {
  if (permission === "unsupported" || permission === "granted") return null;

  return (
    <Card className="mb-4 flex items-center justify-between gap-3 bg-amber-50">
      <div>
        <p className="text-sm font-medium text-slate-800">
          🔔 Enable reminders
        </p>
        <p className="text-xs text-slate-500">
          Get a silent notification 1 day and 1 hour before each event
          (only while this tab is open).
        </p>
      </div>
      <Button onClick={onRequest} className="shrink-0">
        Enable
      </Button>
    </Card>
  );
}

export default NotificationPermissionBanner;

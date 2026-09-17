import Card from "../common/Card";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";

// Today's fruit-buying reminder. Shows a DONE button if a reminder for
// today is still pending; otherwise shows a caught-up state.
function FruitReminderCard({ pendingReminders, onMarkDone }) {
  if (!pendingReminders || pendingReminders.length === 0) {
    return (
      <EmptyState
        icon="🍎"
        title="No pending fruit reminders"
        description="You're all caught up for now."
      />
    );
  }

  return (
    <Card className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-slate-800">🍎 Buy fruits</p>
        <p className="text-xs text-slate-400">
          {pendingReminders.length} reminder(s) pending
        </p>
      </div>
      <Button onClick={() => onMarkDone(pendingReminders[0].id)}>DONE</Button>
    </Card>
  );
}

export default FruitReminderCard;

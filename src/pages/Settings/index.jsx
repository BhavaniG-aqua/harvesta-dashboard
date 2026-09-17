import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { settingsMock } from "../../data/mockData";

const ALL_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function SettingsPage() {
  const [friendName, setFriendName] = useState(settingsMock.friendName);
  const [reminderDays, setReminderDays] = useState(settingsMock.reminderDays);
  const [reminderTimes, setReminderTimes] = useState(
    settingsMock.reminderTimes.join(", ")
  );

  function toggleDay(day) {
    setReminderDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Settings" subtitle="Lightweight preferences" />

      <Card>
        <label className="block">
          <span className="text-xs font-medium text-slate-500">
            Friend&apos;s Name
          </span>
          <input
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </label>
      </Card>

      <Card>
        <p className="mb-2 text-xs font-medium text-slate-500">
          Fruit Reminder Days
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_DAYS.map((day) => {
            const isActive = reminderDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={[
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200",
                ].join(" ")}
              >
                {day.slice(0, 3)}
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <label className="block">
          <span className="text-xs font-medium text-slate-500">
            Reminder Times (comma-separated)
          </span>
          <input
            value={reminderTimes}
            onChange={(e) => setReminderTimes(e.target.value)}
            placeholder="09:00, 14:00, 20:00"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </label>
      </Card>

      <Button className="self-start">💾 Save Settings</Button>
    </div>
  );
}

export default SettingsPage;

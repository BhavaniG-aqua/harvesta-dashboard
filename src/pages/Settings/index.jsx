import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { useSettingsContext } from "../../services/SettingsContext";

function SettingsPage() {
  const { settings, updateSettings } = useSettingsContext();
  const [friendName, setFriendName] = useState(settings.friendName);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    updateSettings({ friendName });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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

      <div className="flex items-center gap-3">
        <Button className="self-start" onClick={handleSave}>
          💾 Save Settings
        </Button>
        {saved ? (
          <span className="text-xs font-medium text-emerald-600">Saved ✓</span>
        ) : null}
      </div>

      <Link
        to="/inspiration"
        className="text-sm font-medium text-brand-600 hover:underline"
      >
        ✨ Manage Inspiration Content →
      </Link>
    </div>
  );
}

export default SettingsPage;

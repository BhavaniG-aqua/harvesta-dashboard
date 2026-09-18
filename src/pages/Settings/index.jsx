import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import ThemeToggle from "../../components/common/ThemeToggle";
import { useSettingsContext } from "../../services/SettingsContext";
import { useThemeContext } from "../../services/ThemeContext";

function SettingsPage() {
  const { settings, updateSettings } = useSettingsContext();
  const { theme } = useThemeContext();
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

      <Card className="bg-white dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Theme</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Currently {theme === "dark" ? "dark" : "light"} mode
            </p>
          </div>
          <ThemeToggle />
        </div>
      </Card>

      <Card className="bg-white dark:bg-slate-800">
        <label className="block">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Friend&apos;s Name
          </span>
          <input
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </label>
      </Card>

      <div className="flex items-center gap-3">
        <Button className="self-start" onClick={handleSave}>
          💾 Save Settings
        </Button>
        {saved ? (
          <span className="text-xs font-medium text-success-600">Saved ✓</span>
        ) : null}
      </div>
    </div>
  );
}

export default SettingsPage;

import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import ThemeToggle from "../../components/common/ThemeToggle";
import ProfilePhotoPicker from "../../components/settings/ProfilePhotoPicker";
import ChangePasscodeForm from "../../components/settings/ChangePasscodeForm";
import { useSettingsContext } from "../../services/SettingsContext";

function formatDateDisplay(value) {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
}

const PROFILE_FIELDS = [
  { key: "friendName", label: "Name", icon: "🙂", required: true },
  { key: "birthday", label: "Birthday", icon: "🎂", required: true, isDate: true },
  { key: "bio", label: "Short bio", icon: "📝" },
  { key: "currentGoal", label: "Current goal", icon: "🎯" },
  { key: "permanentReminder", label: "Permanent reminder", icon: "💡" },
];

function SettingsPage() {
  const { settings, updateSettings } = useSettingsContext();

  const [editing, setEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(settings.profilePhoto || null);
  const [friendName, setFriendName] = useState(settings.friendName || "");
  const [birthday, setBirthday] = useState(settings.birthday || "");
  const [bio, setBio] = useState(settings.bio || "");
  const [currentGoal, setCurrentGoal] = useState(settings.currentGoal || "");
  const [permanentReminder, setPermanentReminder] = useState(
    settings.permanentReminder || ""
  );
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function startEdit() {
    setProfilePhoto(settings.profilePhoto || null);
    setFriendName(settings.friendName || "");
    setBirthday(settings.birthday || "");
    setBio(settings.bio || "");
    setCurrentGoal(settings.currentGoal || "");
    setPermanentReminder(settings.permanentReminder || "");
    setError("");
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setError("");
  }

  function handleSave() {
    if (!friendName.trim() || !birthday) {
      setError("Name and birthday are required — everything else is optional.");
      return;
    }
    setError("");
    updateSettings({
      friendName: friendName.trim(),
      profilePhoto,
      birthday,
      bio,
      currentGoal,
      permanentReminder,
    });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Settings" subtitle="Lightweight preferences" action={<ThemeToggle />} />

      {/* Profile ---------------------------------------------------- */}
      <Card className="bg-white dark:bg-slate-800" padded={false}>
        {!editing ? (
          <>
            <div className="flex items-center gap-4 border-b border-slate-100 p-5 dark:border-slate-700/60">
              <ProfilePhotoPicker value={settings.profilePhoto} editable={false} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                  {settings.friendName || "Add your name"}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {formatDateDisplay(settings.birthday) || "Add your birthday"}
                </p>
              </div>
              <button
                type="button"
                onClick={startEdit}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-2 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100 dark:bg-brand-800/30 dark:text-brand-300 dark:hover:bg-brand-800/50"
              >
                ✏️ Edit
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {PROFILE_FIELDS.slice(2).map((field) => (
                <div key={field.key} className="flex gap-3 px-5 py-3.5">
                  <span className="mt-0.5 text-base">{field.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      {field.label}
                    </p>
                    <p
                      className={[
                        "mt-0.5 text-sm",
                        settings[field.key]
                          ? "text-slate-700 dark:text-slate-200"
                          : "italic text-slate-300 dark:text-slate-600",
                      ].join(" ")}
                    >
                      {settings[field.key] || "Not set"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {saved ? (
              <p className="border-t border-slate-100 px-5 py-3 text-xs font-medium text-success-600 dark:border-slate-700/60">
                Saved ✓
              </p>
            ) : null}
          </>
        ) : (
          <div className="flex flex-col gap-4 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Edit profile
            </p>

            <ProfilePhotoPicker value={profilePhoto} onChange={setProfilePhoto} editable />

            <label className="block">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Name <span className="text-red-500">*</span>
              </span>
              <input
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Birthday <span className="text-red-500">*</span>
              </span>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Short bio (optional)
              </span>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="A few words about yourself…"
                className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Current goal (optional)
              </span>
              <textarea
                value={currentGoal}
                onChange={(e) => setCurrentGoal(e.target.value)}
                rows={2}
                placeholder="What are you working toward right now?"
                className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Permanent reminder (optional)
              </span>
              <p className="mb-1 text-[11px] text-slate-400 dark:text-slate-500">
                A quote or saying you want to see often — also shown on the Dashboard.
              </p>
              <textarea
                value={permanentReminder}
                onChange={(e) => setPermanentReminder(e.target.value)}
                rows={2}
                placeholder="e.g. Keep going, one step at a time."
                className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            {error ? <p className="text-xs font-medium text-red-500">{error}</p> : null}

            <div className="flex items-center gap-3">
              <Button onClick={handleSave} className="self-start">
                ✨ Save
              </Button>
              <Button variant="ghost" onClick={cancelEdit} className="self-start">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Letters passcode ------------------------------------------- */}
      <Card className="flex flex-col gap-3 bg-white dark:bg-slate-800">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Letters Passcode
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Protects your Letters tab with its own 6-digit passcode.
          </p>
        </div>
        <ChangePasscodeForm />
      </Card>

      {/* Help ---------------------------------------------------------- */}
      <Card className="flex items-center justify-between bg-white dark:bg-slate-800">
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Need help?</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            See how to use every part of this website.
          </p>
        </div>
        <Link to="/help">
          <Button variant="secondary">📖 User Guide</Button>
        </Link>
      </Card>
    </div>
  );
}

export default SettingsPage;

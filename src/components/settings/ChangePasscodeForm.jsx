import { useState } from "react";
import Button from "../common/Button";
import { useLettersContext } from "../../services/LettersContext";

// Lets the user change their Letters passcode from Settings. Collapsed
// behind a single "Change Letters Passcode" button by default — only
// once clicked does it reveal the old/new/confirm fields, instead of
// always showing three open passcode inputs on the Settings page.
function ChangePasscodeForm() {
  const { hasPasscode, changePasscode } = useLettersContext();
  const [open, setOpen] = useState(false);
  const [oldPasscode, setOldPasscode] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [message, setMessage] = useState(null); // { type: "error"|"success", text }
  const [busy, setBusy] = useState(false);

  if (!hasPasscode) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        You haven't set up a Letters passcode yet — open the{" "}
        <span className="font-medium text-brand-600 dark:text-brand-400">Letters</span> tab to
        create one.
      </p>
    );
  }

  function resetFields() {
    setOldPasscode("");
    setNewPasscode("");
    setConfirmPasscode("");
    setMessage(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    if (oldPasscode.length !== 6 || newPasscode.length !== 6) {
      setMessage({ type: "error", text: "Enter all 6 digits for both passcodes." });
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setMessage({ type: "error", text: "New passcodes don't match." });
      return;
    }

    setBusy(true);
    const ok = await changePasscode(oldPasscode, newPasscode);
    setBusy(false);

    if (!ok) {
      setMessage({ type: "error", text: "Old passcode is incorrect." });
      return;
    }

    setMessage({ type: "success", text: "Passcode updated ✓" });
    setOldPasscode("");
    setNewPasscode("");
    setConfirmPasscode("");
    setTimeout(() => setOpen(false), 1500);
  }

  if (!open) {
    return (
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          resetFields();
          setOpen(true);
        }}
        className="self-start"
      >
        🔑 Change Letters Passcode
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="block">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Current passcode
        </span>
        <input
          autoFocus
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={oldPasscode}
          onChange={(e) => setOldPasscode(e.target.value.replace(/[^0-9]/g, ""))}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm tracking-widest text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          New passcode
        </span>
        <input
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={newPasscode}
          onChange={(e) => setNewPasscode(e.target.value.replace(/[^0-9]/g, ""))}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm tracking-widest text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Confirm new passcode
        </span>
        <input
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={confirmPasscode}
          onChange={(e) => setConfirmPasscode(e.target.value.replace(/[^0-9]/g, ""))}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm tracking-widest text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </label>

      {message ? (
        <p
          className={[
            "text-xs font-medium",
            message.type === "error" ? "text-accent-500" : "text-success-600",
          ].join(" ")}
        >
          {message.text}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" variant="secondary" disabled={busy} className="self-start">
          {busy ? "Updating…" : "🔑 Update Passcode"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            resetFields();
            setOpen(false);
          }}
          className="self-start"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default ChangePasscodeForm;

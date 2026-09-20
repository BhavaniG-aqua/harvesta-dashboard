import { useId, useState } from "react";
import Button from "../common/Button";

// 6 separate single-digit boxes, auto-advancing, used both to unlock the
// Letters tab and (in Settings) to confirm the old/new passcode. Purely
// presentational + local input state — verification happens in the
// parent via `onSubmit`.
//
// Each instance gets its own unique id prefix (via useId) so that when
// TWO of these are rendered on the same screen (e.g. "New passcode" +
// "Confirm passcode"), `document.getElementById` inside one instance
// can never accidentally grab an input that belongs to the other one —
// previously both used the same hardcoded `pc-0`..`pc-5` ids, which is
// why focus would jump into the wrong field's boxes.
function PasscodeInput({ value, onChange, autoFocus = false }) {
  const uid = useId();
  const digits = value.padEnd(6, " ").slice(0, 6).split("");

  function handleDigitChange(index, raw) {
    const char = raw.replace(/[^0-9]/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = char || " ";
    onChange(nextDigits.join("").trimEnd());

    if (char && index < 5) {
      const nextInput = document.getElementById(`${uid}-${index + 1}`);
      nextInput?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !digits[index].trim() && index > 0) {
      const prevInput = document.getElementById(`${uid}-${index - 1}`);
      prevInput?.focus();
    }
  }

  return (
    <div className="flex justify-center gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          id={`${uid}-${i}`}
          autoFocus={autoFocus && i === 0}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          value={d.trim()}
          onChange={(e) => handleDigitChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="h-12 w-10 rounded-xl border border-slate-200 bg-white text-center text-lg font-semibold text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      ))}
    </div>
  );
}

// Full-screen passcode gate shown before the Letters tab content. Handles
// BOTH first-time setup (no passcode saved yet) and unlocking (passcode
// already exists).
function PasscodeGate({ hasPasscode, onSetPasscode, onUnlock }) {
  const [passcode, setPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSetup(e) {
    e.preventDefault();
    setError("");
    if (passcode.length !== 6) {
      setError("Enter all 6 digits.");
      return;
    }
    if (passcode !== confirmPasscode) {
      setError("Passcodes don't match.");
      return;
    }
    setBusy(true);
    await onSetPasscode(passcode);
    setBusy(false);
  }

  async function handleUnlock(e) {
    e.preventDefault();
    setError("");
    if (passcode.length !== 6) {
      setError("Enter all 6 digits.");
      return;
    }
    setBusy(true);
    const ok = await onUnlock(passcode);
    setBusy(false);
    if (!ok) {
      setError("Incorrect passcode. Try again.");
      setPasscode("");
    }
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-3xl shadow-sm shadow-brand-600/30">
        🔒
      </div>

      {hasPasscode ? (
        <form onSubmit={handleUnlock} className="flex w-full max-w-sm flex-col items-center gap-4">
          <div>
            <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              This space is just for you
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Enter your 6-digit passcode to open your letters.
            </p>
          </div>
          <PasscodeInput value={passcode} onChange={setPasscode} autoFocus />
          {error ? <p className="text-xs font-medium text-accent-500">{error}</p> : null}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Checking…" : "🔓 Unlock"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSetup} className="flex w-full max-w-sm flex-col items-center gap-4">
          <div>
            <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Let's set up your private space
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Choose a 6-digit passcode. Only you'll know it.
            </p>
          </div>
          <div className="w-full">
            <p className="mb-2 text-xs font-medium text-slate-400 dark:text-slate-500">
              New passcode
            </p>
            <PasscodeInput value={passcode} onChange={setPasscode} autoFocus />
          </div>
          <div className="w-full">
            <p className="mb-2 text-xs font-medium text-slate-400 dark:text-slate-500">
              Confirm passcode
            </p>
            <PasscodeInput value={confirmPasscode} onChange={setConfirmPasscode} />
          </div>
          {error ? <p className="text-xs font-medium text-accent-500">{error}</p> : null}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Saving…" : "✨ Create my space"}
          </Button>
        </form>
      )}
    </div>
  );
}

export default PasscodeGate;

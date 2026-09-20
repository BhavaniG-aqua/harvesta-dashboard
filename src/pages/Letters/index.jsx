import { useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import ConfirmButton from "../../components/common/ConfirmButton";
import EmptyState from "../../components/common/EmptyState";
import PasscodeGate from "../../components/letters/PasscodeGate";
import LetterPaper from "../../components/letters/LetterPaper";
import { useLettersContext } from "../../services/LettersContext";
import { todayKey } from "../../hooks/useLettersData";
import { formatShortDate } from "../../utils/date";

// A private, day-wise personal journal — gated behind its own 6-digit
// passcode, kept fully separate from the rest of the app (which has no
// authentication elsewhere). Meant to feel calm and safe: warm paper
// tones, a serif "handwritten" font, and one letter per day.
function LettersPage() {
  const {
    letters,
    hasPasscode,
    unlocked,
    setPasscode,
    tryUnlock,
    getLetterForDate,
    saveLetterForDate,
    deleteLetter,
  } = useLettersContext();

  const [selectedDate, setSelectedDate] = useState(null); // null = list view
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);

  const today = todayKey();
  const todaysLetter = getLetterForDate(today);

  const sortedLetters = useMemo(() => letters, [letters]);

  if (!unlocked) {
    return (
      <PasscodeGate
        hasPasscode={hasPasscode}
        onSetPasscode={setPasscode}
        onUnlock={tryUnlock}
      />
    );
  }

  function openDate(dateKey) {
    const existing = getLetterForDate(dateKey);
    setDraft(existing?.content || "");
    setSelectedDate(dateKey);
    setSaved(false);
  }

  function handleSave() {
    saveLetterForDate(selectedDate, draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  function handleDelete(id) {
    deleteLetter(id);
    setSelectedDate(null);
  }

  // --- Writing/viewing a single day's letter -----------------------------
  if (selectedDate) {
    const isToday = selectedDate === today;
    const existing = getLetterForDate(selectedDate);

    return (
      <div>
        <button
          type="button"
          onClick={() => setSelectedDate(null)}
          className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <span aria-hidden="true">←</span> All letters
        </button>

        <LetterPaper
          dateKey={selectedDate}
          content={draft}
          editable
          onChange={setDraft}
          placeholder={
            isToday ? "Write today's letter…" : "Write what you remember about this day…"
          }
        />

        <div className="mt-4 flex items-center gap-3">
          <Button onClick={handleSave}>🪶 Save Letter</Button>
          {existing ? (
            <ConfirmButton
              label="🗑️ Delete"
              confirmLabel="Delete this letter?"
              onConfirm={() => handleDelete(existing.id)}
            />
          ) : null}
          {saved ? (
            <span className="text-xs font-medium text-success-600">Saved ✓</span>
          ) : null}
        </div>
      </div>
    );
  }

  // --- List of day-wise letters -------------------------------------------
  return (
    <div>
      <PageHeader title="Letters" />

      <p className="mb-5 border-l-2 border-amber-300/70 pl-3 font-serif text-sm italic leading-relaxed text-slate-500 dark:border-amber-800/50 dark:text-slate-400">
        Drop the mask. No pretending. No judging. Be completely yourself in here.
      </p>

      <div className="mb-5">
        <button
          type="button"
          onClick={() => openDate(today)}
          className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-amber-300 bg-amber-50/60 px-4 py-4 text-left transition-colors hover:bg-amber-50 dark:border-amber-800/50 dark:bg-slate-800/60 dark:hover:bg-slate-800"
        >
          <span className="text-2xl">✍️</span>
          <span>
            <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
              {todaysLetter ? "Continue today's letter" : "Write today's letter"}
            </span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">
              {formatShortDate(today)}
            </span>
          </span>
        </button>
      </div>

      {sortedLetters.length === 0 ? (
        <EmptyState
          icon="🪶"
          title="No letters yet"
          description="Write your first letter above — one per day, saved just for you."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {sortedLetters.map((letter) => (
            <button
              key={letter.id}
              type="button"
              onClick={() => openDate(letter.date)}
              className="flex items-center justify-between rounded-2xl border border-amber-200/60 bg-[#fdf8ee] px-4 py-3 text-left shadow-sm shadow-amber-900/5 transition-shadow hover:shadow-md dark:border-amber-900/30 dark:bg-slate-800"
            >
              <div className="overflow-hidden">
                <p className="truncate font-serif text-sm text-slate-700 dark:text-slate-200">
                  {letter.content?.slice(0, 60) || "Empty letter"}
                  {letter.content && letter.content.length > 60 ? "…" : ""}
                </p>
                <p className="mt-0.5 text-xs text-amber-700/70 dark:text-amber-300/60">
                  {formatShortDate(letter.date)}
                </p>
              </div>
              <span className="shrink-0 text-lg">🪶</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LettersPage;

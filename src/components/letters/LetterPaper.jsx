import { formatFullDate } from "../../utils/date";

// Renders a single letter as an actual paper letter: a soft cream card
// with a serif "handwritten note" feel, a torn/deckled top edge, and
// the date shown like a letter dateline ("Tuesday, 17 September").
function LetterPaper({ dateKey, content, editable = false, onChange, placeholder }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-200/70 bg-[#fdf8ee] shadow-md shadow-amber-900/5 dark:border-amber-900/30 dark:bg-slate-800">
      {/* Decorative torn-edge strip at the top of the paper. */}
      <div
        className="h-2 w-full bg-gradient-to-r from-amber-200/80 via-amber-100/60 to-amber-200/80 dark:from-amber-800/40 dark:via-amber-900/20 dark:to-amber-800/40"
        style={{
          maskImage:
            "repeating-linear-gradient(100deg, transparent 0 2px, black 2px 6px)",
          WebkitMaskImage:
            "repeating-linear-gradient(100deg, transparent 0 2px, black 2px 6px)",
        }}
      />
      <div className="p-5 sm:p-7">
        <p className="mb-4 text-right font-serif text-sm italic text-amber-700/80 dark:text-amber-300/70">
          {formatFullDate(new Date(`${dateKey}T00:00:00`))}
        </p>

        {editable ? (
          <textarea
            autoFocus
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Dear diary…"}
            rows={12}
            className="w-full resize-none bg-transparent font-serif text-[15px] leading-8 text-slate-700 outline-none placeholder:text-amber-700/40 dark:text-slate-200 dark:placeholder:text-amber-300/30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent, transparent 31px, rgba(180,140,60,0.15) 32px)",
            }}
          />
        ) : (
          <p
            className="whitespace-pre-wrap font-serif text-[15px] leading-8 text-slate-700 dark:text-slate-200"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent, transparent 31px, rgba(180,140,60,0.15) 32px)",
            }}
          >
            {content || <span className="italic text-slate-400 dark:text-slate-500">This letter is empty.</span>}
          </p>
        )}
      </div>
    </div>
  );
}

export default LetterPaper;

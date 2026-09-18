// Simple rounded card container used across the dashboard and other pages.
//
// Deliberately has NO default background color baked in. Tailwind v4
// sorts generated utility classes alphabetically in the compiled
// stylesheet, so "bg-white" (starts with "w") would always beat an
// earlier-alphabet override like "bg-brand-700" or "bg-amber-50" applied
// via `className` — regardless of the order classes appear in the JSX
// string. The only reliable fix is to never bake in a competing
// background utility here; every caller sets its own via `className`
// (typically "bg-white dark:bg-slate-800" for plain cards).
function Card({ children, className = "", padded = true, interactive = false }) {
  return (
    <div
      className={[
        "rounded-2xl border border-slate-200/70 shadow-sm shadow-slate-200/50 dark:border-slate-700/70 dark:shadow-black/20",
        padded ? "p-4" : "",
        interactive ? "card-interactive" : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default Card;

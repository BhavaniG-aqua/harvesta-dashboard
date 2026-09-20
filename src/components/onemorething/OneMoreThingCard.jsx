import Card from "../common/Card";

// A single "One More Thing" content card — a quote or an image, shown
// read-only. No delete/edit controls: content is curated ahead of time
// outside the app (quotes in the Supabase Table Editor, photos dropped
// straight into the "one-more-thing" Storage bucket). Only one item
// (quote OR image) is ever rendered per call — the alternation between
// the two lives in the data/hook layer, not here.
//
// `label` is an optional small pill shown above the card (e.g. "Today"
// or "Always") so the Dashboard/page can distinguish the rotating pick
// from the one fixed image without repeating that logic everywhere.
// `compact` shrinks the image's max height for tight spots like the
// Dashboard summary (full page keeps the taller, more generous size).
//
// Images are deliberately shown at their OWN aspect ratio — never
// cropped or force-stretched to a fixed box. `object-contain` + natural
// width/height (only capped so huge photos don't blow past the
// viewport) means a tall portrait photo stays tall and a wide landscape
// photo stays wide, exactly as uploaded.
function OneMoreThingCard({ item, className = "", label, compact = false }) {
  if (!item) return null;

  if (item.type === "image") {
    if (!item.imageUrl) return null;
    return (
      <div className={`relative ${className}`}>
        {label ? (
          <span className="absolute -top-3 left-5 z-10 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm shadow-brand-600/30">
            {label}
          </span>
        ) : null}
        <div className="rounded-[28px] bg-gradient-to-br from-brand-100 via-white to-accent-100 p-2.5 pt-4 shadow-md shadow-brand-700/10 ring-1 ring-white/60 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700 dark:ring-slate-600/40">
          <Card className="overflow-hidden bg-white dark:bg-slate-800" padded={false}>
            <div className="relative flex items-center justify-center bg-slate-100/70 dark:bg-slate-900/40">
              <img
                src={item.imageUrl}
                alt={item.caption || "A little something"}
                loading="lazy"
                className={`mx-auto block h-auto w-auto max-w-full object-contain ${
                  compact ? "max-h-64" : "max-h-[70vh]"
                }`}
              />
              <span className="absolute left-2 top-2 rounded-full bg-white/85 px-2 py-0.5 text-xs shadow-sm backdrop-blur-sm dark:bg-slate-900/70">
                🌿
              </span>
            </div>
            {item.caption ? (
              <p className="px-4 py-3 text-center text-sm italic text-slate-600 dark:text-slate-300">
                {item.caption}
              </p>
            ) : null}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {label ? (
        <span className="absolute -top-3 left-5 z-10 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm shadow-brand-600/30">
          {label}
        </span>
      ) : null}
      <Card className="relative overflow-hidden bg-gradient-to-br from-brand-50 to-accent-100/40 pt-6 dark:from-slate-800 dark:to-slate-800">
        <span className="pointer-events-none absolute -left-1 -top-3 text-4xl text-brand-200/70 dark:text-brand-700/40">
          “
        </span>
        <p className="relative pl-3 text-sm italic leading-relaxed text-slate-700 dark:text-slate-200">
          {item.quote}
        </p>
        {item.author ? (
          <p className="mt-2 pl-3 text-xs font-medium text-slate-400 dark:text-slate-500">
            — {item.author}
          </p>
        ) : null}
      </Card>
    </div>
  );
}

export default OneMoreThingCard;

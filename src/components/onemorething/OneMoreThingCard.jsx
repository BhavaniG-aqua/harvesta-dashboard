import Card from "../common/Card";

// A single "One More Thing" content card — a quote or an image, shown
// read-only. No delete/edit controls: content is curated ahead of time
// outside the app, never through an in-app upload form.
function OneMoreThingCard({ item }) {
  if (!item) return null;

  if (item.type === "image") {
    return (
      <Card className="overflow-hidden bg-white dark:bg-slate-800" padded={false}>
        <img
          src={item.imageUrl}
          alt={item.caption || ""}
          className="max-h-72 w-full object-cover"
        />
        {item.caption ? (
          <p className="p-3 text-sm text-slate-600 dark:text-slate-300">{item.caption}</p>
        ) : null}
      </Card>
    );
  }

  if (item.type === "funny") {
    return (
      <Card className="bg-amber-50 dark:bg-slate-800">
        <p className="text-sm text-slate-700 dark:text-slate-200">{item.text}</p>
      </Card>
    );
  }

  return (
    <Card className="bg-brand-50 dark:bg-slate-800">
      <p className="text-sm italic text-slate-700 dark:text-slate-200">“{item.quote}”</p>
      {item.author ? (
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">— {item.author}</p>
      ) : null}
    </Card>
  );
}

export default OneMoreThingCard;

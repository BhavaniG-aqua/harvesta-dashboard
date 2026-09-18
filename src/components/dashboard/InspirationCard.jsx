import Card from "../common/Card";

// Small inspiration snippet card for the Dashboard — cycles once per day
// through motivation quotes, funny content, and uploaded images.
function InspirationCard({ item }) {
  if (!item) return null;

  if (item.type === "image") {
    return (
      <Card className="overflow-hidden" padded={false}>
        <img
          src={item.imageUrl}
          alt={item.caption || "Inspiration"}
          className="max-h-64 w-full object-cover"
        />
        {item.caption ? (
          <p className="p-3 text-sm text-slate-600">{item.caption}</p>
        ) : null}
      </Card>
    );
  }

  if (item.type === "funny") {
    return (
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
          Just for fun 😄
        </p>
        <p className="mt-2 text-sm text-slate-700">{item.text}</p>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-brand-50 to-accent-100/40">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
        Quote of the day ✨
      </p>
      <p className="mt-2 text-sm italic text-slate-700">“{item.quote}”</p>
      {item.author ? (
        <p className="mt-1 text-xs text-slate-400">— {item.author}</p>
      ) : null}
    </Card>
  );
}

export default InspirationCard;

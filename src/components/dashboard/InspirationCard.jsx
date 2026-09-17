import Card from "../common/Card";

// Small inspiration snippet card for the Dashboard (quote or funny content).
function InspirationCard({ item }) {
  if (!item) return null;

  if (item.type === "funny") {
    return (
      <Card className="bg-amber-50">
        <p className="text-xs font-medium uppercase tracking-wide text-amber-600">
          Just for fun 😄
        </p>
        <p className="mt-2 text-sm text-slate-700">{item.text}</p>
      </Card>
    );
  }

  return (
    <Card className="bg-brand-50">
      <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
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

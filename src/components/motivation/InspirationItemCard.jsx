import Card from "../common/Card";
import ConfirmButton from "../common/ConfirmButton";

// A single inspiration content card (motivation quote or funny text),
// used in the Inspiration management page.
function InspirationItemCard({ item, onDelete }) {
  const isFunny = item.type === "funny";

  return (
    <Card className={isFunny ? "bg-amber-50" : "bg-brand-50"}>
      <div className="flex items-start justify-between gap-3">
        <div>
          {isFunny ? (
            <p className="text-sm text-slate-700">{item.text}</p>
          ) : (
            <>
              <p className="text-sm italic text-slate-700">“{item.quote}”</p>
              {item.author ? (
                <p className="mt-1 text-xs text-slate-400">— {item.author}</p>
              ) : null}
            </>
          )}
        </div>
        <ConfirmButton
          label="🗑️"
          confirmLabel="Delete?"
          onConfirm={() => onDelete(item.id)}
        />
      </div>
    </Card>
  );
}

export default InspirationItemCard;

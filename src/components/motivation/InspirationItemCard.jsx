import Card from "../common/Card";
import ConfirmButton from "../common/ConfirmButton";

// A single inspiration content card (motivation quote, funny text, or
// uploaded image), used in the Inspiration management page.
function InspirationItemCard({ item, onDelete }) {
  if (item.type === "image") {
    return (
      <Card className="overflow-hidden bg-white dark:bg-slate-800" padded={false}>
        <div className="relative">
          <img
            src={item.imageUrl}
            alt={item.caption || "Inspiration"}
            className="max-h-72 w-full object-cover"
          />
          <ConfirmButton
            label="🗑️"
            confirmLabel="Delete?"
            onConfirm={() => onDelete(item.id)}
            className="absolute right-2 top-2"
          />
        </div>
        {item.caption ? (
          <p className="p-3 text-sm text-slate-600 dark:text-slate-300">{item.caption}</p>
        ) : null}
      </Card>
    );
  }

  const isFunny = item.type === "funny";

  return (
    <Card
      className={
        isFunny
          ? "bg-amber-50 dark:bg-slate-800"
          : "bg-brand-50 dark:bg-slate-800"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {isFunny ? (
            <p className="text-sm text-slate-700 dark:text-slate-200">{item.text}</p>
          ) : (
            <>
              <p className="text-sm italic text-slate-700 dark:text-slate-200">“{item.quote}”</p>
              {item.author ? (
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">— {item.author}</p>
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

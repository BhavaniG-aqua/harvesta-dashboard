import { Link } from "react-router-dom";
import Card from "../common/Card";

// Compact note summary card for the Notes list.
function NoteCard({ note }) {
  const preview = note.content?.slice(0, 80) || "No content yet";

  return (
    <Link to={`/notes/${note.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <p className="text-sm font-semibold text-slate-900">
          {note.title || "Untitled note"}
        </p>
        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{preview}</p>
        <p className="mt-2 text-xs text-slate-400">Updated {note.updatedAt}</p>
      </Card>
    </Link>
  );
}

export default NoteCard;

import { Link } from "react-router-dom";
import Card from "../common/Card";
import { stripHtml } from "../../utils/html";

// Compact note summary card for the Notes list.
function NoteCard({ note }) {
  const preview = stripHtml(note.content).slice(0, 80) || "No content yet";
  const attachmentCount = note.attachments?.length || 0;

  return (
    <Link to={`/notes/${note.id}`}>
      <Card interactive className="bg-white">
        <p className="text-sm font-semibold text-slate-900">
          {note.title || "Untitled note"}
        </p>
        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{preview}</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
          <span>Updated {note.updatedAt}</span>
          {attachmentCount > 0 ? (
            <span>📎 {attachmentCount}</span>
          ) : null}
        </div>
      </Card>
    </Link>
  );
}

export default NoteCard;

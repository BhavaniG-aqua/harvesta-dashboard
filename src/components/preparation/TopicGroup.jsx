import { useRef, useState } from "react";
import TopicItem from "./TopicItem";
import ConfirmButton from "../common/ConfirmButton";

const DOUBLE_TAP_MS = 350;

// Renders one category (or company) as a collapsible header followed by
// its indented topics, giving the whole page a clear Category -> Topics
// (or Company -> Topics) hierarchy instead of one flat scattered list.
//
// Interaction model (kept deliberately distinct so nothing overlaps):
//   - Single tap anywhere on the row (title, background, or the arrow)
//     -> expand/collapse the topics underneath.
//   - Double-tap specifically on the title text -> rename it.
//   - The arrow is purely a toggle affordance; it never opens rename.
//   - Delete icon -> asks for confirmation, separate from the row tap.
//
// Double-tap is detected manually (via a timestamp ref) rather than the
// native `ondblclick` event, because the native event still fires two
// separate `click` events first — which would toggle the row open/closed
// twice before the rename kicked in. Tracking taps ourselves lets a
// single tap on the title behave exactly like tapping anywhere else on
// the row (toggle), while a fast second tap on the title cancels that
// toggle and opens rename instead.
function TopicGroup({
  title,
  topics,
  onStatusChange,
  onDelete,
  onRename,
  onRenameGroup,
  onDeleteGroup,
  deletable = true,
  emptyLabel = "No topics here yet.",
  defaultOpen = true,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(title);
  const lastTitleTapRef = useRef(0);
  const singleTapTimerRef = useRef(null);

  function commitRename() {
    const trimmed = name.trim();
    if (trimmed && trimmed !== title) {
      onRenameGroup?.(trimmed);
    } else {
      setName(title);
    }
    setEditing(false);
  }

  function handleToggle() {
    setOpen((v) => !v);
  }

  function handleTitleClick(e) {
    e.stopPropagation();
    if (!onRenameGroup) {
      handleToggle();
      return;
    }

    const now = Date.now();
    const isDoubleTap = now - lastTitleTapRef.current < DOUBLE_TAP_MS;
    lastTitleTapRef.current = now;

    if (isDoubleTap) {
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
        singleTapTimerRef.current = null;
      }
      setEditing(true);
      return;
    }

    // Wait briefly to see if a second tap arrives; if not, treat as a
    // normal single tap and toggle open/closed.
    singleTapTimerRef.current = setTimeout(() => {
      handleToggle();
      singleTapTimerRef.current = null;
    }, DOUBLE_TAP_MS);
  }

  return (
    <div className="mb-4">
      <div
        role="button"
        tabIndex={0}
        onClick={editing ? undefined : handleToggle}
        onKeyDown={(e) => {
          if (!editing && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleToggle();
          }
        }}
        className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/60"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            aria-label={open ? "Collapse" : "Expand"}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-brand-500 transition-transform hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <span
              className="inline-block transition-transform"
              style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
            >
              ▸
            </span>
          </button>

          {editing ? (
            <input
              autoFocus
              value={name}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setName(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") {
                  setName(title);
                  setEditing(false);
                }
              }}
              className="min-w-0 flex-1 rounded-lg border border-brand-300 bg-white px-2 py-1 text-sm font-semibold text-slate-900 outline-none dark:bg-slate-900 dark:text-slate-100"
            />
          ) : (
            <p
              onClick={handleTitleClick}
              className="min-w-0 flex-1 truncate text-sm font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300"
              title={onRenameGroup ? "Double-tap to rename" : title}
            >
              {title}
            </p>
          )}

          <span className="shrink-0 rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-300">
            {topics.length}
          </span>
        </div>

        {deletable && onDeleteGroup ? (
          <div onClick={(e) => e.stopPropagation()}>
            <ConfirmButton
              label="🗑️"
              confirmLabel="Delete this?"
              onConfirm={onDeleteGroup}
              className="shrink-0"
            />
          </div>
        ) : null}
      </div>

      {open ? (
        <div className="mt-2 ml-6 border-l border-slate-200 pl-4 dark:border-slate-700">
          {topics.length === 0 ? (
            <p className="py-1 text-xs text-slate-400 dark:text-slate-500">{emptyLabel}</p>
          ) : (
            <div className="flex flex-col gap-2">
              {topics.map((topic) => (
                <TopicItem
                  key={topic.id}
                  topic={topic}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                  onRename={onRename}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default TopicGroup;

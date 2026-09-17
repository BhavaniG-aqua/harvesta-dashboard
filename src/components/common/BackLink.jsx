import { Link } from "react-router-dom";

// Simple back link used at the top of detail pages.
function BackLink({ to, label = "Back" }) {
  return (
    <Link
      to={to}
      className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
    >
      <span aria-hidden="true">←</span>
      {label}
    </Link>
  );
}

export default BackLink;

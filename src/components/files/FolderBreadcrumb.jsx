import { Link } from "react-router-dom";

// Breadcrumb navigation for the nested folder file manager.
function FolderBreadcrumb({ trail }) {
  return (
    <div className="no-scrollbar mb-3 flex items-center gap-1 overflow-x-auto text-sm text-slate-500">
      <Link to="/preparation/files" className="shrink-0 hover:text-brand-600">
        📁 Interview Prep
      </Link>
      {trail.map((item) => (
        <span key={item.id} className="flex shrink-0 items-center gap-1">
          <span className="text-slate-300">/</span>
          <Link
            to={`/preparation/files/${item.id}`}
            className="hover:text-brand-600"
          >
            {item.name}
          </Link>
        </span>
      ))}
    </div>
  );
}

export default FolderBreadcrumb;

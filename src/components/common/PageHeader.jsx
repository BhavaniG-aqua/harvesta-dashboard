// Standard page header: title + optional subtitle/action, used on every page
// for a consistent mobile-first heading treatment.
function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export default PageHeader;

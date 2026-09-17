// Small section label used to separate blocks within a page
// (e.g. "Upcoming Events", "Today's Focus").
function SectionTitle({ children, className = "" }) {
  return (
    <h2
      className={[
        "mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400",
        className,
      ].join(" ")}
    >
      {children}
    </h2>
  );
}

export default SectionTitle;

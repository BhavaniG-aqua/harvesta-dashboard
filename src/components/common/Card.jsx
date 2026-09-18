// Simple rounded card container used across the dashboard and other pages.
function Card({ children, className = "", padded = true, interactive = false }) {
  return (
    <div
      className={[
        "rounded-2xl border border-slate-200/70 bg-white shadow-sm shadow-slate-200/50",
        padded ? "p-4" : "",
        interactive ? "card-interactive" : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default Card;

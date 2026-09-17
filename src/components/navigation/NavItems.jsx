import { NavLink } from "react-router-dom";

// Nav items shared between mobile bottom-bar and desktop sidebar.
export const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "🏠" },
  { to: "/placements", label: "Placements", icon: "💼" },
  { to: "/preparation", label: "Preparation", icon: "🎯" },
  { to: "/health", label: "Health", icon: "❤️" },
  { to: "/notes", label: "Notes", icon: "📝" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
];

function NavItems({ orientation = "horizontal" }) {
  const isVertical = orientation === "vertical";

  return (
    <>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            [
              "flex items-center gap-3 rounded-xl transition-colors",
              isVertical
                ? "px-4 py-2.5 text-sm font-medium"
                : "flex-1 flex-col justify-center gap-0.5 py-2 text-[11px] font-medium",
              isActive
                ? "bg-brand-100 text-brand-700"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
            ].join(" ")
          }
        >
          <span className={isVertical ? "text-lg" : "text-xl leading-none"}>
            {item.icon}
          </span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </>
  );
}

export default NavItems;

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
              "flex items-center gap-3 rounded-xl transition-all",
              isVertical
                ? "px-4 py-2.5 text-sm font-medium"
                : "flex-1 flex-col justify-center gap-0.5 py-2 text-[11px] font-medium",
              isActive
                ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-sm shadow-brand-600/30"
                : "text-slate-500 hover:bg-brand-50 hover:text-brand-600",
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

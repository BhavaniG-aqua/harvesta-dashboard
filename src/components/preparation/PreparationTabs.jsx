import { NavLink } from "react-router-dom";

// Sub-tabs within the Preparation section (Topics vs Interview Files).
function PreparationTabs() {
  const tabs = [
    { to: "/preparation", label: "Topics", end: true },
    { to: "/preparation/files", label: "Interview Files", end: false },
  ];

  return (
    <div className="mb-4 flex gap-2 border-b border-slate-200">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            [
              "px-1 pb-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
              isActive
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-slate-400 hover:text-slate-600",
            ].join(" ")
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}

export default PreparationTabs;

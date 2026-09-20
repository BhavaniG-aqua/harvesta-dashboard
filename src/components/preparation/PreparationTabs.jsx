import { NavLink } from "react-router-dom";

// Sub-tabs within the Preparation section: Categories / Companies /
// Interview Files — three ways to browse the same underlying topics.
function PreparationTabs() {
  const tabs = [
    { to: "/preparation", label: "📂 Categories", end: true },
    { to: "/preparation/companies", label: "🏢 Companies", end: false },
    { to: "/preparation/files", label: "🗂️ Interview Files", end: false },
  ];

  return (
    <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-700">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            [
              "shrink-0 px-1 pb-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
              isActive
                ? "border-brand-600 text-brand-700 dark:border-brand-400 dark:text-brand-400"
                : "border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300",
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

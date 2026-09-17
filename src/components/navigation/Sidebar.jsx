import NavItems from "./NavItems";

// Persistent sidebar shown on desktop / tablet-landscape screens.
function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
      <div className="px-6 py-5">
        <p className="text-lg font-semibold text-slate-800">Friend Dashboard</p>
        <p className="text-xs text-slate-400">Placement command center</p>
      </div>
      <nav className="flex flex-col gap-1 px-3" aria-label="Primary">
        <NavItems orientation="vertical" />
      </nav>
    </aside>
  );
}

export default Sidebar;

import NavItems from "./NavItems";

// Persistent sidebar shown on desktop / tablet-landscape screens.
function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200/70 bg-white/80 backdrop-blur-sm md:flex md:flex-col">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg shadow-sm shadow-brand-600/30">
            🎓
          </span>
          <div>
            <p className="text-base font-bold leading-tight text-slate-900">
              Friend Dashboard
            </p>
            <p className="text-xs text-slate-400">Placement command center</p>
          </div>
        </div>
      </div>
      <nav className="flex flex-col gap-1 px-3" aria-label="Primary">
        <NavItems orientation="vertical" />
      </nav>
    </aside>
  );
}

export default Sidebar;

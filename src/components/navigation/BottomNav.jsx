import NavItems from "./NavItems";

// Fixed bottom navigation bar shown on mobile / small screens.
function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-200/70 bg-white/90 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden dark:border-slate-800 dark:bg-slate-900/90"
      aria-label="Primary"
    >
      <NavItems orientation="horizontal" />
    </nav>
  );
}

export default BottomNav;

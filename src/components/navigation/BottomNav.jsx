import NavItems from "./NavItems";

// Fixed bottom navigation bar shown on mobile / small screens.
function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-200 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden"
      aria-label="Primary"
    >
      <NavItems orientation="horizontal" />
    </nav>
  );
}

export default BottomNav;

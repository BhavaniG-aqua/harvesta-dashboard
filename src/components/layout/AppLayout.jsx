import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "../navigation/Sidebar";
import BottomNav from "../navigation/BottomNav";
import ThemeToggle from "../common/ThemeToggle";
import { useFavicon } from "../../hooks/useFavicon";
import { useLettersContext } from "../../services/LettersContext";

// Root application shell: sidebar on desktop, bottom nav on mobile,
// and a scrollable content area in between. A theme toggle sits at the
// top of the content on mobile (Sidebar carries its own on desktop).
function AppLayout() {
  const { lock } = useLettersContext();
  const location = useLocation();
  useFavicon();

  // Letters auto-locks the instant you navigate away from it — there is
  // no manual "Lock" button anymore, this is the only way it locks
  // (besides a full page reload).
  useEffect(() => {
    if (!location.pathname.startsWith("/letters")) {
      lock();
    }
  }, [location.pathname, lock]);

  return (
    <div className="flex min-h-screen bg-transparent text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <main className="flex-1 overflow-y-auto pb-20 md:pb-8">
          <div className="mx-auto w-full max-w-3xl px-4 py-4 md:px-8 md:py-6">
            <div className="mb-2 flex justify-end md:hidden">
              <ThemeToggle />
            </div>
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

export default AppLayout;

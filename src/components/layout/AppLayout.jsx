import { Outlet } from "react-router-dom";
import Sidebar from "../navigation/Sidebar";
import BottomNav from "../navigation/BottomNav";

// Root application shell: sidebar on desktop, bottom nav on mobile,
// and a scrollable content area in between.
function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <main className="flex-1 overflow-y-auto pb-20 md:pb-8">
          <div className="mx-auto w-full max-w-3xl px-4 py-4 md:px-8 md:py-6">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

export default AppLayout;

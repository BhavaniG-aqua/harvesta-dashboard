import NavItems from "./NavItems";
import ThemeToggle from "../common/ThemeToggle";
import { useSettingsContext } from "../../services/SettingsContext";
import defaultProfilePhoto from "../../assets/defaultProfilePhoto";

// Persistent sidebar shown on desktop / tablet-landscape screens.
function Sidebar() {
  const { settings } = useSettingsContext();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200/70 bg-white/80 backdrop-blur-sm md:flex md:flex-col dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center justify-between gap-2 px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-brand-700 shadow-sm shadow-brand-600/30">
            <img
              src={settings.profilePhoto || defaultProfilePhoto}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </span>
          <div>
            <p className="text-base font-bold leading-tight text-slate-900 dark:text-slate-100">
              Harvesta
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Made just for you</p>
          </div>
        </div>
      </div>
      <nav className="flex flex-col gap-1 px-3" aria-label="Primary">
        <NavItems orientation="vertical" />
      </nav>
      <div className="mt-auto flex items-center justify-between border-t border-slate-200/70 px-6 py-4 dark:border-slate-800">
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Theme</p>
        <ThemeToggle />
      </div>
    </aside>
  );
}

export default Sidebar;

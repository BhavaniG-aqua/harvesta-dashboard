import { useThemeContext } from "../../services/ThemeContext";

// Small pill toggle switching between light/dark theme. Icon-based, no
// text needed — sun for light, moon for dark, click to switch.
function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useThemeContext();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={[
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-base transition-colors hover:bg-slate-50",
        "dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700",
        className,
      ].join(" ")}
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}

export default ThemeToggle;

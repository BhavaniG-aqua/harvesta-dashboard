import { createContext, useContext, useEffect } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

const ThemeContext = createContext(null);

function getInitialTheme() {
  try {
    const stored = window.localStorage.getItem("dashboard.theme");
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // ignore
  }
  // Fall back to the OS/browser preference on first visit.
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

// Provides the current theme ("light" | "dark") + a toggle function, and
// keeps the <html> element's "dark" class in sync so Tailwind's `dark:`
// variants (configured via @custom-variant in index.css) respond to it.
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorageState("dashboard.theme", getInitialTheme());

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return ctx;
}

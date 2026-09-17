import { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { settingsMock } from "../data/mockData";

// Persisted state hook for lightweight app Settings.
export function useSettingsData() {
  const [settings, setSettings] = useLocalStorageState(
    "dashboard.settings",
    settingsMock
  );

  const updateSettings = useCallback(
    (partial) => {
      setSettings((prev) => ({ ...prev, ...partial }));
    },
    [setSettings]
  );

  return { settings, updateSettings };
}

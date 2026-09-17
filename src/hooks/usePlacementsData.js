import { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { placementEventsMock } from "../data/mockData";

// Local (persisted) state hook for Placement events.
// Mirrors the future `placement_events` table.
export function usePlacementsData() {
  const [events, setEvents] = useLocalStorageState(
    "dashboard.placementEvents",
    placementEventsMock
  );

  const getEvent = useCallback(
    (id) => events.find((e) => e.id === id) || null,
    [events]
  );

  const addEvent = useCallback(
    (data) => {
      const id = `pe-${Date.now()}`;
      setEvents((prev) => [...prev, { id, ...data }]);
      return id;
    },
    [setEvents]
  );

  const updateEvent = useCallback(
    (id, data) => {
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
    },
    [setEvents]
  );

  const deleteEvent = useCallback(
    (id) => {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    },
    [setEvents]
  );

  return { events, getEvent, addEvent, updateEvent, deleteEvent };
}

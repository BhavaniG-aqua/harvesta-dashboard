import { useState, useEffect, useCallback } from "react";
import { supabase } from "../services/supabaseClient";

// Maps DB row (snake_case) <-> app object (camelCase) so components never
// need to change when swapping from mock/localStorage to Supabase.
function fromRow(row) {
  return {
    id: row.id,
    company: row.company,
    date: row.date,
    time: row.time,
    role: row.role,
    package: row.package,
    requirements: row.requirements,
    selectionProcess: row.selection_process,
    whatToPrepare: row.what_to_prepare,
    notes: row.notes,
  };
}

function toRow(data) {
  return {
    company: data.company,
    date: data.date,
    time: data.time,
    role: data.role,
    package: data.package,
    requirements: data.requirements,
    selection_process: data.selectionProcess,
    what_to_prepare: data.whatToPrepare,
    notes: data.notes,
  };
}

// Supabase-backed hook for Placement events. Same public API as the
// previous localStorage-backed version (see usePlacementsData.js), so no
// consuming component needs to change — `addEvent`/`updateEvent`/
// `deleteEvent` just became async (they already were awaited correctly
// at their call sites).
export function usePlacementsData() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("placement_events")
      .select("*")
      .order("date", { ascending: true })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) console.error("Failed to load placement events:", error);
        setEvents((data || []).map(fromRow));
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const getEvent = useCallback(
    (id) => events.find((e) => e.id === id) || null,
    [events]
  );

  const addEvent = useCallback(async (data) => {
    const { data: inserted, error } = await supabase
      .from("placement_events")
      .insert(toRow(data))
      .select()
      .single();
    if (error) {
      console.error("Failed to add placement event:", error);
      return null;
    }
    const newEvent = fromRow(inserted);
    setEvents((prev) => [...prev, newEvent]);
    return newEvent.id;
  }, []);

  const updateEvent = useCallback(async (id, data) => {
    const { error } = await supabase
      .from("placement_events")
      .update(toRow(data))
      .eq("id", id);
    if (error) {
      console.error("Failed to update placement event:", error);
      return;
    }
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
  }, []);

  const deleteEvent = useCallback(async (id) => {
    const { error } = await supabase
      .from("placement_events")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Failed to delete placement event:", error);
      return;
    }
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { events, loading, getEvent, addEvent, updateEvent, deleteEvent };
}

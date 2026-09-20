import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../services/supabaseClient";

const PASSCODE_ROW_ID = 1;

// Very small, dependency-free SHA-256 hex digest via the Web Crypto API —
// used so the 6-digit passcode is never stored as plain text. This is a
// lightweight personal-use gate, not real security (no rate limiting,
// no salt rotation), but it's a meaningful step above storing the raw
// digits.
async function hashPasscode(passcode) {
  const bytes = new TextEncoder().encode(passcode);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fromLetterRow(row) {
  return { id: row.id, date: row.letter_date, content: row.content, updatedAt: row.updated_at };
}

// Supabase-backed hook for "Letters" — a private, day-wise personal
// journal gated behind its own 6-digit passcode, kept fully separate
// from the rest of the app (which has no authentication at all). The
// passcode's hash lives in the `letters_passcode` table (single row);
// unlocking only lives in memory for the current session (locks again
// on reload, and auto-locks on navigating away — see AppLayout.jsx).
export function useLettersData() {
  const [letters, setLetters] = useState([]);
  const [passcodeHash, setPasscodeHash] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      supabase.from("letters").select("*").order("letter_date", { ascending: false }),
      supabase.from("letters_passcode").select("*").eq("id", PASSCODE_ROW_ID).single(),
    ]).then(([lettersRes, passcodeRes]) => {
      if (!active) return;
      if (lettersRes.error) console.error("Failed to load letters:", lettersRes.error);
      if (passcodeRes.error) console.error("Failed to load passcode:", passcodeRes.error);
      setLetters((lettersRes.data || []).map(fromLetterRow));
      setPasscodeHash(passcodeRes.data?.passcode_hash || null);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const hasPasscode = Boolean(passcodeHash);

  const setPasscode = useCallback(async (sixDigits) => {
    const hash = await hashPasscode(sixDigits);
    const { error } = await supabase
      .from("letters_passcode")
      .update({ passcode_hash: hash })
      .eq("id", PASSCODE_ROW_ID);
    if (error) {
      console.error("Failed to set passcode:", error);
      return;
    }
    setPasscodeHash(hash);
  }, []);

  const verifyPasscode = useCallback(
    async (sixDigits) => {
      if (!passcodeHash) return false;
      const hash = await hashPasscode(sixDigits);
      return hash === passcodeHash;
    },
    [passcodeHash]
  );

  const tryUnlock = useCallback(
    async (sixDigits) => {
      const ok = await verifyPasscode(sixDigits);
      if (ok) setUnlocked(true);
      return ok;
    },
    [verifyPasscode]
  );

  const lock = useCallback(() => setUnlocked(false), []);

  const changePasscode = useCallback(
    async (oldSixDigits, newSixDigits) => {
      const ok = await verifyPasscode(oldSixDigits);
      if (!ok) return false;
      await setPasscode(newSixDigits);
      return true;
    },
    [verifyPasscode, setPasscode]
  );

  const sortedLetters = useMemo(
    () => [...letters].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [letters]
  );

  const getLetterForDate = useCallback(
    (dateKey) => letters.find((l) => l.date === dateKey) || null,
    [letters]
  );

  const saveLetterForDate = useCallback(async (dateKey, content) => {
    const { data, error } = await supabase
      .from("letters")
      .upsert(
        { letter_date: dateKey, content, updated_at: new Date().toISOString() },
        { onConflict: "letter_date" }
      )
      .select()
      .single();
    if (error) {
      console.error("Failed to save letter:", error);
      return;
    }
    const saved = fromLetterRow(data);
    setLetters((prev) => {
      const existingIndex = prev.findIndex((l) => l.date === dateKey);
      if (existingIndex === -1) return [saved, ...prev];
      const updated = [...prev];
      updated[existingIndex] = saved;
      return updated;
    });
  }, []);

  const deleteLetter = useCallback(async (id) => {
    const { error } = await supabase.from("letters").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete letter:", error);
      return;
    }
    setLetters((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return {
    letters: sortedLetters,
    loading,
    hasPasscode,
    unlocked,
    setPasscode,
    tryUnlock,
    lock,
    changePasscode,
    getLetterForDate,
    saveLetterForDate,
    deleteLetter,
  };
}

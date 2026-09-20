import { useCallback, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { uploadToStorage, buildStoragePath } from "../utils/supabaseStorage";

const SETTINGS_ROW_ID = 1;

function fromRow(row) {
  return {
    friendName: row.friend_name || "",
    sleepTargetHours: row.sleep_target_hours ?? 7,
    profilePhoto: row.profile_photo_url || null,
    birthday: row.birthday || "",
    bio: row.bio || "",
    currentGoal: row.current_goal || "",
    permanentReminder: row.permanent_reminder || "",
  };
}

// Supabase-backed hook for lightweight app Settings (single row, id = 1).
//
// `updateSettings({ profilePhoto, ... })` accepts EITHER:
//   - a File/Blob for `profilePhoto` (freshly picked from the file input)
//     -> uploaded to the "profile-photos" bucket, then the resulting
//        public URL is what actually gets saved to the `settings` row.
//   - a string (existing URL) or `null` (remove photo) for `profilePhoto`
//     -> saved as-is.
// This keeps ProfilePhotoPicker's existing `onChange(file/dataUrl/null)`
// call sites working without changes to the component itself.
export function useSettingsData() {
  const [settings, setSettings] = useState({
    friendName: "",
    sleepTargetHours: 7,
    profilePhoto: null,
    birthday: "",
    bio: "",
    currentGoal: "",
    permanentReminder: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("settings")
      .select("*")
      .eq("id", SETTINGS_ROW_ID)
      .single()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) console.error("Failed to load settings:", error);
        if (data) setSettings(fromRow(data));
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const updateSettings = useCallback(async (partial) => {
    let profilePhotoUrl = partial.profilePhoto;

    // A real File/Blob (fresh upload) needs to go to Storage first;
    // strings (existing URL) and null (removed) are saved as-is.
    if (partial.profilePhoto instanceof Blob) {
      const path = buildStoragePath("profile", partial.profilePhoto.name || "photo.jpg");
      profilePhotoUrl = await uploadToStorage("profile-photos", path, partial.profilePhoto);
    }

    const row = {
      id: SETTINGS_ROW_ID,
      friend_name: partial.friendName,
      birthday: partial.birthday || null,
      bio: partial.bio,
      current_goal: partial.currentGoal,
      permanent_reminder: partial.permanentReminder,
      ...(partial.profilePhoto !== undefined
        ? { profile_photo_url: profilePhotoUrl }
        : {}),
    };
    // Remove undefined keys so a partial update doesn't null out columns
    // that weren't actually part of this update.
    Object.keys(row).forEach((key) => row[key] === undefined && delete row[key]);

    const { data, error } = await supabase
      .from("settings")
      .update(row)
      .eq("id", SETTINGS_ROW_ID)
      .select()
      .single();
    if (error) {
      console.error("Failed to update settings:", error);
      return;
    }
    setSettings(fromRow(data));
  }, []);

  return { settings, loading, updateSettings };
}

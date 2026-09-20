import { useEffect, useRef, useState } from "react";
import defaultProfilePhoto from "../../assets/defaultProfilePhoto";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

// Profile photo picker: shows current photo (or a placeholder), with
// Edit (choose a new jpg/jpeg/png) and Remove actions.
//
// `value` may be:
//   - a string (an existing Supabase Storage URL, or a legacy data URL)
//   - a File/Blob (freshly picked, not uploaded yet — previewed locally
//     via a temporary object URL until Settings saves it)
//   - null/undefined (no photo set — shows the default mascot image)
// `onChange` is called with the raw File (not a data URL) so the caller
// can upload it to Supabase Storage on Save; passing `null` means
// "remove the photo".
//
// When `editable` is false, only the photo itself is shown (read-only
// view mode, sized smaller to sit inline in the profile header row)
// instead of the larger editable layout with Change/Remove actions.
function ProfilePhotoPicker({ value, onChange, editable = true }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  // Builds a temporary local preview URL whenever `value` is a
  // File/Blob (i.e. picked but not yet uploaded), and cleans it up when
  // it's no longer needed to avoid leaking object URLs.
  useEffect(() => {
    if (value instanceof Blob) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [value]);

  function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please choose a .jpg, .jpeg, or .png image.");
      return;
    }
    setError("");
    onChange(file);
  }

  const displaySrc =
    previewUrl || (typeof value === "string" ? value : null) || defaultProfilePhoto;

  const avatar = (
    <div
      className={[
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-brand-700 shadow-sm shadow-brand-600/20",
        editable ? "h-20 w-20" : "h-14 w-14",
      ].join(" ")}
    >
      <img src={displaySrc} alt="Profile" className="h-full w-full object-cover" />
    </div>
  );

  if (!editable) return avatar;

  return (
    <div className="flex items-center gap-4">
      {avatar}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            className="hidden"
            onChange={handleFile}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          >
            ✏️ {value ? "Change" : "Add"} photo
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:bg-slate-700 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              🗑️ Remove
            </button>
          ) : null}
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">JPG, JPEG or PNG only</p>
        {error ? <p className="text-[11px] font-medium text-red-500">{error}</p> : null}
      </div>
    </div>
  );
}

export default ProfilePhotoPicker;

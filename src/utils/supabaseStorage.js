import { supabase } from "../services/supabaseClient";

// Uploads a File/Blob to a Supabase Storage bucket and returns its public
// URL. All buckets used by this app are public (no auth, per Master
// Context §5), so a plain public URL is enough — no signed URLs needed.
//
// `path` should be unique per file, e.g. `${folderName}/${fileId}-${file.name}`.
export async function uploadToStorage(bucket, path, file) {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// Deletes a single object from a bucket. Safe to call even if the path
// is unknown/missing — Supabase Storage's delete is idempotent.
export async function deleteFromStorage(bucket, path) {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}

const IMAGE_EXTENSION_RE = /\.(png|jpe?g|gif|webp|avif|svg)$/i;

// Lists every image directly inside `path` (default: bucket root) and
// returns each one's public URL — used so a bucket like "one-more-thing"
// can be treated as a plain drop folder: whoever manages the app just
// uploads image files straight into the bucket via the Supabase Storage
// dashboard (no matching database row needed), and the app picks them up
// automatically next time it loads.
//
// Sorted by upload time (`created_at`, ascending) rather than filename —
// this way, whenever a new photo is dropped into the bucket later, it
// simply joins the END of the list instead of potentially slotting in
// alphabetically ahead of older photos (which would shuffle everyone
// else's position and change which photo lands on which day). Existing
// photos always keep their relative order as new ones are added.
//
// Folder "placeholder" entries (Supabase Storage lists empty folders as
// rows with no `id`) and non-image files are filtered out.
export async function listPublicImages(bucket, path = "") {
  const { data, error } = await supabase.storage.from(bucket).list(path, {
    limit: 500,
    sortBy: { column: "created_at", order: "asc" },
  });
  if (error) throw error;

  return (data || [])
    .filter((entry) => entry.id && IMAGE_EXTENSION_RE.test(entry.name))
    .map((entry) => {
      const fullPath = path ? `${path}/${entry.name}` : entry.name;
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fullPath);
      return { name: entry.name, path: fullPath, url: urlData.publicUrl };
    });
}

// Builds a readable, collision-safe storage path:
// {sanitized-prefix}/{shortId}-{sanitized-filename}.
//
// `prefix` is a human-readable label (e.g. a folder's display NAME, or a
// full "Parent/Child" breadcrumb path for nested folders, a note's
// title, or "profile") rather than a raw database id/UUID — so browsing
// the Supabase Storage dashboard directly shows meaningful folder names
// instead of opaque UUIDs. Each "/"-separated segment of `prefix` is
// sanitized independently so a breadcrumb like "Siemens/Previous
// Questions" correctly becomes two nested Storage folders
// ("Siemens/Previous-Questions") instead of being collapsed into one.
//
// The short id prefix on the filename itself (a random base-36 string,
// NOT a millisecond timestamp) exists only to guarantee two files with
// the same name in the same folder never collide/overwrite each other —
// it's intentionally short instead of a long epoch-millisecond number so
// the readable filename stays easy to spot at a glance.
export function buildStoragePath(prefix, fileName) {
  const safePrefix =
    String(prefix || "")
      .split("/")
      .map(sanitizeSegment)
      .filter(Boolean)
      .join("/") || "misc";
  const safeName = sanitizeSegment(fileName);
  const shortId = Math.random().toString(36).slice(2, 8);
  return `${safePrefix}/${shortId}-${safeName}`;
}

// Sanitizes a SINGLE path segment (no "/" allowed in the input) — safe
// to use for both a folder name and a filename.
function sanitizeSegment(value) {
  return String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9.\-_ ]/g, "")
    .replace(/\s+/g, "-");
}

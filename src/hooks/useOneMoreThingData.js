import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { listPublicImages } from "../utils/supabaseStorage";

// Number of whole days since the Unix epoch, in LOCAL time — used as a
// stable "day index" so the picked item only changes once per calendar
// day (not on every render/reload).
function dayIndex() {
  const now = new Date();
  const local = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor(local.getTime() / 86400000);
}

function fromQuoteRow(row) {
  return {
    id: row.id,
    type: "quote",
    quote: row.quote,
    author: row.author,
    rotationOrder: row.rotation_order,
  };
}

// Turns one Storage object (from `listPublicImages`) into a rotation
// item. There is deliberately no caption here — captions for the daily
// rotation come only from curated quote rows; images dropped straight
// into the bucket are just shown as-is.
function fromBucketImage(entry) {
  return { id: `bucket-${entry.path}`, type: "image", imageUrl: entry.url, caption: null };
}

function fromFixedRow(row) {
  if (!row?.image_url) return null;
  return { id: "fixed", type: "image", imageUrl: row.image_url, caption: row.caption };
}

// Interleaves two arrays (a[0], b[0], a[1], b[1], ...) so the daily
// rotation alternates between quotes and photos instead of running
// through one type at a time — matches the original "must alternate"
// intent even though the two now come from different sources (a
// curated table vs. a plain Storage bucket listing).
function weave(a, b) {
  const out = [];
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i]) out.push(a[i]);
    if (b[i]) out.push(b[i]);
  }
  return out;
}

// Supabase-backed hook for "One More Thing" — a single small quote OR
// image shown per day (never a list), to quietly lift the mood without
// ever labeling itself as "motivation" or "inspiration" to the user.
//
// This is intentionally READ-ONLY from the app's point of view:
//   - Quotes are curated directly in the Supabase Table Editor
//     (`one_more_thing_rotation`, rows with type='quote').
//   - Photos are simply dropped straight into the "one-more-thing"
//     Storage bucket (root folder) from the Supabase dashboard — no
//     matching database row needed. This hook lists that bucket on
//     load and folds whatever it finds into the daily rotation
//     automatically.
//   - `one_more_thing_fixed` holds the one single image that's always
//     shown as-is, every day, unchanged.
//
// `getTodayItem()` cycles deterministically through the combined
// rotation — exactly one item per calendar day, in order, before
// repeating.
export function useOneMoreThingData() {
  const [items, setItems] = useState([]);
  const [fixedItem, setFixedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      const [quoteRes, fixedRes] = await Promise.all([
        supabase
          .from("one_more_thing_rotation")
          .select("*")
          .eq("type", "quote")
          .order("rotation_order", { ascending: true }),
        supabase.from("one_more_thing_fixed").select("*").eq("id", 1).single(),
      ]);
      if (!active) return;
      if (quoteRes.error) console.error("Failed to load quotes:", quoteRes.error);
      if (fixedRes.error) console.error("Failed to load fixed content:", fixedRes.error);

      let bucketImages = [];
      try {
        bucketImages = await listPublicImages("one-more-thing");
      } catch (err) {
        console.error("Failed to list one-more-thing bucket images:", err);
      }
      if (!active) return;

      const quotes = (quoteRes.data || []).map(fromQuoteRow);
      const images = bucketImages.map(fromBucketImage);
      setItems(weave(quotes, images));
      setFixedItem(fromFixedRow(fixedRes.data));
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  function getTodayItem() {
    if (items.length === 0) return null;
    const index = dayIndex() % items.length;
    return items[index];
  }

  return { items, fixedItem, loading, getTodayItem };
}

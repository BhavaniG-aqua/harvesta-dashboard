import { createClient } from "@supabase/supabase-js";

// Client-safe Supabase connection. Only the public anon key is used here —
// never the service-role key (per Master Context Section 5).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase env vars are missing. Copy .env.example to .env and fill in your project URL/anon key."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

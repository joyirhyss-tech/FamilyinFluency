import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Supabase client singleton.
 * Returns null if env vars are missing — every consumer must guard with:
 *   if (!supabase) return;
 * This ensures the app works 100% offline / without Supabase configured.
 */
export const supabase = url && key ? createClient(url, key) : null;

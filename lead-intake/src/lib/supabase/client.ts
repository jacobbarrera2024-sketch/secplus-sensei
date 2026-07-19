import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/env";

export function createBrowserClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  return createSupabaseBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
}

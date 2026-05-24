import { createClient } from "@supabase/supabase-js";
import { getEnv, isSupabaseConfigured } from "../config/env.js";

/** Singleton anon client for auth verification (JWT → user). */
let client = null;

export function getSupabaseAnonClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!client) {
    const { supabaseUrl, supabaseAnonKey } = getEnv();
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}

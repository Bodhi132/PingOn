/**
 * Centralized environment for the API process.
 * Create `backend/.env` with the same Supabase values you use in Next (without NEXT_PUBLIC_ prefix).
 */
export function getEnv() {
  return {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: Number(process.env.PORT ?? 4000),
    frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
    supabaseUrl: process.env.SUPABASE_URL ?? "",
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "",
  };
}

export function isSupabaseConfigured() {
  const { supabaseUrl, supabaseAnonKey } = getEnv();
  return Boolean(supabaseUrl && supabaseAnonKey);
}

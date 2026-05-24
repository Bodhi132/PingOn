import { isSupabaseConfigured } from "../config/env.js";

export function getHealth(req, res) {
  res.json({
    ok: true,
    service: "pingon-api",
    supabaseConfigured: isSupabaseConfigured(),
  });
}

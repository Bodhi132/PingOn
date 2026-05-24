import { getSupabaseAnonClient } from "../lib/supabase.js";
import { isSupabaseConfigured } from "../config/env.js";

export async function getMe(req, res) {
  if (!isSupabaseConfigured()) {
    res
      .status(503)
      .json({ error: "SUPABASE_URL / SUPABASE_ANON_KEY not set on API server" });
    return;
  }

  const header = req.headers.authorization;
  const jwt =
    typeof header === "string" && header.startsWith("Bearer ")
      ? header.slice(7)
      : null;

  if (!jwt) {
    res.status(401).json({
      error: "Missing Authorization: Bearer <access_token>",
    });
    return;
  }

  const supabase = getSupabaseAnonClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(jwt);

  if (error || !user) {
    res.status(401).json({
      error: error?.message ?? "Invalid or expired token",
    });
    return;
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
    },
  });
}

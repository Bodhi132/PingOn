import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseBrowserConfig } from "./env";

export async function createClient(): Promise<SupabaseClient | null> {
  const { url, anonKey } = getSupabaseBrowserConfig();
  if (!url || !anonKey) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet, _headers) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies; middleware refreshes session.
        }
      },
    },
    global: {
      fetch: (fetchUrl, init) => {
        return fetch(fetchUrl, {
          ...init,
          cache: "no-store",
        });
      },
    },
  });
}

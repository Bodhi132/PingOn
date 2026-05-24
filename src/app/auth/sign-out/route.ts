import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseBrowserConfig } from "@/lib/supabase/env";

export async function POST(request: Request) {
  const { url, anonKey } = getSupabaseBrowserConfig();
  const origin = new URL(request.url).origin;

  if (!url || !anonKey) {
    return NextResponse.redirect(`${origin}/auth/login?error=config`, 303);
  }

  const cookieStore = await cookies();
  const response = NextResponse.redirect(`${origin}/auth/login`, { status: 303 });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      },
    },
  });

  await supabase.auth.signOut();
  return response;
}

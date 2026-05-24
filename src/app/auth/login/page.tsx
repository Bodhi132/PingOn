import { LoginForm } from "@/components/auth/LoginForm";
import { safeNextPath } from "@/lib/auth/redirect";
import { getSupabaseBrowserConfig } from "@/lib/supabase/env";

interface LoginPageProps {
  searchParams: Promise<{ next?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = safeNextPath(params.next);
  const error = params.error;
  const { url, anonKey } = getSupabaseBrowserConfig();
  const configured = Boolean(url && anonKey);

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-neutral-200/50 bg-white/80 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.06)] backdrop-blur-md">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Email and password, or Google. New here?{" "}
          <a
            href={`/auth/sign-up?next=${encodeURIComponent(next)}`}
            className="font-medium text-neutral-900 underline-offset-4 hover:underline"
          >
            Create an account
          </a>
        </p>
        {!configured ? (
          <p
            className="mt-4 rounded-lg border border-amber-200/80 bg-amber-50/90 px-3 py-2 text-sm text-amber-950"
            role="status"
          >
            Add <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
            <code className="text-xs">.env.local</code>, then restart{" "}
            <code className="text-xs">npm run dev</code>.
          </p>
        ) : null}
        {error ? (
          <p
            className="mt-4 rounded-lg border border-red-200/80 bg-red-50/90 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {error === "oauth"
              ? "Google sign-in did not complete. Try again."
              : error === "config"
                ? "Supabase is not configured. Check your environment variables."
                : "Something went wrong. Try again."}
          </p>
        ) : null}
        <LoginForm
          nextPath={next}
          disabled={!configured}
        />
      </div>
    </div>
  );
}

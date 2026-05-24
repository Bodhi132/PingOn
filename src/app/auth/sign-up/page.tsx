import { SignUpForm } from "@/components/auth/SignUpForm";
import { safeNextPath } from "@/lib/auth/redirect";
import { getSupabaseBrowserConfig } from "@/lib/supabase/env";

interface SignUpPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const next = safeNextPath(params.next);
  const { url, anonKey } = getSupabaseBrowserConfig();
  const configured = Boolean(url && anonKey);

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-neutral-200/50 bg-white/80 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.06)] backdrop-blur-md">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">
          Create account
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Already have an account?{" "}
          <a
            href={`/auth/login?next=${encodeURIComponent(next)}`}
            className="font-medium text-neutral-900 underline-offset-4 hover:underline"
          >
            Sign in
          </a>
        </p>
        {!configured ? (
          <p
            className="mt-4 rounded-lg border border-amber-200/80 bg-amber-50/90 px-3 py-2 text-sm text-amber-950"
            role="status"
          >
            Add <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
            <code className="text-xs">.env.local</code>, then restart the dev server.
          </p>
        ) : null}
        <SignUpForm
          nextPath={next}
          disabled={!configured}
        />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleGlyph } from "@/components/auth/GoogleGlyph";
import { createClient } from "@/lib/supabase/client";

interface SignUpFormProps {
  nextPath: string;
  disabled?: boolean;
}

export function SignUpForm({ nextPath, disabled = false }: SignUpFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function onEmailSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: signError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      });
      if (signError) {
        setError(signError.message);
        return;
      }
      if (data.session) {
        router.push(nextPath);
        router.refresh();
        return;
      }
      setInfo(
        "Check your email to confirm your account, then sign in. You can close this tab.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setError(null);
    setInfo(null);
    setGoogleLoading(true);
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (oauthError) {
        setError(oauthError.message);
        setGoogleLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-up failed");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <button
        type="button"
        onClick={onGoogle}
        disabled={googleLoading || loading || disabled}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200/50 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-50 disabled:opacity-60"
      >
        <GoogleGlyph />
        {googleLoading ? "Redirecting…" : "Continue with Google"}
      </button>

      <div className="relative">
        <div
          className="absolute inset-0 flex items-center"
          aria-hidden
        >
          <span className="w-full border-t border-neutral-200/80" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white/80 px-2 text-neutral-400">or</span>
        </div>
      </div>

      <form
        onSubmit={onEmailSignUp}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="signup-email"
            className="block text-xs font-medium uppercase tracking-wide text-neutral-500"
          >
            Email
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-neutral-200/50 bg-white/90 px-3 py-2.5 text-sm outline-none transition focus:border-neutral-300 focus:ring-2 focus:ring-neutral-950/10"
          />
        </div>
        <div>
          <label
            htmlFor="signup-password"
            className="block text-xs font-medium uppercase tracking-wide text-neutral-500"
          >
            Password
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-neutral-200/50 bg-white/90 px-3 py-2.5 text-sm outline-none transition focus:border-neutral-300 focus:ring-2 focus:ring-neutral-950/10"
          />
        </div>
        {error ? (
          <p
            className="text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        {info ? (
          <p
            className="rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 py-2 text-sm text-neutral-800"
            role="status"
          >
            {info}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading || googleLoading || disabled}
          className="w-full rounded-full bg-neutral-950 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Sign up with email"}
        </button>
      </form>
    </div>
  );
}

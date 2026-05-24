"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleGlyph } from "@/components/auth/GoogleGlyph";
import { createClient } from "@/lib/supabase/client";

interface LoginFormProps {
  nextPath: string;
  disabled?: boolean;
}

export function LoginForm({ nextPath, disabled = false }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function onEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signError) {
        setError(signError.message);
        return;
      }
      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setError(null);
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
      setError(err instanceof Error ? err.message : "Google sign-in failed");
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
        onSubmit={onEmailSignIn}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="login-email"
            className="block text-xs font-medium uppercase tracking-wide text-neutral-500"
          >
            Email
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-neutral-200/50 bg-white/90 px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-neutral-300 focus:ring-2 focus:ring-neutral-950/10"
          />
        </div>
        <div>
          <label
            htmlFor="login-password"
            className="block text-xs font-medium uppercase tracking-wide text-neutral-500"
          >
            Password
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
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
        <button
          type="submit"
          disabled={loading || googleLoading || disabled}
          className="w-full rounded-full bg-neutral-950 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in with email"}
        </button>
      </form>
    </div>
  );
}

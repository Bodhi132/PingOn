import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/Sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-4 py-20">
        <div className="max-w-md rounded-2xl border border-neutral-200/50 bg-white/90 p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-neutral-900">
            Supabase is not configured
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Add{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">
              NEXT_PUBLIC_SUPABASE_URL
            </code>{" "}
            and{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>{" "}
            to <code className="text-xs">.env.local</code>, then restart the dev
            server.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
          >
            ← Back home
          </Link>
        </div>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar userEmail={user.email} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

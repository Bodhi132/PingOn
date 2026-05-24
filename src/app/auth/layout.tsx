import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#fafafa]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.08),transparent)]"
        aria-hidden
      />
      <header className="px-4 py-6">
        <Link
          href="/"
          className="mx-auto flex max-w-md items-center gap-2 text-sm font-semibold tracking-tight text-neutral-900"
        >
          <span
            className="relative flex h-2 w-2"
            aria-hidden
          >
            <span className="pingon-radar absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22C55E]" />
          </span>
          PingON
        </Link>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-4">
        {children}
      </div>
    </div>
  );
}

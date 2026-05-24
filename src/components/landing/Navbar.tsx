import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#embed", label: "Embed Widget" },
  { href: "#pricing", label: "Pricing" },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4 md:pt-6">
      <nav
        className="mx-auto flex max-w-5xl flex-col gap-3 rounded-2xl border border-neutral-200/50 bg-white/70 px-4 py-3 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:rounded-full sm:py-2.5 md:px-6"
        aria-label="Primary"
      >
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 font-semibold tracking-tight text-neutral-900"
          >
            <Image src="/logo.png" alt="PingON Logo" width={24} height={24} className="h-6 w-auto" />
            PingON
          </Link>
          <div className="flex items-center gap-2 sm:hidden">
            <Link
              href="/auth/login?next=/dashboard"
              className="rounded-full px-3 py-2 text-sm font-medium text-neutral-600"
            >
              Log in
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white shadow-sm active:scale-[0.98]"
            >
              Start
            </Link>
          </div>
        </div>

        <ul className="flex items-center justify-center gap-0.5 overflow-x-auto pb-0.5 text-sm font-medium text-neutral-600 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-1 sm:pb-0 [&::-webkit-scrollbar]:hidden">
          {navLinks.map((l) => (
            <li
              key={l.href}
              className="shrink-0"
            >
              <Link
                href={l.href}
                className="rounded-full px-2.5 py-1.5 transition-colors hover:bg-neutral-100/80 hover:text-neutral-900 md:px-3"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <Link
            href="/auth/login?next=/dashboard"
            className="rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
          >
            Log in
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white shadow-sm transition-transform hover:bg-neutral-800 active:scale-[0.98]"
          >
            Start Monitoring
          </Link>
        </div>
      </nav>
    </header>
  );
}

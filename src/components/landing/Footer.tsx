import Link from "next/link";

const footerLinks = [
  { href: "#", label: "Privacy" },
  { href: "#", label: "Terms" },
  { href: "#", label: "Status" },
  { href: "#", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-neutral-200/40 px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 text-sm text-neutral-500 md:flex-row">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-neutral-800"
        >
          <span
            className="h-2 w-2 rounded-full bg-[#22C55E]"
            aria-hidden
          />
          PingON
        </Link>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footerLinks.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="transition hover:text-neutral-900"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-xs text-neutral-400">
          © {new Date().getFullYear()} PingON. Frontend preview.
        </p>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { MotionReveal } from "./MotionReveal";

export function Hero() {
  return (
    <section className="relative px-4 pb-16 pt-10 md:pb-24 md:pt-14">
      <div className="mx-auto max-w-5xl">
        <MotionReveal>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-200/50 bg-white/60 px-3 py-1 text-xs font-medium text-neutral-600 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
            1-minute precision probes · AI-ready checks
          </p>
          <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl md:text-[3.25rem] md:leading-[1.08]">
            Keep your infrastructure{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">ON</span>
              <span
                className="absolute -inset-x-1 bottom-1 -z-0 h-3 rounded-md bg-[#22C55E]/20"
                aria-hidden
              />
            </span>{" "}
            with intelligent monitoring.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600 md:text-xl">
            Lightning-fast 1-minute interval polling for standard web apps and
            AI endpoints. Know before your users do.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.1)_inset] transition hover:bg-neutral-800"
            >
              Start for free
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="#"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200/50 bg-white/70 px-6 py-3 text-sm font-semibold text-neutral-800 backdrop-blur-sm transition hover:bg-white"
            >
              <BookOpen className="h-4 w-4 text-neutral-500" aria-hidden />
              Read the docs
            </Link>
          </div>
        </MotionReveal>

        <MotionReveal
          className="mt-12 md:mt-16"
          delay={0.08}
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-neutral-200/50 bg-neutral-100 shadow-[0_24px_80px_rgba(0,0,0,0.06)] ring-1 ring-neutral-200/40">
            {/* eslint-disable-next-line @next/next/no-img-element -- animated GIF; avoid Image optimizer */}
            <img
              src="/cofounder-2-hero.gif"
              alt="PingON — monitoring and uptime preview"
              className="absolute inset-0 h-full w-full object-contain"
              width={1920}
              height={1080}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { MotionReveal } from "./MotionReveal";

export function PricingLimits() {
  return (
    <section
      id="pricing"
      className="px-4 py-16 md:py-24"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-5xl">
        <MotionReveal>
          <div className="mx-auto max-w-xl rounded-2xl border border-neutral-200/50 bg-white/80 p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.06)] backdrop-blur-md md:p-10">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200/50 bg-neutral-50">
              <ShieldCheck
                className="h-5 w-5 text-[#22C55E]"
                aria-hidden
              />
            </div>
            <h2
              id="pricing-heading"
              className="text-2xl font-semibold tracking-tight text-neutral-950 md:text-[1.65rem]"
            >
              Monitor up to 5 endpoints completely free.
            </h2>
            <p className="mt-3 text-neutral-600">
              No credit card for the starter tier. Upgrade when you need teams,
              SSO, and deeper history — your checks stay the same.
            </p>
            <Link
              href="/dashboard"
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 sm:w-auto"
            >
              Start monitoring
            </Link>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}

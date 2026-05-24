import { Activity, Cpu, Globe2, LayoutDashboard } from "lucide-react";
import { MOCK_LATENCY_SERIES, MOCK_LLM_PAYLOAD } from "@/data/mock-landing";
import { MotionReveal } from "./MotionReveal";
import { AnalyticsChartIsland } from "./AnalyticsChartIsland";
import { PollingTerminal } from "./PollingTerminal";

function BentoCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-neutral-200/50 bg-white/75 p-5 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_18px_48px_rgba(0,0,0,0.04)] backdrop-blur-md md:p-6 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export function BentoGrid() {
  const payloadJson = JSON.stringify(MOCK_LLM_PAYLOAD, null, 2);

  return (
    <section
      id="features"
      className="border-t border-neutral-200/40 bg-white/40 px-4 py-16 md:py-24"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-5xl">
        <MotionReveal>
          <div className="mb-10 max-w-2xl">
            <h2
              id="features-heading"
              className="text-2xl font-semibold tracking-tight text-neutral-950 md:text-3xl"
            >
              Built for uptime you can trust
            </h2>
            <p className="mt-3 text-neutral-600">
              A calm control surface for probes, payloads, and public status —
              composed in a bento grid so signal stays dense and readable.
            </p>
          </div>
        </MotionReveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:grid-rows-[auto_auto]">
          <MotionReveal
            className="md:col-span-2 lg:col-span-2 lg:row-span-1"
            delay={0.04}
          >
            <BentoCard className="relative flex h-full flex-col overflow-hidden">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/50 bg-neutral-50/80 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                    <Activity className="h-3.5 w-3.5 text-[#22C55E]" />
                    1-minute polling
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-neutral-900">
                    High-frequency checks without the noise
                  </h3>
                  <p className="mt-1 max-w-md text-sm text-neutral-600">
                    Structured logs stream as your probes land — 200 OK lines
                    append on every 60s cadence so operators see rhythm, not
                    chaos.
                  </p>
                </div>
              </div>
              <PollingTerminal />
            </BentoCard>
          </MotionReveal>

          <MotionReveal
            className="lg:col-span-1"
            delay={0.08}
          >
            <BentoCard className="relative h-full">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/50 bg-neutral-50/80 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                <Cpu className="h-3.5 w-3.5 text-neutral-700" />
                AI endpoints
              </div>
              <h3 className="mt-3 text-lg font-semibold text-neutral-900">
                Validate LLM routes like any HTTP surface
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                POST JSON, assert schema, and track latency on inference
                gateways — not just static pages.
              </p>
              <div className="mt-5 translate-y-1 rounded-xl border border-neutral-200/60 bg-white/90 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.08)] ring-1 ring-neutral-100">
                <div className="mb-2 flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                  <span>POST /v1/chat/completions</span>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-600">
                    application/json
                  </span>
                </div>
                <pre className="max-h-[200px] overflow-auto whitespace-pre-wrap break-words font-mono text-[10px] leading-relaxed text-neutral-700 sm:text-[11px]">
                  {payloadJson}
                </pre>
              </div>
            </BentoCard>
          </MotionReveal>

          <MotionReveal
            id="embed"
            className="lg:col-span-1"
            delay={0.1}
          >
            <BentoCard className="relative h-full overflow-visible">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/50 bg-neutral-50/80 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                <Globe2 className="h-3.5 w-3.5 text-neutral-700" />
                Embed widget
              </div>
              <h3 className="mt-3 text-lg font-semibold text-neutral-900">
                Status that floats above your marketing site
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                Drop a minimal badge visitors recognize instantly — glass panel,
                micro-border, no dashboard required.
              </p>
              <div className="relative mt-8 flex min-h-[140px] items-center justify-center rounded-xl border border-dashed border-neutral-200/80 bg-gradient-to-b from-neutral-50/90 to-white/40 p-6">
                <div
                  className="pointer-events-none absolute inset-x-8 top-6 h-10 rounded-lg bg-white/40 blur-xl"
                  aria-hidden
                />
                <div className="relative z-10 w-full max-w-[220px] rounded-xl border border-neutral-200/50 bg-white/90 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-md">
                  <div className="mb-2 flex items-center justify-between text-[10px] font-medium text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      acme.com
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-neutral-200/40 bg-neutral-50/80 px-3 py-2">
                    <span className="text-xs font-medium text-neutral-700">
                      Uptime
                    </span>
                    <span className="rounded-full bg-[#22C55E]/15 px-2 py-0.5 text-xs font-semibold text-[#15803d]">
                      100%
                    </span>
                  </div>
                  <p className="mt-2 text-[10px] text-neutral-400">
                    Public embed · updates with your checks
                  </p>
                </div>
              </div>
            </BentoCard>
          </MotionReveal>

          <MotionReveal
            className="md:col-span-2 lg:col-span-2"
            delay={0.12}
          >
            <BentoCard>
              <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/50 bg-neutral-50/80 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                    <Activity className="h-3.5 w-3.5 text-[#22C55E]" />
                    Analytics
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-neutral-900">
                    Latency trends at a glance
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    Mock p95 series for the last week — crisp area, neon edge,
                    no chart junk.
                  </p>
                </div>
                <div className="rounded-full border border-neutral-200/50 bg-white/80 px-3 py-1.5 text-xs font-medium text-neutral-700">
                  <span className="text-[#22C55E]">●</span> Healthy spread
                </div>
              </div>
              <AnalyticsChartIsland data={MOCK_LATENCY_SERIES} />
            </BentoCard>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}

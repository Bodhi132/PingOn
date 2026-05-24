"use client";

import dynamic from "next/dynamic";
import type { LatencyDataPoint } from "@/types/landing";

const AnalyticsChart = dynamic(
  () =>
    import("./AnalyticsChart").then((m) => ({
      default: m.AnalyticsChart,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[200px] w-full items-center justify-center rounded-xl border border-dashed border-neutral-200/60 bg-neutral-50/50 text-xs text-neutral-400 sm:h-[220px]">
        Loading chart…
      </div>
    ),
  },
);

interface AnalyticsChartIslandProps {
  data: LatencyDataPoint[];
}

export function AnalyticsChartIsland({ data }: AnalyticsChartIslandProps) {
  return <AnalyticsChart data={data} />;
}

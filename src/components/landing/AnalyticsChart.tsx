"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LatencyDataPoint } from "@/types/landing";

interface AnalyticsChartProps {
  data: LatencyDataPoint[];
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <div className="h-[200px] w-full sm:h-[220px]">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
        >
          <defs>
            <linearGradient
              id="latencyFill"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#22C55E"
                stopOpacity={0.35}
              />
              <stop
                offset="100%"
                stopColor="#22C55E"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#a3a3a3", fontSize: 11 }}
            dy={6}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#a3a3a3", fontSize: 11 }}
            tickFormatter={(v) => `${v}ms`}
            width={44}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(229,229,229,0.6)",
              fontSize: 12,
              boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
            }}
            labelStyle={{ color: "#525252", fontWeight: 600 }}
            formatter={(value) => [
              `${value != null ? value : "—"} ms`,
              "p95 latency",
            ]}
          />
          <Area
            type="monotone"
            dataKey="latencyMs"
            stroke="#22C55E"
            strokeWidth={2}
            fill="url(#latencyFill)"
            dot={false}
            activeDot={{ r: 4, fill: "#16a34a", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

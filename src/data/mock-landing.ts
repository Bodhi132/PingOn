import type { LatencyDataPoint, MockLLMPayload, TerminalLogLine } from "@/types/landing";

export const MOCK_LATENCY_SERIES: LatencyDataPoint[] = [
  { label: "Mon", latencyMs: 42 },
  { label: "Tue", latencyMs: 38 },
  { label: "Wed", latencyMs: 55 },
  { label: "Thu", latencyMs: 44 },
  { label: "Fri", latencyMs: 36 },
  { label: "Sat", latencyMs: 33 },
  { label: "Sun", latencyMs: 31 },
];

export const MOCK_LLM_PAYLOAD: MockLLMPayload = {
  model: "gpt-4.1-mini",
  temperature: 0.2,
  max_tokens: 512,
  messages: [
    { role: "system", content: "You classify incident severity from logs." },
    { role: "user", content: "502 spike on /api/checkout — summarize impact." },
  ],
};

export function createInitialTerminalLines(): TerminalLogLine[] {
  const now = () =>
    new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  return [
    {
      id: "seed-1",
      timestamp: now(),
      message: "GET https://api.pingon.dev/health — 200 OK (61ms)",
      status: "ok",
    },
    {
      id: "seed-2",
      timestamp: now(),
      message: "Scheduler: next probe in 60s",
      status: "info",
    },
  ];
}

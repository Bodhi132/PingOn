/** Single point on the mock latency chart */
export interface LatencyDataPoint {
  label: string;
  latencyMs: number;
}

/** Line emitted by the mock polling terminal */
export interface TerminalLogLine {
  id: string;
  timestamp: string;
  message: string;
  status: "ok" | "info";
}

/** Mock LLM request body shown in the AI endpoint card */
export interface MockLLMPayload {
  model: string;
  temperature: number;
  max_tokens: number;
  messages: { role: string; content: string }[];
}

"use client";

import { useEffect, useState } from "react";
import type { TerminalLogLine } from "@/types/landing";
import { createInitialTerminalLines } from "@/data/mock-landing";

function formatTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function PollingTerminal() {
  const [lines, setLines] = useState<TerminalLogLine[]>([]);

  useEffect(() => {
    setLines(createInitialTerminalLines());
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setLines((prev) => {
        const next: TerminalLogLine = {
          id: `tick-${Date.now()}`,
          timestamp: formatTime(),
          message:
            "GET https://status.acme.com/api — 200 OK (54ms) · interval 60s",
          status: "ok",
        };
        const merged = [...prev, next];
        return merged.slice(-12);
      });
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex h-full min-h-[220px] flex-col rounded-xl border border-neutral-200/40 bg-neutral-950/95 font-mono text-[11px] leading-relaxed text-neutral-300 shadow-inner sm:min-h-[260px] sm:text-xs">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
        <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
          probe-stream · live
        </span>
      </div>
      <div className="flex-1 space-y-1.5 overflow-hidden p-3">
        {lines.map((line) => (
          <p
            key={line.id}
            className="flex flex-wrap gap-x-2 gap-y-0.5"
          >
            <span className="text-neutral-500">{line.timestamp}</span>
            <span
              className={
                line.status === "ok" ? "text-[#86EFAC]" : "text-neutral-400"
              }
            >
              {line.message}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}

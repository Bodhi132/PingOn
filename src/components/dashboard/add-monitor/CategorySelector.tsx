import React from "react";
import { MonitorCategory } from "./types";
import { Globe, Server, Activity, Shield } from "lucide-react";

interface CategorySelectorProps {
  value: MonitorCategory;
  onChange: (category: MonitorCategory) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const categories: { id: MonitorCategory; label: string; icon: React.ReactNode; desc: string; disabled?: boolean }[] = [
    {
      id: "api",
      label: "API Monitoring",
      desc: "Monitor HTTP endpoints and advanced APIs.",
      icon: <Server className="h-5 w-5" />,
    },
    {
      id: "udp",
      label: "UDP Monitoring",
      desc: "Monitor UDP endpoints via IP address or domain name.",
      icon: <Activity className="h-5 w-5" />,
    },
    {
      id: "ssl",
      label: "SSL Monitoring",
      desc: "Monitor SSL certificate expiration and validity.",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      id: "website",
      label: "Website Monitoring",
      desc: "Monitor website availability and page load.",
      icon: <Globe className="h-5 w-5" />,
      disabled: true,
    },
    {
      id: "ping",
      label: "Ping / ICMP",
      desc: "Check server reachability at the network level.",
      icon: <Activity className="h-5 w-5" />,
      disabled: true,
    },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-3">Monitoring Category</label>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {categories.map((cat) => (
          <label
            key={cat.id}
            className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none transition-all ${
              value === cat.id
                ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900"
                : cat.disabled
                ? "border-neutral-200 bg-neutral-50/50 opacity-60 cursor-not-allowed"
                : "border-neutral-200 bg-white hover:border-neutral-300"
            }`}
          >
            <input
              type="radio"
              name="category"
              value={cat.id}
              disabled={cat.disabled}
              checked={value === cat.id}
              onChange={() => onChange(cat.id)}
              className="sr-only"
            />
            <div className="flex flex-col gap-1">
              <div className={`flex items-center gap-2 ${value === cat.id ? "text-neutral-900" : "text-neutral-700"}`}>
                {cat.icon}
                <span className="text-sm font-medium">{cat.label}</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                {cat.desc}
                {cat.disabled && <span className="ml-1 text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">(Coming Soon)</span>}
              </p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { ApiMonitorType } from "./types";

interface ApiTypeSelectorProps {
  value: ApiMonitorType;
  onChange: (type: ApiMonitorType) => void;
}

export function ApiTypeSelector({ value, onChange }: ApiTypeSelectorProps) {
  return (
    <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
      <label className="block text-sm font-medium text-neutral-700">API Monitor Type</label>
      <div className="mt-3 flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="apiType"
            value="http"
            checked={value === "http"}
            onChange={() => onChange("http")}
            className="text-neutral-900 focus:ring-neutral-900"
          />
          <span className="text-sm text-neutral-700">Standard HTTP</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="apiType"
            value="advanced"
            checked={value === "advanced"}
            onChange={() => onChange("advanced")}
            className="text-neutral-900 focus:ring-neutral-900"
          />
          <span className="text-sm text-neutral-700">Advanced API</span>
        </label>
      </div>
    </div>
  );
}

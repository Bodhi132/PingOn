"use client";

import React, { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { MonitorFormData, MonitorCategory, ApiMonitorType } from "./types";
import { FormInput } from "./FormFields";
import { CategorySelector } from "./CategorySelector";
import { ApiTypeSelector } from "./ApiTypeSelector";
import { ApiConfigFields } from "./ApiConfigFields";

export function AddMonitorForm() {
  const router = useRouter();
  const supabase = createClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<MonitorFormData>({
    category: "api",
    apiType: "http",
    url: "",
    port: "",
    method: "GET",
    headers: '{\n  "Content-Type": "application/json"\n}',
    payload: "",
    expectedResponse: "",
  });

  const updateForm = (fields: Partial<MonitorFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let parsedHeaders = {};
    let parsedPayload = null;

    if (formData.category === "api" && formData.apiType === "advanced") {
      try {
        if (formData.headers.trim()) {
          parsedHeaders = JSON.parse(formData.headers);
        }
      } catch (err) {
        setError("Invalid JSON in Headers field.");
        return;
      }

      try {
        if (formData.payload.trim()) {
          parsedPayload = JSON.parse(formData.payload);
        }
      } catch (err) {
        setError("Invalid JSON in Request Payload field.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      const isAdvancedApi = formData.category === "api" && formData.apiType === "advanced";
      const isUdp = formData.category === "udp";
      const isSsl = formData.category === "ssl";

      let monitorType = "http";
      if (isAdvancedApi) monitorType = "api";
      if (isUdp) monitorType = "udp";
      if (isSsl) monitorType = "ssl";

      const { error: insertError } = await supabase.from("monitors").insert({
        user_id: userId,
        url: formData.url.trim(),
        type: monitorType,
        method: isAdvancedApi ? formData.method : isUdp ? "UDP" : isSsl ? "SSL" : "GET",
        headers: isAdvancedApi ? parsedHeaders : isUdp && formData.port ? { port: Number(formData.port) } : {},
        payload: isAdvancedApi ? parsedPayload : null,
        expected_response:
          isAdvancedApi && formData.expectedResponse.trim()
            ? formData.expectedResponse.trim()
            : null,
        status: "pending",
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      router.refresh(); // Invalidate Next.js client router cache before navigating
      router.push("/dashboard?success=monitor_added");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create monitor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-neutral-200/50 bg-white p-6 shadow-sm"
    >
      {error && (
        <div className="rounded-md border border-rose-200/50 bg-rose-50 p-4 text-sm text-rose-600">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <CategorySelector
          value={formData.category}
          onChange={(category: MonitorCategory) => updateForm({ category })}
        />

        {formData.category === "api" && (
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <h3 className="text-lg font-medium text-neutral-900">API Monitor Details</h3>
            
            <ApiTypeSelector
              value={formData.apiType}
              onChange={(apiType: ApiMonitorType) => updateForm({ apiType })}
            />

            <FormInput
              id="url"
              label="URL to Monitor"
              type="url"
              required
              value={formData.url}
              onChange={(e) => updateForm({ url: e.target.value })}
              placeholder="https://api.example.com"
            />

            {formData.apiType === "advanced" && (
              <ApiConfigFields formData={formData} updateForm={updateForm} />
            )}
          </div>
        )}

        {formData.category === "udp" && (
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <h3 className="text-lg font-medium text-neutral-900">UDP Monitor Details</h3>
            <p className="text-xs text-neutral-500">Enter the IP address or raw domain name to monitor via UDP heartbeat.</p>

            <FormInput
              id="udp-url"
              label="IP Address or Domain Name"
              type="text"
              required
              value={formData.url}
              onChange={(e) => updateForm({ url: e.target.value })}
              placeholder="e.g. 8.8.8.8 or example.com"
            />

            <FormInput
              id="udp-port"
              label="Port (Optional)"
              type="number"
              value={formData.port}
              onChange={(e) => updateForm({ port: e.target.value })}
              placeholder="e.g. 53"
            />
          </div>
        )}

        {formData.category === "ssl" && (
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <h3 className="text-lg font-medium text-neutral-900">SSL Monitor Details</h3>
            <p className="text-xs text-neutral-500">Enter the domain name to monitor SSL certificate validity and expiration.</p>

            <FormInput
              id="ssl-url"
              label="Domain Name"
              type="text"
              required
              value={formData.url}
              onChange={(e) => updateForm({ url: e.target.value })}
              placeholder="e.g. google.com or github.com"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !["api", "udp", "ssl"].includes(formData.category)}
          className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:scale-105 hover:bg-neutral-800 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {isSubmitting ? "Adding..." : "Add Monitor"}
        </button>
      </div>
    </form>
  );
}

import React from "react";
import { FormInput, FormSelect, FormTextarea } from "./FormFields";
import { MonitorFormData } from "./types";

interface ApiConfigFieldsProps {
  formData: MonitorFormData;
  updateForm: (fields: Partial<MonitorFormData>) => void;
}

export function ApiConfigFields({ formData, updateForm }: ApiConfigFieldsProps) {
  const methodOptions = [
    { label: "GET", value: "GET" },
    { label: "POST", value: "POST" },
    { label: "PUT", value: "PUT" },
    { label: "DELETE", value: "DELETE" },
  ];

  return (
    <div className="space-y-4 rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
      <FormSelect
        id="method"
        label="Method"
        options={methodOptions}
        value={formData.method}
        onChange={(e) => updateForm({ method: e.target.value })}
      />

      <FormTextarea
        id="headers"
        label="Headers (JSON)"
        rows={3}
        value={formData.headers}
        onChange={(e) => updateForm({ headers: e.target.value })}
        className="font-mono"
      />

      <FormTextarea
        id="payload"
        label="Request Payload (JSON)"
        rows={4}
        value={formData.payload}
        onChange={(e) => updateForm({ payload: e.target.value })}
        placeholder='{"key": "value"}'
        className="font-mono"
      />

      <FormInput
        id="expectedResponse"
        label="Expected Response Keyword (Optional)"
        value={formData.expectedResponse}
        onChange={(e) => updateForm({ expectedResponse: e.target.value })}
        placeholder='e.g. "status": "success"'
      />
    </div>
  );
}

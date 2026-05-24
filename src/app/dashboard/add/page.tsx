import { AddMonitorForm } from "@/components/dashboard/add-monitor/AddMonitorForm";

export default function AddMonitorPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Add Monitor</h1>
        <p className="text-sm text-neutral-500">
          Create a new monitor to track uptime and latency across various protocols.
        </p>
      </div>

      <AddMonitorForm />
    </div>
  );
}

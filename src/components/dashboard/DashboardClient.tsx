"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Plus,
  Clock,
  AlertTriangle,
  Terminal,
  Settings2,
  MoreVertical,
  Globe,
  ArrowUpRight,
  Search,
  ServerCrash,
  Trash2,
  Loader2,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { createClient } from "@/lib/supabase/client";
import { deleteMonitorAction, fetchDashboardDataAction } from "@/app/dashboard/actions";

type Monitor = {
  id: string;
  url: string;
  type: string;
  method: string;
  status: string;
};

type PingLog = {
  monitor_id: string;
  is_up: boolean;
  latency_ms: number;
  created_at: string;
};

interface DashboardClientProps {
  initialMonitors: Monitor[];
  pingLogs: PingLog[];
}

const MOCK_LATENCY_DATA = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i}:00`,
  latency: Math.floor(Math.random() * 50) + 20 + (i === 14 || i === 15 ? 150 : 0),
}));

const MOCK_INCIDENTS = [
  { id: 1, start: "Today, 14:00", duration: "1h 15m", error: "502 Bad Gateway", status: "resolved" },
  { id: 2, start: "Today, 18:30", duration: "Ongoing", error: "Connection Timeout", status: "active" },
];

export function DashboardClient({ initialMonitors, pingLogs }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"mission-control" | "deep-dive">("mission-control");
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [monitorsList, setMonitorsList] = useState<Monitor[]>(initialMonitors);
  const [pingLogsList, setPingLogsList] = useState<PingLog[]>(pingLogs);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchLiveData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Fetch fresh data securely via Server Action to guarantee server-side auth cookie resolution and RLS enforcement
      const { monitors, pingLogs: freshLogs } = await fetchDashboardDataAction();

      setMonitorsList(monitors.filter(m => !deletedIds.includes(m.id)));
      setPingLogsList(freshLogs);
      router.refresh(); // Sync server components in background
    } catch (err) {
      console.error("Error fetching live data:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [deletedIds, router]);

  useEffect(() => {
    // Fetch live data immediately on component mount to guarantee fresh state bypassing Turbopack server cache
    fetchLiveData();
  }, [fetchLiveData]);

  useEffect(() => {
    // If we just navigated here from adding a new monitor, clean the URL and force a live fetch
    if (searchParams.get("success")) {
      router.replace("/dashboard");
      fetchLiveData();
    }
  }, [searchParams, router, fetchLiveData]);

  useEffect(() => {
    // Automatic live polling every 15 seconds for a true real-time dashboard feel
    const interval = setInterval(() => {
      fetchLiveData();
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchLiveData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this monitor? All associated ping logs will be permanently erased.")) {
      return;
    }

    setIsDeleting(id);
    try {
      await deleteMonitorAction(id);
      setDeletedIds(prev => [...prev, id]);
      setMonitorsList(prev => prev.filter(m => m.id !== id));
      router.refresh();
    } catch (err: any) {
      console.error("Failed to delete monitor:", err);
      alert("Failed to delete monitor: " + err.message);
    } finally {
      setIsDeleting(null);
    }
  };

  const processedMonitors = useMemo(() => {
    return monitorsList.map(monitor => {
      const mLogs = pingLogsList.filter(l => l.monitor_id === monitor.id);

      const totalLogs = mLogs.length;
      const upLogs = mLogs.filter(l => l.is_up).length;

      const uptime = totalLogs > 0 ? ((upLogs / totalLogs) * 100).toFixed(2) + "%" : "Pending...";

      const downLogs = totalLogs - upLogs;
      const downtimeStr = downLogs > 0 ? `${downLogs}m down` : "100% Up";

      const latestLog = mLogs[0];
      const isUp = latestLog ? latestLog.is_up : null;
      const pingStr = latestLog ? `${latestLog.latency_ms}ms` : "N/A";

      // Prioritize the actual status column from the monitors table updated by Hugging Face
      let statusStr = monitor.status || "pending";
      if (statusStr === "pending" && latestLog) {
        statusStr = latestLog.is_up ? "up" : "down";
      }

      const sparklineData = mLogs.slice(0, 30).reverse();

      return {
        id: monitor.id,
        name: monitor.url.replace(/^https?:\/\//, '').split('/')[0],
        url: monitor.url,
        status: statusStr,
        uptime,
        downtimeStr,
        ping: pingStr,
        sparklineData
      };
    });
  }, [monitorsList, pingLogsList]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-center justify-between border-b border-neutral-200/50 pb-4">
        <div className="flex space-x-1 rounded-lg bg-neutral-100/50 p-1 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab("mission-control")}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${activeTab === "mission-control"
                ? "bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200/50"
                : "text-neutral-500 hover:text-neutral-700"
              }`}
          >
            <Activity className="h-4 w-4" />
            Mission Control
          </button>
          <button
            onClick={() => setActiveTab("deep-dive")}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${activeTab === "deep-dive"
                ? "bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200/50"
                : "text-neutral-500 hover:text-neutral-700"
              }`}
          >
            <Search className="h-4 w-4" />
            Deep Dive
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLiveData}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 active:scale-95 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-green-600' : ''}`} />
            Refresh
          </button>

          {activeTab === "mission-control" && (
            <Link href="/dashboard/add" className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-md transition-transform hover:scale-105 hover:bg-neutral-800 active:scale-95">
              <Plus className="h-4 w-4" />
              Quick Add
            </Link>
          )}
        </div>
      </div>

      {activeTab === "mission-control" && (
        <MissionControl
          monitors={processedMonitors}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}
      {activeTab === "deep-dive" && <DeepDive />}
    </div>
  );
}

function MissionControl({
  monitors,
  onDelete,
  isDeleting
}: {
  monitors: any[];
  onDelete: (id: string) => void;
  isDeleting: string | null;
}) {
  const upCount = monitors.filter(m => m.status === "up").length;
  const downCount = monitors.filter(m => m.status === "down").length;
  const pendingCount = monitors.filter(m => m.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Global Status Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200/50 bg-white p-6 shadow-sm">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-600/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-gradient-to-tr from-rose-400/20 to-red-600/5 blur-3xl" />

        <div className="relative flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Global Status</h2>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-4xl font-bold tracking-tight text-neutral-900">
                {upCount} Up, {downCount} Down
              </span>
              {downCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-600 ring-1 ring-inset ring-rose-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                  </span>
                  Critical Incidents
                </span>
              )}
            </div>
            {pendingCount > 0 && (
              <p className="text-xs text-neutral-400 mt-2 font-medium">{pendingCount} monitor(s) waiting for first ping...</p>
            )}
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-50 ring-1 ring-inset ring-neutral-200/50">
            <Globe className="h-8 w-8 text-neutral-400" />
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {monitors.map((monitor, i) => (
          <div
            key={monitor.id}
            className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${i === 0 ? "md:col-span-2 lg:col-span-2" : ""
              } ${monitor.status === "up"
                ? "border-neutral-200/50 hover:border-green-500/30"
                : monitor.status === "down"
                  ? "border-rose-200/50 bg-rose-50/30 hover:border-rose-500/30"
                  : "border-neutral-200/50 opacity-80"
              }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${monitor.status === "up" ? "bg-green-50 text-green-600"
                    : monitor.status === "down" ? "bg-rose-100 text-rose-600"
                      : "bg-neutral-100 text-neutral-500"
                  }`}>
                  {monitor.status === "up" ? <CheckCircle2 className="h-5 w-5" />
                    : monitor.status === "down" ? <XCircle className="h-5 w-5" />
                      : <Clock className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 group-hover:text-neutral-950 truncate max-w-[200px]" title={monitor.name}>{monitor.name}</h3>
                  <p className="text-xs text-neutral-500 font-mono truncate max-w-[200px]" title={monitor.url}>{monitor.url}</p>
                </div>
              </div>
              <button
                onClick={() => onDelete(monitor.id)}
                disabled={isDeleting === monitor.id}
                className="text-neutral-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50 disabled:opacity-50"
                title="Delete Monitor"
              >
                {isDeleting === monitor.id ? (
                  <Loader2 className="h-4 w-4 animate-spin text-rose-600" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-1">Uptime <span className="text-[10px] text-neutral-400 normal-case">/ 24h</span></p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-semibold text-neutral-900">{monitor.uptime}</p>
                  {monitor.downtimeStr !== "100% Up" && monitor.status !== "pending" && (
                    <span className="text-xs font-medium text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-100/50">
                      {monitor.downtimeStr}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Ping</p>
                <p className={`text-lg font-semibold ${monitor.status === "up" ? "text-neutral-900" : monitor.status === "down" ? "text-rose-600" : "text-neutral-400"}`}>
                  {monitor.ping}
                </p>
              </div>
            </div>

            {/* Live Sparkline Data */}
            <div className="mt-6 flex h-8 w-full items-end gap-1">
              {monitor.sparklineData && monitor.sparklineData.length > 0 ? (
                Array.from({ length: 30 }).map((_, j) => {
                  const offset = 30 - monitor.sparklineData.length;
                  const log = monitor.sparklineData[j - offset];

                  if (!log) {
                    return <div key={j} className="w-full rounded-t-sm bg-neutral-100/50" style={{ height: "10%" }} />;
                  }

                  const isDown = !log.is_up;
                  const normalizedHeight = isDown ? 4 : Math.min(Math.max((log.latency_ms / 200) * 100, 20), 100);

                  return (
                    <div
                      key={j}
                      className={`w-full rounded-t-sm transition-all ${isDown ? "bg-rose-400" : "bg-green-400/60"
                        }`}
                      style={{ height: `${normalizedHeight}%` }}
                      title={`${isDown ? 'DOWN' : 'UP'} - ${log.latency_ms}ms`}
                    />
                  );
                })
              ) : (
                <div className="w-full flex items-center justify-center text-xs text-neutral-400 h-full border-t border-dashed border-neutral-200">
                  Waiting for data...
                </div>
              )}
            </div>
          </div>
        ))}

        {monitors.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
            <ServerCrash className="h-12 w-12 text-neutral-200 mb-4" />
            <h3 className="text-lg font-medium text-neutral-900">No monitors configured</h3>
            <p className="text-sm text-neutral-500 mt-1 max-w-sm">You haven't added any monitors yet.</p>
          </div>
        )}

        <Link href="/dashboard/add" className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 p-6 text-neutral-500 transition-all hover:border-neutral-300 hover:bg-neutral-50 min-h-[220px]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-neutral-200/50 group-hover:scale-110 transition-transform">
            <Plus className="h-6 w-6 text-neutral-400 group-hover:text-neutral-600" />
          </div>
          <span className="text-sm font-medium">Add New Monitor</span>
        </Link>
      </div>
    </div>
  );
}

function DeepDive() {
  return (
    <div className="space-y-6">
      {/* Header Context */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Payment Processor</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-600 ring-1 ring-inset ring-rose-50-500/20">
              <XCircle className="h-3 w-3" />
              Currently Down
            </span>
          </div>
          <a href="#" className="mt-1 flex items-center gap-1 text-sm font-mono text-neutral-500 hover:text-neutral-700">
            stripe-proxy.internal <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>

        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50">
            <Settings2 className="h-4 w-4" />
            Configure
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Charts & History */}
        <div className="space-y-6 lg:col-span-2">

          {/* Latency Chart */}
          <div className="rounded-2xl border border-neutral-200/50 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-semibold text-neutral-900">Latency (Last 24h)</h3>
              <span className="text-xs font-medium text-neutral-500">Average: 42ms</span>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_LATENCY_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorLatency)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Heartbeat History */}
          <div className="rounded-2xl border border-neutral-200/50 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-neutral-900">Heartbeat History (Last hour)</h3>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 60 }).map((_, i) => {
                const isFailure = i > 45 && i < 50; // Mock failure window
                return (
                  <div
                    key={i}
                    className={`h-6 w-3 rounded-[2px] transition-all hover:scale-110 hover:ring-2 hover:ring-offset-1 ${isFailure ? "bg-rose-500 hover:ring-rose-500" : "bg-emerald-400 hover:ring-emerald-400"
                      }`}
                    title={isFailure ? "Timeout Error" : "OK"}
                  />
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
              <span>60 mins ago</span>
              <span>Now</span>
            </div>
          </div>
        </div>

        {/* Right Column: Logs & Config */}
        <div className="space-y-6">

          {/* Incident Log */}
          <div className="rounded-2xl border border-neutral-200/50 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold text-neutral-900">Incident Log</h3>
            </div>
            <div className="space-y-4">
              {MOCK_INCIDENTS.map((incident) => (
                <div key={incident.id} className="relative pl-4">
                  <div className={`absolute left-0 top-1.5 h-2 w-2 rounded-full ${incident.status === 'active' ? 'bg-rose-500 animate-pulse' : 'bg-neutral-300'
                    }`} />
                  <div className="border-l-2 border-neutral-100 pl-4 pb-4 last:border-0 last:pb-0">
                    <p className="text-sm font-medium text-neutral-900">{incident.error}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {incident.start}</span>
                      <span>•</span>
                      <span>Duration: {incident.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Config */}
          <div className="rounded-2xl border border-neutral-200/50 bg-[#0a0a0a] p-6 shadow-sm text-neutral-300">
            <div className="mb-4 flex items-center gap-2 text-white">
              <Terminal className="h-5 w-5" />
              <h3 className="font-semibold">Deep Dive Mode</h3>
            </div>
            <div className="space-y-4 text-sm text-neutral-400">
              <p>Deep dive will be fully wired up next. Currently showing Mission Control with live data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

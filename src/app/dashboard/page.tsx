import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (!userId) {
    redirect("/auth/login");
  }

  // Fetch monitors with no caching
  const { data: monitors, error: monitorsError } = await supabase
    .from("monitors")
    .select("*")
    .eq("user_id", userId);

  if (monitorsError) {
    console.error("Error fetching monitors:", monitorsError);
  }

  // Fetch recent ping logs for these monitors to calculate uptime (limit 1000 to avoid timezone/clock skew filtering issues)
  const { data: pingLogs, error: logsError } = await supabase
    .from("ping_logs")
    .select("monitor_id, is_up, latency_ms, created_at")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (logsError) {
    console.error("Error fetching logs:", logsError);
  }

  return (
    <DashboardClient 
      initialMonitors={monitors || []} 
      pingLogs={pingLogs || []} 
    />
  );
}

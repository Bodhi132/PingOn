"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteMonitorAction(id: string) {
  const supabase = await createClient();

  if (!supabase) {
    throw new Error("Supabase client is not configured.");
  }

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (!userId) {
    throw new Error("Unauthorized: Please log in to delete monitors.");
  }

  // Delete the monitor matching the ID and verifying ownership
  const { error, data } = await supabase
    .from("monitors")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select();

  if (error) {
    console.error("Supabase delete error:", error);
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error("Monitor not found or you do not have permission to delete it.");
  }

  // Purge Next.js server cache for the dashboard
  revalidatePath("/dashboard");
  return { success: true };
}

export async function fetchDashboardDataAction() {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client is not configured.");

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (!userId) {
    throw new Error("Unauthorized: Please log in to view dashboard data.");
  }

  // Fetch monitors for the authenticated user
  const { data: monitors, error: monitorsError } = await supabase
    .from("monitors")
    .select("*")
    .eq("user_id", userId);

  if (monitorsError) {
    console.error("Error fetching monitors:", monitorsError);
    throw new Error(monitorsError.message);
  }

  // Fetch recent ping logs (limit 1000 to avoid timezone/clock skew filtering issues)
  const { data: pingLogs, error: logsError } = await supabase
    .from("ping_logs")
    .select("monitor_id, is_up, latency_ms, created_at")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (logsError) {
    console.error("Error fetching ping logs:", logsError);
    throw new Error(logsError.message);
  }

  return {
    monitors: monitors || [],
    pingLogs: pingLogs || [],
  };
}

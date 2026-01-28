"use client";

/**
 * Fetches system status from system_get_status_public() for /status page.
 * Hosted Supabase only. Auto-refresh every 60s per wireframe.
 */

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export type SystemStatusOverall = "operational" | "degraded" | "outage";

export type SystemStatusComponent = {
  name: string;
  status: SystemStatusOverall;
  uptime: string;
};

export type SystemStatusIncident = {
  title: string;
  date: string;
  duration: string;
  status: string;
};

export type SystemStatusMaintenance = {
  title: string;
  date: string;
  time: string;
  impact: string;
};

export type SystemStatusData = {
  overall: SystemStatusOverall;
  components: SystemStatusComponent[];
  incidents: SystemStatusIncident[];
  maintenance: SystemStatusMaintenance[];
  at: string;
};

export type SystemStatusResult = {
  data: SystemStatusData | null;
  status: "loading" | "empty" | "error" | "success";
  error: string | null;
  refetch: () => void;
};

export function useSystemStatus(): SystemStatusResult {
  const [data, setData] = useState<SystemStatusData | null>(null);
  const [status, setStatus] = useState<"loading" | "empty" | "error" | "success">("loading");
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setStatus("loading");
    setError(null);
    const supabase = createClient();

    try {
      const { data: res, error: err } = await supabase.rpc("system_get_status_public");
      if (err) {
        setError(err.message);
        setStatus("error");
        setData(null);
        return;
      }
      const payload = res as {
        overall?: string;
        components?: SystemStatusComponent[];
        incidents?: SystemStatusIncident[];
        maintenance?: SystemStatusMaintenance[];
        at?: string;
      } | null;
      if (!payload) {
        setStatus("empty");
        setData(null);
        return;
      }
      setData({
        overall: (payload.overall as SystemStatusOverall) ?? "operational",
        components: Array.isArray(payload.components) ? payload.components : [],
        incidents: Array.isArray(payload.incidents) ? payload.incidents : [],
        maintenance: Array.isArray(payload.maintenance) ? payload.maintenance : [],
        at: typeof payload.at === "string" ? payload.at : new Date().toISOString(),
      });
      setStatus("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch status");
      setStatus("error");
      setData(null);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60_000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return { data, status, error, refetch: fetchStatus };
}

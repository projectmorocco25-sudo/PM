"use client";

import { useQuery } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type AuditLogRow = {
  id: string;
  operation_type: string;
  table_name: string;
  record_id: string | null;
  created_at: string;
  user_id: string | null;
  reason: string | null;
};

async function fetchRecordAuditLogs(tableName: string, recordId: string, limit: number) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("id,operation_type,table_name,record_id,created_at,user_id,reason")
    .eq("table_name", tableName)
    .eq("record_id", recordId)
    .order("created_at", { ascending: false })
    .limit(Math.max(1, Math.min(limit, 100)));
  if (error) throw error;
  return (data ?? []) as AuditLogRow[];
}

export function useRecordAuditLogs(tableName: string, recordId: string | null | undefined, limit = 20) {
  return useQuery({
    queryKey: ["auditLogs", { tableName, recordId: recordId ?? null, limit }],
    queryFn: () => fetchRecordAuditLogs(tableName, recordId as string, limit),
    enabled: Boolean(recordId),
  });
}


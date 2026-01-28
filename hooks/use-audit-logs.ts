"use client";

/**
 * Audit logs list and detail. Uses shared_get_audit_logs, shared_get_audit_log_detail,
 * shared_generate_audit_report. Table: audit_logs. Hosted Supabase only. MOH/Auditors only (RLS).
 */

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type AuditLogRow = {
  id: string;
  user_id: string | null;
  operation_type: string;
  table_name: string;
  record_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  reason: string | null;
  created_at: string;
};

export type AuditLogDetail = AuditLogRow & {
  previous_hash: string | null;
  current_hash: string | null;
};

type ListPayload = { data: AuditLogRow[]; total: number };
type DetailPayload = AuditLogDetail | { error: string; id?: string };
type ReportPayload = { data: AuditLogRow[]; total: number; generated_at: string };

const PAGE_LIMIT = 50;

export function useAuditLogs(
  tableFilter: string | null,
  userFilter: string | null,
  startDate: string | null,
  endDate: string | null,
  offset: number
) {
  const [items, setItems] = useState<AuditLogRow[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<"loading" | "empty" | "error" | "success">("loading");
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setStatus("loading");
    setError(null);
    const supabase = createClient();
    const { data: res, error: err } = await supabase.rpc("shared_get_audit_logs", {
      p_table_name: tableFilter || null,
      p_user_id: userFilter || null,
      p_start_date: startDate || null,
      p_end_date: endDate || null,
      p_limit: PAGE_LIMIT,
      p_offset: offset,
    });
    if (err) {
      setError(err.message);
      setStatus("error");
      setItems([]);
      return;
    }
    const pl = res as ListPayload;
    const list = Array.isArray(pl?.data) ? pl.data : [];
    const tot = typeof pl?.total === "number" ? pl.total : 0;
    setItems(list);
    setTotal(tot);
    setStatus(list.length ? "success" : "empty");
  }, [tableFilter, userFilter, startDate, endDate, offset]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { items, total, status, error, refetch: fetchList };
}

export function useAuditLogDetail(id: string | null) {
  const [data, setData] = useState<AuditLogDetail | null>(null);
  const [status, setStatus] = useState<"loading" | "empty" | "error" | "success">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      setStatus("empty");
      setError(null);
      return;
    }
    let cancelled = false;
    setStatus("loading");
    setError(null);
    const supabase = createClient();
    void (async () => {
      const { data: res, error: err } = await supabase.rpc("shared_get_audit_log_detail", { p_id: id });
      if (cancelled) return;
      if (err) {
        setError(err.message ?? "Failed to load");
        setData(null);
        setStatus("error");
        return;
      }
      const pl = res as DetailPayload;
      if (pl && "error" in pl) {
        setData(null);
        setError((pl as { error: string }).error);
        setStatus("error");
        return;
      }
      setData(pl as AuditLogDetail);
      setStatus("success");
    })();
    return () => { cancelled = true; };
  }, [id]);

  return { data, status, error };
}

export function useGenerateAuditReport(
  tableFilter: string | null,
  userFilter: string | null,
  startDate: string | null,
  endDate: string | null
) {
  const [data, setData] = useState<ReportPayload | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    setStatus("loading");
    setError(null);
    setData(null);
    const supabase = createClient();
    const { data: res, error: err } = await supabase.rpc("shared_generate_audit_report", {
      p_table_name: tableFilter || null,
      p_user_id: userFilter || null,
      p_start_date: startDate || null,
      p_end_date: endDate || null,
      p_limit: 500,
      p_offset: 0,
    });
    if (err) {
      setError(err.message);
      setStatus("error");
      return;
    }
    const pl = res as ReportPayload;
    setData(pl ?? null);
    setStatus("success");
  }, [tableFilter, userFilter, startDate, endDate]);

  return { data, status, error, generate };
}

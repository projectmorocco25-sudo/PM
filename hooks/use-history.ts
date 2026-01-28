"use client";

/**
 * History data for /history page. Uses shared_get_history RPC.
 * Role-based: MOH -> audit_logs; Company -> registry_submissions.
 * Tables: audit_logs, registry_submissions. Hosted Supabase only.
 */

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type HistoryItem = {
  id: string;
  type: string;
  title: string;
  description: string;
  table_name: string;
  record_id: string | null;
  operation_type: string;
  link: string;
  created_at: string;
  user_id: string | null;
};

type HistoryPayload = { data: HistoryItem[]; total: number; error?: string };

const PAGE_LIMIT = 50;

function parseDateRange(range: string): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  switch (range) {
    case "7":
      start.setDate(start.getDate() - 7);
      break;
    case "90":
      start.setDate(start.getDate() - 90);
      break;
    case "7y":
      start.setFullYear(start.getFullYear() - 7);
      break;
    default:
      start.setDate(start.getDate() - 30);
  }
  return { start: start.toISOString(), end: end.toISOString() };
}

export function useHistory(userId: string | null, dateRange: string = "30", tableFilter: string | null = null) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<"loading" | "empty" | "error" | "success">("loading");
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPage = useCallback(
    async (offset: number, append: boolean) => {
      if (!userId) {
        setItems([]);
        setTotal(0);
        setStatus("empty");
        setError(null);
        return;
      }
      if (offset === 0) {
        setStatus("loading");
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const { start, end } = parseDateRange(dateRange);
      const supabase = createClient();
      const { data: res, error: err } = await supabase.rpc("shared_get_history", {
        p_start_date: start,
        p_end_date: end,
        p_table_name: tableFilter || null,
        p_limit: PAGE_LIMIT,
        p_offset: offset,
      });

      if (offset > 0) setLoadingMore(false);
      if (err) {
        setError(err.message);
        if (offset === 0) {
          setItems([]);
          setStatus("error");
        }
        return;
      }

      const payload = res as HistoryPayload;
      if (payload?.error) {
        setError(payload.error);
        if (offset === 0) {
          setItems([]);
          setStatus("error");
        }
        return;
      }

      const list = Array.isArray(payload?.data) ? payload.data : [];
      const tot = typeof payload?.total === "number" ? payload.total : 0;
      setTotal(tot);

      if (append) {
        setItems((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          const newItems = list.filter((n) => !ids.has(n.id));
          return [...prev, ...newItems];
        });
      } else {
        setItems(list);
        setStatus(list.length ? "success" : "empty");
      }
    },
    [userId, dateRange, tableFilter]
  );

  const refetch = useCallback(() => fetchPage(0, false), [fetchPage]);
  const loadMore = useCallback(() => {
    if (loadingMore || items.length >= total) return;
    fetchPage(items.length, true);
  }, [fetchPage, items.length, total, loadingMore]);

  useEffect(() => {
    fetchPage(0, false);
  }, [fetchPage]);

  const hasMore = items.length < total;
  return { items, total, status, error, refetch, loadMore, hasMore, loadingMore };
}

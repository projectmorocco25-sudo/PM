"use client";

/**
 * Fetches user permissions via shared_get_user_permissions RPC.
 * Data from hosted Supabase only. Tables: users.
 * Wireframe: task-0.5.1.15 (header), task-0.5.1.16 (sidebar).
 */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export type PermissionsResult = {
  role: string;
  company_id: string | null;
  permissions: string[];
} | {
  error: string;
  user_id?: string;
};

export function usePermissions(user: User | null) {
  const [data, setData] = useState<PermissionsResult | null>(null);
  const [status, setStatus] = useState<"loading" | "empty" | "error" | "success">("loading");

  useEffect(() => {
    if (!user?.id) {
      setData(null);
      setStatus("empty");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    const supabase = createClient();
    supabase
      .rpc("shared_get_user_permissions", { user_id: user.id })
      .then(({ data: res, error }) => {
        if (cancelled) return;
        if (error) {
          setData(null);
          setStatus("error");
          return;
        }
        const payload = res as PermissionsResult;
        if (payload && "error" in payload) {
          setData(payload);
          setStatus("error");
          return;
        }
        setData(payload);
        setStatus("success");
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return { data, status };
}

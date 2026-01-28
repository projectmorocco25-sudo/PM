"use client";

/**
 * Dashboard data: permissions, notifications, company (when company_id), companies/products/skus counts.
 * APIs: shared_get_user_permissions, shared_get_notifications, rmm_get_company,
 * rmm_list_companies, rmm_list_products, rmm_list_skus. Hosted Supabase only.
 */

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { PermissionsResult } from "./use-permissions";
import type { NotificationRow } from "./use-notifications";

type Company = { id: string; name: string; registration_number: string; company_type: string };

type DashboardData = {
  permissions: PermissionsResult | null;
  notifications: NotificationRow[];
  company: Company | null;
  companiesCount: number;
  productsCount: number;
  skusCount: number;
  status: "loading" | "empty" | "error" | "success";
  error: string | null;
  refetch: () => void;
};

export function useDashboardData(user: User | null): DashboardData {
  const [permissions, setPermissions] = useState<PermissionsResult | null>(null);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [companiesCount, setCompaniesCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [skusCount, setSkusCount] = useState(0);
  const [status, setStatus] = useState<"loading" | "empty" | "error" | "success">("loading");
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!user?.id) {
      setStatus("empty");
      return;
    }
    setStatus("loading");
    setError(null);
    const supabase = createClient();

    try {
      const { data: permData, error: permErr } = await supabase.rpc("shared_get_user_permissions", {
        user_id: user.id,
      });
      if (permErr) {
        setError(permErr.message);
        setStatus("error");
        return;
      }
      const perm = permData as PermissionsResult | null;
      setPermissions(perm ?? null);

      const companyId =
        perm && !("error" in perm) ? (perm as { company_id?: string | null }).company_id : null;

      const [notifRes, companyRes, listCompanies, listProducts, listSkus] = await Promise.all([
        supabase.rpc("shared_get_notifications", { p_limit: 10, p_offset: 0 }),
        companyId
          ? supabase.rpc("rmm_get_company", { p_id: companyId })
          : Promise.resolve({ data: null }),
        supabase.rpc("rmm_list_companies", { p_limit: 1, p_offset: 0 }),
        supabase.rpc("rmm_list_products", {
          p_limit: 1,
          p_offset: 0,
          p_company_id: companyId,
        }),
        supabase.rpc("rmm_list_skus", { p_limit: 1, p_offset: 0 }),
      ]);

      const notifPayload = (notifRes.data as { data?: NotificationRow[] })?.data ?? [];
      setNotifications(Array.isArray(notifPayload) ? notifPayload : []);

      const cPayload = companyRes?.data as { company?: Company } | { error?: string } | null;
      if (cPayload && "company" in cPayload && cPayload.company) {
        setCompany(cPayload.company);
      } else {
        setCompany(null);
      }

      const c = (listCompanies.data as { total?: number }) ?? {};
      setCompaniesCount(typeof c.total === "number" ? c.total : 0);

      const p = (listProducts.data as { total?: number }) ?? {};
      setProductsCount(typeof p.total === "number" ? p.total : 0);

      const s = (listSkus.data as { total?: number }) ?? {};
      setSkusCount(typeof s.total === "number" ? s.total : 0);

      setStatus("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard data");
      setStatus("error");
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    permissions,
    notifications,
    company,
    companiesCount,
    productsCount,
    skusCount,
    status,
    error,
    refetch: fetchAll,
  };
}

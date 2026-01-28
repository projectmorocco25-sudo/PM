"use client";

/**
 * Profile data for /profile page. Fetches users row, permissions, company name.
 * Tables: users, companies (via rmm_get_company). RPCs: shared_get_user_permissions, rmm_get_company.
 * Hosted Supabase only.
 */

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export type ProfileUser = {
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  timezone: string;
  language: string;
  role: string;
  company_id: string | null;
  notification_preferences: {
    email_enabled?: boolean;
    submission_updates?: boolean;
    compliance_alerts?: boolean;
    enforcement_actions?: boolean;
    system_announcements?: boolean;
  } | null;
};

export type ProfileData = {
  user: ProfileUser;
  companyName: string | null;
};

export type ProfileResult = {
  data: ProfileData | null;
  status: "loading" | "empty" | "error" | "success";
  error: string | null;
  refetch: () => void;
};

const ROLE_LABELS: Record<string, string> = {
  company_user: "Company User",
  company_admin: "Company Admin",
  company_manager: "Company Manager",
  tier1: "MOH Tier 1",
  tier2_officer: "MOH Tier 2 Officer",
  tier2_registrar: "MOH Tier 2 Registrar",
  system_admin: "System Admin",
  auditor: "Auditor",
  vendor: "Vendor",
};

export function roleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}

export function useProfile(user: User | null): ProfileResult {
  const [data, setData] = useState<ProfileData | null>(null);
  const [status, setStatus] = useState<"loading" | "empty" | "error" | "success">("loading");
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setStatus("empty");
      setData(null);
      return;
    }
    setStatus("loading");
    setError(null);
    const supabase = createClient();

    try {
      const [userRes, permRes] = await Promise.all([
        supabase
          .from("users")
          .select("full_name, email, avatar_url, timezone, language, role, company_id, notification_preferences")
          .eq("id", user.id)
          .single(),
        supabase.rpc("shared_get_user_permissions", { user_id: user.id }),
      ]);

      if (userRes.error) {
        setError(userRes.error.message);
        setStatus("error");
        setData(null);
        return;
      }

      const row = userRes.data as {
        full_name: string | null;
        email: string;
        avatar_url: string | null;
        timezone: string;
        language: string;
        role: string;
        company_id: string | null;
        notification_preferences: Record<string, unknown> | null;
      };

      const perm = permRes.data as { role?: string; company_id?: string | null } | null;
      const role = perm?.role ?? row.role;
      const companyId = perm?.company_id ?? row.company_id;

      let companyName: string | null = null;
      if (companyId) {
        const cr = await supabase.rpc("rmm_get_company", { p_id: companyId });
        const cp = cr.data as { company?: { name: string } } | { error?: string } | null;
        if (cp && !("error" in cp)) {
          const r = cp as { company?: { name: string } };
          if (r.company?.name) companyName = r.company.name;
        }
      }

      const prefs = row.notification_preferences as ProfileUser["notification_preferences"];
      setData({
        user: {
          ...row,
          role,
          company_id: companyId,
          notification_preferences: prefs ?? null,
        },
        companyName,
      });
      setStatus("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load profile");
      setStatus("error");
      setData(null);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { data, status, error, refetch: fetchProfile };
}

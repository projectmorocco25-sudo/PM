import { useQuery } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type UserRoleInfo = {
  role: string | null;
  companyId: string | null;
  permissions: string[];
  isCompanyUser: boolean;
  isMOHUser: boolean;
  isTier1: boolean;
  isTier2: boolean;
};

async function fetchUserRoleInfo(): Promise<UserRoleInfo> {
  const supabase = createSupabaseBrowserClient();
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  console.log("[fetchUserRoleInfo] auth.user:", auth.user);

  if (!userId) {
    console.log("[fetchUserRoleInfo] No userId, returning empty role info");
    return {
      role: null,
      companyId: null,
      permissions: [],
      isCompanyUser: false,
      isMOHUser: false,
      isTier1: false,
      isTier2: false,
    };
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("role, company_id")
    .eq("id", userId)
    .maybeSingle();

  console.log("[fetchUserRoleInfo] profile query result:", { profile, error, userId });
  if (error) throw error;

  // Permissions come from shared_get_user_permissions RPC when available.
  const role = (profile?.role as string | null) ?? null;
  const companyId = (profile?.company_id as string | null) ?? null;

  let permissions: string[] = [];
  try {
    const { data: permData, error: permError } = await supabase.rpc("shared_get_user_permissions", {
      p_user_id: userId,
    });
    if (!permError && permData && typeof permData === "object" && "permissions" in permData) {
      const raw = (permData as { permissions?: unknown }).permissions;
      if (Array.isArray(raw)) permissions = raw.filter((x): x is string => typeof x === "string");
    }
  } catch {
    // Keep permissions empty if RPC is unavailable.
  }

  const isTier1 = role === "tier1" || role === "moh_tier1";
  const isTier2 =
    role === "tier2_officer" ||
    role === "tier2_registrar" ||
    role === "moh_tier2_officer" ||
    role === "moh_tier2_registrar";

  // Primary signal: MOH users have NULL company_id in our schema.
  const isMOHUser = companyId === null || (role?.startsWith("moh_") ?? false);

  const isCompanyUser =
    companyId !== null ||
    role === "company_admin" ||
    role === "company_manager" ||
    role === "company_user" ||
    role === "ipc_admin" ||
    role === "ipc_user" ||
    role === "wholesaler_admin" ||
    role === "wholesaler_user";

  return {
    role,
    companyId,
    permissions,
    isCompanyUser,
    isMOHUser,
    isTier1,
    isTier2,
  };
}

export function useUserRole() {
  return useQuery({
    queryKey: ["userRole"],
    queryFn: fetchUserRoleInfo,
  });
}


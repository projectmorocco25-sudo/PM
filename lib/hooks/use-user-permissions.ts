/**
 * Hook to get user permissions
 * 
 * Fetches user permissions from Supabase using shared_get_user_permissions RPC function.
 * 
 * Database: users table
 * RPC Function: shared_get_user_permissions(user_id uuid)
 * 
 * Wireframe: task-0.5.1.14-dashboard-layout-structure.md, task-0.5.1.15-header-component.md, task-0.5.1.16-sidebar-navigation.md
 */

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface UserPermissions {
  user_id: string;
  role: string;
  company_id: string | null;
  permissions: Record<string, boolean>;
}

export function useUserPermissions(user: User | null) {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setPermissions(null);
      setLoading(false);
      return;
    }

    async function fetchPermissions() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { data, error: rpcError } = await supabase.rpc(
          "shared_get_user_permissions",
          { user_id: user.id }
        );

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        setPermissions(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch permissions"));
      } finally {
        setLoading(false);
      }
    }

    fetchPermissions();
  }, [user]);

  return { permissions, loading, error };
}

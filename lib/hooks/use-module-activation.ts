/**
 * Hook to check module activation status
 * 
 * Fetches module activation status from Supabase system_config table.
 * 
 * Database: system_config table
 * Query: SELECT is_active FROM system_config WHERE module_name = ?
 * 
 * Wireframe: task-0.5.1.16-sidebar-navigation.md (conditional module visibility)
 */

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Module } from "@/lib/constants/modules";

export function useModuleActivation(moduleName: Module) {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchModuleStatus() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { data, error: queryError } = await supabase
          .from("system_config")
          .select("is_active")
          .eq("module_name", moduleName)
          .single();

        if (queryError) {
          // Module not found or error - default to false
          setIsActive(false);
          return;
        }

        setIsActive(data?.is_active || false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch module status"));
        setIsActive(false);
      } finally {
        setLoading(false);
      }
    }

    fetchModuleStatus();
  }, [moduleName]);

  return { isActive, loading, error };
}

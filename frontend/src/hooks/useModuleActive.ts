import { useQuery } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

async function fetchModuleActive(moduleName: string): Promise<boolean> {
  const supabase = createSupabaseBrowserClient();

  // Prefer RPC if present
  try {
    const { data, error } = await supabase.rpc("shared_check_module_active", { p_module_name: moduleName });
    if (!error && typeof data === "boolean") return data;
  } catch {
    // fall through
  }

  const { data, error } = await supabase
    .from("system_config")
    .select("is_active")
    .eq("module_name", moduleName)
    .maybeSingle();
  if (error) throw error;
  return Boolean((data as { is_active?: boolean } | null)?.is_active);
}

export function useModuleActive(moduleName: string) {
  return useQuery({
    queryKey: ["moduleActive", moduleName],
    queryFn: () => fetchModuleActive(moduleName),
  });
}


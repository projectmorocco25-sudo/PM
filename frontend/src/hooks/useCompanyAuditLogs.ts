import { useQuery } from "@tanstack/react-query";

import { listCompanyAuditLogs } from "@/lib/supabase/queries";

export type CompanyAuditLogRow = {
  id: string;
  operation_type: string;
  table_name: string;
  record_id: string | null;
  created_at: string;
  user_id: string | null;
  reason: string | null;
};

export function useCompanyAuditLogs(companyId: string | null | undefined, limit = 20) {
  return useQuery({
    queryKey: ["companyAuditLogs", { companyId: companyId ?? null, limit }],
    queryFn: async () => {
      const res = await listCompanyAuditLogs(companyId as string, limit);
      if (res.error) throw res.error;
      return (res.data ?? []) as CompanyAuditLogRow[];
    },
    enabled: Boolean(companyId),
  });
}


import { useQuery } from "@tanstack/react-query";

import { listAuditLogs } from "@/lib/supabase/queries";

export type AuditLogRow = {
  id: string;
  operation_type: string;
  table_name: string;
  record_id: string | null;
  created_at: string;
};

export function useAuditLogs(limit = 10) {
  return useQuery({
    queryKey: ["auditLogs", { limit }],
    queryFn: async () => {
      const res = await listAuditLogs(limit);
      if (res.error) throw res.error;
      return (res.data ?? []) as AuditLogRow[];
    },
  });
}


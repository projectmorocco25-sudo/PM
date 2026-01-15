"use client";

import { useMemo } from "react";

export type ApprovalHistoryItem = {
  id: string;
  from_status: string;
  to_status: string;
  approver_id: string;
  approval_type: string;
  comments: string | null;
  created_at: string;
  approver?: { full_name: string | null; email: string; role: string } | null;
};

export function ApprovalHistory({ items }: { items: ApprovalHistoryItem[] }) {
  const sorted = useMemo(() => {
    return items.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [items]);

  if (sorted.length === 0) return <div className="text-sm text-zinc-600">No approval history yet.</div>;

  return (
    <ol className="space-y-3">
      {sorted.map((a) => (
        <li key={a.id} className="rounded-md border border-zinc-200 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-medium text-zinc-900">
              {a.approval_type} • {a.from_status} → {a.to_status}
            </div>
            <div className="text-xs text-zinc-600">{new Date(a.created_at).toLocaleString()}</div>
          </div>
          <div className="mt-1 text-xs text-zinc-700">
            {a.approver?.full_name ?? a.approver?.email ?? a.approver_id} {a.approver?.role ? `(${a.approver.role})` : ""}
          </div>
          {a.comments ? <div className="mt-2 text-sm text-zinc-800">{a.comments}</div> : null}
        </li>
      ))}
    </ol>
  );
}


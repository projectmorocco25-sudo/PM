/**
 * Loading skeleton for Pending Approvals page (Task 1.1.2.41)
 * Wireframe: task-0.5.2.1c-pending-approvals.md — Loading state (skeleton cards)
 */

export default function PendingApprovalsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 rounded bg-[#e5e7eb]" aria-hidden />
      <div className="flex flex-wrap gap-3">
        <div className="h-9 w-32 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="h-9 w-40 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="h-9 w-24 rounded bg-[#e5e7eb]" aria-hidden />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-[#e5e7eb] bg-white p-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-[#e5e7eb]" aria-hidden />
              <div className="h-5 w-48 rounded bg-[#e5e7eb]" aria-hidden />
            </div>
            <div className="mt-2 h-4 w-full max-w-md rounded bg-[#e5e7eb]" aria-hidden />
            <div className="mt-1 h-4 w-64 rounded bg-[#e5e7eb]" aria-hidden />
            <div className="mt-4 flex gap-2">
              <div className="h-8 w-24 rounded bg-[#e5e7eb]" aria-hidden />
              <div className="h-8 w-20 rounded bg-[#e5e7eb]" aria-hidden />
              <div className="h-8 w-16 rounded bg-[#e5e7eb]" aria-hidden />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

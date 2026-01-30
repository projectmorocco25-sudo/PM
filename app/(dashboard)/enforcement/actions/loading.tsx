/**
 * Loading skeleton for Enforcement Actions list page (Task 1.1.2.38)
 * Wireframe: task-0.5.2.1-enforcement-actions-list.md — Loading state (5–10 skeleton rows)
 */

export default function EnforcementActionsListLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-5 w-56 rounded bg-[#e5e7eb]" aria-hidden />
      <div className="flex justify-between gap-4">
        <div className="h-9 w-48 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="h-9 w-28 rounded bg-[#e5e7eb]" aria-hidden />
      </div>
      <div className="h-10 w-full max-w-md rounded bg-[#e5e7eb]" aria-hidden />
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="h-80 w-full rounded-lg border border-[#e5e7eb] bg-white p-4 lg:w-60">
          <div className="h-4 w-12 rounded bg-[#e5e7eb]" aria-hidden />
          <div className="mt-3 space-y-2">
            <div className="h-4 w-full rounded bg-[#e5e7eb]" aria-hidden />
            <div className="h-4 w-full rounded bg-[#e5e7eb]" aria-hidden />
            <div className="h-4 w-3/4 rounded bg-[#e5e7eb]" aria-hidden />
          </div>
        </div>
        <div className="min-w-0 flex-1 rounded-lg border border-[#e5e7eb] bg-white p-4">
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 w-full rounded bg-[#e5e7eb]" aria-hidden />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

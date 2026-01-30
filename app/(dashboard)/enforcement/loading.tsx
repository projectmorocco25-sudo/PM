/**
 * Loading skeleton for Enforcement dashboard page (Task 1.1.2.37)
 * Wireframe: task-0.5.2.0-enforcement-dashboard.md — Loading state
 */

export default function EnforcementDashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-5 w-40 rounded bg-[#e5e7eb]" aria-hidden />
      <div className="flex justify-between gap-4">
        <div className="h-9 w-56 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="h-9 w-28 rounded bg-[#e5e7eb]" aria-hidden />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-64 rounded-lg border border-[#e5e7eb] bg-white p-4">
          <div className="h-4 w-24 rounded bg-[#e5e7eb]" aria-hidden />
          <div className="mt-2 h-8 w-12 rounded bg-[#e5e7eb]" aria-hidden />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full rounded bg-[#e5e7eb]" aria-hidden />
            <div className="h-4 w-5/6 rounded bg-[#e5e7eb]" aria-hidden />
            <div className="h-4 w-4/5 rounded bg-[#e5e7eb]" aria-hidden />
          </div>
        </div>
        <div className="h-64 rounded-lg border border-[#e5e7eb] bg-white p-4">
          <div className="h-4 w-28 rounded bg-[#e5e7eb]" aria-hidden />
          <div className="mt-2 h-8 w-12 rounded bg-[#e5e7eb]" aria-hidden />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full rounded bg-[#e5e7eb]" aria-hidden />
            <div className="h-4 w-5/6 rounded bg-[#e5e7eb]" aria-hidden />
          </div>
        </div>
        <div className="h-64 rounded-lg border border-[#e5e7eb] bg-white p-4">
          <div className="h-4 w-32 rounded bg-[#e5e7eb]" aria-hidden />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-20 rounded bg-[#e5e7eb]" aria-hidden />
            <div className="h-4 w-16 rounded bg-[#e5e7eb]" aria-hidden />
            <div className="h-4 w-24 rounded bg-[#e5e7eb]" aria-hidden />
          </div>
        </div>
      </div>
      <div className="h-40 rounded-lg border border-[#e5e7eb] bg-white p-4">
        <div className="h-4 w-40 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="h-20 rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-20 rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-20 rounded bg-[#e5e7eb]" aria-hidden />
        </div>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for Enforcement Reports page (Task 1.1.2.42)
 * Wireframe: task-0.5.2.1d-enforcement-reports.md — Loading state (skeleton cards and charts)
 */

export default function EnforcementReportsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between">
        <div className="h-8 w-56 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="flex gap-2">
          <div className="h-9 w-16 rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-9 w-16 rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-9 w-14 rounded bg-[#e5e7eb]" aria-hidden />
        </div>
      </div>
      <div className="flex gap-3">
        <div className="h-9 w-24 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="h-9 w-28 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="h-9 w-32 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="h-9 w-28 rounded bg-[#e5e7eb]" aria-hidden />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-[#e5e7eb] bg-white p-4">
            <div className="h-4 w-24 rounded bg-[#e5e7eb]" aria-hidden />
            <div className="mt-2 h-8 w-16 rounded bg-[#e5e7eb]" aria-hidden />
            <div className="mt-1 h-4 w-32 rounded bg-[#e5e7eb]" aria-hidden />
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4">
        <div className="h-5 w-48 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="mt-3 space-y-2">
          <div className="h-4 w-full rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-4 w-4/5 rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-4 w-3/5 rounded bg-[#e5e7eb]" aria-hidden />
        </div>
      </div>
      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4">
        <div className="h-5 w-64 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="mt-3 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-full rounded bg-[#e5e7eb]" aria-hidden />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for Company products page (Task 1.1.2.18.1)
 * Wireframe: task-0.5.2.3-company-detail.md (Products tab) — Loading state
 */

export default function CompanyProductsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-5 w-3/4 max-w-md rounded bg-[#e5e7eb]" aria-hidden />
      <div className="flex justify-between gap-4">
        <div className="h-9 w-32 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="h-9 w-28 rounded bg-[#e5e7eb]" aria-hidden />
      </div>
      <div className="h-10 w-full max-w-sm rounded bg-[#e5e7eb]" aria-hidden />
      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4">
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-4 w-full rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-4 w-5/6 rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-4 w-4/5 rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-4 w-full rounded bg-[#e5e7eb]" aria-hidden />
        </div>
      </div>
    </div>
  );
}

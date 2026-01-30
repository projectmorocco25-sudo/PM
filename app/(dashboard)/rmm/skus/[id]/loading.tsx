/**
 * Loading skeleton for SKU detail page (Task 1.1.2.24)
 * Wireframe: task-0.5.2.7-sku-detail.md — Loading state
 */

export default function SkuDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-5 w-64 rounded bg-[#e5e7eb]" aria-hidden />
      <div className="flex justify-between gap-4">
        <div className="h-9 w-72 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="h-9 w-20 rounded bg-[#e5e7eb]" aria-hidden />
      </div>
      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4">
        <div className="h-4 w-32 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="h-4 w-full rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-4 w-full rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-4 w-3/4 rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-4 w-full rounded bg-[#e5e7eb]" aria-hidden />
        </div>
      </div>
      <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-4">
        <div className="h-4 w-40 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="h-4 w-full rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-4 w-full rounded bg-[#e5e7eb]" aria-hidden />
        </div>
      </div>
      <div>
        <div className="flex gap-1 border-b border-[#e5e7eb]">
          <div className="h-10 w-24 rounded-t bg-[#e5e7eb]" aria-hidden />
          <div className="h-10 w-20 rounded-t bg-[#e5e7eb]" aria-hidden />
        </div>
        <div className="mt-4 h-48 rounded-lg border border-[#e5e7eb] bg-white p-4">
          <div className="h-4 w-24 rounded bg-[#e5e7eb]" aria-hidden />
          <div className="mt-3 space-y-2">
            <div className="h-4 w-full rounded bg-[#e5e7eb]" aria-hidden />
            <div className="h-4 w-5/6 rounded bg-[#e5e7eb]" aria-hidden />
            <div className="h-4 w-4/5 rounded bg-[#e5e7eb]" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}

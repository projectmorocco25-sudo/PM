/**
 * Loading skeleton for Product edit form (Task 1.1.2.22)
 * Wireframe: task-0.5.2.9-product-create-edit-form.md — Loading state
 */

export default function ProductEditLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-pulse">
      <div className="h-5 w-56 rounded bg-[#e5e7eb]" aria-hidden />
      <div className="flex justify-between gap-4">
        <div className="h-9 w-40 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="flex gap-2">
          <div className="h-9 w-20 rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-9 w-24 rounded bg-[#e5e7eb]" aria-hidden />
        </div>
      </div>
      <div className="rounded-lg border border-[#e5e7eb] bg-white p-6">
        <div className="h-5 w-36 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="mt-4 space-y-4">
          <div className="h-10 w-full rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-10 w-full rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-10 w-full rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-24 w-full rounded bg-[#e5e7eb]" aria-hidden />
        </div>
      </div>
    </div>
  );
}

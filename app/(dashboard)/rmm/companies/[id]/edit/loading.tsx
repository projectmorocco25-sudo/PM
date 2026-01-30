/**
 * Loading skeleton for Company edit form (Task 1.1.2.19)
 * Wireframe: task-0.5.2.8-company-create-edit-form.md — Loading state
 */

export default function CompanyEditLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-pulse">
      <div className="h-5 w-64 rounded bg-[#e5e7eb]" aria-hidden />
      <div className="flex justify-between gap-4">
        <div className="h-9 w-40 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="flex gap-2">
          <div className="h-9 w-20 rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-9 w-24 rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-9 w-32 rounded bg-[#e5e7eb]" aria-hidden />
        </div>
      </div>
      <div className="rounded-lg border border-[#e5e7eb] bg-white p-6">
        <div className="h-5 w-32 rounded bg-[#e5e7eb] mb-4" aria-hidden />
        <div className="space-y-4">
          <div className="h-10 w-full rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-10 w-full rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-10 w-2/3 rounded bg-[#e5e7eb]" aria-hidden />
        </div>
      </div>
      <div className="rounded-lg border border-[#e5e7eb] bg-white p-6">
        <div className="h-5 w-40 rounded bg-[#e5e7eb] mb-4" aria-hidden />
        <div className="space-y-4">
          <div className="h-24 w-full rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-10 w-full rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-10 w-full rounded bg-[#e5e7eb]" aria-hidden />
        </div>
      </div>
    </div>
  );
}

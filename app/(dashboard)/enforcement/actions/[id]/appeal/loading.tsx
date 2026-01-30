/**
 * Loading skeleton for Appeal Submission page (Task 1.1.2.44)
 * Wireframe: task-0.5.2.1f-appeal-submission-form.md — Loading state
 */

export default function AppealSubmissionLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 rounded bg-[#e5e7eb]" aria-hidden />
      <div className="h-8 w-72 rounded bg-[#e5e7eb]" aria-hidden />
      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4">
        <div className="h-5 w-48 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="mt-3 space-y-2">
          <div className="h-4 w-full rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-4 w-4/5 rounded bg-[#e5e7eb]" aria-hidden />
        </div>
      </div>
      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4">
        <div className="h-5 w-32 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="mt-3 h-9 w-64 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="mt-3 h-5 w-40 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="mt-3 h-24 w-full rounded bg-[#e5e7eb]" aria-hidden />
      </div>
      <div className="flex justify-end gap-2">
        <div className="h-9 w-20 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="h-9 w-28 rounded bg-[#e5e7eb]" aria-hidden />
      </div>
    </div>
  );
}

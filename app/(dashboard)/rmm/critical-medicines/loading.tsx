/**
 * Loading skeleton for Critical Medicines list page (Task 1.1.2.30)
 * Wireframe: task-0.5.2.15-critical-medicines-list.md — Loading state
 */

export default function CriticalMedicinesListLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-5 w-48 rounded bg-[#e5e7eb]" aria-hidden />
      <div className="flex justify-between gap-4">
        <div className="h-9 w-72 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="h-9 w-24 rounded bg-[#e5e7eb]" aria-hidden />
      </div>
      <div className="h-10 w-full max-w-md rounded bg-[#e5e7eb]" aria-hidden />
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="h-80 w-full rounded-lg border border-[#e5e7eb] bg-white p-4 lg:w-[240px]">
          <div className="h-4 w-12 rounded bg-[#e5e7eb]" aria-hidden />
          <div className="mt-3 space-y-2">
            <div className="h-4 w-full rounded bg-[#e5e7eb]" aria-hidden />
            <div className="h-4 w-full rounded bg-[#e5e7eb]" aria-hidden />
            <div className="h-4 w-3/4 rounded bg-[#e5e7eb]" aria-hidden />
          </div>
        </div>
        <div className="min-w-0 flex-1 rounded-lg border border-[#e5e7eb] bg-white p-4">
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-[#e5e7eb]" aria-hidden />
            <div className="h-4 w-full rounded bg-[#e5e7eb]" aria-hidden />
            <div className="h-4 w-full rounded bg-[#e5e7eb]" aria-hidden />
            <div className="h-4 w-5/6 rounded bg-[#e5e7eb]" aria-hidden />
            <div className="h-4 w-full rounded bg-[#e5e7eb]" aria-hidden />
            <div className="h-4 w-4/5 rounded bg-[#e5e7eb]" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}

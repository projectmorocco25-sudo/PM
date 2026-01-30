/**
 * Wireframe: task-0.5.2.3-company-detail.md — Loading state (skeleton).
 * Route: /rmm/companies/[id]
 */

export default function CompanyDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-64 rounded bg-[#e5e7eb]" />
      <div className="h-8 w-48 rounded bg-[#e5e7eb]" />
      <div className="h-48 rounded-lg bg-[#e5e7eb]" />
      <div className="flex gap-2 border-b border-[#e5e7eb]">
        <div className="h-10 w-24 rounded bg-[#e5e7eb]" />
        <div className="h-10 w-24 rounded bg-[#e5e7eb]" />
        <div className="h-10 w-24 rounded bg-[#e5e7eb]" />
      </div>
      <div className="h-64 rounded-lg bg-[#e5e7eb]" />
    </div>
  );
}

import { RmmPageBreadcrumbs } from "../RmmPageBreadcrumbs";

export default function SubmissionsLoading() {
  return (
    <div className="space-y-6">
      <RmmPageBreadcrumbs tail={["Submissions"]} />
      <div className="h-8 w-48 animate-pulse rounded bg-[#e5e7eb]" />
      <div className="h-24 w-full animate-pulse rounded-lg bg-[#e5e7eb]" />
      <div className="h-20 w-full animate-pulse rounded-lg bg-[#e5e7eb]" />
      <div className="h-64 w-full animate-pulse rounded-lg bg-[#e5e7eb]" />
    </div>
  );
}

import { RmmPageBreadcrumbs } from "../../RmmPageBreadcrumbs";

export default function SubmissionDetailLoading() {
  return (
    <div className="space-y-6">
      <RmmPageBreadcrumbs tail={[{ label: "Submissions", href: "/rmm/submissions" }, "Submission"]} />
      <div className="h-8 w-64 animate-pulse rounded bg-[#e5e7eb]" />
      <div className="h-32 w-full animate-pulse rounded-lg bg-[#e5e7eb]" />
      <div className="h-48 w-full animate-pulse rounded-lg bg-[#e5e7eb]" />
      <div className="h-40 w-full animate-pulse rounded-lg bg-[#e5e7eb]" />
    </div>
  );
}

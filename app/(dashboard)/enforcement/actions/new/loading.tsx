/**
 * Loading skeleton for Create Enforcement Action wizard (Task 1.1.2.40)
 * Wireframe: task-0.5.2.1b-create-enforcement-action-wizard.md — Loading state
 */

export default function CreateEnforcementActionWizardLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-pulse">
      <div className="h-8 w-64 rounded bg-[#e5e7eb]" aria-hidden />
      <div className="h-4 w-48 rounded bg-[#e5e7eb]" aria-hidden />
      <div className="h-64 rounded-lg border border-[#e5e7eb] bg-white p-4">
        <div className="h-4 w-24 rounded bg-[#e5e7eb]" aria-hidden />
        <div className="mt-3 space-y-2">
          <div className="h-10 w-full rounded bg-[#e5e7eb]" aria-hidden />
          <div className="h-10 w-full rounded bg-[#e5e7eb]" aria-hidden />
        </div>
      </div>
      <div className="flex justify-end">
        <div className="h-9 w-28 rounded bg-[#e5e7eb]" aria-hidden />
      </div>
    </div>
  );
}

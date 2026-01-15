"use client";

import { Spinner } from "@/components/feedback/Spinner";
import { ErrorState } from "@/components/feedback/ErrorState";
import { useModuleActive } from "@/hooks/useModuleActive";

export function ModuleGuard({
  moduleName,
  children,
}: {
  moduleName: string;
  children: React.ReactNode;
}) {
  const { data, isLoading, error } = useModuleActive(moduleName);

  if (isLoading) return <Spinner label="Checking module…" />;
  if (error) {
    return (
      <ErrorState
        title="Module check failed"
        message={error instanceof Error ? error.message : "Unknown error"}
      />
    );
  }

  if (!data) {
    return <ErrorState title="Module inactive" message={`${moduleName.toUpperCase()} is not active.`} />;
  }

  return <>{children}</>;
}


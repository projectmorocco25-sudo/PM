"use client";

import { Spinner } from "@/components/feedback/Spinner";
import { ErrorState } from "@/components/feedback/ErrorState";
import { useUserRole } from "@/hooks/useUserRole";

export function PermissionGuard({
  required,
  children,
  fallback,
}: {
  required: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { data, isLoading, error } = useUserRole();

  if (isLoading) return <Spinner label="Checking permissions…" />;
  if (error) {
    return (
      <ErrorState
        title="Permission check failed"
        message={error instanceof Error ? error.message : "Unknown error"}
      />
    );
  }

  const ok = data?.permissions?.includes(required) ?? false;
  if (!ok) {
    return fallback ?? <ErrorState title="Not permitted" message="You do not have permission for this action." />;
  }

  return <>{children}</>;
}


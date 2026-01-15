"use client";

import { Spinner } from "@/components/feedback/Spinner";
import { ErrorState } from "@/components/feedback/ErrorState";
import { useUserRole } from "@/hooks/useUserRole";

export function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const { data, isLoading, error } = useUserRole();

  if (isLoading) return <Spinner label="Checking access…" />;
  if (error) {
    return (
      <ErrorState
        title="Access check failed"
        message={error instanceof Error ? error.message : "Unknown error"}
      />
    );
  }

  if (!data?.role || !allowedRoles.includes(data.role)) {
    return <ErrorState title="Not authorized" message="You do not have access to this page." />;
  }

  return <>{children}</>;
}


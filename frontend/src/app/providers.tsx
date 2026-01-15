"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import { AppProvider } from "@/contexts/AppContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              // Don't retry auth/permission issues.
              if (typeof error === "object" && error && "code" in error) {
                const code = (error as { code?: string }).code;
                if (code === "PGRST301") return false; // PostgREST "JWT expired" / auth related
              }
              return failureCount < 2;
            },
            staleTime: 30_000,
          },
        },
      }),
  );
  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </AppProvider>
  );
}


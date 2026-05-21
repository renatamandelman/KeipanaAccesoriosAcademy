"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/lib/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: async ({ queryKey }) => {
          const res = await fetch(queryKey[0] as string);
          if (!res.ok) throw new Error("Error fetching");
          return res.json();
        },
        staleTime: 30_000,
      },
    },
  }));

  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}

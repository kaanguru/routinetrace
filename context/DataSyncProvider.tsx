import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Expose globally if needed for LegendState
export const queryClient = new QueryClient({
  defaultOptions: {
    // Handle server clock discrepancies in Expo projects
    queries: {
      staleTime: 1000 * 5, // 5s
      refetchOnWindowFocus: false, // ReactNative doesn't have windows
      retry: false, // Use global handlers instead
    },
  },
});

export function DataSyncProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

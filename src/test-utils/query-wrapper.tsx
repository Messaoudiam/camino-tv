import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Creates a QueryClient for testing with sensible defaults
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Wrapper component for testing with QueryClientProvider
 */
export function createQueryWrapper() {
  const queryClient = createTestQueryClient();
  return function QueryWrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

/**
 * Render helper that includes QueryClientProvider
 */
export function withQueryClient(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>;
}

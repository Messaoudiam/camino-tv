"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

/**
 * TanStack Query Provider
 *
 * Best practices appliquées :
 * - QueryClient créé dans useState pour éviter de le recréer à chaque render
 * - Configuration optimisée pour une app Next.js
 * - DevTools activés uniquement en développement
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Données considérées fraîches pendant 5 minutes
            staleTime: 5 * 60 * 1000,
            // Données gardées en cache pendant 30 minutes
            gcTime: 30 * 60 * 1000,
            // Retry 1 fois en cas d'erreur
            retry: 1,
            // Pas de refetch auto au focus (évite les requêtes inutiles)
            refetchOnWindowFocus: false,
            // Refetch si la connexion revient
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry 0 pour les mutations (plus prévisible)
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools uniquement en développement */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";

// === TYPES ===
interface Favorite {
  id: string;
  dealId: string;
  userId: string;
  createdAt: string;
}

interface FavoritesResponse {
  favorites: Favorite[];
}

// === API FUNCTIONS ===
async function fetchFavorites(): Promise<FavoritesResponse> {
  const response = await fetch("/api/favorites", {
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Non authentifié - retourner une liste vide
      return { favorites: [] };
    }
    throw new Error("Erreur lors du chargement des favoris");
  }

  return response.json();
}

async function addFavorite(dealId: string): Promise<Favorite> {
  const response = await fetch("/api/favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ dealId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erreur lors de l'ajout aux favoris");
  }

  return response.json();
}

async function removeFavorite(dealId: string): Promise<void> {
  const response = await fetch(`/api/favorites?dealId=${dealId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erreur lors de la suppression du favori");
  }
}

// === QUERY HOOKS ===

/**
 * Hook pour récupérer les favoris de l'utilisateur
 */
export function useFavoritesQuery(isAuthenticated: boolean) {
  return useQuery({
    queryKey: queryKeys.favorites.list(),
    queryFn: fetchFavorites,
    // Ne fetch que si l'utilisateur est authentifié
    enabled: isAuthenticated,
    // Les favoris changent souvent, on peut réduire le staleTime
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// === MUTATION HOOKS ===

/**
 * Hook pour ajouter un deal aux favoris
 * Avec optimistic update pour une UX fluide
 */
export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFavorite,
    // Optimistic update
    onMutate: async (dealId) => {
      // Cancel les queries en cours
      await queryClient.cancelQueries({
        queryKey: queryKeys.favorites.list(),
      });

      // Snapshot de l'état actuel
      const previousFavorites = queryClient.getQueryData<FavoritesResponse>(
        queryKeys.favorites.list()
      );

      // Optimistic update
      if (previousFavorites) {
        queryClient.setQueryData<FavoritesResponse>(
          queryKeys.favorites.list(),
          {
            favorites: [
              ...previousFavorites.favorites,
              {
                id: `temp-${dealId}`,
                dealId,
                userId: "",
                createdAt: new Date().toISOString(),
              },
            ],
          }
        );
      }

      return { previousFavorites };
    },
    onError: (_err, _dealId, context) => {
      // Rollback en cas d'erreur
      if (context?.previousFavorites) {
        queryClient.setQueryData(
          queryKeys.favorites.list(),
          context.previousFavorites
        );
      }
    },
    onSettled: () => {
      // Refetch pour s'assurer de la cohérence
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.list() });
    },
  });
}

/**
 * Hook pour retirer un deal des favoris
 * Avec optimistic update pour une UX fluide
 */
export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFavorite,
    // Optimistic update
    onMutate: async (dealId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.favorites.list(),
      });

      const previousFavorites = queryClient.getQueryData<FavoritesResponse>(
        queryKeys.favorites.list()
      );

      if (previousFavorites) {
        queryClient.setQueryData<FavoritesResponse>(
          queryKeys.favorites.list(),
          {
            favorites: previousFavorites.favorites.filter(
              (f) => f.dealId !== dealId
            ),
          }
        );
      }

      return { previousFavorites };
    },
    onError: (_err, _dealId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(
          queryKeys.favorites.list(),
          context.previousFavorites
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.list() });
    },
  });
}

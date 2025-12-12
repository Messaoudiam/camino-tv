"use client";

/**
 * Hook useFavorites - Refactoré avec TanStack Query
 *
 * Avantages :
 * - Cache partagé entre composants
 * - Optimistic updates pour une UX fluide
 * - Pas de re-fetch inutiles
 * - Gestion automatique du loading/error state
 */

import { useAuth } from "@/lib/auth-client";
import {
  useFavoritesQuery,
  useAddFavorite,
  useRemoveFavorite,
} from "@/lib/queries";

export function useFavorites() {
  const { isAuthenticated } = useAuth();

  // Query pour récupérer les favoris
  const {
    data: favoritesData,
    isLoading,
  } = useFavoritesQuery(isAuthenticated);

  // Mutations avec optimistic updates
  const addMutation = useAddFavorite();
  const removeMutation = useRemoveFavorite();

  // Les favoris sont déjà des objets Deal complets (retournés par l'API)
  const favoriteDeals = favoritesData?.favorites ?? [];

  // Extraire les IDs pour les vérifications rapides
  const favorites = favoriteDeals.map((deal) => deal.id);

  const addToFavorites = async (dealId: string) => {
    if (!isAuthenticated) {
      console.warn("User must be authenticated to add favorites");
      return;
    }
    addMutation.mutate(dealId);
  };

  const removeFromFavorites = async (dealId: string) => {
    if (!isAuthenticated) {
      console.warn("User must be authenticated to remove favorites");
      return;
    }
    removeMutation.mutate(dealId);
  };

  const toggleFavorite = async (dealId: string) => {
    if (favorites.includes(dealId)) {
      await removeFromFavorites(dealId);
    } else {
      await addToFavorites(dealId);
    }
  };

  const isFavorite = (dealId: string) => favorites.includes(dealId);

  return {
    favorites,
    favoriteDeals, // Les objets Deal complets
    isLoading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.length,
    isAuthenticated,
    // États de mutation pour l'UI
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}

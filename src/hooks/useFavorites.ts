'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-client';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Load favorites from API on mount
  useEffect(() => {
    const loadFavorites = async () => {
      if (!isAuthenticated) {
        setFavorites([]);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/favorites', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          const favoriteIds = data.favorites.map((fav: any) => fav.id);
          setFavorites(favoriteIds);
        } else {
          console.error('Error loading favorites:', response.statusText);
          setFavorites([]);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [isAuthenticated]);

  const addToFavorites = async (id: string) => {
    if (!isAuthenticated) {
      console.warn('User must be authenticated to add favorites');
      return;
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ dealId: id }),
      });

      if (response.ok) {
        setFavorites(prev => [...prev, id]);
      } else {
        const error = await response.json();
        console.error('Error adding favorite:', error);
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  const removeFromFavorites = async (id: string) => {
    if (!isAuthenticated) {
      console.warn('User must be authenticated to remove favorites');
      return;
    }

    try {
      const response = await fetch(`/api/favorites?dealId=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setFavorites(prev => prev.filter(fav => fav !== id));
      } else {
        const error = await response.json();
        console.error('Error removing favorite:', error);
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const toggleFavorite = async (id: string) => {
    if (favorites.includes(id)) {
      await removeFromFavorites(id);
    } else {
      await addToFavorites(id);
    }
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.length,
    isAuthenticated,
  };
}
/**
 * Query Keys Factory
 *
 * Best practice TanStack Query : Centraliser toutes les query keys
 * - Évite les erreurs de typo
 * - Facilite l'invalidation de cache
 * - Structure hiérarchique pour l'invalidation granulaire
 *
 * Usage:
 * - queryKeys.deals.all → ['deals']
 * - queryKeys.deals.list(filters) → ['deals', 'list', filters]
 * - queryKeys.deals.detail(id) → ['deals', 'detail', id]
 */

import { DealCategory, BlogCategory } from "@/types";

// Types pour les filtres
export interface DealsFilters {
  category?: DealCategory;
  limit?: number;
  offset?: number;
  all?: boolean; // Admin only - include inactive
}

export interface BlogFilters {
  category?: BlogCategory;
  limit?: number;
  offset?: number;
  featured?: boolean;
}

export interface CommentsFilters {
  blogPostId: string;
}

// Query Keys Factory
export const queryKeys = {
  // === DEALS ===
  deals: {
    all: ["deals"] as const,
    lists: () => [...queryKeys.deals.all, "list"] as const,
    list: (filters?: DealsFilters) =>
      [...queryKeys.deals.lists(), filters ?? {}] as const,
    details: () => [...queryKeys.deals.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.deals.details(), id] as const,
  },

  // === FAVORITES ===
  favorites: {
    all: ["favorites"] as const,
    list: () => [...queryKeys.favorites.all, "list"] as const,
  },

  // === BLOG ===
  blog: {
    all: ["blog"] as const,
    lists: () => [...queryKeys.blog.all, "list"] as const,
    list: (filters?: BlogFilters) =>
      [...queryKeys.blog.lists(), filters ?? {}] as const,
    details: () => [...queryKeys.blog.all, "detail"] as const,
    detail: (slug: string) => [...queryKeys.blog.details(), slug] as const,
  },

  // === COMMENTS ===
  comments: {
    all: ["comments"] as const,
    lists: () => [...queryKeys.comments.all, "list"] as const,
    list: (filters: CommentsFilters) =>
      [...queryKeys.comments.lists(), filters] as const,
  },

  // === USERS (Admin) ===
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: () => [...queryKeys.users.lists()] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // === VOTES ===
  votes: {
    all: ["votes"] as const,
    deal: (dealId: string) => [...queryKeys.votes.all, "deal", dealId] as const,
  },
} as const;

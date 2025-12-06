/**
 * TanStack Query Hooks - Index
 *
 * Point d'entrée unique pour tous les hooks de requêtes.
 * Import simplifié : import { useDeals, useBlogPosts } from "@/lib/queries";
 */

// Query Keys
export { queryKeys } from "./keys";
export type { DealsFilters, BlogFilters, CommentsFilters } from "./keys";

// Deals
export {
  useDeals,
  useDeal,
  useCreateDeal,
  useUpdateDeal,
  useDeleteDeal,
} from "./deals";

// Favorites
export {
  useFavoritesQuery,
  useAddFavorite,
  useRemoveFavorite,
} from "./favorites";

// Blog
export {
  useBlogPosts,
  useBlogPost,
  useBlogPostsAdmin,
  useCreateBlogPost,
  useUpdateBlogPost,
  useDeleteBlogPost,
} from "./blog";

// Comments
export { useComments, useCreateComment, useDeleteComment } from "./comments";

// Users (Admin)
export { useUsers, useUpdateUser, useDeleteUser } from "./users";

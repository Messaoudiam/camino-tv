"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys, BlogFilters } from "./keys";
import type { BlogPost, BlogCategory } from "@/types";

// === TYPES ===
interface BlogPostsResponse {
  posts: BlogPostDB[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// Type from database (before transformation)
interface BlogPostDB {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  authorId?: string;
  authorName: string;
  authorImage: string;
  authorRole: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
}

// === HELPER ===
function transformPost(dbPost: BlogPostDB): BlogPost {
  return {
    id: dbPost.id,
    title: dbPost.title,
    slug: dbPost.slug,
    excerpt: dbPost.excerpt,
    content: dbPost.content,
    imageUrl: dbPost.imageUrl,
    category: dbPost.category as BlogPost["category"],
    publishedAt: dbPost.publishedAt,
    readTime: dbPost.readTime,
    tags: dbPost.tags || [],
    isFeatured: dbPost.isFeatured,
    author: {
      id: dbPost.authorId || dbPost.id,
      name: dbPost.authorName,
      avatar: dbPost.authorImage,
      role: dbPost.authorRole,
    },
  };
}

// === API FUNCTIONS ===
async function fetchBlogPosts(
  filters?: BlogFilters
): Promise<{ posts: BlogPost[]; pagination: BlogPostsResponse["pagination"] }> {
  const params = new URLSearchParams();

  if (filters?.category) params.set("category", filters.category);
  if (filters?.limit) params.set("limit", filters.limit.toString());
  if (filters?.offset) params.set("offset", filters.offset.toString());
  if (filters?.featured) params.set("featured", "true");

  const url = `/api/blog${params.toString() ? `?${params.toString()}` : ""}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des articles");
  }

  const data: BlogPostsResponse = await response.json();

  return {
    posts: (data.posts || []).map(transformPost),
    pagination: data.pagination,
  };
}

async function fetchBlogPostBySlug(slug: string): Promise<BlogPost> {
  const response = await fetch(`/api/blog/${slug}`);

  if (!response.ok) {
    throw new Error("Article non trouvé");
  }

  const data: BlogPostDB = await response.json();
  return transformPost(data);
}

// === QUERY HOOKS ===

/**
 * Hook pour récupérer la liste des articles de blog
 * @param filters - Filtres optionnels (category, limit, offset, featured)
 */
export function useBlogPosts(filters?: BlogFilters) {
  return useQuery({
    queryKey: queryKeys.blog.list(filters),
    queryFn: () => fetchBlogPosts(filters),
  });
}

/**
 * Hook pour récupérer un article par son slug
 * @param slug - Slug de l'article
 */
export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: queryKeys.blog.detail(slug),
    queryFn: () => fetchBlogPostBySlug(slug),
    enabled: !!slug,
  });
}

// === ADMIN HOOKS ===

// Type pour les données brutes de la DB (admin)
interface BlogPostAdmin {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  authorId: string | null;
  authorName: string;
  authorImage: string;
  authorRole: string;
  publishedAt: string;
  readTime: number;
  views: number;
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateBlogPostData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: BlogCategory;
  authorName: string;
  authorImage: string;
  authorRole: string;
  publishedAt: string;
  readTime: number;
  tags?: string[];
  isFeatured?: boolean;
  isPublished?: boolean;
}

interface UpdateBlogPostData extends Partial<CreateBlogPostData> {
  id: string;
}

// API Functions for Admin
async function fetchBlogPostsAdmin(): Promise<BlogPostAdmin[]> {
  const response = await fetch("/api/blog?all=true");
  if (!response.ok) {
    throw new Error("Erreur lors du chargement des articles");
  }
  const data = await response.json();
  return data.posts || [];
}

async function createBlogPost(data: CreateBlogPostData): Promise<BlogPostAdmin> {
  const response = await fetch("/api/blog", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.details?.[0]?.message || "Erreur lors de la création");
  }
  return response.json();
}

async function updateBlogPost({ id, ...data }: UpdateBlogPostData): Promise<BlogPostAdmin> {
  const response = await fetch(`/api/blog/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.details?.[0]?.message || "Erreur lors de la modification");
  }
  return response.json();
}

async function deleteBlogPost(id: string): Promise<void> {
  const response = await fetch(`/api/blog/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erreur lors de la suppression");
  }
}

/**
 * Hook pour récupérer tous les articles (admin - inclut brouillons)
 */
export function useBlogPostsAdmin() {
  return useQuery({
    queryKey: [...queryKeys.blog.all, "admin"],
    queryFn: fetchBlogPostsAdmin,
  });
}

/**
 * Hook pour créer un article
 */
export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.all });
    },
  });
}

/**
 * Hook pour modifier un article
 */
export function useUpdateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.all });
    },
  });
}

/**
 * Hook pour supprimer un article
 */
export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.all });
    },
  });
}

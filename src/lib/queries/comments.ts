"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";

// === TYPES ===
interface CommentUser {
  id: string;
  name: string | null;
  image: string | null;
  role: "USER" | "ADMIN";
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: CommentUser;
}

interface CreateCommentData {
  content: string;
  blogPostId: string;
}

// === API FUNCTIONS ===
async function fetchComments(blogPostId: string): Promise<Comment[]> {
  const response = await fetch(`/api/comments?blogPostId=${blogPostId}`);

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des commentaires");
  }

  return response.json();
}

async function createComment(data: CreateCommentData): Promise<Comment> {
  const response = await fetch("/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erreur lors de l'ajout du commentaire");
  }

  return response.json();
}

async function deleteComment(commentId: string): Promise<void> {
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erreur lors de la suppression");
  }
}

// === QUERY HOOKS ===

/**
 * Hook pour récupérer les commentaires d'un article
 * @param blogPostId - ID de l'article
 */
export function useComments(blogPostId: string) {
  return useQuery({
    queryKey: queryKeys.comments.list({ blogPostId }),
    queryFn: () => fetchComments(blogPostId),
    enabled: !!blogPostId,
    // Les commentaires peuvent changer fréquemment
    staleTime: 30 * 1000, // 30 secondes
  });
}

// === MUTATION HOOKS ===

/**
 * Hook pour créer un commentaire
 * Avec optimistic update pour une UX fluide
 */
export function useCreateComment(blogPostId: string) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.comments.list({ blogPostId });

  return useMutation({
    mutationFn: createComment,
    // Optimistic update
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousComments = queryClient.getQueryData<Comment[]>(queryKey);

      // Note: On ne fait pas d'optimistic update ici car on n'a pas
      // les infos utilisateur. Le serveur répond rapidement.

      return { previousComments };
    },
    onError: (_err, _newComment, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(queryKey, context.previousComments);
      }
    },
    onSuccess: (newComment) => {
      // Ajoute le nouveau commentaire au début de la liste
      const previousComments = queryClient.getQueryData<Comment[]>(queryKey);
      if (previousComments) {
        queryClient.setQueryData(queryKey, [newComment, ...previousComments]);
      } else {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
}

/**
 * Hook pour supprimer un commentaire
 * Avec optimistic update pour une UX fluide
 */
export function useDeleteComment(blogPostId: string) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.comments.list({ blogPostId });

  return useMutation({
    mutationFn: deleteComment,
    // Optimistic update
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousComments = queryClient.getQueryData<Comment[]>(queryKey);

      if (previousComments) {
        queryClient.setQueryData(
          queryKey,
          previousComments.filter((c) => c.id !== commentId),
        );
      }

      return { previousComments };
    },
    onError: (_err, _commentId, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(queryKey, context.previousComments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";

// === TYPES ===
interface VoteResponse {
  temperature: number;
  userVote: 1 | -1 | null;
  message?: string;
}

// === API FUNCTIONS ===
async function fetchDealVote(dealId: string): Promise<VoteResponse> {
  const response = await fetch(`/api/deals/${dealId}/vote`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du vote");
  }

  return response.json();
}

async function voteDeal(dealId: string, value: 1 | -1): Promise<VoteResponse> {
  const response = await fetch(`/api/deals/${dealId}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ value }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erreur lors du vote");
  }

  return response.json();
}

async function removeVote(dealId: string): Promise<VoteResponse> {
  const response = await fetch(`/api/deals/${dealId}/vote`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erreur lors de la suppression du vote");
  }

  return response.json();
}

// === QUERY HOOKS ===

/**
 * Hook pour récupérer le vote d'un deal
 */
export function useDealVote(dealId: string) {
  return useQuery({
    queryKey: queryKeys.votes.deal(dealId),
    queryFn: () => fetchDealVote(dealId),
    staleTime: 30 * 1000, // 30 secondes
  });
}

// === MUTATION HOOKS ===

/**
 * Hook pour voter (hot ou cold)
 */
export function useVoteDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dealId, value }: { dealId: string; value: 1 | -1 }) =>
      voteDeal(dealId, value),
    onMutate: async ({ dealId, value }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.votes.deal(dealId),
      });

      // Snapshot previous value
      const previousVote = queryClient.getQueryData<VoteResponse>(
        queryKeys.votes.deal(dealId),
      );

      // Optimistic update
      if (previousVote) {
        // Si pas de vote précédent, delta = value (+1 ou -1)
        // Si vote existe et on change, delta = value * 2 (on annule l'ancien et on ajoute le nouveau)
        const delta = previousVote.userVote === null ? value : value * 2;

        queryClient.setQueryData<VoteResponse>(queryKeys.votes.deal(dealId), {
          temperature: previousVote.temperature + delta,
          userVote: value,
        });
      }

      return { previousVote };
    },
    onError: (_err, { dealId }, context) => {
      // Rollback on error
      if (context?.previousVote) {
        queryClient.setQueryData(
          queryKeys.votes.deal(dealId),
          context.previousVote,
        );
      }
    },
    onSettled: (_data, _error, { dealId }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: queryKeys.votes.deal(dealId),
      });
      // Also invalidate deals list to update temperatures
      queryClient.invalidateQueries({
        queryKey: queryKeys.deals.all,
      });
    },
  });
}

/**
 * Hook pour supprimer un vote
 */
export function useRemoveVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dealId: string) => removeVote(dealId),
    onMutate: async (dealId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.votes.deal(dealId),
      });

      const previousVote = queryClient.getQueryData<VoteResponse>(
        queryKeys.votes.deal(dealId),
      );

      if (previousVote && previousVote.userVote !== null) {
        queryClient.setQueryData<VoteResponse>(queryKeys.votes.deal(dealId), {
          temperature: previousVote.temperature - previousVote.userVote,
          userVote: null,
        });
      }

      return { previousVote };
    },
    onError: (_err, dealId, context) => {
      if (context?.previousVote) {
        queryClient.setQueryData(
          queryKeys.votes.deal(dealId),
          context.previousVote,
        );
      }
    },
    onSettled: (_data, _error, dealId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.votes.deal(dealId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.deals.all,
      });
    },
  });
}

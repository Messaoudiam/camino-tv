"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys, DealsFilters } from "./keys";
import type { Deal, DealCategory } from "@/types";

// === TYPES ===
interface DealsResponse {
  deals: Deal[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface CreateDealData {
  title: string;
  brand: string;
  originalPrice: number;
  currentPrice: number;
  discountPercentage: number;
  imageUrl: string;
  category: DealCategory;
  affiliateUrl: string;
  promoCode?: string;
  promoDescription?: string;
  isActive?: boolean;
  isNew?: boolean;
  isLimited?: boolean;
}

interface UpdateDealData extends Partial<CreateDealData> {
  id: string;
}

// === API FUNCTIONS ===
async function fetchDeals(filters?: DealsFilters): Promise<DealsResponse> {
  const params = new URLSearchParams();

  if (filters?.category) params.set("category", filters.category);
  if (filters?.limit) params.set("limit", filters.limit.toString());
  if (filters?.offset) params.set("offset", filters.offset.toString());
  if (filters?.all) params.set("all", "true");

  const url = `/api/deals${params.toString() ? `?${params.toString()}` : ""}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des deals");
  }

  return response.json();
}

async function fetchDealById(id: string): Promise<Deal> {
  const response = await fetch(`/api/deals/${id}`);

  if (!response.ok) {
    throw new Error("Deal non trouvé");
  }

  return response.json();
}

async function createDeal(data: CreateDealData): Promise<Deal> {
  const response = await fetch("/api/deals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erreur lors de la création");
  }

  return response.json();
}

async function updateDeal({ id, ...data }: UpdateDealData): Promise<Deal> {
  const response = await fetch(`/api/deals/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erreur lors de la modification");
  }

  return response.json();
}

async function deleteDeal(id: string): Promise<void> {
  const response = await fetch(`/api/deals/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erreur lors de la suppression");
  }
}

// === QUERY HOOKS ===

/**
 * Hook pour récupérer la liste des deals
 * @param filters - Filtres optionnels (category, limit, offset, all)
 */
export function useDeals(filters?: DealsFilters) {
  return useQuery({
    queryKey: queryKeys.deals.list(filters),
    queryFn: () => fetchDeals(filters),
  });
}

/**
 * Hook pour récupérer un deal par son ID
 * @param id - ID du deal
 */
export function useDeal(id: string) {
  return useQuery({
    queryKey: queryKeys.deals.detail(id),
    queryFn: () => fetchDealById(id),
    enabled: !!id,
  });
}

// === MUTATION HOOKS ===

/**
 * Hook pour créer un deal
 */
export function useCreateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDeal,
    onSuccess: () => {
      // Invalide toutes les listes de deals pour forcer un refresh
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.lists() });
    },
  });
}

/**
 * Hook pour modifier un deal
 */
export function useUpdateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDeal,
    onSuccess: (data) => {
      // Met à jour le cache du deal spécifique
      queryClient.setQueryData(queryKeys.deals.detail(data.id), data);
      // Invalide les listes pour refléter les changements
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.lists() });
    },
  });
}

/**
 * Hook pour supprimer un deal
 */
export function useDeleteDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDeal,
    onSuccess: () => {
      // Invalide toutes les queries deals
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.all });
    },
  });
}

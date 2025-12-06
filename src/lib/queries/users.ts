"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";

// === TYPES ===
interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
  _count: {
    favorites: number;
    sessions: number;
  };
}

interface UsersResponse {
  users: User[];
}

interface UpdateUserData {
  id: string;
  role?: "USER" | "ADMIN";
  name?: string;
}

// === API FUNCTIONS ===
async function fetchUsers(): Promise<User[]> {
  const response = await fetch("/api/users");
  if (!response.ok) {
    throw new Error("Erreur lors du chargement des utilisateurs");
  }
  const data: UsersResponse = await response.json();
  return data.users;
}

async function updateUser({ id, ...data }: UpdateUserData): Promise<User> {
  const response = await fetch(`/api/users/${id}`, {
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

async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erreur lors de la suppression");
  }
}

// === QUERY HOOKS ===

/**
 * Hook pour récupérer la liste des utilisateurs (admin)
 */
export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: fetchUsers,
  });
}

// === MUTATION HOOKS ===

/**
 * Hook pour modifier un utilisateur (rôle, etc.)
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

/**
 * Hook pour supprimer un utilisateur
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

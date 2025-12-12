"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// === TYPES ===
interface SubscribeResponse {
  message: string;
  requiresConfirmation?: boolean;
  subscriber?: {
    id: string;
    email: string;
    subscribedAt: string;
  };
}

interface UnsubscribeResponse {
  message: string;
}

interface NewsletterError {
  error: string;
}

interface EmailData {
  email: string;
}

// === API FUNCTIONS ===
async function subscribeToNewsletter(
  data: EmailData
): Promise<SubscribeResponse> {
  const response = await fetch("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      (result as NewsletterError).error ||
        "Erreur lors de l'inscription à la newsletter"
    );
  }

  return result;
}

async function unsubscribeFromNewsletter(
  data: EmailData
): Promise<UnsubscribeResponse> {
  const response = await fetch("/api/newsletter/unsubscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      (result as NewsletterError).error ||
        "Erreur lors de la désinscription de la newsletter"
    );
  }

  return result;
}

// === MUTATION HOOKS ===

/**
 * Hook pour s'inscrire à la newsletter
 */
export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: subscribeToNewsletter,
  });
}

/**
 * Hook pour se désinscrire de la newsletter
 */
export function useUnsubscribeNewsletter() {
  return useMutation({
    mutationFn: unsubscribeFromNewsletter,
  });
}

// === ADMIN TYPES ===
export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: "PENDING" | "ACTIVE" | "UNSUBSCRIBED";
  subscribedAt: string;
  updatedAt: string;
}

export interface NewsletterStats {
  total: number;
  pending: number;
  active: number;
  unsubscribed: number;
}

interface AdminNewsletterResponse {
  subscribers: NewsletterSubscriber[];
  stats: NewsletterStats;
}

// === ADMIN API FUNCTIONS ===
async function fetchNewsletterSubscribers(
  status?: "PENDING" | "ACTIVE" | "UNSUBSCRIBED"
): Promise<AdminNewsletterResponse> {
  const params = new URLSearchParams();
  if (status) params.set("status", status);

  const response = await fetch(`/api/admin/newsletter?${params.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erreur lors du chargement des abonnés");
  }

  return response.json();
}

async function deleteNewsletterSubscriber(email: string): Promise<void> {
  const response = await fetch("/api/admin/newsletter", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erreur lors de la suppression");
  }
}

// === ADMIN QUERY HOOKS ===

/**
 * Hook pour récupérer les abonnés newsletter (admin)
 */
export function useNewsletterSubscribers(status?: "PENDING" | "ACTIVE" | "UNSUBSCRIBED") {
  return useQuery({
    queryKey: ["newsletter", "subscribers", status],
    queryFn: () => fetchNewsletterSubscribers(status),
  });
}

/**
 * Hook pour supprimer un abonné (admin)
 */
export function useDeleteNewsletterSubscriber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNewsletterSubscriber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletter", "subscribers"] });
    },
  });
}

// === SEND NEWSLETTER ===
interface SendNewsletterData {
  subject: string;
  content: string;
}

interface SendNewsletterResponse {
  message: string;
  stats: {
    total: number;
    sent: number;
    failed: number;
  };
}

async function sendNewsletter(data: SendNewsletterData): Promise<SendNewsletterResponse> {
  const response = await fetch("/api/admin/newsletter/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Erreur lors de l'envoi de la newsletter");
  }

  return result;
}

/**
 * Hook pour envoyer une newsletter (admin)
 */
export function useSendNewsletter() {
  return useMutation({
    mutationFn: sendNewsletter,
  });
}

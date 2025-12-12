import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";

export type MessageReply = {
  id: string;
  content: string;
  messageId: string;
  adminId: string;
  createdAt: string;
  admin: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export type ContactMessage = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  status: "NEW" | "READ" | "REPLIED" | "ARCHIVED";
  userId: string | null;
  user?: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  replies: MessageReply[];
  createdAt: string;
  updatedAt: string;
};

export type ContactMessagesResponse = {
  messages: ContactMessage[];
  stats: {
    total: number;
    new: number;
    read: number;
    replied: number;
    archived: number;
  };
};

/**
 * Fetch contact messages
 */
async function fetchContactMessages(
  status?: string
): Promise<ContactMessagesResponse> {
  const params = new URLSearchParams();
  if (status && status !== "ALL") {
    params.set("status", status);
  }

  const response = await fetch(`/api/admin/messages?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des messages");
  }
  return response.json();
}

/**
 * Update message status
 */
async function updateMessageStatus(
  id: string,
  status: ContactMessage["status"]
): Promise<ContactMessage> {
  const response = await fetch(`/api/admin/messages/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la mise à jour du statut");
  }
  return response.json();
}

/**
 * Delete message
 */
async function deleteMessage(id: string): Promise<void> {
  const response = await fetch(`/api/admin/messages/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la suppression du message");
  }
}

// ============================================
// REACT QUERY HOOKS
// ============================================

export function useContactMessages(status?: string) {
  return useQuery({
    queryKey: [...queryKeys.messages.all, status],
    queryFn: () => fetchContactMessages(status),
  });
}

export function useUpdateMessageStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: ContactMessage["status"];
    }) => updateMessageStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.all });
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.all });
    },
  });
}

/**
 * Reply to a message
 */
async function replyToMessage(
  messageId: string,
  content: string
): Promise<MessageReply> {
  const response = await fetch(`/api/admin/messages/${messageId}/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error("Erreur lors de l'envoi de la réponse");
  }
  return response.json();
}

export function useReplyToMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, content }: { messageId: string; content: string }) =>
      replyToMessage(messageId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.all });
    },
  });
}

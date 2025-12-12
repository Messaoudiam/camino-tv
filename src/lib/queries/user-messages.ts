import { useQuery } from "@tanstack/react-query";
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

export type UserMessage = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  status: "NEW" | "READ" | "REPLIED" | "ARCHIVED";
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  replies: MessageReply[];
};

export type UserMessagesResponse = {
  messages: UserMessage[];
  stats: {
    total: number;
    unread: number;
  };
};

/**
 * Fetch user's own messages
 */
async function fetchUserMessages(): Promise<UserMessagesResponse> {
  const response = await fetch("/api/messages", {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des messages");
  }
  return response.json();
}

/**
 * Fetch a single message with conversation
 */
async function fetchUserMessage(id: string): Promise<UserMessage> {
  const response = await fetch(`/api/messages/${id}`, {
    credentials: "include",
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Message non trouvé");
    }
    throw new Error("Erreur lors de la récupération du message");
  }
  return response.json();
}

// ============================================
// REACT QUERY HOOKS
// ============================================

export function useUserMessages() {
  return useQuery({
    queryKey: queryKeys.userMessages.list(),
    queryFn: fetchUserMessages,
  });
}

export function useUserMessage(id: string) {
  return useQuery({
    queryKey: queryKeys.userMessages.detail(id),
    queryFn: () => fetchUserMessage(id),
    enabled: !!id,
  });
}

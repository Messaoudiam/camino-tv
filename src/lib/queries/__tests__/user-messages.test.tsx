/**
 * Tests for User Messages TanStack Query Hooks
 * useUserMessages, useUserMessage
 */

import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useUserMessages, useUserMessage } from "../user-messages";

// Mock global fetch
global.fetch = jest.fn();

// Create wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useUserMessages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMessagesResponse = {
    messages: [
      {
        id: "msg-1",
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@example.com",
        category: "general",
        subject: "Question",
        message: "Test message",
        status: "REPLIED",
        userId: "user-1",
        createdAt: "2025-01-15T10:00:00Z",
        updatedAt: "2025-01-15T10:00:00Z",
        replies: [
          {
            id: "reply-1",
            content: "Merci pour votre message",
            messageId: "msg-1",
            adminId: "admin-1",
            createdAt: "2025-01-16T10:00:00Z",
            admin: {
              id: "admin-1",
              name: "Admin",
              image: null,
            },
          },
        ],
      },
      {
        id: "msg-2",
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@example.com",
        category: "technical",
        subject: "Bug",
        message: "Found a bug",
        status: "NEW",
        userId: "user-1",
        createdAt: "2025-01-14T10:00:00Z",
        updatedAt: "2025-01-14T10:00:00Z",
        replies: [],
      },
    ],
    stats: {
      total: 2,
      unread: 1,
    },
  };

  it("fetches user messages successfully", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockMessagesResponse),
    });

    const { result } = renderHook(() => useUserMessages(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/messages", {
      credentials: "include",
    });
    expect(result.current.data?.messages).toHaveLength(2);
    expect(result.current.data?.stats.total).toBe(2);
  });

  it("returns stats with unread count", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockMessagesResponse),
    });

    const { result } = renderHook(() => useUserMessages(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.stats.unread).toBe(1);
  });

  it("handles fetch error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useUserMessages(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe(
      "Erreur lors de la récupération des messages"
    );
  });

  it("handles authentication error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const { result } = renderHook(() => useUserMessages(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it("returns empty messages array when no data", async () => {
    const emptyResponse = {
      messages: [],
      stats: {
        total: 0,
        unread: 0,
      },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(emptyResponse),
    });

    const { result } = renderHook(() => useUserMessages(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.messages).toEqual([]);
    expect(result.current.data?.stats.total).toBe(0);
  });
});

describe("useUserMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMessage = {
    id: "msg-1",
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean@example.com",
    category: "general",
    subject: "Question sur les deals",
    message: "Bonjour, j'ai une question...",
    status: "REPLIED",
    userId: "user-1",
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-16T10:00:00Z",
    replies: [
      {
        id: "reply-1",
        content: "Merci pour votre message",
        messageId: "msg-1",
        adminId: "admin-1",
        createdAt: "2025-01-16T10:00:00Z",
        admin: {
          id: "admin-1",
          name: "Admin User",
          image: null,
        },
      },
    ],
  };

  it("fetches single message successfully", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockMessage),
    });

    const { result } = renderHook(() => useUserMessage("msg-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/messages/msg-1", {
      credentials: "include",
    });
    expect(result.current.data?.id).toBe("msg-1");
    expect(result.current.data?.subject).toBe("Question sur les deals");
  });

  it("includes replies with admin info", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockMessage),
    });

    const { result } = renderHook(() => useUserMessage("msg-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.replies).toHaveLength(1);
    expect(result.current.data?.replies[0].admin.name).toBe("Admin User");
  });

  it("handles 404 error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => useUserMessage("nonexistent"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe("Message non trouvé");
  });

  it("handles server error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useUserMessage("msg-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe(
      "Erreur lors de la récupération du message"
    );
  });

  it("does not fetch when id is empty", async () => {
    const { result } = renderHook(() => useUserMessage(""), {
      wrapper: createWrapper(),
    });

    // Should remain in loading state as query is disabled
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns message without replies", async () => {
    const messageWithoutReplies = { ...mockMessage, replies: [] };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(messageWithoutReplies),
    });

    const { result } = renderHook(() => useUserMessage("msg-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.replies).toEqual([]);
  });
});

describe("Query Keys", () => {
  it("uses correct query key for user messages list", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          messages: [],
          stats: { total: 0, unread: 0 },
        }),
    });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    renderHook(() => useUserMessages(), { wrapper });

    await waitFor(() => {
      const queries = queryClient.getQueryCache().findAll();
      expect(queries.length).toBeGreaterThan(0);
      expect(queries[0].queryKey).toContain("userMessages");
    });
  });

  it("uses correct query key for single message", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: "msg-1",
          replies: [],
        }),
    });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    renderHook(() => useUserMessage("msg-1"), { wrapper });

    await waitFor(() => {
      const queries = queryClient.getQueryCache().findAll();
      expect(queries.some((q) => q.queryKey.includes("msg-1"))).toBe(true);
    });
  });
});

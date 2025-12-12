/**
 * Tests for Contact Messages TanStack Query Hooks
 * useContactMessages, useUpdateMessageStatus, useDeleteMessage
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import {
  useContactMessages,
  useUpdateMessageStatus,
  useDeleteMessage,
  useReplyToMessage,
} from "../messages";

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

describe("useContactMessages", () => {
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
        status: "NEW",
        createdAt: "2025-01-15T10:00:00Z",
        updatedAt: "2025-01-15T10:00:00Z",
      },
      {
        id: "msg-2",
        firstName: "Marie",
        lastName: "Martin",
        email: "marie@example.com",
        category: "partnership",
        subject: "Partenariat",
        message: "Proposition",
        status: "READ",
        createdAt: "2025-01-14T10:00:00Z",
        updatedAt: "2025-01-14T10:00:00Z",
      },
    ],
    stats: {
      total: 10,
      new: 3,
      read: 2,
      replied: 4,
      archived: 1,
    },
  };

  it("fetches all messages without status filter", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockMessagesResponse),
    });

    const { result } = renderHook(() => useContactMessages(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/admin/messages?");
    expect(result.current.data?.messages).toHaveLength(2);
    expect(result.current.data?.stats.total).toBe(10);
  });

  it("fetches messages with status filter", async () => {
    const newMessagesResponse = {
      messages: [mockMessagesResponse.messages[0]],
      stats: mockMessagesResponse.stats,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(newMessagesResponse),
    });

    const { result } = renderHook(() => useContactMessages("NEW"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/admin/messages?status=NEW");
    expect(result.current.data?.messages).toHaveLength(1);
  });

  it("handles fetch error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useContactMessages(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe(
      "Erreur lors de la récupération des messages"
    );
  });

  it("returns empty messages array when no data", async () => {
    const emptyResponse = {
      messages: [],
      stats: {
        total: 0,
        new: 0,
        read: 0,
        replied: 0,
        archived: 0,
      },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(emptyResponse),
    });

    const { result } = renderHook(() => useContactMessages(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.messages).toEqual([]);
    expect(result.current.data?.stats.total).toBe(0);
  });
});

describe("useUpdateMessageStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates message status successfully", async () => {
    const updatedMessage = {
      id: "msg-1",
      status: "READ",
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(updatedMessage),
    });

    const { result } = renderHook(() => useUpdateMessageStatus(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ id: "msg-1", status: "READ" });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/admin/messages/msg-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "READ" }),
    });
  });

  it("updates status to REPLIED", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: "msg-1", status: "REPLIED" }),
    });

    const { result } = renderHook(() => useUpdateMessageStatus(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ id: "msg-1", status: "REPLIED" });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/admin/messages/msg-1",
      expect.objectContaining({
        body: JSON.stringify({ status: "REPLIED" }),
      })
    );
  });

  it("updates status to ARCHIVED", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: "msg-1", status: "ARCHIVED" }),
    });

    const { result } = renderHook(() => useUpdateMessageStatus(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ id: "msg-1", status: "ARCHIVED" });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/admin/messages/msg-1",
      expect.objectContaining({
        body: JSON.stringify({ status: "ARCHIVED" }),
      })
    );
  });

  it("handles update error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useUpdateMessageStatus(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ id: "msg-1", status: "READ" });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe(
      "Erreur lors de la mise à jour du statut"
    );
  });
});

describe("useDeleteMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deletes message successfully", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Message supprimé" }),
    });

    const { result } = renderHook(() => useDeleteMessage(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate("msg-1");
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/admin/messages/msg-1", {
      method: "DELETE",
    });
  });

  it("handles delete error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useDeleteMessage(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate("msg-1");
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe(
      "Erreur lors de la suppression du message"
    );
  });

  it("deletes message with different id", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Message supprimé" }),
    });

    const { result } = renderHook(() => useDeleteMessage(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate("msg-special-123");
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/admin/messages/msg-special-123",
      { method: "DELETE" }
    );
  });
});

describe("useReplyToMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sends reply successfully", async () => {
    const mockReply = {
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
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockReply),
    });

    const { result } = renderHook(() => useReplyToMessage(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ messageId: "msg-1", content: "Merci pour votre message" });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/admin/messages/msg-1/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "Merci pour votre message" }),
    });
  });

  it("handles reply error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useReplyToMessage(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ messageId: "msg-1", content: "Test reply" });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe(
      "Erreur lors de l'envoi de la réponse"
    );
  });

  it("handles validation error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    const { result } = renderHook(() => useReplyToMessage(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ messageId: "msg-1", content: "" });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe("Query Keys", () => {
  it("uses correct query key for messages", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          messages: [],
          stats: { total: 0, new: 0, read: 0, replied: 0, archived: 0 },
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

    renderHook(() => useContactMessages(), { wrapper });

    await waitFor(() => {
      const queries = queryClient.getQueryCache().findAll();
      expect(queries.length).toBeGreaterThan(0);
      expect(queries[0].queryKey).toContain("messages");
    });
  });

  it("uses different query keys for different status filters", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          messages: [],
          stats: { total: 0, new: 0, read: 0, replied: 0, archived: 0 },
        }),
    });

    // Render with NEW status
    const { unmount } = renderHook(() => useContactMessages("NEW"), {
      wrapper,
    });

    await waitFor(() => {
      const queries = queryClient.getQueryCache().findAll();
      expect(queries.some((q) => q.queryKey.includes("NEW"))).toBe(true);
    });

    unmount();

    // Render with READ status
    renderHook(() => useContactMessages("READ"), { wrapper });

    await waitFor(() => {
      const queries = queryClient.getQueryCache().findAll();
      expect(queries.some((q) => q.queryKey.includes("READ"))).toBe(true);
    });
  });
});

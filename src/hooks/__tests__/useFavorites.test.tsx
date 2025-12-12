import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFavorites } from "../useFavorites";
import React from "react";

// Mock auth-client
const mockUseAuth = jest.fn();
jest.mock("@/lib/auth-client", () => ({
  useAuth: () => mockUseAuth(),
}));

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

describe("useFavorites", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: authenticated user
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { id: "test-user" },
    });
    // Default mock for initial fetch
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ favorites: [] }),
    });
  });

  it("loads favorites from API on mount", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          favorites: [{ id: "item1" }, { id: "item2" }],
        }),
    });

    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/favorites", {
      credentials: "include",
    });
    expect(result.current.favorites).toEqual(["item1", "item2"]);
    expect(result.current.favoritesCount).toBe(2);
  });

  it("adds item to favorites", async () => {
    // Initial load
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ favorites: [] }),
      })
      // Add favorite
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
      // Refetch after invalidation
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ favorites: [{ id: "item1" }] }),
      });

    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addToFavorites("item1");
    });

    await waitFor(() => {
      expect(result.current.favorites).toContain("item1");
    });
    expect(result.current.isFavorite("item1")).toBe(true);
  });

  it("removes item from favorites", async () => {
    // Initial load with items
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            favorites: [{ id: "item1" }, { id: "item2" }],
          }),
      })
      // Remove favorite
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
      // Refetch after invalidation
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ favorites: [{ id: "item2" }] }),
      });

    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.removeFromFavorites("item1");
    });

    await waitFor(() => {
      expect(result.current.favorites).not.toContain("item1");
    });
    expect(result.current.isFavorite("item1")).toBe(false);
  });

  it("toggles favorites correctly", async () => {
    // Initial load with item1
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            favorites: [{ id: "item1" }],
          }),
      })
      // Remove item1
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
      // Refetch after remove
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ favorites: [] }),
      })
      // Add item2
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
      // Refetch after add
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ favorites: [{ id: "item2" }] }),
      });

    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Remove existing favorite
    await act(async () => {
      await result.current.toggleFavorite("item1");
    });

    await waitFor(() => {
      expect(result.current.isFavorite("item1")).toBe(false);
    });

    // Add new favorite
    await act(async () => {
      await result.current.toggleFavorite("item2");
    });

    await waitFor(() => {
      expect(result.current.isFavorite("item2")).toBe(true);
    });
  });

  it("does not add favorites when not authenticated", async () => {
    // Mock useAuth to return not authenticated
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });

    // Not loading because query is disabled when not authenticated
    expect(result.current.isLoading).toBe(false);

    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    await act(async () => {
      await result.current.addToFavorites("item1");
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "User must be authenticated to add favorites",
    );
    expect(result.current.favorites).not.toContain("item1");

    consoleWarnSpy.mockRestore();
  });
});

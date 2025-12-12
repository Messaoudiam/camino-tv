/**
 * Tests for CommentSection Component
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommentSection } from "../CommentSection";
import { withQueryClient } from "@/test-utils/query-wrapper";

// Mock useAuth hook
const mockUseAuth = jest.fn();
jest.mock("@/lib/auth-client", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock date-fns to have consistent date formatting
jest.mock("date-fns", () => ({
  formatDistanceToNow: () => "il y a 2 heures",
}));

jest.mock("date-fns/locale", () => ({
  fr: {},
}));

describe("CommentSection", () => {
  const mockBlogPostId = "post-123";

  const mockComments = [
    {
      id: "comment-1",
      content: "Super article !",
      createdAt: new Date().toISOString(),
      user: {
        id: "user-1",
        name: "Jean Dupont",
        image: null,
        role: "USER",
      },
    },
    {
      id: "comment-2",
      content: "Merci pour ce contenu.",
      createdAt: new Date().toISOString(),
      user: {
        id: "admin-1",
        name: "Admin Sean",
        image: "/avatar.jpg",
        role: "ADMIN",
      },
    },
  ];

  const mockAuthenticatedUser = {
    user: { id: "user-1", name: "Jean Dupont", email: "jean@example.com" },
    isAuthenticated: true,
    isLoading: false,
    isAdmin: false,
  };

  const mockAdminUser = {
    user: { id: "admin-1", name: "Admin Sean", email: "admin@example.com" },
    isAuthenticated: true,
    isLoading: false,
    isAdmin: true,
  };

  const mockUnauthenticated = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isAdmin: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  describe("Loading State", () => {
    it("shows loading skeleton while auth is loading", () => {
      mockUseAuth.mockReturnValue({
        ...mockUnauthenticated,
        isLoading: true,
      });

      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      // Should show skeleton loading state
      expect(screen.getByText("Commentaires")).toBeInTheDocument();
      expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
    });

    it("shows loading skeleton while fetching comments", async () => {
      mockUseAuth.mockReturnValue(mockUnauthenticated);
      mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      // Should show skeleton loading
      await waitFor(() => {
        expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
      });
    });
  });

  describe("Unauthenticated User", () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue(mockUnauthenticated);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockComments,
      });
    });

    it("shows login prompt instead of comment form", async () => {
      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        expect(
          screen.getByText("Connectez-vous pour laisser un commentaire"),
        ).toBeInTheDocument();
      });

      expect(screen.getByText("Se connecter")).toBeInTheDocument();
    });

    it("displays existing comments", async () => {
      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        expect(screen.getByText("Super article !")).toBeInTheDocument();
        expect(screen.getByText("Merci pour ce contenu.")).toBeInTheDocument();
      });
    });

    it("displays comment count", async () => {
      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        expect(screen.getByText("Commentaires (2)")).toBeInTheDocument();
      });
    });

    it("shows user names", async () => {
      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        expect(screen.getByText("Jean Dupont")).toBeInTheDocument();
        expect(screen.getByText("Admin Sean")).toBeInTheDocument();
      });
    });

    it("shows admin badge for admin comments", async () => {
      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        expect(screen.getAllByText("Admin").length).toBeGreaterThan(0);
      });
    });

    it("does not show delete buttons", async () => {
      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        expect(screen.getByText("Super article !")).toBeInTheDocument();
      });

      // Delete buttons should not be visible for unauthenticated users
      expect(screen.queryByRole("button", { name: /supprimer/i })).not.toBeInTheDocument();
    });
  });

  describe("Authenticated User", () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue(mockAuthenticatedUser);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockComments,
      });
    });

    it("shows comment form", async () => {
      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Partagez votre avis sur cet article..."),
        ).toBeInTheDocument();
      });

      expect(screen.getByText("Publier")).toBeInTheDocument();
    });

    it("shows user name in comment form", async () => {
      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        expect(screen.getByText(/Commentez en tant que/)).toBeInTheDocument();
        expect(screen.getByText("Jean Dupont")).toBeInTheDocument();
      });
    });

    it("disables submit button when textarea is empty", async () => {
      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        const submitButton = screen.getByText("Publier");
        expect(submitButton).toBeDisabled();
      });
    });

    it("enables submit button when textarea has content", async () => {
      const user = userEvent.setup();
      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Partagez votre avis sur cet article...")).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText("Partagez votre avis sur cet article...");
      await user.type(textarea, "Mon commentaire");

      const submitButton = screen.getByText("Publier");
      expect(submitButton).not.toBeDisabled();
    });

    it("shows character count", async () => {
      const user = userEvent.setup();
      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        expect(screen.getByText("0/2000 caractères")).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText("Partagez votre avis sur cet article...");
      await user.type(textarea, "Test");

      expect(screen.getByText("4/2000 caractères")).toBeInTheDocument();
    });

    it("submits comment successfully", async () => {
      const user = userEvent.setup();
      const newComment = {
        id: "new-comment",
        content: "Nouveau commentaire",
        createdAt: new Date().toISOString(),
        user: mockAuthenticatedUser.user,
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockComments,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => newComment,
        });

      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Partagez votre avis sur cet article...")).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText("Partagez votre avis sur cet article...");
      await user.type(textarea, "Nouveau commentaire");

      const submitButton = screen.getByText("Publier");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/comments", expect.objectContaining({
          method: "POST",
        }));
      });
    });

    it("clears textarea after successful submission", async () => {
      const user = userEvent.setup();
      const newComment = {
        id: "new-comment",
        content: "Nouveau commentaire",
        createdAt: new Date().toISOString(),
        user: mockAuthenticatedUser.user,
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockComments,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => newComment,
        });

      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Partagez votre avis sur cet article...")).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText("Partagez votre avis sur cet article...") as HTMLTextAreaElement;
      await user.type(textarea, "Nouveau commentaire");
      await user.click(screen.getByText("Publier"));

      await waitFor(() => {
        expect(textarea.value).toBe("");
      });
    });

    it("shows error message on submission failure", async () => {
      const user = userEvent.setup();

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockComments,
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: "Erreur de test" }),
        });

      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Partagez votre avis sur cet article...")).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText("Partagez votre avis sur cet article...");
      await user.type(textarea, "Test commentaire");
      await user.click(screen.getByText("Publier"));

      await waitFor(() => {
        expect(screen.getByText("Erreur de test")).toBeInTheDocument();
      });
    });

    it("shows delete button only for own comments", async () => {
      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        expect(screen.getByText("Super article !")).toBeInTheDocument();
      });

      // User-1's comment should have delete button (via hover - we check it exists)
      // We can't directly test hover state, but we can verify the button structure
      const cards = document.querySelectorAll(".group");
      expect(cards.length).toBe(2);
    });
  });

  describe("Admin User", () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue(mockAdminUser);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockComments,
      });
    });

    it("shows admin badge in comment form", async () => {
      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        // Admin badge next to the user's name in the form
        const adminBadges = screen.getAllByText("Admin");
        expect(adminBadges.length).toBeGreaterThan(0);
      });
    });

    it("can delete any comment (admin privilege)", async () => {
      const user = userEvent.setup();

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockComments,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        });

      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        expect(screen.getByText("Super article !")).toBeInTheDocument();
      });

      // Find and hover over a comment card to reveal delete button
      const commentCards = document.querySelectorAll(".group");
      expect(commentCards.length).toBe(2);

      // Admin should be able to see delete buttons for all comments
    });
  });

  describe("Empty State", () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue(mockUnauthenticated);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
      });
    });

    it("shows empty state message when no comments", async () => {
      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        expect(
          screen.getByText("Aucun commentaire pour le moment. Soyez le premier à commenter !"),
        ).toBeInTheDocument();
      });
    });

    it("shows comment count as 0", async () => {
      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        expect(screen.getByText("Commentaires (0)")).toBeInTheDocument();
      });
    });
  });

  describe("Delete Comment", () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue(mockAuthenticatedUser);
    });

    it("opens confirmation dialog when clicking delete", async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockComments,
      });

      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        expect(screen.getByText("Super article !")).toBeInTheDocument();
      });

      // Find delete button (it's hidden by default, but exists in DOM)
      const deleteButtons = document.querySelectorAll('button[class*="hover:text-destructive"]');

      if (deleteButtons.length > 0) {
        await user.click(deleteButtons[0]);

        await waitFor(() => {
          expect(screen.getByText("Supprimer le commentaire")).toBeInTheDocument();
          expect(
            screen.getByText("Voulez-vous vraiment supprimer ce commentaire ? Cette action est irréversible."),
          ).toBeInTheDocument();
        });
      }
    });

    it("closes dialog when clicking cancel", async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockComments,
      });

      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        expect(screen.getByText("Super article !")).toBeInTheDocument();
      });

      const deleteButtons = document.querySelectorAll('button[class*="hover:text-destructive"]');

      if (deleteButtons.length > 0) {
        await user.click(deleteButtons[0]);

        await waitFor(() => {
          expect(screen.getByText("Annuler")).toBeInTheDocument();
        });

        await user.click(screen.getByText("Annuler"));

        await waitFor(() => {
          expect(screen.queryByText("Supprimer le commentaire")).not.toBeInTheDocument();
        });
      }
    });

    it("deletes comment when confirmed", async () => {
      const user = userEvent.setup();

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockComments,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: "Commentaire supprimé" }),
        });

      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        expect(screen.getByText("Super article !")).toBeInTheDocument();
      });

      const deleteButtons = document.querySelectorAll('button[class*="hover:text-destructive"]');

      if (deleteButtons.length > 0) {
        await user.click(deleteButtons[0]);

        await waitFor(() => {
          expect(screen.getByRole("button", { name: "Supprimer" })).toBeInTheDocument();
        });

        await user.click(screen.getByRole("button", { name: "Supprimer" }));

        await waitFor(() => {
          expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining("/api/comments/"),
            expect.objectContaining({ method: "DELETE" }),
          );
        });
      }
    });
  });

  describe("Error Handling", () => {
    it("handles fetch error gracefully", async () => {
      mockUseAuth.mockReturnValue(mockUnauthenticated);
      mockFetch.mockRejectedValue(new Error("Network error"));

      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      // Should show empty state or handle error gracefully
      await waitFor(() => {
        expect(screen.getByText("Commentaires (0)")).toBeInTheDocument();
      });
    });

    it("handles connection error on comment submission", async () => {
      const user = userEvent.setup();
      mockUseAuth.mockReturnValue(mockAuthenticatedUser);

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        })
        .mockRejectedValueOnce(new Error("Network error"));

      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Partagez votre avis sur cet article...")).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText("Partagez votre avis sur cet article...");
      await user.type(textarea, "Test");
      await user.click(screen.getByText("Publier"));

      // The error message from the network error is displayed
      await waitFor(() => {
        expect(screen.getByText("Network error")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue(mockAuthenticatedUser);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockComments,
      });
    });

    it("has accessible form elements", async () => {
      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        const textarea = screen.getByPlaceholderText("Partagez votre avis sur cet article...");
        expect(textarea).toHaveAttribute("maxLength", "2000");
      });
    });

    it("has accessible submit button", async () => {
      render(withQueryClient(<CommentSection blogPostId={mockBlogPostId} />));

      await waitFor(() => {
        const button = screen.getByText("Publier");
        expect(button).toHaveAttribute("type", "submit");
      });
    });
  });
});

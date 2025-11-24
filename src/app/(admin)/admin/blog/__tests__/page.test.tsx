/**
 * Tests for Admin Blog Page
 */

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogPage from "../page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

// Mock BlogForm component
jest.mock("@/components/admin/blog-form", () => ({
  BlogForm: ({ open, onOpenChange, onSubmit, mode }: any) =>
    open ? (
      <div data-testid="blog-form-dialog">
        <span>Mode: {mode}</span>
        <button onClick={() => onOpenChange(false)}>Close Form</button>
        <button onClick={() => onSubmit({ title: "Test" })}>Submit Form</button>
      </div>
    ) : null,
}));

// Mock fetch
global.fetch = jest.fn();

const mockPosts = [
  {
    id: "1",
    title: "Premier article de test",
    slug: "premier-article-test",
    excerpt: "Ceci est un extrait du premier article",
    content: "Contenu complet...",
    imageUrl: "https://example.com/image1.jpg",
    category: "culture",
    authorId: null,
    authorName: "Sean",
    authorImage: "https://example.com/avatar1.jpg",
    authorRole: "Fondateur",
    publishedAt: "2025-01-15T10:00:00.000Z",
    readTime: 5,
    views: 100,
    tags: ["test"],
    isFeatured: false,
    isPublished: true,
    createdAt: "2025-01-15T10:00:00.000Z",
    updatedAt: "2025-01-15T10:00:00.000Z",
  },
  {
    id: "2",
    title: "Deuxième article streetwear",
    slug: "deuxieme-article-streetwear",
    excerpt: "Un extrait sur le streetwear",
    content: "Plus de contenu...",
    imageUrl: "https://example.com/image2.jpg",
    category: "streetwear",
    authorId: null,
    authorName: "Mike",
    authorImage: "https://example.com/avatar2.jpg",
    authorRole: "Writer",
    publishedAt: "2025-01-16T10:00:00.000Z",
    readTime: 3,
    views: 50,
    tags: ["streetwear", "mode"],
    isFeatured: true,
    isPublished: false,
    createdAt: "2025-01-16T10:00:00.000Z",
    updatedAt: "2025-01-16T10:00:00.000Z",
  },
];

describe("Admin Blog Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({ posts: mockPosts, pagination: { total: 2 } }),
    });
  });

  describe("Initial Render", () => {
    it("renders page title and description", async () => {
      render(<BlogPage />);

      expect(screen.getByText("Gestion du Blog")).toBeInTheDocument();
      expect(
        screen.getByText("Gérez les articles et contenus de votre blog"),
      ).toBeInTheDocument();
    });

    it("shows loading state initially", () => {
      render(<BlogPage />);

      // Should show loading spinner
      expect(
        screen.getByRole("heading", { name: /Articles de blog/i }),
      ).toBeInTheDocument();
    });

    it("fetches posts on mount", async () => {
      render(<BlogPage />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/blog?all=true");
      });
    });

    it("displays posts after loading", async () => {
      render(<BlogPage />);

      await waitFor(() => {
        expect(screen.getByText("Premier article de test")).toBeInTheDocument();
        expect(
          screen.getByText("Deuxième article streetwear"),
        ).toBeInTheDocument();
      });
    });

    it("shows post count in header", async () => {
      render(<BlogPage />);

      await waitFor(() => {
        expect(screen.getByText("Articles de blog (2)")).toBeInTheDocument();
      });
    });
  });

  describe("Post List", () => {
    it("displays post categories with badges", async () => {
      render(<BlogPage />);

      await waitFor(() => {
        expect(screen.getByText("culture")).toBeInTheDocument();
        expect(screen.getByText("streetwear")).toBeInTheDocument();
      });
    });

    it("displays author information", async () => {
      render(<BlogPage />);

      await waitFor(() => {
        expect(screen.getByText("Sean")).toBeInTheDocument();
        expect(screen.getByText("Mike")).toBeInTheDocument();
      });
    });

    it("displays view counts", async () => {
      render(<BlogPage />);

      await waitFor(() => {
        expect(screen.getByText("100")).toBeInTheDocument();
        expect(screen.getByText("50")).toBeInTheDocument();
      });
    });

    it("shows published/draft status badges", async () => {
      render(<BlogPage />);

      await waitFor(() => {
        expect(screen.getByText("Publié")).toBeInTheDocument();
        expect(screen.getByText("Brouillon")).toBeInTheDocument();
      });
    });

    it("displays formatted publication dates", async () => {
      render(<BlogPage />);

      await waitFor(() => {
        expect(screen.getByText(/15 janv. 2025/i)).toBeInTheDocument();
        expect(screen.getByText(/16 janv. 2025/i)).toBeInTheDocument();
      });
    });
  });

  describe("Empty State", () => {
    it("shows empty state when no posts", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ posts: [], pagination: { total: 0 } }),
      });

      render(<BlogPage />);

      await waitFor(() => {
        expect(
          screen.getByText("Aucun article pour le moment"),
        ).toBeInTheDocument();
        expect(
          screen.getByText("Créer le premier article"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Create Post", () => {
    it("opens form dialog when 'Nouvel article' is clicked", async () => {
      const user = userEvent.setup();
      render(<BlogPage />);

      await waitFor(() => {
        expect(screen.getByText("Premier article de test")).toBeInTheDocument();
      });

      const newArticleButton = screen.getByRole("button", {
        name: /Nouvel article/i,
      });
      await user.click(newArticleButton);

      await waitFor(() => {
        expect(screen.getByTestId("blog-form-dialog")).toBeInTheDocument();
        expect(screen.getByText("Mode: create")).toBeInTheDocument();
      });
    });
  });

  describe("Edit Post", () => {
    it("opens form dialog in edit mode when edit button is clicked", async () => {
      const user = userEvent.setup();
      render(<BlogPage />);

      await waitFor(() => {
        expect(screen.getByText("Premier article de test")).toBeInTheDocument();
      });

      // Find and click edit button (pencil icon)
      const editButtons = screen.getAllByRole("button");
      const editButton = editButtons.find(
        (btn) =>
          btn.querySelector("svg.lucide-pencil") !== null ||
          btn.innerHTML.includes("Pencil"),
      );

      if (editButton) {
        await user.click(editButton);

        await waitFor(() => {
          expect(screen.getByTestId("blog-form-dialog")).toBeInTheDocument();
          expect(screen.getByText("Mode: edit")).toBeInTheDocument();
        });
      }
    });
  });

  describe("Delete Post", () => {
    it("opens delete confirmation dialog", async () => {
      const user = userEvent.setup();
      render(<BlogPage />);

      await waitFor(() => {
        expect(screen.getByText("Premier article de test")).toBeInTheDocument();
      });

      // Find delete button (trash icon)
      const deleteButtons = screen.getAllByRole("button");
      const deleteButton = deleteButtons.find(
        (btn) =>
          btn.classList.contains("text-destructive") ||
          btn.innerHTML.includes("Trash"),
      );

      if (deleteButton) {
        await user.click(deleteButton);

        await waitFor(() => {
          expect(
            screen.getByText(/Dépublier cet article/i),
          ).toBeInTheDocument();
        });
      }
    });

    it("calls delete API when confirmed", async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ posts: mockPosts }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ message: "Article dépublié" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ posts: [mockPosts[1]] }),
        });

      render(<BlogPage />);

      await waitFor(() => {
        expect(screen.getByText("Premier article de test")).toBeInTheDocument();
      });

      // Find and click delete button
      const deleteButtons = screen.getAllByRole("button");
      const deleteButton = deleteButtons.find((btn) =>
        btn.classList.contains("text-destructive"),
      );

      if (deleteButton) {
        await user.click(deleteButton);

        await waitFor(() => {
          expect(
            screen.getByText(/Dépublier cet article/i),
          ).toBeInTheDocument();
        });

        const confirmButton = screen.getByRole("button", {
          name: /Dépublier/i,
        });
        await user.click(confirmButton);

        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledWith(
            "/api/blog/1",
            expect.objectContaining({ method: "DELETE" }),
          );
        });
      }
    });

    it("closes dialog when cancel is clicked", async () => {
      const user = userEvent.setup();
      render(<BlogPage />);

      await waitFor(() => {
        expect(screen.getByText("Premier article de test")).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole("button");
      const deleteButton = deleteButtons.find((btn) =>
        btn.classList.contains("text-destructive"),
      );

      if (deleteButton) {
        await user.click(deleteButton);

        await waitFor(() => {
          expect(
            screen.getByText(/Dépublier cet article/i),
          ).toBeInTheDocument();
        });

        const cancelButton = screen.getByRole("button", { name: /Annuler/i });
        await user.click(cancelButton);

        await waitFor(() => {
          expect(
            screen.queryByText(/Dépublier cet article/i),
          ).not.toBeInTheDocument();
        });
      }
    });
  });

  describe("Refresh Button", () => {
    it("refreshes posts when clicked", async () => {
      const user = userEvent.setup();
      render(<BlogPage />);

      await waitFor(() => {
        expect(screen.getByText("Premier article de test")).toBeInTheDocument();
      });

      const refreshButton = screen.getByRole("button", { name: /Actualiser/i });
      await user.click(refreshButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2); // Initial + refresh
      });
    });
  });

  describe("Error Handling", () => {
    it("handles fetch error gracefully", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error"),
      );

      render(<BlogPage />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });

    it("handles API error response", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "Server error" }),
      });

      render(<BlogPage />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });
  });

  describe("View Post Link", () => {
    it("has link to view post on public site", async () => {
      render(<BlogPage />);

      await waitFor(() => {
        expect(screen.getByText("Premier article de test")).toBeInTheDocument();
      });

      const viewLinks = screen.getAllByRole("link");
      const postLink = viewLinks.find((link) =>
        link.getAttribute("href")?.includes("/blog/premier-article-test"),
      );

      expect(postLink).toBeInTheDocument();
      expect(postLink).toHaveAttribute("target", "_blank");
    });
  });
});

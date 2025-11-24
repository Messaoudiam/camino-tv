/**
 * Tests for BlogForm Component
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BlogForm } from "../blog-form";

// Mock fetch for image upload
global.fetch = jest.fn();

describe("BlogForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
  });

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    onSubmit: mockOnSubmit,
    mode: "create" as const,
  };

  describe("Create Mode", () => {
    it("renders create form with empty fields", () => {
      render(<BlogForm {...defaultProps} />);

      expect(screen.getByText("Créer un nouvel article")).toBeInTheDocument();
      expect(screen.getByLabelText(/Titre de l'article/i)).toHaveValue("");
      expect(screen.getByLabelText(/Slug/i)).toHaveValue("");
    });

    it("auto-generates slug from title", async () => {
      const user = userEvent.setup();
      render(<BlogForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Titre de l'article/i);
      await user.type(titleInput, "Mon Super Article de Test");

      const slugInput = screen.getByLabelText(/Slug/i);
      await waitFor(() => {
        expect(slugInput).toHaveValue("mon-super-article-de-test");
      });
    });

    it("shows validation errors for empty required fields", async () => {
      const user = userEvent.setup();
      render(<BlogForm {...defaultProps} />);

      const submitButton = screen.getByRole("button", {
        name: /Créer l'article/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Le titre doit contenir au moins 10 caractères/i),
        ).toBeInTheDocument();
      });
    });

    it("shows validation error for short title", async () => {
      const user = userEvent.setup();
      render(<BlogForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Titre de l'article/i);
      await user.type(titleInput, "Court");

      const submitButton = screen.getByRole("button", {
        name: /Créer l'article/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Le titre doit contenir au moins 10 caractères/i),
        ).toBeInTheDocument();
      });
    });

    it("displays URL preview for slug", () => {
      render(<BlogForm {...defaultProps} />);

      expect(screen.getByText(/URL: \/blog\//i)).toBeInTheDocument();
    });

    it("renders category select", () => {
      render(<BlogForm {...defaultProps} />);

      // Verify the category select trigger exists
      const categoryTrigger = screen.getByRole("combobox");
      expect(categoryTrigger).toBeInTheDocument();
    });

    it("renders author information section", () => {
      render(<BlogForm {...defaultProps} />);

      expect(screen.getByText("Informations auteur")).toBeInTheDocument();
      expect(screen.getByLabelText(/Nom de l'auteur/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Rôle/i)).toBeInTheDocument();
    });

    it("renders checkboxes for featured and published", () => {
      render(<BlogForm {...defaultProps} />);

      expect(
        screen.getByLabelText(/Article mis en avant/i),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/Publié/i)).toBeInTheDocument();
    });

    it("has published checkbox checked by default", () => {
      render(<BlogForm {...defaultProps} />);

      const publishedCheckbox = screen.getByLabelText(/Publié/i);
      expect(publishedCheckbox).toBeChecked();
    });

    it("has featured checkbox unchecked by default", () => {
      render(<BlogForm {...defaultProps} />);

      const featuredCheckbox = screen.getByLabelText(/Article mis en avant/i);
      expect(featuredCheckbox).not.toBeChecked();
    });
  });

  describe("Edit Mode", () => {
    const initialData = {
      id: "test-id",
      title: "Article existant pour le test",
      slug: "article-existant-test",
      excerpt:
        "Un extrait suffisamment long pour passer la validation du formulaire de test",
      content:
        "Contenu complet de l'article qui doit être assez long pour passer la validation minimale requise...",
      imageUrl: "https://example.com/image.jpg",
      category: "culture",
      authorName: "Sean",
      authorImage: "https://example.com/avatar.jpg",
      authorRole: "Fondateur",
      publishedAt: "2025-01-15T10:00:00.000Z",
      readTime: 5,
      tags: ["test", "blog"],
      isFeatured: true,
      isPublished: true,
    };

    it("renders edit form with pre-filled data", () => {
      render(
        <BlogForm {...defaultProps} mode="edit" initialData={initialData} />,
      );

      expect(screen.getByText("Modifier l'article")).toBeInTheDocument();
      expect(screen.getByLabelText(/Titre de l'article/i)).toHaveValue(
        initialData.title,
      );
      expect(screen.getByLabelText(/Slug/i)).toHaveValue(initialData.slug);
    });

    it("shows image preview when imageUrl is provided", () => {
      render(
        <BlogForm {...defaultProps} mode="edit" initialData={initialData} />,
      );

      const image = screen.getAllByRole("img")[0];
      expect(image).toHaveAttribute("src", initialData.imageUrl);
    });

    it("does not auto-generate slug in edit mode", async () => {
      const user = userEvent.setup();
      render(
        <BlogForm {...defaultProps} mode="edit" initialData={initialData} />,
      );

      const titleInput = screen.getByLabelText(/Titre de l'article/i);
      await user.clear(titleInput);
      await user.type(titleInput, "Nouveau titre different");

      const slugInput = screen.getByLabelText(/Slug/i);
      // Slug should remain unchanged in edit mode
      expect(slugInput).toHaveValue(initialData.slug);
    });

    it("converts tags array to comma-separated string", () => {
      render(
        <BlogForm {...defaultProps} mode="edit" initialData={initialData} />,
      );

      const tagsInput = screen.getByLabelText(/Tags/i);
      expect(tagsInput).toHaveValue("test, blog");
    });

    it("shows featured checkbox as checked when isFeatured is true", () => {
      render(
        <BlogForm {...defaultProps} mode="edit" initialData={initialData} />,
      );

      const featuredCheckbox = screen.getByLabelText(/Article mis en avant/i);
      expect(featuredCheckbox).toBeChecked();
    });
  });

  describe("Form Actions", () => {
    it("calls onOpenChange when cancel button is clicked", async () => {
      const user = userEvent.setup();
      render(<BlogForm {...defaultProps} />);

      const cancelButton = screen.getByRole("button", { name: /Annuler/i });
      await user.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it("disables submit button while submitting", async () => {
      mockOnSubmit.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000)),
      );

      const user = userEvent.setup();

      const validData = {
        title: "Un titre suffisamment long pour le test",
        slug: "un-titre-test",
        excerpt:
          "Un extrait suffisamment long pour passer la validation du formulaire de test édition",
        content:
          "Contenu complet de l'article qui doit être assez long pour passer la validation minimale requise pour le test...",
        imageUrl: "https://example.com/image.jpg",
        category: "culture",
        authorName: "Sean",
        authorImage: "https://example.com/avatar.jpg",
        authorRole: "Fondateur",
        publishedAt: "2025-01-15T10:00:00.000Z",
        readTime: 5,
        tags: ["test"],
        isFeatured: false,
        isPublished: true,
      };

      render(
        <BlogForm {...defaultProps} mode="edit" initialData={validData} />,
      );

      const submitButton = screen.getByRole("button", {
        name: /Enregistrer les modifications/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe("Image Upload", () => {
    it("shows file input when no image is uploaded", () => {
      render(<BlogForm {...defaultProps} />);

      const fileInput = screen.getByLabelText(/Image principale/i);
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute("type", "file");
    });

    it("shows remove button when image is uploaded", () => {
      const initialData = {
        imageUrl: "https://example.com/image.jpg",
        title: "Test Article Title Long Enough",
        slug: "test-article",
        excerpt:
          "Test excerpt long enough for validation purposes in this test case",
        content:
          "Test content long enough for validation purposes in this test case for the blog form...",
        category: "culture",
        authorName: "Sean",
        authorImage: "https://example.com/avatar.jpg",
        authorRole: "Founder",
        publishedAt: "2025-01-15T10:00:00.000Z",
        readTime: 5,
      };

      render(
        <BlogForm {...defaultProps} mode="edit" initialData={initialData} />,
      );

      expect(
        screen.getByRole("button", { name: /Supprimer l'image/i }),
      ).toBeInTheDocument();
    });

    it("accepts correct image file types", () => {
      render(<BlogForm {...defaultProps} />);

      const fileInput = screen.getByLabelText(/Image principale/i);
      expect(fileInput).toHaveAttribute(
        "accept",
        "image/jpeg,image/jpg,image/png,image/webp",
      );
    });
  });

  describe("Tags Input", () => {
    it("renders tags input field", () => {
      render(<BlogForm {...defaultProps} />);

      const tagsInput = screen.getByLabelText(/Tags/i);
      expect(tagsInput).toBeInTheDocument();
      expect(tagsInput).toHaveAttribute(
        "placeholder",
        "sneakers, nike, tendances",
      );
    });
  });

  describe("Read Time Input", () => {
    it("renders read time input with default value", () => {
      render(<BlogForm {...defaultProps} />);

      const readTimeInput = screen.getByLabelText(/Temps de lecture/i);
      expect(readTimeInput).toHaveAttribute("type", "number");
      expect(readTimeInput).toHaveAttribute("min", "1");
      expect(readTimeInput).toHaveAttribute("max", "60");
    });
  });

  describe("Date Input", () => {
    it("renders datetime-local input for publication date", () => {
      render(<BlogForm {...defaultProps} />);

      const dateInput = screen.getByLabelText(/Date de publication/i);
      expect(dateInput).toHaveAttribute("type", "datetime-local");
    });
  });
});

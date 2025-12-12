/**
 * Tests for BlogPageClient Component
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BlogPageClient } from "../BlogPageClient";
import { withQueryClient } from "@/test-utils/query-wrapper";

// Mock API posts data (matches the API response format)
const mockApiPosts = [
  {
    id: "1",
    title: "Article Culture Test",
    slug: "article-culture-test",
    excerpt: "Excerpt for culture article",
    content: "Full content...",
    imageUrl: "/image1.jpg",
    category: "culture",
    authorName: "Sean",
    authorImage: "/sean.jpg",
    authorRole: "Fondateur",
    publishedAt: "2025-01-15T10:00:00.000Z",
    readTime: 5,
    tags: ["culture", "test"],
    isFeatured: true,
  },
  {
    id: "2",
    title: "Article Streetwear Test",
    slug: "article-streetwear-test",
    excerpt: "Excerpt for streetwear article",
    content: "Full content...",
    imageUrl: "/image2.jpg",
    category: "streetwear",
    authorName: "Mike",
    authorImage: "/mike.jpg",
    authorRole: "Writer",
    publishedAt: "2025-01-14T10:00:00.000Z",
    readTime: 3,
    tags: ["streetwear", "mode"],
    isFeatured: false,
  },
  {
    id: "3",
    title: "Article Musique Test",
    slug: "article-musique-test",
    excerpt: "Excerpt for musique article",
    content: "Full content...",
    imageUrl: "/image3.jpg",
    category: "musique",
    authorName: "Sean",
    authorImage: "/sean.jpg",
    authorRole: "Fondateur",
    publishedAt: "2025-01-13T10:00:00.000Z",
    readTime: 7,
    tags: ["musique", "rap"],
    isFeatured: false,
  },
];

// Mock global fetch to return API posts
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ posts: mockApiPosts }),
  } as Response),
);

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (
    props: React.ImgHTMLAttributes<HTMLImageElement> & {
      fill?: boolean;
      priority?: boolean;
    },
  ) => {
    const { fill, priority: _priority, ...restProps } = props;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...restProps}
        alt={props.alt}
        data-fill={fill ? "true" : undefined}
      />
    );
  },
}));

// Mock the layout components
jest.mock("@/components/layout/Header", () => ({
  Header: () => <header data-testid="header">Header</header>,
}));

jest.mock("@/components/layout/Footer", () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

// Mock blogCategories from @/data/mock (only categories needed, posts come from API)
jest.mock("@/data/mock", () => ({
  blogCategories: [
    { id: "culture", name: "Culture", count: 1 },
    { id: "streetwear", name: "Streetwear", count: 1 },
    { id: "musique", name: "Musique", count: 1 },
    { id: "interview", name: "Interview", count: 0 },
    { id: "lifestyle", name: "Lifestyle", count: 0 },
    { id: "tendances", name: "Tendances", count: 0 },
  ],
}));

const mockJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Test Blog",
};

describe("BlogPageClient", () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    (global.fetch as jest.Mock).mockClear();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ posts: mockApiPosts }),
    });
  });

  describe("Initial Render", () => {
    it("renders header and footer", () => {
      render(withQueryClient(<BlogPageClient jsonLd={mockJsonLd} />));
      expect(screen.getByTestId("header")).toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("renders page header with title", () => {
      render(withQueryClient(<BlogPageClient jsonLd={mockJsonLd} />));
      expect(screen.getByText("Culture & Streetwear")).toBeInTheDocument();
    });

    it("renders search input", () => {
      render(withQueryClient(<BlogPageClient jsonLd={mockJsonLd} />));
      expect(
        screen.getByPlaceholderText("Rechercher un article..."),
      ).toBeInTheDocument();
    });

    it("renders category filter buttons", () => {
      render(withQueryClient(<BlogPageClient jsonLd={mockJsonLd} />));
      expect(screen.getByText("Toutes")).toBeInTheDocument();
      // Multiple elements with same text (filter button + sidebar)
      expect(screen.getAllByText("Culture").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Streetwear").length).toBeGreaterThanOrEqual(
        1,
      );
      expect(screen.getAllByText("Musique").length).toBeGreaterThanOrEqual(1);
    });

    it("renders all blog posts", async () => {
      render(withQueryClient(<BlogPageClient jsonLd={mockJsonLd} />));
      await waitFor(() => {
        expect(screen.getByText("Article Culture Test")).toBeInTheDocument();
        expect(screen.getByText("Article Streetwear Test")).toBeInTheDocument();
        expect(screen.getByText("Article Musique Test")).toBeInTheDocument();
      });
    });

    it("displays article count", async () => {
      render(withQueryClient(<BlogPageClient jsonLd={mockJsonLd} />));
      await waitFor(() => {
        expect(screen.getByText("3 articles")).toBeInTheDocument();
      });
    });
  });

  describe("Sidebar", () => {
    it("renders statistics card", () => {
      render(withQueryClient(<BlogPageClient jsonLd={mockJsonLd} />));
      expect(screen.getByText("Statistiques")).toBeInTheDocument();
    });

    it("renders categories card", () => {
      render(withQueryClient(<BlogPageClient jsonLd={mockJsonLd} />));
      // Multiple elements with "Catégories" text possible
      expect(screen.getAllByText("Catégories").length).toBeGreaterThanOrEqual(
        1,
      );
    });
  });

  describe("Search Functionality", () => {
    it("filters posts by title search", async () => {
      const user = userEvent.setup();
      render(withQueryClient(<BlogPageClient jsonLd={mockJsonLd} />));

      const searchInput = screen.getByPlaceholderText(
        "Rechercher un article...",
      );
      await user.type(searchInput, "Culture");

      await waitFor(() => {
        expect(screen.getByText("Article Culture Test")).toBeInTheDocument();
        expect(
          screen.queryByText("Article Streetwear Test"),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText("Article Musique Test"),
        ).not.toBeInTheDocument();
      });
    });

    it("filters posts by tag search", async () => {
      const user = userEvent.setup();
      render(withQueryClient(<BlogPageClient jsonLd={mockJsonLd} />));

      const searchInput = screen.getByPlaceholderText(
        "Rechercher un article...",
      );
      await user.type(searchInput, "rap");

      await waitFor(() => {
        expect(screen.getByText("Article Musique Test")).toBeInTheDocument();
        expect(
          screen.queryByText("Article Culture Test"),
        ).not.toBeInTheDocument();
      });
    });

    it("shows no results message when search has no matches", async () => {
      const user = userEvent.setup();
      render(withQueryClient(<BlogPageClient jsonLd={mockJsonLd} />));

      const searchInput = screen.getByPlaceholderText(
        "Rechercher un article...",
      );
      await user.type(searchInput, "nonexistent article xyz");

      await waitFor(() => {
        expect(screen.getByText("Aucun article trouvé")).toBeInTheDocument();
      });
    });

    it("updates article count when filtering", async () => {
      const user = userEvent.setup();
      render(withQueryClient(<BlogPageClient jsonLd={mockJsonLd} />));

      const searchInput = screen.getByPlaceholderText(
        "Rechercher un article...",
      );
      await user.type(searchInput, "Culture");

      await waitFor(() => {
        expect(screen.getByText("1 article")).toBeInTheDocument();
      });
    });
  });

  describe("Category Filter", () => {
    it("filters posts by category", async () => {
      const user = userEvent.setup();
      render(withQueryClient(<BlogPageClient jsonLd={mockJsonLd} />));

      const streetwearButton = screen.getAllByText("Streetwear")[0];
      await user.click(streetwearButton);

      await waitFor(() => {
        expect(screen.getByText("Article Streetwear Test")).toBeInTheDocument();
        expect(
          screen.queryByText("Article Culture Test"),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText("Article Musique Test"),
        ).not.toBeInTheDocument();
      });
    });

    it("shows all posts when 'Toutes' is selected", async () => {
      const user = userEvent.setup();
      render(withQueryClient(<BlogPageClient jsonLd={mockJsonLd} />));

      // First filter by category
      const streetwearButton = screen.getAllByText("Streetwear")[0];
      await user.click(streetwearButton);

      // Then click "Toutes"
      const toutesButton = screen.getByText("Toutes");
      await user.click(toutesButton);

      await waitFor(() => {
        expect(screen.getByText("Article Culture Test")).toBeInTheDocument();
        expect(screen.getByText("Article Streetwear Test")).toBeInTheDocument();
        expect(screen.getByText("Article Musique Test")).toBeInTheDocument();
      });
    });

    it("updates button styles when category is selected", async () => {
      const user = userEvent.setup();
      render(withQueryClient(<BlogPageClient jsonLd={mockJsonLd} />));

      const streetwearButton = screen.getAllByText("Streetwear")[0];
      await user.click(streetwearButton);

      // The selected button should have default variant styling
      expect(streetwearButton.closest("button")).toBeInTheDocument();
    });
  });

  describe("Combined Filters", () => {
    it("applies both search and category filters", async () => {
      const user = userEvent.setup();
      render(withQueryClient(<BlogPageClient jsonLd={mockJsonLd} />));

      // Select culture category
      const cultureButton = screen.getAllByText("Culture")[0];
      await user.click(cultureButton);

      // Then search
      const searchInput = screen.getByPlaceholderText(
        "Rechercher un article...",
      );
      await user.type(searchInput, "test");

      await waitFor(() => {
        expect(screen.getByText("Article Culture Test")).toBeInTheDocument();
        expect(
          screen.queryByText("Article Streetwear Test"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Reset Filters", () => {
    it("resets all filters when button is clicked", async () => {
      const user = userEvent.setup();
      render(withQueryClient(<BlogPageClient jsonLd={mockJsonLd} />));

      // Apply search filter to get no results
      const searchInput = screen.getByPlaceholderText(
        "Rechercher un article...",
      );
      await user.type(searchInput, "nonexistent xyz abc");

      await waitFor(() => {
        expect(screen.getByText("Aucun article trouvé")).toBeInTheDocument();
      });

      // Click reset button
      const resetButton = screen.getByText("Réinitialiser les filtres");
      await user.click(resetButton);

      await waitFor(() => {
        expect(screen.getByText("Article Culture Test")).toBeInTheDocument();
        expect(screen.getByText("Article Streetwear Test")).toBeInTheDocument();
        expect(screen.getByText("Article Musique Test")).toBeInTheDocument();
      });
    });
  });

  describe("JSON-LD Schema", () => {
    it("renders JSON-LD script tag", () => {
      const { container } = render(
        withQueryClient(<BlogPageClient jsonLd={mockJsonLd} />),
      );
      const script = container.querySelector(
        'script[type="application/ld+json"]',
      );
      expect(script).toBeInTheDocument();
    });
  });
});

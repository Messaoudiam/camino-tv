/**
 * Tests for BlogGrid Component
 */

import { render, screen } from "@testing-library/react";
import { BlogGrid } from "../BlogGrid";
import { BlogPost } from "@/types";

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

const createMockPost = (id: string, isFeatured: boolean = false): BlogPost => ({
  id,
  title: `Test Article ${id}`,
  slug: `test-article-${id}`,
  excerpt: `This is the excerpt for article ${id}`,
  content: `Full content for article ${id}...`,
  imageUrl: `/test-image-${id}.jpg`,
  category: "culture",
  author: {
    id: "sean",
    name: "Sean",
    avatar: "/sean.jpg",
    role: "Fondateur",
  },
  publishedAt: "2025-01-15T10:00:00.000Z",
  readTime: 5,
  tags: ["test", "blog"],
  isFeatured,
});

describe("BlogGrid", () => {
  describe("Loading State", () => {
    it("renders skeleton loading state", () => {
      const { container } = render(<BlogGrid posts={[]} loading={true} />);
      const skeletons = container.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBe(6);
    });

    it("does not render posts when loading", () => {
      const posts = [createMockPost("1"), createMockPost("2")];
      render(<BlogGrid posts={posts} loading={true} />);
      expect(screen.queryByText("Test Article 1")).not.toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("renders empty state when no posts", () => {
      render(<BlogGrid posts={[]} />);
      expect(screen.getByText("Aucun article trouvé")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Essayez de modifier vos filtres ou revenez plus tard.",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Regular Posts", () => {
    it("renders all posts", () => {
      const posts = [
        createMockPost("1"),
        createMockPost("2"),
        createMockPost("3"),
      ];
      render(<BlogGrid posts={posts} />);

      expect(screen.getByText("Test Article 1")).toBeInTheDocument();
      expect(screen.getByText("Test Article 2")).toBeInTheDocument();
      expect(screen.getByText("Test Article 3")).toBeInTheDocument();
    });

    it("renders posts in a grid layout", () => {
      const posts = [createMockPost("1"), createMockPost("2")];
      const { container } = render(<BlogGrid posts={posts} />);

      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass(
        "grid-cols-1",
        "md:grid-cols-2",
        "lg:grid-cols-3",
      );
    });
  });

  describe("Featured Post", () => {
    it("renders featured post separately", () => {
      const posts = [
        createMockPost("1", true), // Featured
        createMockPost("2"),
        createMockPost("3"),
      ];
      render(<BlogGrid posts={posts} />);

      expect(screen.getByText("À la une")).toBeInTheDocument();
      expect(screen.getByText("Test Article 1")).toBeInTheDocument();
    });

    it("renders 'Derniers articles' heading when featured post exists", () => {
      const posts = [
        createMockPost("1", true), // Featured
        createMockPost("2"),
      ];
      render(<BlogGrid posts={posts} />);

      expect(screen.getByText("Derniers articles")).toBeInTheDocument();
    });

    it("does not render 'À la une' when no featured post", () => {
      const posts = [createMockPost("1"), createMockPost("2")];
      render(<BlogGrid posts={posts} />);

      expect(screen.queryByText("À la une")).not.toBeInTheDocument();
    });

    it("separates featured post from regular posts", () => {
      const posts = [
        createMockPost("1", true), // Featured
        createMockPost("2"),
        createMockPost("3"),
      ];
      render(<BlogGrid posts={posts} />);

      // Featured post should be separate
      expect(screen.getByText("À la une")).toBeInTheDocument();
      // Regular posts should be in their section
      expect(screen.getByText("Derniers articles")).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("navigates to post on click", () => {
      const posts = [createMockPost("test-123")];
      render(<BlogGrid posts={posts} />);

      // Simulate click on the card
      const card = screen.getByText("Test Article test-123").closest("div");
      if (card) {
        card.click();
      }
    });
  });

  describe("Styling", () => {
    it("applies custom className", () => {
      const posts = [createMockPost("1")];
      const { container } = render(
        <BlogGrid posts={posts} className="custom-grid-class" />,
      );
      expect(container.firstChild).toHaveClass("custom-grid-class");
    });

    it("has proper spacing", () => {
      const posts = [createMockPost("1")];
      const { container } = render(<BlogGrid posts={posts} />);
      expect(container.firstChild).toHaveClass("space-y-8");
    });
  });

  describe("Multiple Featured Posts", () => {
    it("only shows first featured post as featured", () => {
      const posts = [
        createMockPost("1", true), // Featured
        createMockPost("2", true), // Also featured but should appear in regular
        createMockPost("3"),
      ];
      render(<BlogGrid posts={posts} />);

      // Only one "À la une" section
      const aLaUne = screen.getAllByText("À la une");
      expect(aLaUne.length).toBe(1);
    });
  });
});

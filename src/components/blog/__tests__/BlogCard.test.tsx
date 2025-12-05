/**
 * Tests for BlogCard Component
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { BlogCard } from "../BlogCard";
import { BlogPost } from "@/types";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => {
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

const mockPost: BlogPost = {
  id: "1",
  title: "Test Article Title for Testing",
  slug: "test-article-title-testing",
  excerpt:
    "This is a test excerpt that is long enough to be displayed properly in the card component.",
  content: "Full article content...",
  imageUrl: "/test-image.jpg",
  category: "culture",
  author: {
    id: "sean",
    name: "Sean",
    avatar: "/sean.jpg",
    role: "Fondateur",
  },
  publishedAt: "2025-01-15T10:00:00.000Z",
  readTime: 5,
  tags: ["test", "blog", "article", "demo"],
  isFeature: false,
};

describe("BlogCard", () => {
  describe("Default Variant", () => {
    it("renders post title", () => {
      render(<BlogCard post={mockPost} />);
      expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    });

    it("renders post excerpt", () => {
      render(<BlogCard post={mockPost} />);
      expect(screen.getByText(mockPost.excerpt)).toBeInTheDocument();
    });

    it("renders post image", () => {
      render(<BlogCard post={mockPost} />);
      const image = screen.getByAltText(mockPost.title);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", mockPost.imageUrl);
    });

    it("renders read time", () => {
      render(<BlogCard post={mockPost} />);
      expect(screen.getByText(/5 min/)).toBeInTheDocument();
    });

    it("renders formatted date", () => {
      render(<BlogCard post={mockPost} />);
      // Date format: "15 janvier 2025"
      expect(screen.getByText(/15 janvier 2025/)).toBeInTheDocument();
    });

    it("renders tags (max 3)", () => {
      render(<BlogCard post={mockPost} />);
      expect(screen.getByText("#test")).toBeInTheDocument();
      expect(screen.getByText("#blog")).toBeInTheDocument();
      expect(screen.getByText("#article")).toBeInTheDocument();
      // 4th tag should show as "+1"
      expect(screen.getByText("+1")).toBeInTheDocument();
    });

    it("renders 'Lire' button", () => {
      render(<BlogCard post={mockPost} />);
      expect(screen.getByText("Lire")).toBeInTheDocument();
    });

    it("calls onClick when clicked", () => {
      const handleClick = jest.fn();
      render(<BlogCard post={mockPost} onClick={handleClick} />);

      const card = screen.getByText(mockPost.title).closest("div");
      if (card) {
        fireEvent.click(card);
        expect(handleClick).toHaveBeenCalled();
      }
    });
  });

  describe("Featured Variant", () => {
    it("renders larger image in featured variant", () => {
      render(<BlogCard post={mockPost} variant="featured" />);
      const image = screen.getByAltText(mockPost.title);
      expect(image).toBeInTheDocument();
    });

    it("renders title with larger text", () => {
      render(<BlogCard post={mockPost} variant="featured" />);
      const title = screen.getByText(mockPost.title);
      expect(title).toHaveClass("text-2xl");
    });

    it("renders full excerpt", () => {
      render(<BlogCard post={mockPost} variant="featured" />);
      expect(screen.getByText(mockPost.excerpt)).toBeInTheDocument();
    });

    it("renders date and read time", () => {
      render(<BlogCard post={mockPost} variant="featured" />);
      expect(screen.getByText(/15 janvier 2025/)).toBeInTheDocument();
      expect(screen.getByText(/5 min/)).toBeInTheDocument();
    });
  });

  describe("Compact Variant", () => {
    it("renders smaller image in compact variant", () => {
      render(<BlogCard post={mockPost} variant="compact" />);
      const image = screen.getByAltText(mockPost.title);
      expect(image).toBeInTheDocument();
    });

    it("renders title only (no excerpt in compact)", () => {
      render(<BlogCard post={mockPost} variant="compact" />);
      expect(screen.getByText(mockPost.title)).toBeInTheDocument();
      // Excerpt should not be rendered in compact
      expect(screen.queryByText(mockPost.excerpt)).not.toBeInTheDocument();
    });

    it("renders read time", () => {
      render(<BlogCard post={mockPost} variant="compact" />);
      expect(screen.getByText(/5 min/)).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles post with no tags", () => {
      const postWithNoTags = { ...mockPost, tags: [] };
      render(<BlogCard post={postWithNoTags} />);
      expect(screen.getByText(mockPost.title)).toBeInTheDocument();
      // No tags should be displayed
      expect(screen.queryByText(/#/)).not.toBeInTheDocument();
    });

    it("handles post with exactly 3 tags", () => {
      const postWith3Tags = { ...mockPost, tags: ["one", "two", "three"] };
      render(<BlogCard post={postWith3Tags} />);
      expect(screen.getByText("#one")).toBeInTheDocument();
      expect(screen.getByText("#two")).toBeInTheDocument();
      expect(screen.getByText("#three")).toBeInTheDocument();
      // No "+X" should appear
      expect(screen.queryByText(/\+\d/)).not.toBeInTheDocument();
    });

    it("handles post with 1 tag", () => {
      const postWith1Tag = { ...mockPost, tags: ["single"] };
      render(<BlogCard post={postWith1Tag} />);
      expect(screen.getByText("#single")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <BlogCard post={mockPost} className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });
  });
});

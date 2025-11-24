/**
 * Tests for BlogInteractions Component
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BlogInteractions } from "../BlogInteractions";
import { BlogPost } from "@/types";

// Mock clipboard API
const mockWriteText = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

const mockPost: BlogPost = {
  id: "1",
  title: "Test Article Title",
  slug: "test-article-title",
  excerpt: "Test excerpt",
  content: "Test content",
  imageUrl: "/test.jpg",
  category: "culture",
  author: {
    id: "sean",
    name: "Sean",
    avatar: "/sean.jpg",
    role: "Fondateur",
  },
  publishedAt: "2025-01-15T10:00:00.000Z",
  readTime: 5,
  tags: ["test"],
  isFeature: false,
};

describe("BlogInteractions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWriteText.mockResolvedValue(undefined);
  });

  describe("Initial Render", () => {
    it("renders share button", () => {
      render(<BlogInteractions post={mockPost} />);
      expect(
        screen.getByRole("button", { name: /partager/i }),
      ).toBeInTheDocument();
    });

    it("does not show share menu initially", () => {
      render(<BlogInteractions post={mockPost} />);
      expect(screen.queryByText("Twitter")).not.toBeInTheDocument();
      expect(screen.queryByText("Facebook")).not.toBeInTheDocument();
    });
  });

  describe("Share Menu Toggle", () => {
    it("opens share menu when button is clicked", () => {
      render(<BlogInteractions post={mockPost} />);

      const shareButton = screen.getByRole("button", { name: /partager/i });
      fireEvent.click(shareButton);

      expect(screen.getByText("Twitter")).toBeInTheDocument();
      expect(screen.getByText("Facebook")).toBeInTheDocument();
      expect(screen.getByText("Copier le lien")).toBeInTheDocument();
    });

    it("closes share menu when button is clicked again", () => {
      render(<BlogInteractions post={mockPost} />);

      const shareButton = screen.getByRole("button", { name: /partager/i });

      // Open
      fireEvent.click(shareButton);
      expect(screen.getByText("Twitter")).toBeInTheDocument();

      // Close
      fireEvent.click(shareButton);
      expect(screen.queryByText("Twitter")).not.toBeInTheDocument();
    });
  });

  describe("Twitter Share Link", () => {
    it("has correct Twitter share URL", () => {
      render(<BlogInteractions post={mockPost} />);

      const shareButton = screen.getByRole("button", { name: /partager/i });
      fireEvent.click(shareButton);

      const twitterLink = screen.getByText("Twitter").closest("a");
      expect(twitterLink).toHaveAttribute(
        "href",
        expect.stringContaining("twitter.com/intent/tweet"),
      );
    });

    it("includes post title in Twitter URL", () => {
      render(<BlogInteractions post={mockPost} />);

      const shareButton = screen.getByRole("button", { name: /partager/i });
      fireEvent.click(shareButton);

      const twitterLink = screen.getByText("Twitter").closest("a");
      expect(twitterLink).toHaveAttribute(
        "href",
        expect.stringContaining(encodeURIComponent(mockPost.title)),
      );
    });

    it("includes via=CaminoTV in Twitter URL", () => {
      render(<BlogInteractions post={mockPost} />);

      const shareButton = screen.getByRole("button", { name: /partager/i });
      fireEvent.click(shareButton);

      const twitterLink = screen.getByText("Twitter").closest("a");
      expect(twitterLink).toHaveAttribute(
        "href",
        expect.stringContaining("via=CaminoTV"),
      );
    });

    it("opens Twitter link in new tab", () => {
      render(<BlogInteractions post={mockPost} />);

      const shareButton = screen.getByRole("button", { name: /partager/i });
      fireEvent.click(shareButton);

      const twitterLink = screen.getByText("Twitter").closest("a");
      expect(twitterLink).toHaveAttribute("target", "_blank");
      expect(twitterLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Facebook Share Link", () => {
    it("has correct Facebook share URL", () => {
      render(<BlogInteractions post={mockPost} />);

      const shareButton = screen.getByRole("button", { name: /partager/i });
      fireEvent.click(shareButton);

      const facebookLink = screen.getByText("Facebook").closest("a");
      expect(facebookLink).toHaveAttribute(
        "href",
        expect.stringContaining("facebook.com/sharer/sharer.php"),
      );
    });

    it("opens Facebook link in new tab", () => {
      render(<BlogInteractions post={mockPost} />);

      const shareButton = screen.getByRole("button", { name: /partager/i });
      fireEvent.click(shareButton);

      const facebookLink = screen.getByText("Facebook").closest("a");
      expect(facebookLink).toHaveAttribute("target", "_blank");
      expect(facebookLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Copy Link", () => {
    it("copies URL to clipboard when clicked", async () => {
      render(<BlogInteractions post={mockPost} />);

      const shareButton = screen.getByRole("button", { name: /partager/i });
      fireEvent.click(shareButton);

      const copyButton = screen.getByText("Copier le lien");
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalled();
      });
    });

    it("shows 'Copié!' after copying", async () => {
      render(<BlogInteractions post={mockPost} />);

      const shareButton = screen.getByRole("button", { name: /partager/i });
      fireEvent.click(shareButton);

      const copyButton = screen.getByText("Copier le lien");
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText("Copié!")).toBeInTheDocument();
      });
    });

    it("reverts to 'Copier le lien' after timeout", async () => {
      jest.useFakeTimers();
      render(<BlogInteractions post={mockPost} />);

      const shareButton = screen.getByRole("button", { name: /partager/i });
      fireEvent.click(shareButton);

      const copyButton = screen.getByText("Copier le lien");
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText("Copié!")).toBeInTheDocument();
      });

      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(screen.getByText("Copier le lien")).toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });

  describe("Menu Closes on Link Click", () => {
    it("closes menu when Twitter link is clicked", () => {
      render(<BlogInteractions post={mockPost} />);

      const shareButton = screen.getByRole("button", { name: /partager/i });
      fireEvent.click(shareButton);

      const twitterLink = screen.getByText("Twitter");
      fireEvent.click(twitterLink);

      expect(screen.queryByText("Facebook")).not.toBeInTheDocument();
    });

    it("closes menu when Facebook link is clicked", () => {
      render(<BlogInteractions post={mockPost} />);

      const shareButton = screen.getByRole("button", { name: /partager/i });
      fireEvent.click(shareButton);

      const facebookLink = screen.getByText("Facebook");
      fireEvent.click(facebookLink);

      expect(screen.queryByText("Twitter")).not.toBeInTheDocument();
    });
  });
});

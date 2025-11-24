/**
 * Tests for ShareButtons Component
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ShareButtons } from "../ShareButtons";
import { BlogPost } from "@/types";

// Mock window.open
const mockWindowOpen = jest.fn();
Object.defineProperty(window, "open", {
  value: mockWindowOpen,
  writable: true,
});

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

describe("ShareButtons", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWriteText.mockResolvedValue(undefined);
  });

  describe("Render", () => {
    it("renders Twitter share button", () => {
      render(<ShareButtons post={mockPost} />);
      expect(
        screen.getByRole("button", { name: /partager.*twitter/i }),
      ).toBeInTheDocument();
    });

    it("renders Facebook share button", () => {
      render(<ShareButtons post={mockPost} />);
      expect(
        screen.getByRole("button", { name: /partager.*facebook/i }),
      ).toBeInTheDocument();
    });

    it("renders copy link button", () => {
      render(<ShareButtons post={mockPost} />);
      expect(
        screen.getByRole("button", { name: /copier le lien/i }),
      ).toBeInTheDocument();
    });

    it("has proper accessibility attributes", () => {
      render(<ShareButtons post={mockPost} />);
      const shareGroup = screen.getByRole("group", {
        name: /boutons de partage/i,
      });
      expect(shareGroup).toBeInTheDocument();
    });
  });

  describe("Twitter Share", () => {
    it("opens Twitter share popup with correct URL", () => {
      render(<ShareButtons post={mockPost} />);

      const twitterButton = screen.getByRole("button", {
        name: /partager.*twitter/i,
      });
      fireEvent.click(twitterButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining("twitter.com/intent/tweet"),
        "_blank",
        "width=550,height=420",
      );
    });

    it("includes post title in Twitter share URL", () => {
      render(<ShareButtons post={mockPost} />);

      const twitterButton = screen.getByRole("button", {
        name: /partager.*twitter/i,
      });
      fireEvent.click(twitterButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent(mockPost.title)),
        expect.any(String),
        expect.any(String),
      );
    });

    it("includes via=CaminoTV in Twitter share URL", () => {
      render(<ShareButtons post={mockPost} />);

      const twitterButton = screen.getByRole("button", {
        name: /partager.*twitter/i,
      });
      fireEvent.click(twitterButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining("via=CaminoTV"),
        expect.any(String),
        expect.any(String),
      );
    });
  });

  describe("Facebook Share", () => {
    it("opens Facebook share popup with correct URL", () => {
      render(<ShareButtons post={mockPost} />);

      const facebookButton = screen.getByRole("button", {
        name: /partager.*facebook/i,
      });
      fireEvent.click(facebookButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining("facebook.com/sharer/sharer.php"),
        "_blank",
        "width=580,height=296",
      );
    });
  });

  describe("Copy Link", () => {
    it("copies URL to clipboard when clicked", async () => {
      render(<ShareButtons post={mockPost} />);

      const copyButton = screen.getByRole("button", {
        name: /copier le lien/i,
      });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalled();
      });
    });

    it("shows 'Copié!' after copying", async () => {
      render(<ShareButtons post={mockPost} />);

      const copyButton = screen.getByRole("button", {
        name: /copier le lien/i,
      });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText("Copié!")).toBeInTheDocument();
      });
    });

    it("reverts to 'Copier le lien' after timeout", async () => {
      jest.useFakeTimers();
      render(<ShareButtons post={mockPost} />);

      const copyButton = screen.getByRole("button", {
        name: /copier le lien/i,
      });
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
});

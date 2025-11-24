/**
 * @jest-environment node
 *
 * Tests for Single Blog Post API Routes
 * /api/blog/[id] - GET (single), PUT (update), DELETE (soft delete)
 */

import { NextRequest } from "next/server";
import { GET, PUT, DELETE } from "../route";

// Mock Prisma
const mockFindUnique = jest.fn();
const mockUpdate = jest.fn();

jest.mock("@/lib/db", () => ({
  prisma: {
    blogPost: {
      findUnique: (...args: any[]) => mockFindUnique(...args),
      update: (...args: any[]) => mockUpdate(...args),
    },
  },
}));

// Mock auth helpers
const mockRequireAdmin = jest.fn();
jest.mock("@/lib/auth-helpers", () => ({
  requireAdmin: (...args: any[]) => mockRequireAdmin(...args),
}));

const mockPost = {
  id: "test-id-123",
  title: "Test Article",
  slug: "test-article",
  excerpt: "This is a test excerpt for the article",
  content: "Full content of the test article...",
  imageUrl: "https://example.com/image.jpg",
  category: "culture",
  authorId: null,
  authorName: "Sean",
  authorImage: "https://example.com/avatar.jpg",
  authorRole: "Founder",
  publishedAt: new Date("2025-01-01"),
  readTime: 5,
  views: 100,
  tags: ["test"],
  isFeatured: false,
  isPublished: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("GET /api/blog/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a blog post by ID", async () => {
    mockFindUnique.mockResolvedValueOnce(mockPost);
    mockUpdate.mockResolvedValue({ ...mockPost, views: 101 });

    const request = new NextRequest(
      "http://localhost:3000/api/blog/test-id-123",
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "test-id-123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe("test-id-123");
    expect(data.title).toBe("Test Article");
  });

  it("returns a blog post by slug when ID not found", async () => {
    mockFindUnique
      .mockResolvedValueOnce(null) // First call by ID returns null
      .mockResolvedValueOnce(mockPost); // Second call by slug returns post
    mockUpdate.mockResolvedValue({ ...mockPost, views: 101 });

    const request = new NextRequest(
      "http://localhost:3000/api/blog/test-article",
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "test-article" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.slug).toBe("test-article");
  });

  it("returns 404 when post not found", async () => {
    mockFindUnique.mockResolvedValue(null);

    const request = new NextRequest(
      "http://localhost:3000/api/blog/non-existent",
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "non-existent" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Article non trouvé");
  });

  it("increments views counter", async () => {
    mockFindUnique.mockResolvedValueOnce(mockPost);
    mockUpdate.mockResolvedValue({ ...mockPost, views: 101 });

    const request = new NextRequest(
      "http://localhost:3000/api/blog/test-id-123",
    );
    await GET(request, { params: Promise.resolve({ id: "test-id-123" }) });

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "test-id-123" },
      data: { views: { increment: 1 } },
    });
  });

  it("returns 500 on database error", async () => {
    mockFindUnique.mockRejectedValue(new Error("Database error"));

    const request = new NextRequest(
      "http://localhost:3000/api/blog/test-id-123",
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "test-id-123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Erreur lors de la récupération de l'article");
  });
});

describe("PUT /api/blog/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates a blog post when admin authenticated", async () => {
    mockRequireAdmin.mockResolvedValue({
      session: { user: { role: "ADMIN" } },
    });
    mockFindUnique.mockResolvedValue(mockPost);
    mockUpdate.mockResolvedValue({ ...mockPost, title: "Updated Title" });

    const request = new NextRequest(
      "http://localhost:3000/api/blog/test-id-123",
      {
        method: "PUT",
        body: JSON.stringify({ title: "Updated Title" }),
        headers: { "Content-Type": "application/json" },
      },
    );

    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-id-123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.title).toBe("Updated Title");
    expect(mockUpdate).toHaveBeenCalled();
  });

  it("returns 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue({
      error: "Non authentifié",
      status: 401,
    });

    const request = new NextRequest(
      "http://localhost:3000/api/blog/test-id-123",
      {
        method: "PUT",
        body: JSON.stringify({ title: "Updated Title" }),
        headers: { "Content-Type": "application/json" },
      },
    );

    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-id-123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Non authentifié");
  });

  it("returns 404 when post not found", async () => {
    mockRequireAdmin.mockResolvedValue({
      session: { user: { role: "ADMIN" } },
    });
    mockFindUnique.mockResolvedValue(null);

    const request = new NextRequest(
      "http://localhost:3000/api/blog/non-existent",
      {
        method: "PUT",
        body: JSON.stringify({ title: "Updated Title" }),
        headers: { "Content-Type": "application/json" },
      },
    );

    const response = await PUT(request, {
      params: Promise.resolve({ id: "non-existent" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Article non trouvé");
  });

  it("returns 409 when changing to existing slug", async () => {
    mockRequireAdmin.mockResolvedValue({
      session: { user: { role: "ADMIN" } },
    });
    mockFindUnique
      .mockResolvedValueOnce(mockPost) // First call to check post exists
      .mockResolvedValueOnce({ id: "other-id", slug: "existing-slug" }); // Second call to check slug uniqueness

    const request = new NextRequest(
      "http://localhost:3000/api/blog/test-id-123",
      {
        method: "PUT",
        body: JSON.stringify({ slug: "existing-slug" }),
        headers: { "Content-Type": "application/json" },
      },
    );

    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-id-123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe("Un article avec ce slug existe déjà");
  });

  it("allows keeping same slug on update", async () => {
    mockRequireAdmin.mockResolvedValue({
      session: { user: { role: "ADMIN" } },
    });
    mockFindUnique.mockResolvedValue(mockPost);
    mockUpdate.mockResolvedValue(mockPost);

    const request = new NextRequest(
      "http://localhost:3000/api/blog/test-id-123",
      {
        method: "PUT",
        body: JSON.stringify({ slug: "test-article" }), // Same slug as existing
        headers: { "Content-Type": "application/json" },
      },
    );

    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-id-123" }),
    });

    expect(response.status).toBe(200);
  });

  it("returns 400 for invalid data", async () => {
    mockRequireAdmin.mockResolvedValue({
      session: { user: { role: "ADMIN" } },
    });
    mockFindUnique.mockResolvedValue(mockPost);

    const request = new NextRequest(
      "http://localhost:3000/api/blog/test-id-123",
      {
        method: "PUT",
        body: JSON.stringify({ title: "Too" }), // Title too short
        headers: { "Content-Type": "application/json" },
      },
    );

    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-id-123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Données invalides");
  });
});

describe("DELETE /api/blog/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("soft deletes a blog post when admin authenticated", async () => {
    mockRequireAdmin.mockResolvedValue({
      session: { user: { role: "ADMIN" } },
    });
    mockFindUnique.mockResolvedValue(mockPost);
    mockUpdate.mockResolvedValue({ ...mockPost, isPublished: false });

    const request = new NextRequest(
      "http://localhost:3000/api/blog/test-id-123",
      {
        method: "DELETE",
      },
    );

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-id-123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("Article dépublié avec succès");
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "test-id-123" },
      data: { isPublished: false },
    });
  });

  it("returns 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue({
      error: "Non authentifié",
      status: 401,
    });

    const request = new NextRequest(
      "http://localhost:3000/api/blog/test-id-123",
      {
        method: "DELETE",
      },
    );

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-id-123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Non authentifié");
  });

  it("returns 403 when not admin", async () => {
    mockRequireAdmin.mockResolvedValue({
      error: "Accès réservé aux administrateurs",
      status: 403,
    });

    const request = new NextRequest(
      "http://localhost:3000/api/blog/test-id-123",
      {
        method: "DELETE",
      },
    );

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-id-123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Accès réservé aux administrateurs");
  });

  it("returns 404 when post not found", async () => {
    mockRequireAdmin.mockResolvedValue({
      session: { user: { role: "ADMIN" } },
    });
    mockFindUnique.mockResolvedValue(null);

    const request = new NextRequest(
      "http://localhost:3000/api/blog/non-existent",
      {
        method: "DELETE",
      },
    );

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "non-existent" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Article non trouvé");
  });
});

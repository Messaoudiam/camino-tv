/**
 * @jest-environment node
 *
 * Tests for Blog API Routes
 * /api/blog - GET (list), POST (create)
 */

import { NextRequest } from "next/server";
import { GET, POST } from "../route";

// Mock Prisma
const mockFindMany = jest.fn();
const mockCount = jest.fn();
const mockCreate = jest.fn();
const mockFindUnique = jest.fn();

jest.mock("@/lib/db", () => ({
  prisma: {
    blogPost: {
      findMany: (...args: any[]) => mockFindMany(...args),
      count: (...args: any[]) => mockCount(...args),
      create: (...args: any[]) => mockCreate(...args),
      findUnique: (...args: any[]) => mockFindUnique(...args),
    },
  },
}));

// Mock auth helpers
const mockRequireAdmin = jest.fn();
jest.mock("@/lib/auth-helpers", () => ({
  requireAdmin: (...args: any[]) => mockRequireAdmin(...args),
}));

describe("GET /api/blog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPosts = [
    {
      id: "1",
      title: "Test Article 1",
      slug: "test-article-1",
      excerpt: "This is a test excerpt for article 1",
      content: "Full content here...",
      imageUrl: "https://example.com/image1.jpg",
      category: "culture",
      authorName: "Sean",
      authorImage: "https://example.com/avatar.jpg",
      authorRole: "Founder",
      publishedAt: new Date("2025-01-01"),
      readTime: 5,
      views: 100,
      tags: ["test", "article"],
      isFeatured: false,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "Test Article 2",
      slug: "test-article-2",
      excerpt: "This is a test excerpt for article 2",
      content: "More content...",
      imageUrl: "https://example.com/image2.jpg",
      category: "streetwear",
      authorName: "Mike",
      authorImage: "https://example.com/avatar2.jpg",
      authorRole: "Writer",
      publishedAt: new Date("2025-01-02"),
      readTime: 3,
      views: 50,
      tags: ["streetwear"],
      isFeatured: true,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it("returns all published blog posts", async () => {
    mockFindMany.mockResolvedValue(mockPosts);
    mockCount.mockResolvedValue(2);

    const request = new NextRequest("http://localhost:3000/api/blog");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts).toHaveLength(2);
    expect(data.pagination.total).toBe(2);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isPublished: true }),
        orderBy: { publishedAt: "desc" },
      }),
    );
  });

  it("filters by category", async () => {
    mockFindMany.mockResolvedValue([mockPosts[0]]);
    mockCount.mockResolvedValue(1);

    const request = new NextRequest(
      "http://localhost:3000/api/blog?category=culture",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts).toHaveLength(1);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ category: "culture" }),
      }),
    );
  });

  it("supports pagination with limit and offset", async () => {
    mockFindMany.mockResolvedValue([mockPosts[1]]);
    mockCount.mockResolvedValue(2);

    const request = new NextRequest(
      "http://localhost:3000/api/blog?limit=1&offset=1",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pagination.limit).toBe(1);
    expect(data.pagination.offset).toBe(1);
    expect(data.pagination.hasMore).toBe(false);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 1,
        skip: 1,
      }),
    );
  });

  it("filters featured posts", async () => {
    mockFindMany.mockResolvedValue([mockPosts[1]]);
    mockCount.mockResolvedValue(1);

    const request = new NextRequest(
      "http://localhost:3000/api/blog?featured=true",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts).toHaveLength(1);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isFeatured: true }),
      }),
    );
  });

  it("includes unpublished posts with all=true parameter when admin authenticated", async () => {
    // Mock admin authentication for all=true to work
    mockRequireAdmin.mockResolvedValue({
      session: { user: { id: "admin-1", role: "ADMIN" } },
      error: null,
    });
    mockFindMany.mockResolvedValue(mockPosts);
    mockCount.mockResolvedValue(2);

    const request = new NextRequest("http://localhost:3000/api/blog?all=true");
    await GET(request);

    // When all=true and admin authenticated, isPublished should not be in the where clause
    expect(mockFindMany).toHaveBeenCalled();
    const callArgs = mockFindMany.mock.calls[0][0];
    expect(callArgs.where).not.toHaveProperty("isPublished");
  });

  it("ignores all=true parameter when not admin authenticated", async () => {
    // Mock non-admin authentication
    mockRequireAdmin.mockResolvedValue({
      error: "Non autorisé",
      status: 403,
    });
    mockFindMany.mockResolvedValue(mockPosts);
    mockCount.mockResolvedValue(2);

    const request = new NextRequest("http://localhost:3000/api/blog?all=true");
    await GET(request);

    // When all=true but not admin, isPublished should still be in the where clause
    expect(mockFindMany).toHaveBeenCalled();
    const callArgs = mockFindMany.mock.calls[0][0];
    expect(callArgs.where).toHaveProperty("isPublished", true);
  });

  it("returns 500 on database error", async () => {
    mockFindMany.mockRejectedValue(new Error("Database error"));

    const request = new NextRequest("http://localhost:3000/api/blog");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Erreur lors de la récupération des articles");
  });
});

describe("POST /api/blog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validPostData = {
    title: "Un nouvel article de test pour le blog",
    slug: "un-nouvel-article-test",
    excerpt:
      "Ceci est un extrait de test suffisamment long pour passer la validation du formulaire",
    content:
      "Contenu complet de l'article qui doit être assez long pour passer la validation minimale de 100 caractères...",
    imageUrl: "https://example.com/image.jpg",
    category: "culture",
    authorName: "Sean",
    authorImage: "https://example.com/avatar.jpg",
    authorRole: "Fondateur",
    publishedAt: "2025-01-15T10:00:00.000Z",
    readTime: 5,
    tags: ["test", "blog"],
    isFeatured: false,
    isPublished: true,
  };

  it("creates a new blog post when admin authenticated", async () => {
    mockRequireAdmin.mockResolvedValue({
      session: { user: { role: "ADMIN" } },
    });
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: "new-id", ...validPostData });

    const request = new NextRequest("http://localhost:3000/api/blog", {
      method: "POST",
      body: JSON.stringify(validPostData),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.id).toBe("new-id");
    expect(mockCreate).toHaveBeenCalled();
  });

  it("returns 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValue({
      error: "Non authentifié",
      status: 401,
    });

    const request = new NextRequest("http://localhost:3000/api/blog", {
      method: "POST",
      body: JSON.stringify(validPostData),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Non authentifié");
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns 403 when not admin", async () => {
    mockRequireAdmin.mockResolvedValue({
      error: "Accès réservé aux administrateurs",
      status: 403,
    });

    const request = new NextRequest("http://localhost:3000/api/blog", {
      method: "POST",
      body: JSON.stringify(validPostData),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Accès réservé aux administrateurs");
  });

  it("returns 409 when slug already exists", async () => {
    mockRequireAdmin.mockResolvedValue({
      session: { user: { role: "ADMIN" } },
    });
    mockFindUnique.mockResolvedValue({
      id: "existing-id",
      slug: validPostData.slug,
    });

    const request = new NextRequest("http://localhost:3000/api/blog", {
      method: "POST",
      body: JSON.stringify(validPostData),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe("Un article avec ce slug existe déjà");
  });

  it("returns 400 for invalid data - title too short", async () => {
    mockRequireAdmin.mockResolvedValue({
      session: { user: { role: "ADMIN" } },
    });

    const invalidData = { ...validPostData, title: "Short" };

    const request = new NextRequest("http://localhost:3000/api/blog", {
      method: "POST",
      body: JSON.stringify(invalidData),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Données invalides");
  });

  it("returns 400 for invalid slug format", async () => {
    mockRequireAdmin.mockResolvedValue({
      session: { user: { role: "ADMIN" } },
    });

    const invalidData = { ...validPostData, slug: "Invalid Slug With Spaces" };

    const request = new NextRequest("http://localhost:3000/api/blog", {
      method: "POST",
      body: JSON.stringify(invalidData),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Données invalides");
  });

  it("returns 400 for invalid category", async () => {
    mockRequireAdmin.mockResolvedValue({
      session: { user: { role: "ADMIN" } },
    });

    const invalidData = { ...validPostData, category: "invalid-category" };

    const request = new NextRequest("http://localhost:3000/api/blog", {
      method: "POST",
      body: JSON.stringify(invalidData),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Données invalides");
  });
});

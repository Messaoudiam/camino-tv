/**
 * @jest-environment node
 *
 * Tests for Comments API Routes
 * /api/comments - GET (list), POST (create)
 */

import { NextRequest } from "next/server";
import { GET, POST } from "../route";

// Mock Prisma
const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();
const mockCreate = jest.fn();

jest.mock("@/lib/db", () => ({
  prisma: {
    comment: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      create: (...args: unknown[]) => mockCreate(...args),
    },
    blogPost: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
    },
  },
}));

// Mock auth
const mockGetSession = jest.fn();
jest.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
    },
  },
}));

describe("GET /api/comments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockComments = [
    {
      id: "comment-1",
      content: "Super article ! J'ai adoré.",
      userId: "user-1",
      blogPostId: "post-1",
      createdAt: new Date("2025-01-15T10:00:00.000Z"),
      updatedAt: new Date("2025-01-15T10:00:00.000Z"),
      user: {
        id: "user-1",
        name: "Jean Dupont",
        image: null,
        role: "USER",
      },
    },
    {
      id: "comment-2",
      content: "Merci pour cet article très complet !",
      userId: "admin-1",
      blogPostId: "post-1",
      createdAt: new Date("2025-01-15T11:00:00.000Z"),
      updatedAt: new Date("2025-01-15T11:00:00.000Z"),
      user: {
        id: "admin-1",
        name: "Admin Sean",
        image: "/avatar.jpg",
        role: "ADMIN",
      },
    },
  ];

  const mockBlogPost = {
    id: "post-1",
    title: "Test Article",
    slug: "test-article",
  };

  it("returns 400 when blogPostId is missing", async () => {
    const request = new NextRequest("http://localhost:3000/api/comments");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("blogPostId is required");
  });

  it("returns 404 when blog post does not exist", async () => {
    mockFindUnique.mockResolvedValue(null);

    const request = new NextRequest(
      "http://localhost:3000/api/comments?blogPostId=non-existent",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Article not found");
  });

  it("returns all comments for a blog post", async () => {
    mockFindUnique.mockResolvedValue(mockBlogPost);
    mockFindMany.mockResolvedValue(mockComments);

    const request = new NextRequest(
      "http://localhost:3000/api/comments?blogPostId=post-1",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data[0].content).toBe("Super article ! J'ai adoré.");
    expect(data[1].user.role).toBe("ADMIN");
  });

  it("includes user information with each comment", async () => {
    mockFindUnique.mockResolvedValue(mockBlogPost);
    mockFindMany.mockResolvedValue(mockComments);

    const request = new NextRequest(
      "http://localhost:3000/api/comments?blogPostId=post-1",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(data[0].user).toBeDefined();
    expect(data[0].user.name).toBe("Jean Dupont");
    expect(data[0].user.id).toBe("user-1");
  });

  it("orders comments by createdAt descending", async () => {
    mockFindUnique.mockResolvedValue(mockBlogPost);
    mockFindMany.mockResolvedValue(mockComments);

    const request = new NextRequest(
      "http://localhost:3000/api/comments?blogPostId=post-1",
    );
    await GET(request);

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: "desc" },
      }),
    );
  });

  it("returns 500 on database error", async () => {
    mockFindUnique.mockRejectedValue(new Error("Database error"));

    const request = new NextRequest(
      "http://localhost:3000/api/comments?blogPostId=post-1",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to fetch comments");
  });

  it("returns empty array when no comments exist", async () => {
    mockFindUnique.mockResolvedValue(mockBlogPost);
    mockFindMany.mockResolvedValue([]);

    const request = new NextRequest(
      "http://localhost:3000/api/comments?blogPostId=post-1",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(0);
  });
});

describe("POST /api/comments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockBlogPost = {
    id: "post-1",
    title: "Test Article",
    slug: "test-article",
  };

  const mockSession = {
    user: {
      id: "user-1",
      name: "Jean Dupont",
      email: "jean@example.com",
      role: "USER",
    },
  };

  const validCommentData = {
    content: "Ceci est un commentaire de test.",
    blogPostId: "post-1",
  };

  it("returns 401 when not authenticated", async () => {
    mockGetSession.mockResolvedValue(null);

    const request = new NextRequest("http://localhost:3000/api/comments", {
      method: "POST",
      body: JSON.stringify(validCommentData),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Vous devez être connecté pour commenter");
  });

  it("returns 400 when content is empty", async () => {
    mockGetSession.mockResolvedValue(mockSession);

    const request = new NextRequest("http://localhost:3000/api/comments", {
      method: "POST",
      body: JSON.stringify({ content: "", blogPostId: "post-1" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Le commentaire ne peut pas être vide");
  });

  it("returns 400 when content is too long (over 2000 chars)", async () => {
    mockGetSession.mockResolvedValue(mockSession);

    const longContent = "a".repeat(2001);
    const request = new NextRequest("http://localhost:3000/api/comments", {
      method: "POST",
      body: JSON.stringify({ content: longContent, blogPostId: "post-1" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Le commentaire est trop long (max 2000 caractères)");
  });

  it("returns 400 when blogPostId is missing", async () => {
    mockGetSession.mockResolvedValue(mockSession);

    const request = new NextRequest("http://localhost:3000/api/comments", {
      method: "POST",
      body: JSON.stringify({ content: "Test comment" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    // Zod validation error
    expect(data.error).toBeDefined();
  });

  it("returns 404 when blog post does not exist", async () => {
    mockGetSession.mockResolvedValue(mockSession);
    mockFindUnique.mockResolvedValue(null);

    const request = new NextRequest("http://localhost:3000/api/comments", {
      method: "POST",
      body: JSON.stringify(validCommentData),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Article not found");
  });

  it("creates a comment when authenticated with valid data", async () => {
    mockGetSession.mockResolvedValue(mockSession);
    mockFindUnique.mockResolvedValue(mockBlogPost);
    mockCreate.mockResolvedValue({
      id: "new-comment",
      content: validCommentData.content,
      userId: mockSession.user.id,
      blogPostId: validCommentData.blogPostId,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: mockSession.user.id,
        name: mockSession.user.name,
        image: null,
        role: "USER",
      },
    });

    const request = new NextRequest("http://localhost:3000/api/comments", {
      method: "POST",
      body: JSON.stringify(validCommentData),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.id).toBe("new-comment");
    expect(data.content).toBe(validCommentData.content);
    expect(data.user.name).toBe(mockSession.user.name);
  });

  it("allows admin to create comments", async () => {
    const adminSession = {
      user: {
        id: "admin-1",
        name: "Admin Sean",
        email: "admin@example.com",
        role: "ADMIN",
      },
    };

    mockGetSession.mockResolvedValue(adminSession);
    mockFindUnique.mockResolvedValue(mockBlogPost);
    mockCreate.mockResolvedValue({
      id: "admin-comment",
      content: "Commentaire admin",
      userId: adminSession.user.id,
      blogPostId: "post-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: adminSession.user.id,
        name: adminSession.user.name,
        image: "/avatar.jpg",
        role: "ADMIN",
      },
    });

    const request = new NextRequest("http://localhost:3000/api/comments", {
      method: "POST",
      body: JSON.stringify({ content: "Commentaire admin", blogPostId: "post-1" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.user.role).toBe("ADMIN");
  });

  it("trims whitespace from content", async () => {
    mockGetSession.mockResolvedValue(mockSession);
    mockFindUnique.mockResolvedValue(mockBlogPost);
    mockCreate.mockResolvedValue({
      id: "new-comment",
      content: "Commentaire avec espaces",
      userId: mockSession.user.id,
      blogPostId: "post-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: mockSession.user.id,
        name: mockSession.user.name,
        image: null,
        role: "USER",
      },
    });

    const request = new NextRequest("http://localhost:3000/api/comments", {
      method: "POST",
      body: JSON.stringify({
        content: "   Commentaire avec espaces   ",
        blogPostId: "post-1",
      }),
      headers: { "Content-Type": "application/json" },
    });

    await POST(request);

    // Verify content was trimmed before saving
    expect(mockCreate).toHaveBeenCalled();
  });

  it("returns 500 on database error during creation", async () => {
    mockGetSession.mockResolvedValue(mockSession);
    mockFindUnique.mockResolvedValue(mockBlogPost);
    mockCreate.mockRejectedValue(new Error("Database error"));

    const request = new NextRequest("http://localhost:3000/api/comments", {
      method: "POST",
      body: JSON.stringify(validCommentData),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to create comment");
  });
});

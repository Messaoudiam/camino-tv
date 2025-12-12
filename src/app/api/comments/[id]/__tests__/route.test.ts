/**
 * @jest-environment node
 *
 * Tests for Comments DELETE API Route
 * /api/comments/[id] - DELETE (delete comment)
 */

import { NextRequest } from "next/server";
import { DELETE } from "../route";

// Mock Prisma
const mockFindUnique = jest.fn();
const mockDelete = jest.fn();

jest.mock("@/lib/db", () => ({
  prisma: {
    comment: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      delete: (...args: unknown[]) => mockDelete(...args),
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

describe("DELETE /api/comments/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockComment = {
    id: "comment-1",
    content: "Test comment",
    userId: "user-1",
    blogPostId: "post-1",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserSession = {
    user: {
      id: "user-1",
      name: "Jean Dupont",
      email: "jean@example.com",
      role: "USER",
    },
  };

  const mockAdminSession = {
    user: {
      id: "admin-1",
      name: "Admin Sean",
      email: "admin@example.com",
      role: "ADMIN",
    },
  };

  const createRequest = (id: string) =>
    new NextRequest(`http://localhost:3000/api/comments/${id}`, {
      method: "DELETE",
    });

  const createParams = (id: string) => Promise.resolve({ id });

  it("returns 401 when not authenticated", async () => {
    mockGetSession.mockResolvedValue(null);

    const request = createRequest("comment-1");
    const response = await DELETE(request, {
      params: createParams("comment-1"),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe(
      "Vous devez être connecté pour supprimer un commentaire",
    );
  });

  it("returns 404 when comment does not exist", async () => {
    mockGetSession.mockResolvedValue(mockUserSession);
    mockFindUnique.mockResolvedValue(null);

    const request = createRequest("non-existent");
    const response = await DELETE(request, {
      params: createParams("non-existent"),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Commentaire non trouvé");
  });

  it("returns 403 when user is not owner and not admin", async () => {
    const otherUserSession = {
      user: {
        id: "other-user",
        name: "Other User",
        email: "other@example.com",
        role: "USER",
      },
    };

    mockGetSession.mockResolvedValue(otherUserSession);
    mockFindUnique.mockResolvedValue(mockComment);

    const request = createRequest("comment-1");
    const response = await DELETE(request, {
      params: createParams("comment-1"),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe(
      "Vous n'êtes pas autorisé à supprimer ce commentaire",
    );
  });

  it("allows owner to delete their own comment", async () => {
    mockGetSession.mockResolvedValue(mockUserSession);
    mockFindUnique.mockResolvedValue(mockComment);
    mockDelete.mockResolvedValue(mockComment);

    const request = createRequest("comment-1");
    const response = await DELETE(request, {
      params: createParams("comment-1"),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("Commentaire supprimé");
    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: "comment-1" },
    });
  });

  it("allows admin to delete any comment", async () => {
    mockGetSession.mockResolvedValue(mockAdminSession);
    mockFindUnique.mockResolvedValue(mockComment); // Comment owned by user-1
    mockDelete.mockResolvedValue(mockComment);

    const request = createRequest("comment-1");
    const response = await DELETE(request, {
      params: createParams("comment-1"),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("Commentaire supprimé");
    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: "comment-1" },
    });
  });

  it("returns 500 on database error during find", async () => {
    mockGetSession.mockResolvedValue(mockUserSession);
    mockFindUnique.mockRejectedValue(new Error("Database error"));

    const request = createRequest("comment-1");
    const response = await DELETE(request, {
      params: createParams("comment-1"),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to delete comment");
  });

  it("returns 500 on database error during delete", async () => {
    mockGetSession.mockResolvedValue(mockUserSession);
    mockFindUnique.mockResolvedValue(mockComment);
    mockDelete.mockRejectedValue(new Error("Database error"));

    const request = createRequest("comment-1");
    const response = await DELETE(request, {
      params: createParams("comment-1"),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to delete comment");
  });

  it("verifies comment ownership by userId", async () => {
    mockGetSession.mockResolvedValue(mockUserSession);
    mockFindUnique.mockResolvedValue(mockComment);
    mockDelete.mockResolvedValue(mockComment);

    const request = createRequest("comment-1");
    await DELETE(request, { params: createParams("comment-1") });

    // Verify the correct comment was looked up
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "comment-1" },
    });
  });

  it("handles comment owned by another user when logged in as admin", async () => {
    const commentByOtherUser = {
      ...mockComment,
      userId: "other-user-id",
    };

    mockGetSession.mockResolvedValue(mockAdminSession);
    mockFindUnique.mockResolvedValue(commentByOtherUser);
    mockDelete.mockResolvedValue(commentByOtherUser);

    const request = createRequest("comment-1");
    const response = await DELETE(request, {
      params: createParams("comment-1"),
    });

    expect(response.status).toBe(200);
  });

  it("handles user deleting comment from different blog post", async () => {
    const commentOnDifferentPost = {
      ...mockComment,
      blogPostId: "different-post",
    };

    mockGetSession.mockResolvedValue(mockUserSession);
    mockFindUnique.mockResolvedValue(commentOnDifferentPost);
    mockDelete.mockResolvedValue(commentOnDifferentPost);

    const request = createRequest("comment-1");
    const response = await DELETE(request, {
      params: createParams("comment-1"),
    });

    // Should still work as long as user owns the comment
    expect(response.status).toBe(200);
  });
});

/**
 * @jest-environment node
 *
 * Tests for User Single Message API Routes
 * /api/messages/[id] - GET (get single message with conversation)
 */

import { NextRequest } from "next/server";
import { GET } from "../route";

// Mock Prisma
const mockFindFirst = jest.fn();

jest.mock("@/lib/db", () => ({
  prisma: {
    contactMessage: {
      findFirst: (...args: unknown[]) => mockFindFirst(...args),
    },
  },
}));

// Mock auth
const mockRequireAuth = jest.fn();
jest.mock("@/lib/auth-helpers", () => ({
  requireAuth: (...args: unknown[]) => mockRequireAuth(...args),
}));

describe("GET /api/messages/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMessage = {
    id: "msg-1",
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean@example.com",
    category: "general",
    subject: "Question sur les deals",
    message: "Bonjour, j'ai une question concernant les offres...",
    status: "REPLIED",
    userId: "user-1",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-16"),
    replies: [
      {
        id: "reply-1",
        content: "Bonjour Jean, merci pour votre message...",
        messageId: "msg-1",
        adminId: "admin-1",
        createdAt: new Date("2025-01-16T10:00:00Z"),
        admin: {
          id: "admin-1",
          name: "Admin User",
          image: null,
        },
      },
      {
        id: "reply-2",
        content: "Suite à votre question...",
        messageId: "msg-1",
        adminId: "admin-1",
        createdAt: new Date("2025-01-16T14:00:00Z"),
        admin: {
          id: "admin-1",
          name: "Admin User",
          image: null,
        },
      },
    ],
  };

  const mockUserSession = {
    session: {
      user: {
        id: "user-1",
        email: "jean@example.com",
        role: "USER",
      },
    },
  };

  describe("Authentication", () => {
    it("returns 401 if not authenticated", async () => {
      mockRequireAuth.mockResolvedValueOnce({
        error: "Non authentifié",
        status: 401,
      });

      const request = new NextRequest(
        "http://localhost:3000/api/messages/msg-1"
      );
      const response = await GET(request, {
        params: Promise.resolve({ id: "msg-1" }),
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Non authentifié");
    });
  });

  describe("Fetching Single Message", () => {
    beforeEach(() => {
      mockRequireAuth.mockResolvedValue(mockUserSession);
    });

    it("returns message with full conversation", async () => {
      mockFindFirst.mockResolvedValueOnce(mockMessage);

      const request = new NextRequest(
        "http://localhost:3000/api/messages/msg-1"
      );
      const response = await GET(request, {
        params: Promise.resolve({ id: "msg-1" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe("msg-1");
      expect(data.subject).toBe("Question sur les deals");
      expect(data.replies).toHaveLength(2);
    });

    it("includes admin info in replies", async () => {
      mockFindFirst.mockResolvedValueOnce(mockMessage);

      const request = new NextRequest(
        "http://localhost:3000/api/messages/msg-1"
      );
      const response = await GET(request, {
        params: Promise.resolve({ id: "msg-1" }),
      });
      const data = await response.json();

      expect(data.replies[0].admin.name).toBe("Admin User");
      expect(data.replies[0].admin.id).toBe("admin-1");
    });

    it("returns replies ordered by createdAt ascending", async () => {
      mockFindFirst.mockResolvedValueOnce(mockMessage);

      const request = new NextRequest(
        "http://localhost:3000/api/messages/msg-1"
      );
      await GET(request, {
        params: Promise.resolve({ id: "msg-1" }),
      });

      expect(mockFindFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.objectContaining({
            replies: expect.objectContaining({
              orderBy: { createdAt: "asc" },
            }),
          }),
        })
      );
    });

    it("only returns message owned by the user", async () => {
      mockFindFirst.mockResolvedValueOnce(mockMessage);

      const request = new NextRequest(
        "http://localhost:3000/api/messages/msg-1"
      );
      await GET(request, {
        params: Promise.resolve({ id: "msg-1" }),
      });

      expect(mockFindFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: "msg-1",
            userId: "user-1",
          },
        })
      );
    });

    it("returns 404 if message not found", async () => {
      mockFindFirst.mockResolvedValueOnce(null);

      const request = new NextRequest(
        "http://localhost:3000/api/messages/nonexistent"
      );
      const response = await GET(request, {
        params: Promise.resolve({ id: "nonexistent" }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Message non trouvé");
    });

    it("returns 404 if message belongs to another user", async () => {
      // Message exists but userId doesn't match
      mockFindFirst.mockResolvedValueOnce(null);

      const request = new NextRequest(
        "http://localhost:3000/api/messages/msg-other-user"
      );
      const response = await GET(request, {
        params: Promise.resolve({ id: "msg-other-user" }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Message non trouvé");
    });

    it("returns message without replies if none exist", async () => {
      const messageWithoutReplies = { ...mockMessage, replies: [] };
      mockFindFirst.mockResolvedValueOnce(messageWithoutReplies);

      const request = new NextRequest(
        "http://localhost:3000/api/messages/msg-1"
      );
      const response = await GET(request, {
        params: Promise.resolve({ id: "msg-1" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.replies).toEqual([]);
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      mockRequireAuth.mockResolvedValue(mockUserSession);
    });

    it("returns 500 on database error", async () => {
      mockFindFirst.mockRejectedValueOnce(new Error("Database error"));

      const request = new NextRequest(
        "http://localhost:3000/api/messages/msg-1"
      );
      const response = await GET(request, {
        params: Promise.resolve({ id: "msg-1" }),
      });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Erreur lors de la récupération du message");
    });
  });
});

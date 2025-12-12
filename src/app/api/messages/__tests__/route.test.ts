/**
 * @jest-environment node
 *
 * Tests for User Messages API Routes
 * /api/messages - GET (list user's own messages)
 */

import { NextRequest } from "next/server";
import { GET } from "../route";

// Mock Prisma
const mockFindMany = jest.fn();

jest.mock("@/lib/db", () => ({
  prisma: {
    contactMessage: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
    },
  },
}));

// Mock auth
const mockRequireAuth = jest.fn();
jest.mock("@/lib/auth-helpers", () => ({
  requireAuth: (...args: unknown[]) => mockRequireAuth(...args),
}));

describe("GET /api/messages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMessages = [
    {
      id: "msg-1",
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean@example.com",
      category: "general",
      subject: "Question sur les deals",
      message: "Bonjour, j'ai une question...",
      status: "REPLIED",
      userId: "user-1",
      createdAt: new Date("2025-01-15"),
      updatedAt: new Date("2025-01-15"),
      replies: [
        {
          id: "reply-1",
          content: "Bonjour, merci pour votre message...",
          messageId: "msg-1",
          adminId: "admin-1",
          createdAt: new Date("2025-01-16"),
          admin: {
            id: "admin-1",
            name: "Admin User",
            image: null,
          },
        },
      ],
    },
    {
      id: "msg-2",
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean@example.com",
      category: "technical",
      subject: "Bug sur le site",
      message: "J'ai trouvé un problème...",
      status: "NEW",
      userId: "user-1",
      createdAt: new Date("2025-01-14"),
      updatedAt: new Date("2025-01-14"),
      replies: [],
    },
  ];

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

      const request = new NextRequest("http://localhost:3000/api/messages");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Non authentifié");
    });
  });

  describe("Fetching User Messages", () => {
    beforeEach(() => {
      mockRequireAuth.mockResolvedValue(mockUserSession);
    });

    it("returns user's messages with replies", async () => {
      mockFindMany.mockResolvedValueOnce(mockMessages);

      const request = new NextRequest("http://localhost:3000/api/messages");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.messages).toHaveLength(2);
      expect(data.stats.total).toBe(2);
    });

    it("filters messages by userId", async () => {
      mockFindMany.mockResolvedValueOnce(mockMessages);

      const request = new NextRequest("http://localhost:3000/api/messages");
      await GET(request);

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: "user-1" },
        })
      );
    });

    it("includes replies with admin info", async () => {
      mockFindMany.mockResolvedValueOnce(mockMessages);

      const request = new NextRequest("http://localhost:3000/api/messages");
      const response = await GET(request);
      const data = await response.json();

      expect(data.messages[0].replies).toHaveLength(1);
      expect(data.messages[0].replies[0].admin.name).toBe("Admin User");
    });

    it("calculates unread count for replied messages", async () => {
      mockFindMany.mockResolvedValueOnce(mockMessages);

      const request = new NextRequest("http://localhost:3000/api/messages");
      const response = await GET(request);
      const data = await response.json();

      // One message is REPLIED with replies
      expect(data.stats.unread).toBe(1);
    });

    it("returns empty array when user has no messages", async () => {
      mockFindMany.mockResolvedValueOnce([]);

      const request = new NextRequest("http://localhost:3000/api/messages");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.messages).toEqual([]);
      expect(data.stats.total).toBe(0);
      expect(data.stats.unread).toBe(0);
    });

    it("orders messages by createdAt descending", async () => {
      mockFindMany.mockResolvedValueOnce(mockMessages);

      const request = new NextRequest("http://localhost:3000/api/messages");
      await GET(request);

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: "desc" },
        })
      );
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      mockRequireAuth.mockResolvedValue(mockUserSession);
    });

    it("returns 500 on database error", async () => {
      mockFindMany.mockRejectedValueOnce(new Error("Database error"));

      const request = new NextRequest("http://localhost:3000/api/messages");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Erreur lors de la récupération des messages");
    });
  });
});

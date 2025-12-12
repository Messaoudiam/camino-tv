/**
 * @jest-environment node
 *
 * Tests for Admin Contact Messages API Routes
 * /api/admin/messages - GET (list with stats)
 */

import { NextRequest } from "next/server";
import { GET } from "../route";

// Mock Prisma
const mockFindMany = jest.fn();
const mockCount = jest.fn();

jest.mock("@/lib/db", () => ({
  prisma: {
    contactMessage: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      count: (...args: unknown[]) => mockCount(...args),
    },
  },
}));

// Mock auth
const mockRequireAdmin = jest.fn();
jest.mock("@/lib/auth-helpers", () => ({
  requireAdmin: (...args: unknown[]) => mockRequireAdmin(...args),
}));

describe("GET /api/admin/messages", () => {
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
      status: "NEW",
      createdAt: new Date("2025-01-15"),
      updatedAt: new Date("2025-01-15"),
    },
    {
      id: "msg-2",
      firstName: "Marie",
      lastName: "Martin",
      email: "marie@example.com",
      category: "partnership",
      subject: "Proposition de partenariat",
      message: "Nous aimerions proposer...",
      status: "READ",
      createdAt: new Date("2025-01-14"),
      updatedAt: new Date("2025-01-14"),
    },
    {
      id: "msg-3",
      firstName: "Pierre",
      lastName: "Durand",
      email: "pierre@example.com",
      category: "technical",
      subject: "Bug sur le site",
      message: "J'ai trouvé un problème...",
      status: "REPLIED",
      createdAt: new Date("2025-01-13"),
      updatedAt: new Date("2025-01-13"),
    },
  ];

  const mockAdminSession = {
    session: {
      user: {
        id: "admin-1",
        email: "admin@camino.tv",
        role: "ADMIN",
      },
    },
  };

  describe("Authentication", () => {
    it("returns 401 if not authenticated", async () => {
      mockRequireAdmin.mockResolvedValueOnce({
        error: "Non authentifié",
        status: 401,
      });

      const request = new NextRequest(
        "http://localhost:3000/api/admin/messages"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Non authentifié");
    });

    it("returns 403 if not admin", async () => {
      mockRequireAdmin.mockResolvedValueOnce({
        error: "Accès non autorisé",
        status: 403,
      });

      const request = new NextRequest(
        "http://localhost:3000/api/admin/messages"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Accès non autorisé");
    });
  });

  describe("Fetching Messages", () => {
    beforeEach(() => {
      mockRequireAdmin.mockResolvedValue(mockAdminSession);
    });

    it("returns all messages with stats", async () => {
      mockFindMany.mockResolvedValueOnce(mockMessages);
      // Mock count calls: total, new, read, replied, archived
      mockCount
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(3) // new
        .mockResolvedValueOnce(2) // read
        .mockResolvedValueOnce(4) // replied
        .mockResolvedValueOnce(1); // archived

      const request = new NextRequest(
        "http://localhost:3000/api/admin/messages"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.messages).toHaveLength(3);
      expect(data.stats).toEqual({
        total: 10,
        new: 3,
        read: 2,
        replied: 4,
        archived: 1,
      });
    });

    it("filters messages by status NEW", async () => {
      const newMessages = [mockMessages[0]];
      mockFindMany.mockResolvedValueOnce(newMessages);
      mockCount
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(4)
        .mockResolvedValueOnce(1);

      const request = new NextRequest(
        "http://localhost:3000/api/admin/messages?status=NEW"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.messages).toHaveLength(1);
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: "NEW" },
        })
      );
    });

    it("filters messages by status READ", async () => {
      const readMessages = [mockMessages[1]];
      mockFindMany.mockResolvedValueOnce(readMessages);
      mockCount
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(4)
        .mockResolvedValueOnce(1);

      const request = new NextRequest(
        "http://localhost:3000/api/admin/messages?status=READ"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.messages).toHaveLength(1);
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: "READ" },
        })
      );
    });

    it("filters messages by status REPLIED", async () => {
      const repliedMessages = [mockMessages[2]];
      mockFindMany.mockResolvedValueOnce(repliedMessages);
      mockCount
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(4)
        .mockResolvedValueOnce(1);

      const request = new NextRequest(
        "http://localhost:3000/api/admin/messages?status=REPLIED"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.messages).toHaveLength(1);
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: "REPLIED" },
        })
      );
    });

    it("filters messages by status ARCHIVED", async () => {
      mockFindMany.mockResolvedValueOnce([]);
      mockCount
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(4)
        .mockResolvedValueOnce(1);

      const request = new NextRequest(
        "http://localhost:3000/api/admin/messages?status=ARCHIVED"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.messages).toHaveLength(0);
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: "ARCHIVED" },
        })
      );
    });

    it("returns messages ordered by createdAt descending", async () => {
      mockFindMany.mockResolvedValueOnce(mockMessages);
      mockCount
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(0);

      const request = new NextRequest(
        "http://localhost:3000/api/admin/messages"
      );
      await GET(request);

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: "desc" },
        })
      );
    });

    it("returns empty array when no messages", async () => {
      mockFindMany.mockResolvedValueOnce([]);
      mockCount
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const request = new NextRequest(
        "http://localhost:3000/api/admin/messages"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.messages).toEqual([]);
      expect(data.stats.total).toBe(0);
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      mockRequireAdmin.mockResolvedValue(mockAdminSession);
    });

    it("returns 500 on database error", async () => {
      mockFindMany.mockRejectedValueOnce(new Error("Database error"));

      const request = new NextRequest(
        "http://localhost:3000/api/admin/messages"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Erreur lors de la récupération des messages");
    });

    it("returns 500 on count error", async () => {
      mockFindMany.mockResolvedValueOnce(mockMessages);
      mockCount.mockRejectedValueOnce(new Error("Count error"));

      const request = new NextRequest(
        "http://localhost:3000/api/admin/messages"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Erreur lors de la récupération des messages");
    });
  });
});

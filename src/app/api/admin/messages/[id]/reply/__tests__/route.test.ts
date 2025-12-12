/**
 * @jest-environment node
 *
 * Tests for Admin Message Reply API Routes
 * /api/admin/messages/[id]/reply - POST (create reply), GET (list replies)
 */

import { NextRequest } from "next/server";
import { POST, GET } from "../route";

// Mock Prisma
const mockFindUnique = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockFindMany = jest.fn();
const mockTransaction = jest.fn();

jest.mock("@/lib/db", () => ({
  prisma: {
    contactMessage: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
    },
    messageReply: {
      create: (...args: unknown[]) => mockCreate(...args),
      findMany: (...args: unknown[]) => mockFindMany(...args),
    },
    $transaction: (...args: unknown[]) => mockTransaction(...args),
  },
}));

// Mock auth
const mockRequireAdmin = jest.fn();
jest.mock("@/lib/auth-helpers", () => ({
  requireAdmin: (...args: unknown[]) => mockRequireAdmin(...args),
}));

describe("Admin Message Reply API - /api/admin/messages/[id]/reply", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMessage = {
    id: "msg-1",
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean@example.com",
    category: "general",
    subject: "Question",
    message: "Test message",
    status: "READ",
    userId: "user-1",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
  };

  const mockReply = {
    id: "reply-1",
    content: "Merci pour votre message...",
    messageId: "msg-1",
    adminId: "admin-1",
    createdAt: new Date("2025-01-16"),
    admin: {
      id: "admin-1",
      name: "Admin User",
      image: null,
    },
  };

  const mockAdminSession = {
    session: {
      user: {
        id: "admin-1",
        email: "admin@camino.tv",
        role: "ADMIN",
      },
    },
  };

  // ============================================
  // POST /api/admin/messages/[id]/reply
  // ============================================
  describe("POST /api/admin/messages/[id]/reply", () => {
    describe("Authentication", () => {
      it("returns 401 if not authenticated", async () => {
        mockRequireAdmin.mockResolvedValueOnce({
          error: "Non authentifié",
          status: 401,
        });

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1/reply",
          {
            method: "POST",
            body: JSON.stringify({ content: "Test reply" }),
          }
        );
        const response = await POST(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
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
          "http://localhost:3000/api/admin/messages/msg-1/reply",
          {
            method: "POST",
            body: JSON.stringify({ content: "Test reply" }),
          }
        );
        const response = await POST(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(response.status).toBe(403);
        expect(data.error).toBe("Accès non autorisé");
      });
    });

    describe("Creating Reply", () => {
      beforeEach(() => {
        mockRequireAdmin.mockResolvedValue(mockAdminSession);
      });

      it("creates reply and updates message status", async () => {
        mockFindUnique.mockResolvedValueOnce(mockMessage);
        mockTransaction.mockResolvedValueOnce([mockReply, mockMessage]);

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1/reply",
          {
            method: "POST",
            body: JSON.stringify({ content: "Merci pour votre message..." }),
          }
        );
        const response = await POST(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.content).toBe("Merci pour votre message...");
        expect(data.admin.name).toBe("Admin User");
      });

      it("returns 404 if message not found", async () => {
        mockFindUnique.mockResolvedValueOnce(null);

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/nonexistent/reply",
          {
            method: "POST",
            body: JSON.stringify({ content: "Test reply" }),
          }
        );
        const response = await POST(request, {
          params: Promise.resolve({ id: "nonexistent" }),
        });
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.error).toBe("Message non trouvé");
      });
    });

    describe("Validation", () => {
      beforeEach(() => {
        mockRequireAdmin.mockResolvedValue(mockAdminSession);
        mockFindUnique.mockResolvedValue(mockMessage);
      });

      it("returns 400 for empty content", async () => {
        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1/reply",
          {
            method: "POST",
            body: JSON.stringify({ content: "" }),
          }
        );
        const response = await POST(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Données invalides");
      });

      it("returns 400 for missing content", async () => {
        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1/reply",
          {
            method: "POST",
            body: JSON.stringify({}),
          }
        );
        const response = await POST(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Données invalides");
      });

      it("returns 400 for content too long", async () => {
        const longContent = "a".repeat(5001);
        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1/reply",
          {
            method: "POST",
            body: JSON.stringify({ content: longContent }),
          }
        );
        const response = await POST(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Données invalides");
      });
    });

    describe("Error Handling", () => {
      beforeEach(() => {
        mockRequireAdmin.mockResolvedValue(mockAdminSession);
        mockFindUnique.mockResolvedValue(mockMessage);
      });

      it("returns 500 on database error", async () => {
        mockTransaction.mockRejectedValueOnce(new Error("Database error"));

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1/reply",
          {
            method: "POST",
            body: JSON.stringify({ content: "Test reply" }),
          }
        );
        const response = await POST(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe("Erreur lors de l'envoi de la réponse");
      });
    });
  });

  // ============================================
  // GET /api/admin/messages/[id]/reply
  // ============================================
  describe("GET /api/admin/messages/[id]/reply", () => {
    describe("Authentication", () => {
      it("returns 401 if not authenticated", async () => {
        mockRequireAdmin.mockResolvedValueOnce({
          error: "Non authentifié",
          status: 401,
        });

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1/reply"
        );
        const response = await GET(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
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
          "http://localhost:3000/api/admin/messages/msg-1/reply"
        );
        const response = await GET(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(response.status).toBe(403);
        expect(data.error).toBe("Accès non autorisé");
      });
    });

    describe("Fetching Replies", () => {
      beforeEach(() => {
        mockRequireAdmin.mockResolvedValue(mockAdminSession);
      });

      it("returns all replies for a message", async () => {
        const mockReplies = [
          mockReply,
          { ...mockReply, id: "reply-2", content: "Suite..." },
        ];
        mockFindMany.mockResolvedValueOnce(mockReplies);

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1/reply"
        );
        const response = await GET(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toHaveLength(2);
      });

      it("includes admin info in replies", async () => {
        mockFindMany.mockResolvedValueOnce([mockReply]);

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1/reply"
        );
        const response = await GET(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(data[0].admin.name).toBe("Admin User");
      });

      it("returns replies ordered by createdAt ascending", async () => {
        mockFindMany.mockResolvedValueOnce([mockReply]);

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1/reply"
        );
        await GET(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });

        expect(mockFindMany).toHaveBeenCalledWith(
          expect.objectContaining({
            orderBy: { createdAt: "asc" },
          })
        );
      });

      it("returns empty array when no replies exist", async () => {
        mockFindMany.mockResolvedValueOnce([]);

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1/reply"
        );
        const response = await GET(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual([]);
      });
    });

    describe("Error Handling", () => {
      beforeEach(() => {
        mockRequireAdmin.mockResolvedValue(mockAdminSession);
      });

      it("returns 500 on database error", async () => {
        mockFindMany.mockRejectedValueOnce(new Error("Database error"));

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1/reply"
        );
        const response = await GET(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe("Erreur lors de la récupération des réponses");
      });
    });
  });
});

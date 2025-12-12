/**
 * @jest-environment node
 *
 * Tests for Admin Contact Message API Routes
 * /api/admin/messages/[id] - PATCH (update status), DELETE (remove)
 */

import { NextRequest } from "next/server";
import { PATCH, DELETE } from "../route";

// Mock Prisma
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

jest.mock("@/lib/db", () => ({
  prisma: {
    contactMessage: {
      update: (...args: unknown[]) => mockUpdate(...args),
      delete: (...args: unknown[]) => mockDelete(...args),
    },
  },
}));

// Mock auth
const mockRequireAdmin = jest.fn();
jest.mock("@/lib/auth-helpers", () => ({
  requireAdmin: (...args: unknown[]) => mockRequireAdmin(...args),
}));

describe("Admin Message API - /api/admin/messages/[id]", () => {
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
    message: "Bonjour, j'ai une question...",
    status: "NEW",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
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
  // PATCH /api/admin/messages/[id] - Update Status
  // ============================================
  describe("PATCH /api/admin/messages/[id]", () => {
    describe("Authentication", () => {
      it("returns 401 if not authenticated", async () => {
        mockRequireAdmin.mockResolvedValueOnce({
          error: "Non authentifié",
          status: 401,
        });

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1",
          {
            method: "PATCH",
            body: JSON.stringify({ status: "READ" }),
          }
        );
        const response = await PATCH(request, {
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
          "http://localhost:3000/api/admin/messages/msg-1",
          {
            method: "PATCH",
            body: JSON.stringify({ status: "READ" }),
          }
        );
        const response = await PATCH(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(response.status).toBe(403);
        expect(data.error).toBe("Accès non autorisé");
      });
    });

    describe("Status Update", () => {
      beforeEach(() => {
        mockRequireAdmin.mockResolvedValue(mockAdminSession);
      });

      it("updates status to READ", async () => {
        const updatedMessage = { ...mockMessage, status: "READ" };
        mockUpdate.mockResolvedValueOnce(updatedMessage);

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1",
          {
            method: "PATCH",
            body: JSON.stringify({ status: "READ" }),
          }
        );
        const response = await PATCH(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.status).toBe("READ");
        expect(mockUpdate).toHaveBeenCalledWith({
          where: { id: "msg-1" },
          data: { status: "READ" },
        });
      });

      it("updates status to REPLIED", async () => {
        const updatedMessage = { ...mockMessage, status: "REPLIED" };
        mockUpdate.mockResolvedValueOnce(updatedMessage);

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1",
          {
            method: "PATCH",
            body: JSON.stringify({ status: "REPLIED" }),
          }
        );
        const response = await PATCH(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.status).toBe("REPLIED");
      });

      it("updates status to ARCHIVED", async () => {
        const updatedMessage = { ...mockMessage, status: "ARCHIVED" };
        mockUpdate.mockResolvedValueOnce(updatedMessage);

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1",
          {
            method: "PATCH",
            body: JSON.stringify({ status: "ARCHIVED" }),
          }
        );
        const response = await PATCH(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.status).toBe("ARCHIVED");
      });

      it("updates status to NEW (reset)", async () => {
        const updatedMessage = { ...mockMessage, status: "NEW" };
        mockUpdate.mockResolvedValueOnce(updatedMessage);

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1",
          {
            method: "PATCH",
            body: JSON.stringify({ status: "NEW" }),
          }
        );
        const response = await PATCH(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.status).toBe("NEW");
      });
    });

    describe("Validation", () => {
      beforeEach(() => {
        mockRequireAdmin.mockResolvedValue(mockAdminSession);
      });

      it("returns 400 for invalid status", async () => {
        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1",
          {
            method: "PATCH",
            body: JSON.stringify({ status: "INVALID_STATUS" }),
          }
        );
        const response = await PATCH(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Statut invalide");
      });

      it("returns 400 for missing status", async () => {
        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1",
          {
            method: "PATCH",
            body: JSON.stringify({}),
          }
        );
        const response = await PATCH(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Statut invalide");
      });

      it("returns 400 for empty body", async () => {
        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1",
          {
            method: "PATCH",
            body: JSON.stringify(null),
          }
        );
        const response = await PATCH(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });

        expect(response.status).toBe(400);
      });
    });

    describe("Error Handling", () => {
      beforeEach(() => {
        mockRequireAdmin.mockResolvedValue(mockAdminSession);
      });

      it("returns 500 on database error", async () => {
        mockUpdate.mockRejectedValueOnce(new Error("Database error"));

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1",
          {
            method: "PATCH",
            body: JSON.stringify({ status: "READ" }),
          }
        );
        const response = await PATCH(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe("Erreur lors de la mise à jour du message");
      });

      it("handles message not found gracefully", async () => {
        mockUpdate.mockRejectedValueOnce(
          new Error("Record to update not found")
        );

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/nonexistent",
          {
            method: "PATCH",
            body: JSON.stringify({ status: "READ" }),
          }
        );
        const response = await PATCH(request, {
          params: Promise.resolve({ id: "nonexistent" }),
        });

        expect(response.status).toBe(500);
      });
    });
  });

  // ============================================
  // DELETE /api/admin/messages/[id] - Delete Message
  // ============================================
  describe("DELETE /api/admin/messages/[id]", () => {
    describe("Authentication", () => {
      it("returns 401 if not authenticated", async () => {
        mockRequireAdmin.mockResolvedValueOnce({
          error: "Non authentifié",
          status: 401,
        });

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1",
          {
            method: "DELETE",
          }
        );
        const response = await DELETE(request, {
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
          "http://localhost:3000/api/admin/messages/msg-1",
          {
            method: "DELETE",
          }
        );
        const response = await DELETE(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(response.status).toBe(403);
        expect(data.error).toBe("Accès non autorisé");
      });
    });

    describe("Successful Deletion", () => {
      beforeEach(() => {
        mockRequireAdmin.mockResolvedValue(mockAdminSession);
      });

      it("deletes message successfully", async () => {
        mockDelete.mockResolvedValueOnce(mockMessage);

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1",
          {
            method: "DELETE",
          }
        );
        const response = await DELETE(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.message).toBe("Message supprimé avec succès");
        expect(mockDelete).toHaveBeenCalledWith({
          where: { id: "msg-1" },
        });
      });

      it("deletes message with any status", async () => {
        const archivedMessage = { ...mockMessage, status: "ARCHIVED" };
        mockDelete.mockResolvedValueOnce(archivedMessage);

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-archived",
          {
            method: "DELETE",
          }
        );
        const response = await DELETE(request, {
          params: Promise.resolve({ id: "msg-archived" }),
        });

        expect(response.status).toBe(200);
        expect(mockDelete).toHaveBeenCalledWith({
          where: { id: "msg-archived" },
        });
      });
    });

    describe("Error Handling", () => {
      beforeEach(() => {
        mockRequireAdmin.mockResolvedValue(mockAdminSession);
      });

      it("returns 500 on database error", async () => {
        mockDelete.mockRejectedValueOnce(new Error("Database error"));

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/msg-1",
          {
            method: "DELETE",
          }
        );
        const response = await DELETE(request, {
          params: Promise.resolve({ id: "msg-1" }),
        });
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe("Erreur lors de la suppression du message");
      });

      it("handles message not found gracefully", async () => {
        mockDelete.mockRejectedValueOnce(
          new Error("Record to delete not found")
        );

        const request = new NextRequest(
          "http://localhost:3000/api/admin/messages/nonexistent",
          {
            method: "DELETE",
          }
        );
        const response = await DELETE(request, {
          params: Promise.resolve({ id: "nonexistent" }),
        });

        expect(response.status).toBe(500);
      });
    });
  });
});

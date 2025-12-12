/**
 * @jest-environment node
 *
 * Tests for Admin Newsletter API Routes
 * /api/admin/newsletter - GET (list), DELETE
 */

import { NextRequest } from "next/server";
import { GET, DELETE } from "../route";

// Mock Prisma
const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();
const mockCount = jest.fn();
const mockDelete = jest.fn();

jest.mock("@/lib/db", () => ({
  prisma: {
    newsletterSubscriber: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      count: (...args: unknown[]) => mockCount(...args),
      delete: (...args: unknown[]) => mockDelete(...args),
    },
  },
}));

// Mock auth
const mockRequireAdmin = jest.fn();
jest.mock("@/lib/auth-helpers", () => ({
  requireAdmin: (...args: unknown[]) => mockRequireAdmin(...args),
}));

describe("GET /api/admin/newsletter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSubscribers = [
    {
      id: "sub-1",
      email: "active@example.com",
      status: "ACTIVE",
      subscribedAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-01-01"),
    },
    {
      id: "sub-2",
      email: "inactive@example.com",
      status: "UNSUBSCRIBED",
      subscribedAt: new Date("2025-01-02"),
      updatedAt: new Date("2025-01-05"),
    },
  ];

  describe("Authentication", () => {
    it("returns 401 when not authenticated", async () => {
      mockRequireAdmin.mockResolvedValue({
        error: "Non authentifié",
        status: 401,
      });

      const request = new NextRequest(
        "http://localhost:3000/api/admin/newsletter",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Non authentifié");
    });

    it("returns 403 when not admin", async () => {
      mockRequireAdmin.mockResolvedValue({
        error: "Accès refusé",
        status: 403,
      });

      const request = new NextRequest(
        "http://localhost:3000/api/admin/newsletter",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Accès refusé");
    });
  });

  describe("List Subscribers", () => {
    beforeEach(() => {
      mockRequireAdmin.mockResolvedValue({ session: {}, error: null });
    });

    it("returns all subscribers with stats", async () => {
      mockFindMany.mockResolvedValue(mockSubscribers);
      mockCount
        .mockResolvedValueOnce(2) // total
        .mockResolvedValueOnce(0) // pending
        .mockResolvedValueOnce(1) // active
        .mockResolvedValueOnce(1); // unsubscribed

      const request = new NextRequest(
        "http://localhost:3000/api/admin/newsletter",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.subscribers).toHaveLength(2);
      expect(data.stats).toEqual({
        total: 2,
        pending: 0,
        active: 1,
        unsubscribed: 1,
      });
    });

    it("filters by ACTIVE status", async () => {
      mockFindMany.mockResolvedValue([mockSubscribers[0]]);
      mockCount
        .mockResolvedValueOnce(2) // total
        .mockResolvedValueOnce(0) // pending
        .mockResolvedValueOnce(1) // active
        .mockResolvedValueOnce(1); // unsubscribed

      const request = new NextRequest(
        "http://localhost:3000/api/admin/newsletter?status=ACTIVE",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.subscribers).toHaveLength(1);
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: "ACTIVE" },
        }),
      );
    });

    it("filters by UNSUBSCRIBED status", async () => {
      mockFindMany.mockResolvedValue([mockSubscribers[1]]);
      mockCount
        .mockResolvedValueOnce(2) // total
        .mockResolvedValueOnce(0) // pending
        .mockResolvedValueOnce(1) // active
        .mockResolvedValueOnce(1); // unsubscribed

      const request = new NextRequest(
        "http://localhost:3000/api/admin/newsletter?status=UNSUBSCRIBED",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.subscribers).toHaveLength(1);
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: "UNSUBSCRIBED" },
        }),
      );
    });

    it("returns CSV when format=csv", async () => {
      mockFindMany.mockResolvedValue(mockSubscribers);
      mockCount
        .mockResolvedValueOnce(2) // total
        .mockResolvedValueOnce(0) // pending
        .mockResolvedValueOnce(1) // active
        .mockResolvedValueOnce(1); // unsubscribed

      const request = new NextRequest(
        "http://localhost:3000/api/admin/newsletter?format=csv",
      );

      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toBe("text/csv");
      expect(response.headers.get("Content-Disposition")).toContain(
        "attachment; filename=",
      );

      const csv = await response.text();
      expect(csv).toContain("email,status,subscribedAt");
      expect(csv).toContain("active@example.com,ACTIVE");
      expect(csv).toContain("inactive@example.com,UNSUBSCRIBED");
    });

    it("returns 500 on database error", async () => {
      mockFindMany.mockRejectedValue(new Error("Database error"));

      const request = new NextRequest(
        "http://localhost:3000/api/admin/newsletter",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Erreur lors de la récupération des abonnés");
    });
  });
});

describe("DELETE /api/admin/newsletter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Authentication", () => {
    it("returns 401 when not authenticated", async () => {
      mockRequireAdmin.mockResolvedValue({
        error: "Non authentifié",
        status: 401,
      });

      const request = new NextRequest(
        "http://localhost:3000/api/admin/newsletter",
        {
          method: "DELETE",
          body: JSON.stringify({ email: "test@example.com" }),
          headers: { "Content-Type": "application/json" },
        },
      );

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Non authentifié");
    });
  });

  describe("Delete Subscriber", () => {
    beforeEach(() => {
      mockRequireAdmin.mockResolvedValue({ session: {}, error: null });
    });

    it("returns 400 when email is missing", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/newsletter",
        {
          method: "DELETE",
          body: JSON.stringify({}),
          headers: { "Content-Type": "application/json" },
        },
      );

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("L'email est requis");
    });

    it("returns 404 when subscriber not found", async () => {
      mockFindUnique.mockResolvedValue(null);

      const request = new NextRequest(
        "http://localhost:3000/api/admin/newsletter",
        {
          method: "DELETE",
          body: JSON.stringify({ email: "notfound@example.com" }),
          headers: { "Content-Type": "application/json" },
        },
      );

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Abonné non trouvé");
    });

    it("deletes subscriber successfully", async () => {
      mockFindUnique.mockResolvedValue({
        id: "sub-1",
        email: "test@example.com",
        status: "ACTIVE",
      });
      mockDelete.mockResolvedValue({});

      const request = new NextRequest(
        "http://localhost:3000/api/admin/newsletter",
        {
          method: "DELETE",
          body: JSON.stringify({ email: "test@example.com" }),
          headers: { "Content-Type": "application/json" },
        },
      );

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe("Abonné supprimé avec succès");
      expect(mockDelete).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });

    it("normalizes email to lowercase", async () => {
      mockFindUnique.mockResolvedValue({
        id: "sub-1",
        email: "test@example.com",
        status: "ACTIVE",
      });
      mockDelete.mockResolvedValue({});

      const request = new NextRequest(
        "http://localhost:3000/api/admin/newsletter",
        {
          method: "DELETE",
          body: JSON.stringify({ email: "TEST@EXAMPLE.COM" }),
          headers: { "Content-Type": "application/json" },
        },
      );

      await DELETE(request);

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });

    it("returns 500 on database error", async () => {
      mockFindUnique.mockRejectedValue(new Error("Database error"));

      const request = new NextRequest(
        "http://localhost:3000/api/admin/newsletter",
        {
          method: "DELETE",
          body: JSON.stringify({ email: "test@example.com" }),
          headers: { "Content-Type": "application/json" },
        },
      );

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Erreur lors de la suppression de l'abonné");
    });
  });
});

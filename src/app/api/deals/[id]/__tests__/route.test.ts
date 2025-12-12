/**
 * @jest-environment node
 *
 * Tests for Single Deal API Routes
 * /api/deals/[id] - GET (single), PUT (update), DELETE (soft delete)
 */

import { NextRequest } from "next/server";
import { GET, PUT, DELETE } from "../route";
import { Prisma } from "@prisma/client";

// Mock Prisma
const mockFindUnique = jest.fn();
const mockUpdate = jest.fn();

jest.mock("@/lib/db", () => ({
  prisma: {
    deal: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
    },
  },
}));

// Mock auth helpers
const mockRequireAdmin = jest.fn();
jest.mock("@/lib/auth-helpers", () => ({
  requireAdmin: (...args: unknown[]) => mockRequireAdmin(...args),
}));

const mockDeal = {
  id: "deal-123",
  title: "Nike Air Max 90 - Super promo exclusive",
  brand: "Nike",
  originalPrice: 150,
  currentPrice: 99,
  discountPercentage: 34,
  imageUrl: "https://example.com/nike.jpg",
  category: "sneakers",
  affiliateUrl: "https://affiliate.com/nike",
  promoCode: "SAVE20",
  promoDescription: "20% de réduction",
  isNew: true,
  isLimited: false,
  isActive: true,
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
  _count: { favorites: 5 },
};

describe("GET /api/deals/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a deal by ID", async () => {
    mockFindUnique.mockResolvedValueOnce(mockDeal);

    const request = new NextRequest("http://localhost:3000/api/deals/deal-123");
    const response = await GET(request, {
      params: Promise.resolve({ id: "deal-123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe("deal-123");
    expect(data.title).toBe("Nike Air Max 90 - Super promo exclusive");
    expect(data._count.favorites).toBe(5);
  });

  it("includes favorites count in response", async () => {
    mockFindUnique.mockResolvedValueOnce(mockDeal);

    const request = new NextRequest("http://localhost:3000/api/deals/deal-123");
    const response = await GET(request, {
      params: Promise.resolve({ id: "deal-123" }),
    });
    const data = await response.json();

    expect(data._count).toBeDefined();
    expect(data._count.favorites).toBe(5);
  });

  it("returns 404 when deal not found", async () => {
    mockFindUnique.mockResolvedValueOnce(null);

    const request = new NextRequest(
      "http://localhost:3000/api/deals/non-existent",
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "non-existent" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Deal non trouvé");
  });

  it("returns 500 on database error", async () => {
    mockFindUnique.mockRejectedValueOnce(new Error("Database error"));

    const request = new NextRequest("http://localhost:3000/api/deals/deal-123");
    const response = await GET(request, {
      params: Promise.resolve({ id: "deal-123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Erreur lors de la récupération du deal");
  });
});

describe("PUT /api/deals/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Authentication", () => {
    it("returns 401 when not authenticated", async () => {
      mockRequireAdmin.mockResolvedValueOnce({
        error: "Non authentifié",
        status: 401,
      });

      const request = new NextRequest(
        "http://localhost:3000/api/deals/deal-123",
        {
          method: "PUT",
          body: JSON.stringify({ title: "Updated Deal Title Here" }),
          headers: { "Content-Type": "application/json" },
        },
      );

      const response = await PUT(request, {
        params: Promise.resolve({ id: "deal-123" }),
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Non authentifié");
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("returns 403 when not admin", async () => {
      mockRequireAdmin.mockResolvedValueOnce({
        error: "Accès refusé",
        status: 403,
      });

      const request = new NextRequest(
        "http://localhost:3000/api/deals/deal-123",
        {
          method: "PUT",
          body: JSON.stringify({ title: "Updated Deal Title Here" }),
          headers: { "Content-Type": "application/json" },
        },
      );

      const response = await PUT(request, {
        params: Promise.resolve({ id: "deal-123" }),
      });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Accès refusé");
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe("Successful Update", () => {
    beforeEach(() => {
      mockRequireAdmin.mockResolvedValue({
        session: { user: { id: "admin-1", role: "ADMIN" } },
        error: null,
      });
    });

    it("updates a deal with valid data", async () => {
      mockUpdate.mockResolvedValueOnce({
        ...mockDeal,
        title: "Updated Nike Air Max 90 Title",
      });

      const request = new NextRequest(
        "http://localhost:3000/api/deals/deal-123",
        {
          method: "PUT",
          body: JSON.stringify({ title: "Updated Nike Air Max 90 Title" }),
          headers: { "Content-Type": "application/json" },
        },
      );

      const response = await PUT(request, {
        params: Promise.resolve({ id: "deal-123" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe("Updated Nike Air Max 90 Title");
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: "deal-123" },
        data: { title: "Updated Nike Air Max 90 Title" },
      });
    });

    it("updates multiple fields at once", async () => {
      const updateData = {
        title: "Nouveau titre super long pour le deal",
        currentPrice: 79,
        discountPercentage: 47,
        isLimited: true,
      };

      mockUpdate.mockResolvedValueOnce({ ...mockDeal, ...updateData });

      const request = new NextRequest(
        "http://localhost:3000/api/deals/deal-123",
        {
          method: "PUT",
          body: JSON.stringify(updateData),
          headers: { "Content-Type": "application/json" },
        },
      );

      const response = await PUT(request, {
        params: Promise.resolve({ id: "deal-123" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe(updateData.title);
      expect(data.currentPrice).toBe(79);
      expect(data.discountPercentage).toBe(47);
      expect(data.isLimited).toBe(true);
    });

    it("updates category with valid value", async () => {
      mockUpdate.mockResolvedValueOnce({
        ...mockDeal,
        category: "streetwear",
      });

      const request = new NextRequest(
        "http://localhost:3000/api/deals/deal-123",
        {
          method: "PUT",
          body: JSON.stringify({ category: "streetwear" }),
          headers: { "Content-Type": "application/json" },
        },
      );

      const response = await PUT(request, {
        params: Promise.resolve({ id: "deal-123" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.category).toBe("streetwear");
    });

    it("deactivates a deal by setting isActive to false", async () => {
      mockUpdate.mockResolvedValueOnce({ ...mockDeal, isActive: false });

      const request = new NextRequest(
        "http://localhost:3000/api/deals/deal-123",
        {
          method: "PUT",
          body: JSON.stringify({ isActive: false }),
          headers: { "Content-Type": "application/json" },
        },
      );

      const response = await PUT(request, {
        params: Promise.resolve({ id: "deal-123" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.isActive).toBe(false);
    });
  });

  describe("Validation", () => {
    beforeEach(() => {
      mockRequireAdmin.mockResolvedValue({
        session: { user: { id: "admin-1", role: "ADMIN" } },
        error: null,
      });
    });

    it("returns 400 when title is too short", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/deals/deal-123",
        {
          method: "PUT",
          body: JSON.stringify({ title: "Short" }),
          headers: { "Content-Type": "application/json" },
        },
      );

      const response = await PUT(request, {
        params: Promise.resolve({ id: "deal-123" }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Données invalides");
      expect(data.details).toBeDefined();
    });

    it("returns 400 when brand is too short", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/deals/deal-123",
        {
          method: "PUT",
          body: JSON.stringify({ brand: "X" }),
          headers: { "Content-Type": "application/json" },
        },
      );

      const response = await PUT(request, {
        params: Promise.resolve({ id: "deal-123" }),
      });

      expect(response.status).toBe(400);
    });

    it("returns 400 when price is not positive", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/deals/deal-123",
        {
          method: "PUT",
          body: JSON.stringify({ currentPrice: -10 }),
          headers: { "Content-Type": "application/json" },
        },
      );

      const response = await PUT(request, {
        params: Promise.resolve({ id: "deal-123" }),
      });

      expect(response.status).toBe(400);
    });

    it("returns 400 when discount is out of range", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/deals/deal-123",
        {
          method: "PUT",
          body: JSON.stringify({ discountPercentage: 150 }),
          headers: { "Content-Type": "application/json" },
        },
      );

      const response = await PUT(request, {
        params: Promise.resolve({ id: "deal-123" }),
      });

      expect(response.status).toBe(400);
    });

    it("returns 400 when category is invalid", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/deals/deal-123",
        {
          method: "PUT",
          body: JSON.stringify({ category: "invalid_category" }),
          headers: { "Content-Type": "application/json" },
        },
      );

      const response = await PUT(request, {
        params: Promise.resolve({ id: "deal-123" }),
      });

      expect(response.status).toBe(400);
    });

    it("returns 400 when imageUrl is invalid", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/deals/deal-123",
        {
          method: "PUT",
          body: JSON.stringify({ imageUrl: "not-a-url" }),
          headers: { "Content-Type": "application/json" },
        },
      );

      const response = await PUT(request, {
        params: Promise.resolve({ id: "deal-123" }),
      });

      expect(response.status).toBe(400);
    });

    it("returns 400 when affiliateUrl is invalid", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/deals/deal-123",
        {
          method: "PUT",
          body: JSON.stringify({ affiliateUrl: "not-a-url" }),
          headers: { "Content-Type": "application/json" },
        },
      );

      const response = await PUT(request, {
        params: Promise.resolve({ id: "deal-123" }),
      });

      expect(response.status).toBe(400);
    });

    it("accepts all valid categories", async () => {
      const categories = [
        "sneakers",
        "streetwear",
        "accessories",
        "electronics",
        "lifestyle",
      ];

      for (const category of categories) {
        mockUpdate.mockResolvedValueOnce({ ...mockDeal, category });

        const request = new NextRequest(
          "http://localhost:3000/api/deals/deal-123",
          {
            method: "PUT",
            body: JSON.stringify({ category }),
            headers: { "Content-Type": "application/json" },
          },
        );

        const response = await PUT(request, {
          params: Promise.resolve({ id: "deal-123" }),
        });

        expect(response.status).toBe(200);
      }
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      mockRequireAdmin.mockResolvedValue({
        session: { user: { id: "admin-1", role: "ADMIN" } },
        error: null,
      });
    });

    it("returns 404 when deal not found (P2025 error)", async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        "Record not found",
        { code: "P2025", clientVersion: "5.0.0" },
      );
      mockUpdate.mockRejectedValueOnce(prismaError);

      const request = new NextRequest(
        "http://localhost:3000/api/deals/non-existent",
        {
          method: "PUT",
          body: JSON.stringify({ title: "Updated Title Here!!" }),
          headers: { "Content-Type": "application/json" },
        },
      );

      const response = await PUT(request, {
        params: Promise.resolve({ id: "non-existent" }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Deal non trouvé");
    });

    it("returns 500 on database error", async () => {
      mockUpdate.mockRejectedValueOnce(new Error("Database error"));

      const request = new NextRequest(
        "http://localhost:3000/api/deals/deal-123",
        {
          method: "PUT",
          body: JSON.stringify({ title: "Updated Title Here!!" }),
          headers: { "Content-Type": "application/json" },
        },
      );

      const response = await PUT(request, {
        params: Promise.resolve({ id: "deal-123" }),
      });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Erreur lors de la mise à jour du deal");
    });
  });
});

describe("DELETE /api/deals/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Authentication", () => {
    it("returns 401 when not authenticated", async () => {
      mockRequireAdmin.mockResolvedValueOnce({
        error: "Non authentifié",
        status: 401,
      });

      const request = new NextRequest(
        "http://localhost:3000/api/deals/deal-123",
        { method: "DELETE" },
      );

      const response = await DELETE(request, {
        params: Promise.resolve({ id: "deal-123" }),
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Non authentifié");
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("returns 403 when not admin", async () => {
      mockRequireAdmin.mockResolvedValueOnce({
        error: "Accès refusé",
        status: 403,
      });

      const request = new NextRequest(
        "http://localhost:3000/api/deals/deal-123",
        { method: "DELETE" },
      );

      const response = await DELETE(request, {
        params: Promise.resolve({ id: "deal-123" }),
      });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Accès refusé");
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe("Successful Deletion", () => {
    beforeEach(() => {
      mockRequireAdmin.mockResolvedValue({
        session: { user: { id: "admin-1", role: "ADMIN" } },
        error: null,
      });
    });

    it("soft deletes a deal by setting isActive to false", async () => {
      mockUpdate.mockResolvedValueOnce({ ...mockDeal, isActive: false });

      const request = new NextRequest(
        "http://localhost:3000/api/deals/deal-123",
        { method: "DELETE" },
      );

      const response = await DELETE(request, {
        params: Promise.resolve({ id: "deal-123" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe("Deal désactivé avec succès");
      expect(data.deal).toBeDefined();
      expect(data.deal.isActive).toBe(false);
    });

    it("calls update with correct parameters", async () => {
      mockUpdate.mockResolvedValueOnce({ ...mockDeal, isActive: false });

      const request = new NextRequest(
        "http://localhost:3000/api/deals/deal-123",
        { method: "DELETE" },
      );

      await DELETE(request, {
        params: Promise.resolve({ id: "deal-123" }),
      });

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: "deal-123" },
        data: { isActive: false },
      });
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      mockRequireAdmin.mockResolvedValue({
        session: { user: { id: "admin-1", role: "ADMIN" } },
        error: null,
      });
    });

    it("returns 404 when deal not found (P2025 error)", async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        "Record not found",
        { code: "P2025", clientVersion: "5.0.0" },
      );
      mockUpdate.mockRejectedValueOnce(prismaError);

      const request = new NextRequest(
        "http://localhost:3000/api/deals/non-existent",
        { method: "DELETE" },
      );

      const response = await DELETE(request, {
        params: Promise.resolve({ id: "non-existent" }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Deal non trouvé");
    });

    it("returns 500 on database error", async () => {
      mockUpdate.mockRejectedValueOnce(new Error("Database error"));

      const request = new NextRequest(
        "http://localhost:3000/api/deals/deal-123",
        { method: "DELETE" },
      );

      const response = await DELETE(request, {
        params: Promise.resolve({ id: "deal-123" }),
      });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Erreur lors de la suppression du deal");
    });
  });
});

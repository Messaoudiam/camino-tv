/**
 * @jest-environment node
 *
 * Tests for Deals API Routes
 * /api/deals - GET (list), POST (create - admin only)
 */

import { NextRequest } from "next/server";
import { GET, POST } from "../route";

// Mock Prisma
const mockFindMany = jest.fn();
const mockCount = jest.fn();
const mockCreate = jest.fn();

jest.mock("@/lib/db", () => ({
  prisma: {
    deal: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      count: (...args: unknown[]) => mockCount(...args),
      create: (...args: unknown[]) => mockCreate(...args),
    },
  },
}));

// Mock auth
const mockRequireAdmin = jest.fn();
jest.mock("@/lib/auth-helpers", () => ({
  requireAdmin: (...args: unknown[]) => mockRequireAdmin(...args),
}));

describe("GET /api/deals", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockDeals = [
    {
      id: "deal-1",
      title: "Nike Air Max 90 - Super promo",
      brand: "Nike",
      originalPrice: 150,
      currentPrice: 99,
      discountPercentage: 34,
      imageUrl: "https://example.com/nike.jpg",
      category: "sneakers",
      affiliateUrl: "https://affiliate.com/nike",
      isActive: true,
      createdAt: new Date("2025-01-01"),
      _count: { favorites: 5 },
    },
    {
      id: "deal-2",
      title: "Adidas Superstar Classic Edition",
      brand: "Adidas",
      originalPrice: 100,
      currentPrice: 75,
      discountPercentage: 25,
      imageUrl: "https://example.com/adidas.jpg",
      category: "sneakers",
      affiliateUrl: "https://affiliate.com/adidas",
      isActive: true,
      createdAt: new Date("2025-01-02"),
      _count: { favorites: 3 },
    },
  ];

  describe("Public Access", () => {
    it("returns all active deals", async () => {
      mockFindMany.mockResolvedValueOnce(mockDeals);
      mockCount.mockResolvedValueOnce(2);

      const request = new NextRequest("http://localhost:3000/api/deals");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.deals).toHaveLength(2);
      expect(data.pagination.total).toBe(2);
    });

    it("filters by category", async () => {
      mockFindMany.mockResolvedValueOnce([mockDeals[0]]);
      mockCount.mockResolvedValueOnce(1);

      const request = new NextRequest(
        "http://localhost:3000/api/deals?category=sneakers",
      );
      const response = await GET(request);
      await response.json();

      expect(response.status).toBe(200);
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: "sneakers",
          }),
        }),
      );
    });

    it("supports pagination with limit and offset", async () => {
      mockFindMany.mockResolvedValueOnce([mockDeals[0]]);
      mockCount.mockResolvedValueOnce(10);

      const request = new NextRequest(
        "http://localhost:3000/api/deals?limit=1&offset=5",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 1,
          skip: 5,
        }),
      );
      expect(data.pagination.hasMore).toBe(true);
    });

    it("enforces maximum limit of 100", async () => {
      mockFindMany.mockResolvedValueOnce([]);
      mockCount.mockResolvedValueOnce(0);

      const request = new NextRequest(
        "http://localhost:3000/api/deals?limit=500",
      );
      await GET(request);

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 100, // Max limit enforced
        }),
      );
    });

    it("ignores invalid category", async () => {
      mockFindMany.mockResolvedValueOnce(mockDeals);
      mockCount.mockResolvedValueOnce(2);

      const request = new NextRequest(
        "http://localhost:3000/api/deals?category=invalid",
      );
      await GET(request);

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.not.objectContaining({
            category: "invalid",
          }),
        }),
      );
    });

    it("only shows active deals for public users", async () => {
      mockFindMany.mockResolvedValueOnce(mockDeals);
      mockCount.mockResolvedValueOnce(2);

      const request = new NextRequest("http://localhost:3000/api/deals");
      await GET(request);

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: true,
          }),
        }),
      );
    });
  });

  describe("Admin Access with ?all=true", () => {
    it("shows all deals including inactive for admin", async () => {
      mockRequireAdmin.mockResolvedValueOnce({ session: {}, error: null });
      mockFindMany.mockResolvedValueOnce(mockDeals);
      mockCount.mockResolvedValueOnce(2);

      const request = new NextRequest(
        "http://localhost:3000/api/deals?all=true",
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      // When admin, isActive filter should not be applied
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.not.objectContaining({
            isActive: true,
          }),
        }),
      );
    });

    it("ignores ?all=true for non-admin users", async () => {
      mockRequireAdmin.mockResolvedValueOnce({
        error: "Non autorisé",
        status: 403,
      });
      mockFindMany.mockResolvedValueOnce(mockDeals);
      mockCount.mockResolvedValueOnce(2);

      const request = new NextRequest(
        "http://localhost:3000/api/deals?all=true",
      );
      await GET(request);

      // Should still filter by isActive
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: true,
          }),
        }),
      );
    });
  });

  describe("Error Handling", () => {
    it("returns 500 on database error", async () => {
      mockFindMany.mockRejectedValueOnce(new Error("Database error"));

      const request = new NextRequest("http://localhost:3000/api/deals");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Erreur lors de la récupération des deals");
    });
  });
});

describe("POST /api/deals", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validDealData = {
    title: "Nike Air Force 1 - Offre exceptionnelle",
    brand: "Nike",
    originalPrice: 120,
    currentPrice: 89,
    discountPercentage: 26,
    imageUrl: "https://example.com/nike-af1.jpg",
    category: "sneakers",
    affiliateUrl: "https://affiliate.com/nike-af1",
    promoCode: "SAVE20",
    promoDescription: "20% de réduction",
    isNew: true,
    isLimited: false,
  };

  describe("Authentication", () => {
    it("returns 401 when not authenticated", async () => {
      mockRequireAdmin.mockResolvedValueOnce({
        error: "Non authentifié",
        status: 401,
      });

      const request = new NextRequest("http://localhost:3000/api/deals", {
        method: "POST",
        body: JSON.stringify(validDealData),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Non authentifié");
    });

    it("returns 403 when not admin", async () => {
      mockRequireAdmin.mockResolvedValueOnce({
        error: "Accès refusé",
        status: 403,
      });

      const request = new NextRequest("http://localhost:3000/api/deals", {
        method: "POST",
        body: JSON.stringify(validDealData),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Accès refusé");
    });
  });

  describe("Successful Creation", () => {
    beforeEach(() => {
      mockRequireAdmin.mockResolvedValue({ session: {}, error: null });
    });

    it("creates a new deal with valid data", async () => {
      const createdDeal = { id: "new-deal-id", ...validDealData };
      mockCreate.mockResolvedValueOnce(createdDeal);

      const request = new NextRequest("http://localhost:3000/api/deals", {
        method: "POST",
        body: JSON.stringify(validDealData),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.id).toBe("new-deal-id");
      expect(data.title).toBe(validDealData.title);
    });

    it("creates deal without optional fields", async () => {
      const minimalData = {
        title: "Minimal Deal Title Here",
        brand: "Brand",
        originalPrice: 100,
        currentPrice: 80,
        discountPercentage: 20,
        imageUrl: "https://example.com/image.jpg",
        category: "streetwear",
        affiliateUrl: "https://affiliate.com/deal",
      };

      mockCreate.mockResolvedValueOnce({ id: "deal-id", ...minimalData });

      const request = new NextRequest("http://localhost:3000/api/deals", {
        method: "POST",
        body: JSON.stringify(minimalData),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
      expect(mockCreate).toHaveBeenCalled();
    });
  });

  describe("Validation", () => {
    beforeEach(() => {
      mockRequireAdmin.mockResolvedValue({ session: {}, error: null });
    });

    it("returns 400 when title is too short", async () => {
      const invalidData = { ...validDealData, title: "Short" };

      const request = new NextRequest("http://localhost:3000/api/deals", {
        method: "POST",
        body: JSON.stringify(invalidData),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Données invalides");
      expect(data.details).toBeDefined();
    });

    it("returns 400 when brand is too short", async () => {
      const invalidData = { ...validDealData, brand: "X" };

      const request = new NextRequest("http://localhost:3000/api/deals", {
        method: "POST",
        body: JSON.stringify(invalidData),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it("returns 400 when prices are not positive", async () => {
      const invalidData = { ...validDealData, originalPrice: -50 };

      const request = new NextRequest("http://localhost:3000/api/deals", {
        method: "POST",
        body: JSON.stringify(invalidData),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it("returns 400 when discount is out of range", async () => {
      const invalidData = { ...validDealData, discountPercentage: 150 };

      const request = new NextRequest("http://localhost:3000/api/deals", {
        method: "POST",
        body: JSON.stringify(invalidData),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it("returns 400 when category is invalid", async () => {
      const invalidData = { ...validDealData, category: "invalid_category" };

      const request = new NextRequest("http://localhost:3000/api/deals", {
        method: "POST",
        body: JSON.stringify(invalidData),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it("returns 400 when imageUrl is invalid", async () => {
      const invalidData = { ...validDealData, imageUrl: "not-a-url" };

      const request = new NextRequest("http://localhost:3000/api/deals", {
        method: "POST",
        body: JSON.stringify(invalidData),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it("returns 400 when affiliateUrl is invalid", async () => {
      const invalidData = { ...validDealData, affiliateUrl: "not-a-url" };

      const request = new NextRequest("http://localhost:3000/api/deals", {
        method: "POST",
        body: JSON.stringify(invalidData),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);

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
        mockCreate.mockResolvedValueOnce({
          id: `deal-${category}`,
          ...validDealData,
          category,
        });

        const request = new NextRequest("http://localhost:3000/api/deals", {
          method: "POST",
          body: JSON.stringify({ ...validDealData, category }),
          headers: { "Content-Type": "application/json" },
        });

        const response = await POST(request);

        expect(response.status).toBe(201);
      }
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      mockRequireAdmin.mockResolvedValue({ session: {}, error: null });
    });

    it("returns 500 on database error", async () => {
      mockCreate.mockRejectedValueOnce(new Error("Database error"));

      const request = new NextRequest("http://localhost:3000/api/deals", {
        method: "POST",
        body: JSON.stringify(validDealData),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Erreur lors de la création du deal");
    });
  });
});

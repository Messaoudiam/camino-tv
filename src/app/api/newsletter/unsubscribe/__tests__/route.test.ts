/**
 * @jest-environment node
 *
 * Tests for Newsletter Unsubscribe API Routes
 * /api/newsletter/unsubscribe - GET, POST
 */

import { NextRequest } from "next/server";
import { GET, POST } from "../route";

// Mock Prisma
const mockFindUnique = jest.fn();
const mockUpdate = jest.fn();

jest.mock("@/lib/db", () => ({
  prisma: {
    newsletterSubscriber: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
    },
  },
}));

describe("POST /api/newsletter/unsubscribe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validEmail = "test@example.com";

  describe("Validation", () => {
    it("returns 400 when email is missing", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/newsletter/unsubscribe",
        {
          method: "POST",
          body: JSON.stringify({}),
          headers: { "Content-Type": "application/json" },
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it("returns 400 when email format is invalid", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/newsletter/unsubscribe",
        {
          method: "POST",
          body: JSON.stringify({ email: "invalid-email" }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("L'adresse email n'est pas valide");
    });
  });

  describe("Unsubscribe Flow", () => {
    it("returns 404 when email is not subscribed", async () => {
      mockFindUnique.mockResolvedValue(null);

      const request = new NextRequest(
        "http://localhost:3000/api/newsletter/unsubscribe",
        {
          method: "POST",
          body: JSON.stringify({ email: validEmail }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe(
        "Cette adresse email n'est pas inscrite à la newsletter"
      );
    });

    it("returns success message when already unsubscribed", async () => {
      mockFindUnique.mockResolvedValue({
        id: "sub-1",
        email: validEmail,
        status: "UNSUBSCRIBED",
      });

      const request = new NextRequest(
        "http://localhost:3000/api/newsletter/unsubscribe",
        {
          method: "POST",
          body: JSON.stringify({ email: validEmail }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe("Vous êtes déjà désinscrit de la newsletter");
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("unsubscribes active subscriber successfully", async () => {
      mockFindUnique.mockResolvedValue({
        id: "sub-1",
        email: validEmail,
        status: "ACTIVE",
      });
      mockUpdate.mockResolvedValue({
        id: "sub-1",
        email: validEmail,
        status: "UNSUBSCRIBED",
      });

      const request = new NextRequest(
        "http://localhost:3000/api/newsletter/unsubscribe",
        {
          method: "POST",
          body: JSON.stringify({ email: validEmail }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe(
        "Vous avez été désinscrit de la newsletter avec succès"
      );
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { email: validEmail },
        data: { status: "UNSUBSCRIBED" },
      });
    });

    it("normalizes email to lowercase", async () => {
      mockFindUnique.mockResolvedValue({
        id: "sub-1",
        email: "test@example.com",
        status: "ACTIVE",
      });
      mockUpdate.mockResolvedValue({
        id: "sub-1",
        email: "test@example.com",
        status: "UNSUBSCRIBED",
      });

      const request = new NextRequest(
        "http://localhost:3000/api/newsletter/unsubscribe",
        {
          method: "POST",
          body: JSON.stringify({ email: "TEST@EXAMPLE.COM" }),
          headers: { "Content-Type": "application/json" },
        }
      );

      await POST(request);

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });
  });

  describe("Error Handling", () => {
    it("returns 500 on database error", async () => {
      mockFindUnique.mockRejectedValue(new Error("Database error"));

      const request = new NextRequest(
        "http://localhost:3000/api/newsletter/unsubscribe",
        {
          method: "POST",
          body: JSON.stringify({ email: validEmail }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe(
        "Une erreur est survenue lors de la désinscription"
      );
    });
  });
});

describe("GET /api/newsletter/unsubscribe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validEmail = "test@example.com";

  describe("Validation", () => {
    it("returns 400 when email param is missing", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/newsletter/unsubscribe"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("L'adresse email est requise");
    });

    it("returns 400 when email format is invalid", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/newsletter/unsubscribe?email=invalid"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("L'adresse email n'est pas valide");
    });
  });

  describe("Unsubscribe via Link", () => {
    it("returns 404 when email is not subscribed", async () => {
      mockFindUnique.mockResolvedValue(null);

      const request = new NextRequest(
        `http://localhost:3000/api/newsletter/unsubscribe?email=${validEmail}`
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe(
        "Cette adresse email n'est pas inscrite à la newsletter"
      );
    });

    it("unsubscribes successfully via GET request", async () => {
      mockFindUnique.mockResolvedValue({
        id: "sub-1",
        email: validEmail,
        status: "ACTIVE",
      });
      mockUpdate.mockResolvedValue({
        id: "sub-1",
        email: validEmail,
        status: "UNSUBSCRIBED",
      });

      const request = new NextRequest(
        `http://localhost:3000/api/newsletter/unsubscribe?email=${validEmail}`
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe(
        "Vous avez été désinscrit de la newsletter avec succès"
      );
    });

    it("handles URL-encoded email addresses", async () => {
      const encodedEmail = encodeURIComponent("test+tag@example.com");
      mockFindUnique.mockResolvedValue({
        id: "sub-1",
        email: "test+tag@example.com",
        status: "ACTIVE",
      });
      mockUpdate.mockResolvedValue({
        id: "sub-1",
        email: "test+tag@example.com",
        status: "UNSUBSCRIBED",
      });

      const request = new NextRequest(
        `http://localhost:3000/api/newsletter/unsubscribe?email=${encodedEmail}`
      );

      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: "test+tag@example.com" },
      });
    });
  });
});

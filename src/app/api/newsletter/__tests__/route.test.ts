/**
 * @jest-environment node
 *
 * Tests for Newsletter API Routes
 * /api/newsletter - POST (subscribe)
 */

import { NextRequest } from "next/server";
import { POST } from "../route";

// Mock Prisma
const mockFindUnique = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();

jest.mock("@/lib/db", () => ({
  prisma: {
    newsletterSubscriber: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      create: (...args: unknown[]) => mockCreate(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
    },
  },
}));

// Mock email sending to avoid ESM import issues with Jest
jest.mock("@/lib/email/send", () => ({
  sendConfirmationEmail: jest.fn().mockResolvedValue({ success: true }),
  sendWelcomeEmail: jest.fn().mockResolvedValue({ success: true }),
}));

describe("POST /api/newsletter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validEmail = "test@example.com";

  describe("Validation", () => {
    it("returns 400 when email is missing", async () => {
      const request = new NextRequest("http://localhost:3000/api/newsletter", {
        method: "POST",
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      // Zod returns a different error for undefined vs empty string
      expect(data.error).toBeDefined();
    });

    it("returns 400 when email is empty string", async () => {
      const request = new NextRequest("http://localhost:3000/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email: "" }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("L'adresse email est requise");
    });

    it("returns 400 when email format is invalid", async () => {
      const invalidEmails = [
        "notanemail",
        "missing@domain",
        "@nodomain.com",
        "spaces in@email.com",
        "test@.com",
      ];

      for (const email of invalidEmails) {
        const request = new NextRequest("http://localhost:3000/api/newsletter", {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: { "Content-Type": "application/json" },
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("L'adresse email n'est pas valide");
      }
    });

    it("accepts valid email formats", async () => {
      const validEmails = [
        "simple@example.com",
        "user.name@domain.org",
        "user+tag@example.fr",
        "firstname.lastname@company.co.uk",
      ];

      for (const email of validEmails) {
        mockFindUnique.mockResolvedValue(null);
        mockCreate.mockResolvedValue({
          id: "test-id",
          email: email.toLowerCase().trim(),
          status: "PENDING",
          confirmationToken: "mock-token",
          subscribedAt: new Date(),
        });

        const request = new NextRequest("http://localhost:3000/api/newsletter", {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: { "Content-Type": "application/json" },
        });

        const response = await POST(request);
        expect(response.status).toBe(201);
      }
    });
  });

  describe("New Subscription (Double Opt-in)", () => {
    it("creates a new subscriber with status PENDING and sends confirmation email", async () => {
      mockFindUnique.mockResolvedValue(null);
      mockCreate.mockResolvedValue({
        id: "new-subscriber-id",
        email: validEmail,
        status: "PENDING",
        confirmationToken: "mock-token",
        subscribedAt: new Date("2025-01-15T10:00:00.000Z"),
      });

      const request = new NextRequest("http://localhost:3000/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email: validEmail }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.message).toContain("email de confirmation");
      expect(data.requiresConfirmation).toBe(true);
      expect(data.subscriber).toBeDefined();
      expect(data.subscriber.email).toBe(validEmail);
      expect(data.subscriber.id).toBe("new-subscriber-id");
    });

    it("normalizes email to lowercase", async () => {
      mockFindUnique.mockResolvedValue(null);
      mockCreate.mockResolvedValue({
        id: "new-subscriber-id",
        email: "test@example.com",
        status: "PENDING",
        confirmationToken: "mock-token",
        subscribedAt: new Date(),
      });

      const request = new NextRequest("http://localhost:3000/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email: "TEST@EXAMPLE.COM" }),
        headers: { "Content-Type": "application/json" },
      });

      await POST(request);

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(mockCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({ email: "test@example.com" }),
      });
    });

    it("trims whitespace from email", async () => {
      mockFindUnique.mockResolvedValue(null);
      mockCreate.mockResolvedValue({
        id: "new-subscriber-id",
        email: "test@example.com",
        status: "PENDING",
        confirmationToken: "mock-token",
        subscribedAt: new Date(),
      });

      const request = new NextRequest("http://localhost:3000/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email: "  test@example.com  " }),
        headers: { "Content-Type": "application/json" },
      });

      await POST(request);

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });
  });

  describe("Existing Subscriber - Active", () => {
    it("returns 409 when email is already subscribed and active", async () => {
      mockFindUnique.mockResolvedValue({
        id: "existing-id",
        email: validEmail,
        status: "ACTIVE",
        subscribedAt: new Date(),
      });

      const request = new NextRequest("http://localhost:3000/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email: validEmail }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe("Cette adresse email est déjà inscrite à la newsletter");
    });

    it("does not create duplicate when email exists (case insensitive)", async () => {
      mockFindUnique.mockResolvedValue({
        id: "existing-id",
        email: "test@example.com",
        status: "ACTIVE",
        subscribedAt: new Date(),
      });

      const request = new NextRequest("http://localhost:3000/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email: "TEST@EXAMPLE.COM" }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);

      expect(response.status).toBe(409);
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe("Existing Subscriber - Unsubscribed (Re-subscribe with Double Opt-in)", () => {
    it("sets status to PENDING and sends confirmation when previously unsubscribed", async () => {
      const existingSubscriber = {
        id: "existing-id",
        email: validEmail,
        status: "UNSUBSCRIBED",
        subscribedAt: new Date("2024-01-01T00:00:00.000Z"),
      };

      mockFindUnique.mockResolvedValue(existingSubscriber);
      mockUpdate.mockResolvedValue({
        ...existingSubscriber,
        status: "PENDING",
        confirmationToken: "new-token",
      });

      const request = new NextRequest("http://localhost:3000/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email: validEmail }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toContain("email de confirmation");
      expect(data.requiresConfirmation).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { email: validEmail },
        data: expect.objectContaining({ status: "PENDING" }),
      });
    });

    it("returns confirmation message after re-subscribe request", async () => {
      const subscribedAt = new Date("2024-01-01T00:00:00.000Z");
      mockFindUnique.mockResolvedValue({
        id: "existing-id",
        email: validEmail,
        status: "UNSUBSCRIBED",
        subscribedAt,
      });
      mockUpdate.mockResolvedValue({
        id: "existing-id",
        email: validEmail,
        status: "PENDING",
        confirmationToken: "new-token",
        subscribedAt,
      });

      const request = new NextRequest("http://localhost:3000/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email: validEmail }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toContain("email de confirmation");
      expect(data.requiresConfirmation).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("returns 500 on database error during findUnique", async () => {
      mockFindUnique.mockRejectedValue(new Error("Database connection failed"));

      const request = new NextRequest("http://localhost:3000/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email: validEmail }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Une erreur est survenue lors de l'inscription");
    });

    it("returns 500 on database error during create", async () => {
      mockFindUnique.mockResolvedValue(null);
      mockCreate.mockRejectedValue(new Error("Unique constraint violation"));

      const request = new NextRequest("http://localhost:3000/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email: validEmail }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Une erreur est survenue lors de l'inscription");
    });

    it("returns 500 on database error during update (reactivation)", async () => {
      mockFindUnique.mockResolvedValue({
        id: "existing-id",
        email: validEmail,
        status: "UNSUBSCRIBED",
        subscribedAt: new Date(),
      });
      mockUpdate.mockRejectedValue(new Error("Update failed"));

      const request = new NextRequest("http://localhost:3000/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email: validEmail }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Une erreur est survenue lors de l'inscription");
    });

    it("handles malformed JSON body", async () => {
      const request = new NextRequest("http://localhost:3000/api/newsletter", {
        method: "POST",
        body: "not valid json",
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Une erreur est survenue lors de l'inscription");
    });
  });

  describe("Response Format", () => {
    it("returns consistent response structure on success (new subscription)", async () => {
      mockFindUnique.mockResolvedValue(null);
      mockCreate.mockResolvedValue({
        id: "new-id",
        email: validEmail,
        status: "ACTIVE",
        subscribedAt: new Date("2025-01-15T10:00:00.000Z"),
      });

      const request = new NextRequest("http://localhost:3000/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email: validEmail }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data).toHaveProperty("message");
      expect(data).toHaveProperty("subscriber");
      expect(data.subscriber).toHaveProperty("id");
      expect(data.subscriber).toHaveProperty("email");
      expect(data.subscriber).toHaveProperty("subscribedAt");
      // Should not expose status in response
      expect(data.subscriber.status).toBeUndefined();
    });

    it("returns consistent error response structure", async () => {
      const request = new NextRequest("http://localhost:3000/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email: "invalid" }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data).toHaveProperty("error");
      expect(typeof data.error).toBe("string");
    });
  });
});

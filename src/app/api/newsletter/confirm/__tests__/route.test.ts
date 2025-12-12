/**
 * @jest-environment node
 *
 * Tests for Newsletter Confirmation API Route
 * /api/newsletter/confirm - GET (confirm subscription)
 */

import { NextRequest } from "next/server";
import { GET } from "../route";

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

// Mock email sending
jest.mock("@/lib/email/send", () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue({ success: true }),
}));

// Mock SITE_URL
jest.mock("@/lib/email", () => ({
  SITE_URL: "https://camino-tv.vercel.app",
}));

describe("GET /api/newsletter/confirm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validToken = "valid-confirmation-token-abc123";

  describe("Token Validation", () => {
    it("redirects to error page when token is missing", async () => {
      const request = new NextRequest(
        "https://camino-tv.vercel.app/api/newsletter/confirm"
      );

      const response = await GET(request);

      expect(response.status).toBe(307); // Redirect
      expect(response.headers.get("Location")).toContain(
        "/newsletter/confirmation?status=error&reason=missing_token"
      );
    });

    it("redirects to error page when token is invalid", async () => {
      mockFindUnique.mockResolvedValueOnce(null);

      const request = new NextRequest(
        `https://camino-tv.vercel.app/api/newsletter/confirm?token=invalid-token`
      );

      const response = await GET(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("Location")).toContain(
        "/newsletter/confirmation?status=error&reason=invalid_token"
      );
    });
  });

  describe("Successful Confirmation", () => {
    it("confirms subscription and redirects to success page", async () => {
      const mockSubscriber = {
        id: "sub-123",
        email: "test@example.com",
        status: "PENDING",
        confirmationToken: validToken,
        subscribedAt: new Date(),
      };

      mockFindUnique.mockResolvedValueOnce(mockSubscriber);
      mockUpdate.mockResolvedValueOnce({
        ...mockSubscriber,
        status: "ACTIVE",
        confirmationToken: null,
        confirmedAt: new Date(),
      });

      const request = new NextRequest(
        `https://camino-tv.vercel.app/api/newsletter/confirm?token=${validToken}`
      );

      const response = await GET(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("Location")).toContain(
        "/newsletter/confirmation?status=success"
      );
    });

    it("updates subscriber status to ACTIVE", async () => {
      const mockSubscriber = {
        id: "sub-123",
        email: "test@example.com",
        status: "PENDING",
        confirmationToken: validToken,
        subscribedAt: new Date(),
      };

      mockFindUnique.mockResolvedValueOnce(mockSubscriber);
      mockUpdate.mockResolvedValueOnce({});

      const request = new NextRequest(
        `https://camino-tv.vercel.app/api/newsletter/confirm?token=${validToken}`
      );

      await GET(request);

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: mockSubscriber.id },
        data: {
          status: "ACTIVE",
          confirmationToken: null,
          confirmedAt: expect.any(Date),
        },
      });
    });

    it("sends welcome email after confirmation", async () => {
      const mockSubscriber = {
        id: "sub-123",
        email: "test@example.com",
        status: "PENDING",
        confirmationToken: validToken,
        subscribedAt: new Date(),
      };

      mockFindUnique.mockResolvedValueOnce(mockSubscriber);
      mockUpdate.mockResolvedValueOnce({});

      const { sendWelcomeEmail } = require("@/lib/email/send");

      const request = new NextRequest(
        `https://camino-tv.vercel.app/api/newsletter/confirm?token=${validToken}`
      );

      await GET(request);

      expect(sendWelcomeEmail).toHaveBeenCalledWith(mockSubscriber.email);
    });

    it("clears confirmation token after use", async () => {
      const mockSubscriber = {
        id: "sub-123",
        email: "test@example.com",
        status: "PENDING",
        confirmationToken: validToken,
        subscribedAt: new Date(),
      };

      mockFindUnique.mockResolvedValueOnce(mockSubscriber);
      mockUpdate.mockResolvedValueOnce({});

      const request = new NextRequest(
        `https://camino-tv.vercel.app/api/newsletter/confirm?token=${validToken}`
      );

      await GET(request);

      const updateCall = mockUpdate.mock.calls[0][0];
      expect(updateCall.data.confirmationToken).toBeNull();
    });
  });

  describe("Already Confirmed", () => {
    it("redirects to already_confirmed status", async () => {
      const mockSubscriber = {
        id: "sub-123",
        email: "test@example.com",
        status: "ACTIVE", // Already confirmed
        confirmationToken: validToken,
        subscribedAt: new Date(),
        confirmedAt: new Date(),
      };

      mockFindUnique.mockResolvedValueOnce(mockSubscriber);

      const request = new NextRequest(
        `https://camino-tv.vercel.app/api/newsletter/confirm?token=${validToken}`
      );

      const response = await GET(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("Location")).toContain(
        "/newsletter/confirmation?status=already_confirmed"
      );
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("redirects to error page on database error", async () => {
      mockFindUnique.mockRejectedValueOnce(new Error("Database error"));

      const request = new NextRequest(
        `https://camino-tv.vercel.app/api/newsletter/confirm?token=${validToken}`
      );

      const response = await GET(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("Location")).toContain(
        "/newsletter/confirmation?status=error&reason=server_error"
      );
    });

    it("still succeeds if welcome email fails", async () => {
      const mockSubscriber = {
        id: "sub-123",
        email: "test@example.com",
        status: "PENDING",
        confirmationToken: validToken,
        subscribedAt: new Date(),
      };

      mockFindUnique.mockResolvedValueOnce(mockSubscriber);
      mockUpdate.mockResolvedValueOnce({});

      const { sendWelcomeEmail } = require("@/lib/email/send");
      sendWelcomeEmail.mockResolvedValueOnce({
        success: false,
        error: "SMTP error",
      });

      const request = new NextRequest(
        `https://camino-tv.vercel.app/api/newsletter/confirm?token=${validToken}`
      );

      const response = await GET(request);

      // Should still redirect to success (confirmation worked)
      expect(response.status).toBe(307);
      expect(response.headers.get("Location")).toContain(
        "/newsletter/confirmation?status=success"
      );
    });
  });

  describe("Security", () => {
    it("finds subscriber by token, not by email", async () => {
      mockFindUnique.mockResolvedValueOnce(null);

      const request = new NextRequest(
        `https://camino-tv.vercel.app/api/newsletter/confirm?token=${validToken}`
      );

      await GET(request);

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { confirmationToken: validToken },
      });
    });

    it("prevents token reuse after confirmation", async () => {
      const mockSubscriber = {
        id: "sub-123",
        email: "test@example.com",
        status: "PENDING",
        confirmationToken: validToken,
        subscribedAt: new Date(),
      };

      mockFindUnique.mockResolvedValueOnce(mockSubscriber);
      mockUpdate.mockResolvedValueOnce({});

      const request = new NextRequest(
        `https://camino-tv.vercel.app/api/newsletter/confirm?token=${validToken}`
      );

      await GET(request);

      // Token should be cleared
      const updateCall = mockUpdate.mock.calls[0][0];
      expect(updateCall.data.confirmationToken).toBeNull();
    });
  });
});

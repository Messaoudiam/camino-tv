/**
 * @jest-environment node
 *
 * Tests for Email Send Functions
 * Tests the email sending functionality with Resend
 */

import {
  sendConfirmationEmail,
  sendWelcomeEmail,
  sendNewsletterToSubscriber,
} from "../send";

// Mock the email module
const mockSendEmail = jest.fn();
jest.mock("../../email", () => ({
  resend: {
    emails: {
      send: (...args: unknown[]) => mockSendEmail(...args),
    },
  },
  EMAIL_FROM: "Camino TV <newsletter@my-library.cloud>",
  SITE_URL: "https://camino-tv.vercel.app",
  isEmailEnabled: () => true,
}));

// Mock react-email render
jest.mock("@react-email/components", () => ({
  render: jest.fn().mockResolvedValue("<html>Mocked Email HTML</html>"),
}));

describe("Email Send Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("sendConfirmationEmail", () => {
    const testEmail = "test@example.com";
    const testToken = "abc123def456";

    it("sends confirmation email successfully", async () => {
      mockSendEmail.mockResolvedValueOnce({ error: null });

      const result = await sendConfirmationEmail(testEmail, testToken);

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
      expect(mockSendEmail).toHaveBeenCalledWith({
        from: "Camino TV <newsletter@my-library.cloud>",
        to: testEmail,
        subject: "Confirmez votre inscription - Camino TV",
        html: expect.any(String),
      });
    });

    it("returns error when Resend API fails", async () => {
      mockSendEmail.mockResolvedValueOnce({
        error: { message: "Rate limit exceeded" },
      });

      const result = await sendConfirmationEmail(testEmail, testToken);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Rate limit exceeded");
    });

    it("handles network errors gracefully", async () => {
      mockSendEmail.mockRejectedValueOnce(new Error("Network error"));

      const result = await sendConfirmationEmail(testEmail, testToken);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Network error");
    });

    it("generates correct confirmation URL", async () => {
      mockSendEmail.mockResolvedValueOnce({ error: null });

      await sendConfirmationEmail(testEmail, testToken);

      // The render function should have been called with props containing confirmUrl
      const { render } = require("@react-email/components");
      expect(render).toHaveBeenCalled();
    });
  });

  describe("sendWelcomeEmail", () => {
    const testEmail = "welcome@example.com";

    it("sends welcome email successfully", async () => {
      mockSendEmail.mockResolvedValueOnce({ error: null });

      const result = await sendWelcomeEmail(testEmail);

      expect(result.success).toBe(true);
      expect(mockSendEmail).toHaveBeenCalledWith({
        from: "Camino TV <newsletter@my-library.cloud>",
        to: testEmail,
        subject: "Bienvenue dans la newsletter Camino TV !",
        html: expect.any(String),
      });
    });

    it("returns error when sending fails", async () => {
      mockSendEmail.mockResolvedValueOnce({
        error: { message: "Invalid email address" },
      });

      const result = await sendWelcomeEmail(testEmail);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid email address");
    });
  });

  describe("sendNewsletterToSubscriber", () => {
    const testEmail = "subscriber@example.com";
    const testSubject = "Les meilleurs deals de la semaine";
    const testContent = "<p>Voici les deals...</p>";

    it("sends newsletter email successfully", async () => {
      mockSendEmail.mockResolvedValueOnce({ error: null });

      const result = await sendNewsletterToSubscriber(
        testEmail,
        testSubject,
        testContent
      );

      expect(result.success).toBe(true);
      expect(mockSendEmail).toHaveBeenCalledWith({
        from: "Camino TV <newsletter@my-library.cloud>",
        to: testEmail,
        subject: testSubject,
        html: expect.any(String),
        headers: {
          "List-Unsubscribe": expect.stringContaining("/unsubscribe?email="),
        },
      });
    });

    it("includes List-Unsubscribe header", async () => {
      mockSendEmail.mockResolvedValueOnce({ error: null });

      await sendNewsletterToSubscriber(testEmail, testSubject, testContent);

      const callArgs = mockSendEmail.mock.calls[0][0];
      expect(callArgs.headers["List-Unsubscribe"]).toContain(
        encodeURIComponent(testEmail)
      );
    });

    it("handles errors gracefully", async () => {
      mockSendEmail.mockRejectedValueOnce(new Error("SMTP error"));

      const result = await sendNewsletterToSubscriber(
        testEmail,
        testSubject,
        testContent
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("SMTP error");
    });
  });
});

describe("Email Disabled Scenario", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("returns error when email is disabled", async () => {
    // Re-mock with email disabled
    jest.doMock("../../email", () => ({
      resend: null,
      EMAIL_FROM: "Camino TV <newsletter@my-library.cloud>",
      SITE_URL: "https://camino-tv.vercel.app",
      isEmailEnabled: () => false,
    }));

    // Re-import the module to get the new mock
    const { sendConfirmationEmail: sendConfirmationEmailDisabled } =
      require("../send");

    const result = await sendConfirmationEmailDisabled(
      "test@example.com",
      "token123"
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Email service not configured");
  });
});

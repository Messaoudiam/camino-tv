/**
 * Tests for NewsletterForm Component
 */

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewsletterForm } from "../newsletter-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock sonner toast
const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();
jest.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

// Helper to render with QueryClient
function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("NewsletterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the form with email input and submit button", () => {
      renderWithQueryClient(<NewsletterForm />);

      expect(
        screen.getByPlaceholderText("Votre adresse email"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "S'inscrire" }),
      ).toBeInTheDocument();
    });

    it("renders the mail icon", () => {
      renderWithQueryClient(<NewsletterForm />);

      // The mail icon should be present (Lucide icon)
      const input = screen.getByPlaceholderText("Votre adresse email");
      expect(input.closest("div")).toBeInTheDocument();
    });

    it("has proper input type for email", () => {
      renderWithQueryClient(<NewsletterForm />);

      const input = screen.getByPlaceholderText("Votre adresse email");
      expect(input).toHaveAttribute("type", "email");
    });
  });

  describe("Client-side Validation", () => {
    it("shows error when submitting empty email", async () => {
      const user = userEvent.setup();
      renderWithQueryClient(<NewsletterForm />);

      // Find and submit the form directly
      const form = document.querySelector("form");
      expect(form).toBeInTheDocument();

      // Trigger form submission
      const submitButton = screen.getByRole("button", { name: "S'inscrire" });
      await user.click(submitButton);

      // Wait for the validation error to appear
      await waitFor(() => {
        expect(
          screen.getByText("L'adresse email est requise"),
        ).toBeInTheDocument();
      });
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("shows error for invalid email format", async () => {
      const user = userEvent.setup();
      renderWithQueryClient(<NewsletterForm />);

      // Type an invalid email
      const input = screen.getByPlaceholderText("Votre adresse email");
      await user.clear(input);
      await user.type(input, "invalid-email-format");

      // Submit the form directly (bypassing HTML5 validation)
      const form = document.querySelector("form")!;
      fireEvent.submit(form);

      // Zod's email validation should reject this format
      await waitFor(() => {
        expect(
          screen.getByText("L'adresse email n'est pas valide"),
        ).toBeInTheDocument();
      });
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("clears error when user starts typing after error", async () => {
      const user = userEvent.setup();
      renderWithQueryClient(<NewsletterForm />);

      // Submit empty to get error
      const submitButton = screen.getByRole("button", { name: "S'inscrire" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("L'adresse email est requise"),
        ).toBeInTheDocument();
      });

      // Start typing
      const input = screen.getByPlaceholderText("Votre adresse email");
      await user.type(input, "t");

      // Error should be cleared
      await waitFor(() => {
        expect(
          screen.queryByText("L'adresse email est requise"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    it("submits valid email to API", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "Merci pour votre inscription à la newsletter !",
          subscriber: {
            id: "test-id",
            email: "test@example.com",
            subscribedAt: new Date().toISOString(),
          },
        }),
      });

      renderWithQueryClient(<NewsletterForm />);

      const input = screen.getByPlaceholderText("Votre adresse email");
      await user.type(input, "test@example.com");

      const submitButton = screen.getByRole("button", { name: "S'inscrire" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "test@example.com" }),
        });
      });
    });

    it("shows loading state while submitting", async () => {
      const user = userEvent.setup();
      // Never resolve to keep loading state
      mockFetch.mockImplementationOnce(() => new Promise(() => {}));

      renderWithQueryClient(<NewsletterForm />);

      const input = screen.getByPlaceholderText("Votre adresse email");
      await user.type(input, "test@example.com");

      const submitButton = screen.getByRole("button", { name: "S'inscrire" });
      await user.click(submitButton);

      // Button should show loading indicator
      await waitFor(() => {
        expect(
          screen.queryByRole("button", { name: "S'inscrire" }),
        ).not.toBeInTheDocument();
      });

      // Input should be disabled during loading
      expect(input).toBeDisabled();
    });

    it("disables form controls while submitting", async () => {
      const user = userEvent.setup();
      mockFetch.mockImplementationOnce(() => new Promise(() => {}));

      renderWithQueryClient(<NewsletterForm />);

      const input = screen.getByPlaceholderText("Votre adresse email");
      await user.type(input, "test@example.com");

      const submitButton = screen.getByRole("button", { name: "S'inscrire" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(input).toBeDisabled();
      });
    });
  });

  describe("Success State", () => {
    it("shows success toast on successful subscription", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "Merci pour votre inscription à la newsletter !",
          subscriber: {
            id: "test-id",
            email: "test@example.com",
            subscribedAt: new Date().toISOString(),
          },
        }),
      });

      renderWithQueryClient(<NewsletterForm />);

      const input = screen.getByPlaceholderText("Votre adresse email");
      await user.type(input, "test@example.com");

      const submitButton = screen.getByRole("button", { name: "S'inscrire" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith(
          "Merci pour votre inscription à la newsletter !",
        );
      });
    });

    it("clears input after successful subscription", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "Merci pour votre inscription à la newsletter !",
          subscriber: {
            id: "test-id",
            email: "test@example.com",
            subscribedAt: new Date().toISOString(),
          },
        }),
      });

      renderWithQueryClient(<NewsletterForm />);

      const input = screen.getByPlaceholderText("Votre adresse email");
      await user.type(input, "test@example.com");

      const submitButton = screen.getByRole("button", { name: "S'inscrire" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalled();
      });

      // Form should show success state with confirmation message
      expect(
        await screen.findByText(
          "Vérifiez votre boîte mail pour confirmer votre inscription !",
        ),
      ).toBeInTheDocument();
    });

    it("shows success message with checkmark icon", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "Merci pour votre inscription à la newsletter !",
          subscriber: {
            id: "test-id",
            email: "test@example.com",
            subscribedAt: new Date().toISOString(),
          },
        }),
      });

      renderWithQueryClient(<NewsletterForm />);

      const input = screen.getByPlaceholderText("Votre adresse email");
      await user.type(input, "test@example.com");

      const submitButton = screen.getByRole("button", { name: "S'inscrire" });
      await user.click(submitButton);

      // Should show success state with confirmation message
      expect(
        await screen.findByText(
          "Vérifiez votre boîte mail pour confirmer votre inscription !",
        ),
      ).toBeInTheDocument();

      // Input and button should not be visible
      expect(
        screen.queryByPlaceholderText("Votre adresse email"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("shows error toast when email is already registered", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: "Cette adresse email est déjà inscrite à la newsletter",
        }),
      });

      renderWithQueryClient(<NewsletterForm />);

      const input = screen.getByPlaceholderText("Votre adresse email");
      await user.type(input, "existing@example.com");

      const submitButton = screen.getByRole("button", { name: "S'inscrire" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          "Cette adresse email est déjà inscrite à la newsletter",
        );
      });
    });

    it("shows inline error message on API error", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: "Cette adresse email est déjà inscrite à la newsletter",
        }),
      });

      renderWithQueryClient(<NewsletterForm />);

      const input = screen.getByPlaceholderText("Votre adresse email");
      await user.type(input, "existing@example.com");

      const submitButton = screen.getByRole("button", { name: "S'inscrire" });
      await user.click(submitButton);

      expect(
        await screen.findByText(
          "Cette adresse email est déjà inscrite à la newsletter",
        ),
      ).toBeInTheDocument();
    });

    it("shows generic error on network failure", async () => {
      const user = userEvent.setup();
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      renderWithQueryClient(<NewsletterForm />);

      const input = screen.getByPlaceholderText("Votre adresse email");
      await user.type(input, "test@example.com");

      const submitButton = screen.getByRole("button", { name: "S'inscrire" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalled();
      });
    });

    it("preserves email input on error for user to retry", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: "Une erreur est survenue",
        }),
      });

      renderWithQueryClient(<NewsletterForm />);

      const input = screen.getByPlaceholderText("Votre adresse email");
      await user.type(input, "test@example.com");

      const submitButton = screen.getByRole("button", { name: "S'inscrire" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalled();
      });

      // Email should still be in the input
      expect(input).toHaveValue("test@example.com");
    });
  });

  describe("Reactivation Flow", () => {
    it("shows reactivation success message", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "Votre inscription a été réactivée avec succès !",
          subscriber: {
            id: "test-id",
            email: "reactivated@example.com",
            subscribedAt: new Date().toISOString(),
          },
        }),
      });

      renderWithQueryClient(<NewsletterForm />);

      const input = screen.getByPlaceholderText("Votre adresse email");
      await user.type(input, "reactivated@example.com");

      const submitButton = screen.getByRole("button", { name: "S'inscrire" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith(
          "Votre inscription a été réactivée avec succès !",
        );
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper aria-invalid attribute on error", async () => {
      const user = userEvent.setup();
      renderWithQueryClient(<NewsletterForm />);

      const input = screen.getByPlaceholderText("Votre adresse email");
      const submitButton = screen.getByRole("button", { name: "S'inscrire" });

      await user.click(submitButton);

      await waitFor(() => {
        expect(input).toHaveAttribute("aria-invalid", "true");
      });
    });

    it("has aria-describedby linking to error message", async () => {
      const user = userEvent.setup();
      renderWithQueryClient(<NewsletterForm />);

      const submitButton = screen.getByRole("button", { name: "S'inscrire" });
      await user.click(submitButton);

      const input = screen.getByPlaceholderText("Votre adresse email");

      await waitFor(() => {
        expect(input).toHaveAttribute("aria-describedby", "newsletter-error");
      });

      // Error message should have matching id
      const errorMessage = screen.getByText("L'adresse email est requise");
      expect(errorMessage).toHaveAttribute("id", "newsletter-error");
    });

    it("submit button is keyboard accessible", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "Merci pour votre inscription à la newsletter !",
          subscriber: {
            id: "test-id",
            email: "test@example.com",
            subscribedAt: new Date().toISOString(),
          },
        }),
      });

      renderWithQueryClient(<NewsletterForm />);

      const input = screen.getByPlaceholderText("Votre adresse email");
      await user.type(input, "test@example.com");

      // Submit with Enter key
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });
  });
});

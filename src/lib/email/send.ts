import { resend, EMAIL_FROM, SITE_URL, isEmailEnabled } from "../email";
import {
  ConfirmationEmail,
  WelcomeEmail,
  NewsletterEmail,
  ContactEmail,
} from "./templates";
import { render } from "@react-email/components";

/**
 * Send confirmation email for double opt-in
 */
export async function sendConfirmationEmail(
  email: string,
  token: string,
): Promise<{ success: boolean; error?: string }> {
  if (!isEmailEnabled() || !resend) {
    console.warn("Email is disabled. Skipping confirmation email.");
    return { success: false, error: "Email service not configured" };
  }

  const confirmUrl = `${SITE_URL}/api/newsletter/confirm?token=${token}`;

  try {
    const html = await render(ConfirmationEmail({ confirmUrl }));

    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "Confirmez votre inscription - Camino TV",
      html,
    });

    if (error) {
      console.error("Failed to send confirmation email:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Error sending confirmation email:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Send welcome email after confirmation
 */
export async function sendWelcomeEmail(
  email: string,
): Promise<{ success: boolean; error?: string }> {
  if (!isEmailEnabled() || !resend) {
    console.warn("Email is disabled. Skipping welcome email.");
    return { success: false, error: "Email service not configured" };
  }

  const unsubscribeUrl = `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;

  try {
    const html = await render(WelcomeEmail({ unsubscribeUrl }));

    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "Bienvenue dans la newsletter Camino TV !",
      html,
    });

    if (error) {
      console.error("Failed to send welcome email:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Error sending welcome email:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Send newsletter campaign to a single subscriber
 */
export async function sendNewsletterToSubscriber(
  email: string,
  subject: string,
  content: string,
): Promise<{ success: boolean; error?: string }> {
  if (!isEmailEnabled() || !resend) {
    return { success: false, error: "Email service not configured" };
  }

  const unsubscribeUrl = `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;

  try {
    const html = await render(
      NewsletterEmail({ subject, content, unsubscribeUrl }),
    );

    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject,
      html,
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Send contact form notification to admin
 */
export async function sendContactEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!isEmailEnabled() || !resend) {
    console.warn("Email is disabled. Skipping contact notification.");
    return { success: false, error: "Email service not configured" };
  }

  // Email admin address (use the same as sender domain or configure separately)
  const adminEmail = process.env.CONTACT_EMAIL || "contact@camino-tv.com";

  try {
    const html = await render(ContactEmail(data));

    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: adminEmail,
      replyTo: data.email,
      subject: `[Contact] ${data.subject} - ${data.firstName} ${data.lastName}`,
      html,
    });

    if (error) {
      console.error("Failed to send contact email:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Error sending contact email:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

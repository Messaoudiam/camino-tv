import { Resend } from "resend";

// Initialize Resend client
const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn(
    "RESEND_API_KEY is not set. Email functionality will be disabled.",
  );
}

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Email configuration
export const EMAIL_FROM = "Camino TV <newsletter@my-library.cloud>";
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Check if email sending is available
 */
export function isEmailEnabled(): boolean {
  return resend !== null;
}

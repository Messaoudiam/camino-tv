import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/email/send";
import { SITE_URL } from "@/lib/email";

/**
 * GET /api/newsletter/confirm?token=xxx
 * Confirm newsletter subscription via email link
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      // Redirect to error page
      return NextResponse.redirect(
        new URL(
          "/newsletter/confirmation?status=error&reason=missing_token",
          SITE_URL,
        ),
      );
    }

    // Find subscriber by confirmation token
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { confirmationToken: token },
    });

    if (!subscriber) {
      // Token not found or already used
      return NextResponse.redirect(
        new URL(
          "/newsletter/confirmation?status=error&reason=invalid_token",
          SITE_URL,
        ),
      );
    }

    // Check if already confirmed
    if (subscriber.status === "ACTIVE") {
      return NextResponse.redirect(
        new URL("/newsletter/confirmation?status=already_confirmed", SITE_URL),
      );
    }

    // Confirm subscription
    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: "ACTIVE",
        confirmationToken: null, // Clear token after use
        confirmedAt: new Date(),
      },
    });

    // Send welcome email
    const emailResult = await sendWelcomeEmail(subscriber.email);
    if (!emailResult.success) {
      console.error("Failed to send welcome email:", emailResult.error);
      // Don't fail - confirmation is complete even if welcome email fails
    }

    // Redirect to success page
    return NextResponse.redirect(
      new URL("/newsletter/confirmation?status=success", SITE_URL),
    );
  } catch (error) {
    console.error("Error confirming newsletter subscription:", error);
    return NextResponse.redirect(
      new URL(
        "/newsletter/confirmation?status=error&reason=server_error",
        SITE_URL,
      ),
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { randomBytes } from "crypto";
import { sendConfirmationEmail } from "@/lib/email/send";

// Validation schema pour l'inscription newsletter
const subscribeSchema = z.object({
  email: z
    .string()
    .min(1, "L'adresse email est requise")
    .transform((val) => val.toLowerCase().trim())
    .pipe(z.string().email("L'adresse email n'est pas valide")),
});

/**
 * Generate a secure confirmation token
 */
function generateToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * POST /api/newsletter
 * Subscribe to the newsletter (public) - sends confirmation email for double opt-in
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = subscribeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 },
      );
    }

    // Email is already normalized (lowercased + trimmed) by Zod transform
    const { email } = validation.data;

    // Check if email already exists
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      // If already subscribed and active
      if (existingSubscriber.status === "ACTIVE") {
        return NextResponse.json(
          { error: "Cette adresse email est déjà inscrite à la newsletter" },
          { status: 409 },
        );
      }

      // If PENDING, resend confirmation email with new token
      if (existingSubscriber.status === "PENDING") {
        const newToken = generateToken();
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { confirmationToken: newToken },
        });

        // Send confirmation email
        const emailResult = await sendConfirmationEmail(email, newToken);
        if (!emailResult.success) {
          console.error(
            "Failed to resend confirmation email:",
            emailResult.error,
          );
        }

        return NextResponse.json(
          {
            message:
              "Un email de confirmation vous a été renvoyé. Vérifiez votre boîte de réception.",
            requiresConfirmation: true,
          },
          { status: 200 },
        );
      }

      // If previously unsubscribed, create new token and send confirmation
      const newToken = generateToken();
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: {
          status: "PENDING",
          confirmationToken: newToken,
          confirmedAt: null,
        },
      });

      // Send confirmation email
      const emailResult = await sendConfirmationEmail(email, newToken);
      if (!emailResult.success) {
        console.error("Failed to send confirmation email:", emailResult.error);
      }

      return NextResponse.json(
        {
          message:
            "Un email de confirmation vous a été envoyé. Vérifiez votre boîte de réception.",
          requiresConfirmation: true,
        },
        { status: 200 },
      );
    }

    // Create new subscriber with PENDING status and confirmation token
    const confirmationToken = generateToken();
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        status: "PENDING",
        confirmationToken,
      },
    });

    // Send confirmation email
    const emailResult = await sendConfirmationEmail(email, confirmationToken);
    if (!emailResult.success) {
      console.error("Failed to send confirmation email:", emailResult.error);
      // Don't fail the request - subscriber is created, email can be resent
    }

    return NextResponse.json(
      {
        message:
          "Un email de confirmation vous a été envoyé. Vérifiez votre boîte de réception.",
        requiresConfirmation: true,
        subscriber: {
          id: subscriber.id,
          email: subscriber.email,
          subscribedAt: subscriber.subscribedAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'inscription" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { serverContactFormSchema } from "@/lib/validations/contact";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendContactEmail } from "@/lib/email/send";
import { ContactCategory } from "@prisma/client";
import { auth } from "@/lib/auth";

/**
 * POST /api/contact
 * Public endpoint - handles contact form submissions
 * Validates input, stores in database, and sends email notification
 * If user is authenticated, links message to their account
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with server-side schema (includes XSS protection)
    const validatedData = serverContactFormSchema.parse(body);

    // Check if user is authenticated (optional)
    let userId: string | undefined;
    try {
      const session = await auth.api.getSession({ headers: request.headers });
      if (session?.user?.id) {
        userId = session.user.id;
      }
    } catch {
      // Not authenticated, that's fine - continue without userId
    }

    // Store in database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        category: validatedData.category as ContactCategory,
        subject: validatedData.subject,
        message: validatedData.message,
        userId, // Link to user if authenticated
      },
    });

    // Send email notification to admin (don't fail if email fails)
    const emailResult = await sendContactEmail({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      category: validatedData.category,
      subject: validatedData.subject,
      message: validatedData.message,
    });

    if (!emailResult.success) {
      console.warn("Failed to send contact email notification:", emailResult.error);
      // Don't fail the request - message is stored in database
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
        id: contactMessage.id,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Données invalides",
          details: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message. Veuillez réessayer." },
      { status: 500 },
    );
  }
}

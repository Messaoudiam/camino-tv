import { NextRequest, NextResponse } from "next/server";
import { serverContactFormSchema } from "@/lib/validations/contact";
import { z } from "zod";

/**
 * POST /api/contact
 * Public endpoint - handles contact form submissions
 * Validates input with Zod and stores/sends the message
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with server-side schema (includes XSS protection)
    const validatedData = serverContactFormSchema.parse(body);

    // Log the contact request (in production, you would:
    // 1. Store in database
    // 2. Send email notification
    // 3. Integrate with CRM, etc.)
    console.log("Contact form submission:", {
      name: `${validatedData.firstName} ${validatedData.lastName}`,
      email: validatedData.email,
      category: validatedData.category,
      subject: validatedData.subject,
      messageLength: validatedData.message.length,
      timestamp: new Date().toISOString(),
    });

    // TODO: In production, implement one of these:
    // - Send email via Resend/SendGrid/Mailgun
    // - Store in database (prisma.contactMessage.create)
    // - Send to Slack/Discord webhook
    // - Integrate with CRM (HubSpot, Salesforce, etc.)

    return NextResponse.json(
      {
        success: true,
        message: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
      },
      { status: 201 }
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
        { status: 400 }
      );
    }

    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message. Veuillez réessayer." },
      { status: 500 }
    );
  }
}

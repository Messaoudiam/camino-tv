import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { z } from "zod";
import { sendNewsletterToSubscriber } from "@/lib/email/send";
import { isEmailEnabled } from "@/lib/email";

const sendNewsletterSchema = z.object({
  subject: z
    .string()
    .min(1, "Le sujet est requis")
    .max(200, "Le sujet est trop long"),
  content: z.string().min(1, "Le contenu est requis"),
});

/**
 * POST /api/admin/newsletter/send
 * Send newsletter to all active subscribers (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // CRITICAL SECURITY: Multi-layered auth check
    const authResult = await requireAdmin(request.headers);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    // Check if email is enabled
    if (!isEmailEnabled()) {
      return NextResponse.json(
        { error: "Le service email n'est pas configuré" },
        { status: 503 },
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = sendNewsletterSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 },
      );
    }

    const { subject, content } = validation.data;

    // Get all active subscribers
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { status: "ACTIVE" },
      select: { email: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: "Aucun abonné actif" },
        { status: 400 },
      );
    }

    // Send emails to all subscribers
    const results = await Promise.allSettled(
      subscribers.map((sub) =>
        sendNewsletterToSubscriber(sub.email, subject, content),
      ),
    );

    // Count successes and failures
    const sent = results.filter(
      (r) => r.status === "fulfilled" && r.value.success,
    ).length;
    const failed = results.length - sent;

    // Log failures
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Failed to send to ${subscribers[index].email}:`,
          result.reason,
        );
      } else if (!result.value.success) {
        console.error(
          `Failed to send to ${subscribers[index].email}:`,
          result.value.error,
        );
      }
    });

    return NextResponse.json({
      message: `Newsletter envoyée à ${sent} abonné${sent > 1 ? "s" : ""}`,
      stats: {
        total: subscribers.length,
        sent,
        failed,
      },
    });
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de la newsletter" },
      { status: 500 },
    );
  }
}

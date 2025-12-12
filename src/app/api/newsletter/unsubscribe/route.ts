import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Validation schema
const unsubscribeSchema = z.object({
  email: z
    .string()
    .min(1, "L'adresse email est requise")
    .transform((val) => val.toLowerCase().trim())
    .pipe(z.string().email("L'adresse email n'est pas valide")),
});

/**
 * POST /api/newsletter/unsubscribe
 * Unsubscribe from the newsletter
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = unsubscribeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Find subscriber
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Cette adresse email n'est pas inscrite à la newsletter" },
        { status: 404 }
      );
    }

    if (subscriber.status === "UNSUBSCRIBED") {
      return NextResponse.json(
        { message: "Vous êtes déjà désinscrit de la newsletter" },
        { status: 200 }
      );
    }

    // Update status to UNSUBSCRIBED
    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { status: "UNSUBSCRIBED" },
    });

    return NextResponse.json(
      { message: "Vous avez été désinscrit de la newsletter avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unsubscribing from newsletter:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la désinscription" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/newsletter/unsubscribe?email=xxx
 * Unsubscribe via link (for email footer links)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get("email");

    if (!emailParam) {
      return NextResponse.json(
        { error: "L'adresse email est requise" },
        { status: 400 }
      );
    }

    const validation = unsubscribeSchema.safeParse({ email: emailParam });

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Find subscriber
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Cette adresse email n'est pas inscrite à la newsletter" },
        { status: 404 }
      );
    }

    if (subscriber.status === "UNSUBSCRIBED") {
      return NextResponse.json(
        { message: "Vous êtes déjà désinscrit de la newsletter" },
        { status: 200 }
      );
    }

    // Update status to UNSUBSCRIBED
    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { status: "UNSUBSCRIBED" },
    });

    return NextResponse.json(
      { message: "Vous avez été désinscrit de la newsletter avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unsubscribing from newsletter:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la désinscription" },
      { status: 500 }
    );
  }
}

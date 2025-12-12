import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { z } from "zod";

const replySchema = z.object({
  content: z
    .string()
    .min(1, "Le contenu est requis")
    .max(5000, "Le contenu ne doit pas dépasser 5000 caractères"),
});

/**
 * POST /api/admin/messages/:id/reply
 * Admin endpoint - reply to a contact message
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin auth
    const authResult = await requireAdmin(request.headers);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { session } = authResult;
    const adminId = session.user.id;
    const { id: messageId } = await params;

    const body = await request.json();
    const { content } = replySchema.parse(body);

    // Check if message exists
    const message = await prisma.contactMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return NextResponse.json(
        { error: "Message non trouvé" },
        { status: 404 }
      );
    }

    // Create reply and update message status in a transaction
    const [reply] = await prisma.$transaction([
      prisma.messageReply.create({
        data: {
          content,
          messageId,
          adminId,
        },
        include: {
          admin: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),
      prisma.contactMessage.update({
        where: { id: messageId },
        data: { status: "REPLIED" },
      }),
    ]);

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating reply:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de la réponse" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/messages/:id/reply
 * Admin endpoint - get all replies for a message
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin auth
    const authResult = await requireAdmin(request.headers);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id: messageId } = await params;

    const replies = await prisma.messageReply.findMany({
      where: { messageId },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(replies);
  } catch (error) {
    console.error("Error fetching replies:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des réponses" },
      { status: 500 }
    );
  }
}

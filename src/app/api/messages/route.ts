import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";

/**
 * GET /api/messages
 * Protected endpoint - get user's own contact messages with replies
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request.headers);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { session } = authResult;
    const userId = session.user.id;

    // Get user's messages with replies
    const messages = await prisma.contactMessage.findMany({
      where: { userId },
      include: {
        replies: {
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
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Count unread replies (messages with replies where user hasn't seen them)
    const unreadCount = messages.filter(
      (msg) => msg.status === "REPLIED" && msg.replies.length > 0
    ).length;

    return NextResponse.json({
      messages,
      stats: {
        total: messages.length,
        unread: unreadCount,
      },
    });
  } catch (error) {
    console.error("Error fetching user messages:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des messages" },
      { status: 500 }
    );
  }
}

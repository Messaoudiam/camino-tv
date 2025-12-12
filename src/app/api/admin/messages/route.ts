import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { ContactStatus } from "@prisma/client";

/**
 * GET /api/admin/messages
 * Admin endpoint - get all contact messages
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin auth
    const authResult = await requireAdmin(request.headers);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") as ContactStatus | null;

    // Build where clause
    const where = status ? { status } : {};

    // Get messages with stats and include replies
    const [messages, total, newCount, readCount, repliedCount, archivedCount] =
      await Promise.all([
        prisma.contactMessage.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
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
        }),
        prisma.contactMessage.count(),
        prisma.contactMessage.count({ where: { status: "NEW" } }),
        prisma.contactMessage.count({ where: { status: "READ" } }),
        prisma.contactMessage.count({ where: { status: "REPLIED" } }),
        prisma.contactMessage.count({ where: { status: "ARCHIVED" } }),
      ]);

    return NextResponse.json({
      messages,
      stats: {
        total,
        new: newCount,
        read: readCount,
        replied: repliedCount,
        archived: archivedCount,
      },
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des messages" },
      { status: 500 }
    );
  }
}

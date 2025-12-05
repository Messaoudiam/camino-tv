import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";

/**
 * Users API Routes
 * GET /api/users - List all users (admin only)
 */

/**
 * GET /api/users
 * Protected endpoint - returns all users (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // CRITICAL SECURITY: Multi-layered auth check (not relying on middleware alone)
    const authResult = await requireAdmin(request.headers);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            favorites: true,
            sessions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des utilisateurs" },
      { status: 500 },
    );
  }
}

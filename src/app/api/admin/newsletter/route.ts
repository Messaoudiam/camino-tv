import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";

/**
 * Admin Newsletter API Routes
 * GET /api/admin/newsletter - List all subscribers with stats (admin only)
 */

/**
 * GET /api/admin/newsletter
 * Returns all newsletter subscribers with statistics
 */
export async function GET(request: NextRequest) {
  try {
    // CRITICAL SECURITY: Multi-layered auth check
    const authResult = await requireAdmin(request.headers);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // Get query params for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // "PENDING" | "ACTIVE" | "UNSUBSCRIBED" | null (all)
    const format = searchParams.get("format"); // "json" | "csv"

    // Build where clause
    const where = status ? { status: status as "PENDING" | "ACTIVE" | "UNSUBSCRIBED" } : {};

    // Get subscribers
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where,
      orderBy: { subscribedAt: "desc" },
      select: {
        id: true,
        email: true,
        status: true,
        subscribedAt: true,
        updatedAt: true,
      },
    });

    // Get stats
    const [totalCount, pendingCount, activeCount, unsubscribedCount] = await Promise.all([
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.count({ where: { status: "PENDING" } }),
      prisma.newsletterSubscriber.count({ where: { status: "ACTIVE" } }),
      prisma.newsletterSubscriber.count({ where: { status: "UNSUBSCRIBED" } }),
    ]);

    const stats = {
      total: totalCount,
      pending: pendingCount,
      active: activeCount,
      unsubscribed: unsubscribedCount,
    };

    // Return CSV if requested
    if (format === "csv") {
      const csvHeader = "email,status,subscribedAt\n";
      const csvRows = subscribers
        .map(
          (s) =>
            `${s.email},${s.status},${s.subscribedAt.toISOString()}`
        )
        .join("\n");
      const csv = csvHeader + csvRows;

      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    return NextResponse.json({ subscribers, stats });
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des abonnés" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/newsletter
 * Delete a subscriber (admin only)
 * Body: { email: string }
 */
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request.headers);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "L'email est requis" },
        { status: 400 }
      );
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Abonné non trouvé" },
        { status: 404 }
      );
    }

    await prisma.newsletterSubscriber.delete({
      where: { email: email.toLowerCase().trim() },
    });

    return NextResponse.json({
      message: "Abonné supprimé avec succès",
    });
  } catch (error) {
    console.error("Error deleting newsletter subscriber:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'abonné" },
      { status: 500 }
    );
  }
}
